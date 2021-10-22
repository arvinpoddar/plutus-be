const { sendError } = require('../utils');
const express = require('express');
const router = express.Router();
const db = require('../config/firebaseConfig')

const COLLECTION = "demo"

/**
 * GET - Fetch all categories for the user
 * 
 * GET /users/{user ID}/categories
 */
router.get('/:userId/categories/', async (req, res) => {
  const snapshot = await db.collection(COLLECTION).get();

  const userId = req.params.userId

  snapshot.forEach((doc) => {
    if (doc.id === userId) {
      return res.send({
        data: doc.data()
      })
    }
  });


});


module.exports = router;