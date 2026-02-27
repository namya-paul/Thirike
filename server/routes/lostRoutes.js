const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { optionalAuth } = require('../middleware/authMiddleware');
const {
  reportLostItem,
  getLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
  claimLostItem,
} = require('../controllers/lostController');

// GET /api/lost          — list all (with filters)
router.get('/', getLostItems);

// GET /api/lost/:id      — single item
router.get('/:id', getLostItemById);

// POST /api/lost         — report a lost item
router.post('/', optionalAuth, upload.single('image'), reportLostItem);

// PATCH /api/lost/:id    — update status
router.patch('/:id', optionalAuth, updateLostItem);

// DELETE /api/lost/:id   — remove report
router.delete('/:id', optionalAuth, deleteLostItem);

// POST /api/lost/:id/claim — submit a claim
router.post('/:id/claim', claimLostItem);

module.exports = router;
