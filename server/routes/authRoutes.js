const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { register, login, sendOtp, verifyOtp, getMe } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/send-otp
router.post('/send-otp', sendOtp);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOtp);

// GET /api/auth/me   (protected)
router.get('/me', authMiddleware, getMe);

module.exports = router;
