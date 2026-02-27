const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { optionalAuth } = require('../middleware/authMiddleware');
const {
  reportFoundItem,
  getFoundItems,
  getFoundItemById,
  updateFoundItem,
  deleteFoundItem,
} = require('../controllers/foundController');

// GET /api/found         — list all
router.get('/', getFoundItems);

// GET /api/found/:id     — single item
router.get('/:id', getFoundItemById);

// POST /api/found        — report a found item
router.post('/', optionalAuth, upload.single('image'), reportFoundItem);

// PATCH /api/found/:id   — update status
router.patch('/:id', optionalAuth, updateFoundItem);

// DELETE /api/found/:id  — remove report
router.delete('/:id', optionalAuth, deleteFoundItem);

module.exports = router;
