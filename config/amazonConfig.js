const AWS = require('aws-sdk');

let configJson = null
if (!process.env.deployed) {
  configJson = require('./aws-plutus-config.json')
}

const AWSConfig = {
  ACCESS_ID: process.env.deployed ? process.env.AWS_ACCESS_ID : configJson.ACCESS_ID,
  SECRET: process.env.deployed ? process.env.AWS_SECRET_KEY : configJson.SECRET,
  REGION: process.env.deployed ? process.env.AWS_REGION : configJson.REGION,
  IMAGE_BUCKET_NAME: process.env.deployed ? process.env.IMAGE_BUCKET_NAME : configJson.IMAGE_BUCKET_NAME,
  EXPORT_BUCKET_NAME: process.env.deployed ? process.env.EXPORT_BUCKET_NAME : configJson.EXPORT_BUCKET_NAME
}

const S3ImageClient = new AWS.S3({
  accessKeyId: AWSConfig.ACCESS_ID,
  secretAccessKey: AWSConfig.SECRET,
  region: AWSConfig.REGION,
  params: {
    Bucket: AWSConfig.IMAGE_BUCKET_NAME,
  }
});

const S3ExportClient = new AWS.S3({
  accessKeyId: AWSConfig.ACCESS_ID,
  secretAccessKey: AWSConfig.SECRET,
  region: AWSConfig.REGION,
  params: {
    Bucket: AWSConfig.EXPORT_BUCKET_NAME,
  }
});

module.exports = { S3ImageClient, S3ExportClient, AWSConfig };