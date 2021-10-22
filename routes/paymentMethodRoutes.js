const { sendError, sendCustomError } = require('../utils');
const { DOCUMENTS } = require('../models/models')
const { FieldValue } = require('firebase-admin/firestore');

const express = require('express');
const router = express.Router();
const db = require('../config/firebaseConfig')
const { v4: uuidv4 } = require('uuid');

/**
 * GET - Fetch all payment methods for the user
 * 
 * GET /users/{user ID}/payment-methods
 */
router.get('/:userId/payment-methods/', async (req, res) => {
  const COLLECTION = req.params.userId

  const ref = db.collection(COLLECTION).doc(DOCUMENTS.PAYMENT_METHODS)

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
 * POST - Create a new payment-method for a user
 * 
 * POST /users/{user ID}/payment-methods
 */

router.post('/:userId/payment-methods/', async (req, res) => {
  const { name } = req.body

  const COLLECTION = req.params.userId
  const ref = db.collection(COLLECTION).doc(DOCUMENTS.PAYMENT_METHODS)

  const newId = uuidv4()

  const method = {
    id: newId,
    name: name,
    created_at: new Date().toISOString()
  }

  try {
    await ref.update({ [newId]: method });
    return res.send(method)
  } catch (err) {
    return sendError(res, err)
  }
});

/**
 * GET - Get an individual payment-method object.
 * 
 * GET /users/{user ID}/payment-methods/{method ID}
 */

router.get('/:userId/payment-methods/:methodId', async (req, res) => {
  const COLLECTION = req.params.userId
  const methodId = req.params.methodId

  const ref = db.collection(COLLECTION).doc(DOCUMENTS.PAYMENT_METHODS)

  try {
    const doc = await ref.get()
    if (!doc.exists) {
      return sendCustomError(res, 404, "Resource not found")
    } else {
      return res.send(doc.get(methodId))
    }
  } catch (err) {
    return sendError(res, err)
  }
});

/**
 * DELETE - delete a particular payment-method object
 * 
 * DELETE /users/{user ID}/payment-method/{method ID}
 */
router.delete('/:userId/payment-methods/:methodId', async (req, res) => {
  const COLLECTION = req.params.userId
  const methodId = req.params.methodId

  const ref = db.collection(COLLECTION).doc(DOCUMENTS.PAYMENT_METHODS)

  try {
    const doc = await ref.get()
    if (!doc.exists) {
      return sendCustomError(res, 404, "Resource not found")
    } else {
      await ref.update({
        [methodId]: FieldValue.delete()
      });
      return res.status(200).send({ id: methodId })
    }
  } catch (err) {
    return sendError(res, err)
  }

});


module.exports = router;