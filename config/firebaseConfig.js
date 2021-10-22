// Import the functions you need from the SDKs you need
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { serviceAccountConfig } = require('./serviceAccount')

let serviceAccount = null

if (process.env.deployed) {
  serviceAccount = serviceAccountConfig
} else {
  serviceAccount = require('./plutus-be-738273006b5d.json');
}

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = db;