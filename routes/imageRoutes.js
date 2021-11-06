const { sendError, sendCustomError } = require('../utils');
const AWS = require('aws-sdk');
const { awsConfig } = require('../config/amazonConfig')

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

/**
 * GET - Create a new image
 * 
 * GET /users/{user ID}/expenses
 */
router.post('/:userId/images/', async (req, res) => {
  const USER_ID = req.params.userId

  try {
    var bucket = new AWS.S3({
      accessKeyId: awsConfig.ACCESS_ID,
      secretAccessKey: awsConfig.SECRET,
      region: awsConfig.REGION,
      params: {
        Bucket: awsConfig.BUCKET_NAME,
      }
    });

    const suffix = uuidv4().substring(0, 6)
    const imageContent = Buffer.from(req.body.base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    const imageName = `${USER_ID}-${suffix}.jpeg`

    const data = {
      Key: imageName,
      Body: imageContent,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };

    bucket.putObject(data, function (err, data) {
      if (err) {
        sendError(res, err)
      } else {
        const s3Url = `https://${awsConfig.BUCKET_NAME}.s3.${awsConfig.REGION}.amazonaws.com/${imageName}`
        return res.send({
          url: s3Url
        })
      }
    });
  } catch (err) {
    sendError(res, err)
  }
});

module.exports = router;