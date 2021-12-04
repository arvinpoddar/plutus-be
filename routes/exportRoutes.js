const { sendError } = require('../utils');
const { S3ExportClient, AWSConfig } = require('../config/amazonConfig')

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

/**
 * Uploads a CSV string to S3.
 * @param {*} userId userID of uploading user
 * @param {*} fileContent string content of CSV
 * @returns Promise object with S3 url
 */
const uploadCSVToS3 = (userId, fileContent) => {
  return new Promise((resolve, reject) => {
    try {
      const suffix = uuidv4().substring(0, 5)
      const fileName = `plutus-export-${suffix}.csv`

      const data = {
        Key: fileName,
        Body: fileContent,
        ContentEncoding: 'utf-8',
        ContentType: 'text/csv'
      };

      S3ExportClient.putObject(data, function (err, data) {
        if (err) {
          reject(err)
        } else {
          const s3Url = `https://${AWSConfig.EXPORT_BUCKET_NAME}.s3.${AWSConfig.REGION}.amazonaws.com/${fileName}`
          resolve({ url: s3Url, filename: fileName })
        }
      });
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * GET - Create a new export
 * 
 * POST /users/{user ID}/expenses
 */
router.post('/:userId/exports/', async (req, res) => {
  const USER_ID = req.params.userId

  try {
    const { url, filename } = await uploadCSVToS3(USER_ID, req.body.file_content)
    return res.send({ url, filename })
  } catch (err) {
    sendError(res, err)
  }
});

module.exports = router;