const { sendError, sendCustomError } = require('../utils');
const { S3ImageClient, AWSConfig } = require('../config/amazonConfig')

const fetch = require('node-fetch');
const FormData = require('form-data');

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const RECEIPT_OCR_API = 'https://ocr.asprise.com/api/v1/receipt'
const RECEIPT_OCR_KEY = 'TEST'

const getFileFromBase64 = (base64) => {
  const imageContent = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
  return imageContent
}

/**
 * Uploads a base64 string as a JPEG to S3.
 * @param {*} userId userID of uploading user
 * @param {*} base64 base64 encoding of image (should be JPEG)
 * @returns Promise object with S3 url
 */
const uploadImageToS3 = (userId, base64) => {
  return new Promise((resolve, reject) => {
    try {
      const suffix = uuidv4().substring(0, 6)
      const imageContent = getFileFromBase64(base64)
      const imageName = `${userId}-${suffix}.jpeg`

      const data = {
        Key: imageName,
        Body: imageContent,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
      };

      S3ImageClient.putObject(data, function (err, data) {
        if (err) {
          reject(err)
        } else {
          const s3Url = `https://${AWSConfig.IMAGE_BUCKET_NAME}.s3.${AWSConfig.REGION}.amazonaws.com/${imageName}`
          resolve(s3Url)
        }
      });
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * GET - Create a new image
 * 
 * GET /users/{user ID}/expenses
 */
router.post('/:userId/images/', async (req, res) => {
  const USER_ID = req.params.userId

  try {
    const url = await uploadImageToS3(USER_ID, req.body.base64)
    return res.send({ url })
  } catch (err) {
    sendError(res, err)
  }
});

router.post('/:userId/receipts/', async (req, res) => {
  const USER_ID = req.params.userId

  try {
    const formData = new FormData();
    formData.append('file', getFileFromBase64(req.body.base64));
    formData.append('client_id', RECEIPT_OCR_KEY);
    formData.append('recognizer', 'auto')

    const ocrResponse = await fetch(RECEIPT_OCR_API, {
      method: 'POST',
      body: formData
    });
    const ocrJson = await ocrResponse.json()
    console.log(ocrJson)
    console.log(ocrJson.receipts[0])
    if (ocrJson && ocrJson.receipts && ocrJson.receipts.length) {
      const url = await uploadImageToS3(USER_ID, req.body.base64)
      return res.send({
        receipt_data: ocrJson.receipts[0],
        url: url
      })
    } else {
      sendCustomError(res, 500, "Invalid receipt")
    }
  } catch (err) {
    sendError(res, err)
  }
});

module.exports = router;