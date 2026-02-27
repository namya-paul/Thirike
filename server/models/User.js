const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    phone: { type: String, trim: true },
    password: { type: String, minlength: 6 },

    // OTP fields
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },

    // Trust level based on resolved reports
    trustScore: { type: Number, default: 0, min: 0, max: 100 },
    resolvedCount: { type: Number, default: 0 },

    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Generate OTP
userSchema.methods.generateOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  return otp;
};

// Verify OTP
userSchema.methods.verifyOtp = function (inputOtp) {
  if (!this.otp || !this.otpExpiry) return false;
  if (new Date() > this.otpExpiry) return false;
  return this.otp === inputOtp;
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpiry;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
