const express = require('express');
const router = express.Router();
const { getMatchesForLost, getMatchesForFound } = require('../controllers/matchController');

// GET /api/match/lost/:id    — find found items matching this lost item
router.get('/lost/:id', getMatchesForLost);

// GET /api/match/found/:id   — find lost items matching this found item
router.get('/found/:id', getMatchesForFound);

module.exports = router;
