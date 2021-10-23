const { sendError, sendCustomError } = require('../utils');
const { DOCUMENTS } = require('../models/models')
const { FieldValue } = require('firebase-admin/firestore');

const express = require('express');
const router = express.Router();
const db = require('../config/firebaseConfig')
const { v4: uuidv4 } = require('uuid');

/**
 * GET - Fetch all expenses for the user
 * 
 * GET /users/{user ID}/expenses
 */
router.get('/:userId/expenses/', async (req, res) => {
  const COLLECTION = req.params.userId

  const ref = db.collection(COLLECTION).doc(DOCUMENTS.EXPENSES)

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
 * POST - Create a new expenses for a user
 * 
 * POST /users/{user ID}/expenses
 */
router.post('/:userId/expenses/', async (req, res) => {
  const COLLECTION = req.params.userId
  const {
    name,
    description,
    date,
    payment_method,
    categories,
    images
  } = req.body
  
  const ref = db.collection(COLLECTION).doc(DOCUMENTS.EXPENSES)

  const newId = uuidv4()

  const expense = {
    id: newId,
    created_at: new Date().toISOString(),
    name,
    description,
    date,
    payment_method,
    categories,
    images
  }

  try {
    await ref.update({ [newId]: expense });
    return res.send(expense)
  } catch (err) {
    return sendError(res, err)
  }
});


/**
 * PUT - Update a given expense object
 * 
 * PUT /users/{user ID}/expenses/{expense ID}
 */
router.put('/:userId/expenses/:expenseId', async (req, res) => {
  const COLLECTION = req.params.userId
  const expenseId = req.params.expenseId

  const ref = db.collection(COLLECTION).doc(DOCUMENTS.EXPENSES)

  try {
    const doc = await ref.get()
    if (!doc.exists) {
      return sendCustomError(res, 404, "Resource not found")
    } else {
      await ref.set({ [expenseId]: req.body }, { merge: true });
      return res.send(req.body)
    }
  } catch (err) {
    return sendError(res, err)
  }
});


/**
 * GET - Get an individual expense object.
 * 
 * GET /users/{user ID}/expenses/{expense ID}
 */
router.get('/:userId/expenses/:expenseId', async (req, res) => {
  const COLLECTION = req.params.userId
  const expenseId = req.params.expenseId

  const ref = db.collection(COLLECTION).doc(DOCUMENTS.EXPENSES)

  try {
    const doc = await ref.get()
    if (!doc.exists) {
      return sendCustomError(res, 404, "Resource not found")
    } else {
      const categoryData = { ...doc.get(expenseId) }
      return res.send(categoryData)
    }
  } catch (err) {
    return sendError(res, err)
  }
});

/**
 * DELETE - delete a particular expense object
 * 
 * DELETE /users/{user ID}/expenses/{expense ID}
 */
router.delete('/:userId/expenses/:expenseId', async (req, res) => {
  const COLLECTION = req.params.userId
  const expenseId = req.params.expenseId

  const ref = db.collection(COLLECTION).doc(DOCUMENTS.EXPENSES)

  try {
    const doc = await ref.get()
    if (!doc.exists) {
      return sendCustomError(res, 404, "Resource not found")
    } else {
      await ref.update({
        [expenseId]: FieldValue.delete()
      });
      return res.status(200).send({ id: expenseId })
    }
  } catch (err) {
    return sendError(res, err)
  }

});


module.exports = router;