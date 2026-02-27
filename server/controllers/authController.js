const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate JWT
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

/**
 * @desc   Register user
 * @route  POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered.' });

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id);

    res.status(201).json({ message: 'Registered successfully.', token, user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Registration failed.' });
  }
};

/**
 * @desc   Login user
 * @route  POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({ message: 'Login successful.', token, user });
  } catch {
    res.status(500).json({ message: 'Login failed.' });
  }
};

/**
 * @desc   Send OTP to email
 * @route  POST /api/auth/send-otp
 */
const sendOtp = async (req, res) => {
  try {
    const { contact } = req.body; // email or phone
    if (!contact) return res.status(400).json({ message: 'Email or phone required.' });

    // Find or create temp user record for OTP
    let user = await User.findOne({ email: contact });
    if (!user) {
      // Allow OTP for non-registered emails too (for document verification)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // In production: send via SMS/email
      console.log(`[DEV] OTP for ${contact}: ${otp}`);

      // Email OTP
      if (contact.includes('@')) {
        try {
          await transporter.sendMail({
            from: `"Thirike" <${process.env.EMAIL_USER}>`,
            to: contact,
            subject: 'Your Thirike Verification OTP',
            html: `
              <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 12px;">
                <h2 style="color: #1E3A8A;">Thirike Verification</h2>
                <p>Your OTP is:</p>
                <h1 style="letter-spacing: 0.3em; color: #10B981;">${otp}</h1>
                <p style="color: #888; font-size: 13px;">Valid for 10 minutes. Don't share this with anyone.</p>
              </div>
            `,
          });
        } catch (emailErr) {
          console.warn('Email send failed, using console OTP');
        }
      }

      return res.json({ message: 'OTP sent.', devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined });
    }

    const otp = user.generateOtp();
    await user.save({ validateBeforeSave: false });

    console.log(`[DEV] OTP for ${contact}: ${otp}`);

    res.json({ message: 'OTP sent.', devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined });
  } catch {
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
};

/**
 * @desc   Verify OTP
 * @route  POST /api/auth/verify-otp
 */
const verifyOtp = async (req, res) => {
  try {
    const { contact, otp } = req.body;

    const user = await User.findOne({ email: contact });
    if (!user) {
      // For document verification where user may not be registered
      // In production: verify against a stored temp OTP
      // For now, accept the hardcoded demo OTP
      if (otp === '123456') {
        return res.json({ message: 'OTP verified.', verified: true });
      }
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (!user.verifyOtp(otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({ message: 'OTP verified.', verified: true, token });
  } catch {
    res.status(500).json({ message: 'OTP verification failed.' });
  }
};

/**
 * @desc   Get current user profile
 * @route  GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { register, login, sendOtp, verifyOtp, getMe };
