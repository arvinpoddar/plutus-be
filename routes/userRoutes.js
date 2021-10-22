const { sendError } = require('../utils');
const { DOCUMENTS } = require('../models/models')

const express = require('express');
const router = express.Router();
const db = require('../config/firebaseConfig')
const { v4: uuidv4 } = require('uuid');


// Default categories for a new user
const DEFAULT_CATEGORIES = [
  "Subscriptions",
  "Transportation",
  "Restaurants",
  "Groceries",
  "Rent",
  "Entertainment",
  "Other"
]

/**
 * POST - Create a new user object in Firestore (initialize the default values)
 * 
 * POST /users/{user ID}
 */
router.post('/:userId', async (req, res) => {
  const COLLECTION = req.params.userId
  
  const defaults = {}

  DEFAULT_CATEGORIES.forEach(cat => {
    const categoryId = uuidv4()
    defaults[categoryId] = {
      id: categoryId,
      name: cat,
      created_at: new Date().toISOString()
    }
  })

  try {
    await db.collection(COLLECTION).doc(DOCUMENTS.CATEGORIES).set(defaults)
    await db.collection(COLLECTION).doc(DOCUMENTS.EXPENSES).set({})
    await db.collection(COLLECTION).doc(DOCUMENTS.PAYMENT_METHODS).set({})
    return res.sendStatus(200)
  } catch (err) {
    sendError(res, err)
  }
});

module.exports = router;