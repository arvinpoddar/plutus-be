const { sendError, sendCustomError } = require('../utils');
const { DOCUMENTS } = require('../models/models')
const { FieldValue } = require('firebase-admin/firestore');

const express = require('express');
const router = express.Router();
const db = require('../config/firebaseConfig')
const { v4: uuidv4 } = require('uuid');

/**
 * GET - Fetch all categories for the user
 * 
 * GET /users/{user ID}/categories
 */
router.get('/:userId/categories/', async (req, res) => {
  const COLLECTION = req.params.userId

  const ref = db.collection(COLLECTION).doc(DOCUMENTS.CATEGORIES)
  try {
    const doc = await ref.get()
    if (!doc.exists) {
      return sendCustomError(res, 404, "Resource not found")
    } else {
      return res.send(Object.values(doc.data()))
    }
  } catch (err) {
    sendError(res, err)
  }
});

/**
 * POST - Create a new category for a user
 * 
 * POST /users/{user ID}/categories
 */

router.post('/:userId/categories/', async (req, res) => {
  const COLLECTION = req.params.userId
  const { name } = req.body
  
  const ref = db.collection(COLLECTION).doc(DOCUMENTS.CATEGORIES)

  const newId = uuidv4()

  const category = {
    id: newId,
    name: name,
    created_at: new Date().toISOString()
  }

  try {
    await ref.update({ [newId]: category });
    return res.send(category)
  } catch (err) {
    return sendError(res, err)
  }
});

/**
 * GET - Get an individual category object. Will include all contained expenses
 * for the category
 * 
 * GET /users/{user ID}/categories/{category ID}
 */

router.get('/:userId/categories/:categoryId', async (req, res) => {
  const COLLECTION = req.params.userId
  const categoryId = req.params.categoryId

  const ref = db.collection(COLLECTION).doc(DOCUMENTS.CATEGORIES)

  try {
    const doc = await ref.get()
    if (!doc.exists) {
      return sendCustomError(res, 404, "Resource not found")
    } else {
      // Collect all expenses that include the category in question
      const expenseRef = db.collection(COLLECTION).doc(DOCUMENTS.EXPENSES)
      const allExpenses = await expenseRef.get()

      const expenses = []
      for (const key in allExpenses.data()) {
        const expense = allExpenses.get(key)
        if (expense.categories && expense.categories.includes(categoryId)) {
          expenses.push(expense)
        }
      }

      const categoryData = {
        ...doc.get(categoryId),
        expenses
      }

      return res.send(categoryData)
    }
  } catch (err) {
    return sendError(res, err)
  }
});

/**
 * DELETE - delete a particular category object
 * 
 * DELETE /users/{user ID}/categories/{category ID}
 */
router.delete('/:userId/categories/:categoryId', async (req, res) => {
  const COLLECTION = req.params.userId
  const categoryId = req.params.categoryId

  const ref = db.collection(COLLECTION).doc(DOCUMENTS.CATEGORIES)

  try {
    const doc = await ref.get()
    if (!doc.exists) {
      return sendCustomError(res, 404, "Resource not found")
    } else {
      await ref.update({
        [categoryId]: FieldValue.delete()
      });
      return res.status(200).send({ id: categoryId })
    }
  } catch (err) {
    return sendError(res, err)
  }

});


module.exports = router;