const AWS = require('aws-sdk');

let configJson = null
if (!process.env.deployed) {
  configJson = require('./aws-plutus-config.json')
}

const AWSConfig = {
  ACCESS_ID: process.env.deployed ? process.env.AWS_ACCESS_ID : configJson.ACCESS_ID,
  SECRET: process.env.deployed ? process.env.AWS_SECRET_KEY : configJson.SECRET,
  REGION: process.env.deployed ? process.env.AWS_REGION : configJson.REGION,
  BUCKET_NAME: process.env.deployed ? process.env.AWS_BUCKET_NAME : configJson.BUCKET_NAME
}

S3Client = new AWS.S3({
  accessKeyId: AWSConfig.ACCESS_ID,
  secretAccessKey: AWSConfig.SECRET,
  region: AWSConfig.REGION,
  params: {
    Bucket: AWSConfig.BUCKET_NAME,
  }
});

module.exports = { S3Client, AWSConfig };