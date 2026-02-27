const mongoose = require('mongoose');
const crypto = require('crypto');

// Encryption helper
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default32charkey0000000000000000';
const IV_LENGTH = 16;

function encrypt(text) {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf8').slice(0, 32), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

const lostItemSchema = new mongoose.Schema(
  {
    // ─── Core Info ───────────────────────────────
    type: { type: String, default: 'lost', enum: ['lost'] },

    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [120, 'Item name too long'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['General Items', 'Important Documents', 'Electronics', 'Accessories', 'Others'],
    },

    // ─── Description ─────────────────────────────
    color: { type: String, trim: true },
    brand: { type: String, trim: true },
    height: { type: String },
    width: { type: String },
    size: { type: String },
    distinctiveFeatures: { type: String, trim: true, maxlength: 1000 },

    // Encrypted — only owner knows this, used for proof
    secretIdentifier: {
      type: String,
      set: (v) => v ? encrypt(v) : '',
    },

    // ─── Location ────────────────────────────────
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Location coordinates are required'],
      },
    },
    locationName: { type: String, trim: true },
    radius: { type: Number, default: 5, min: 1, max: 20 }, // km

    // ─── Date/Time ───────────────────────────────
    dateLostOrFound: { type: Date, required: [true, 'Date is required'] },
    timeLost: { type: String },

    // ─── Image ───────────────────────────────────
    imageUrl: { type: String },

    // ─── Important Document Extra Fields ─────────
    docType: { type: String },
    maskedId: { type: String }, // only last 4 digits stored
    verificationQuestion: { type: String },
    verificationAnswer: {
      type: String,
      set: (v) => v ? encrypt(v) : '',
    },

    // ─── Contact ─────────────────────────────────
    email: {
      type: String,
      set: (v) => v ? encrypt(v) : '',
    },
    phone: {
      type: String,
      set: (v) => v ? encrypt(v) : '',
    },

    // ─── Status ──────────────────────────────────
    status: {
      type: String,
      enum: ['active', 'matched', 'resolved', 'expired'],
      default: 'active',
    },

    resolvedAt: { type: Date },
    matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'FoundItem' },

    // ─── Metadata ────────────────────────────────
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    views: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }, // OTP verified
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Geospatial index for location-based queries
lostItemSchema.index({ location: '2dsphere' });
lostItemSchema.index({ category: 1, status: 1 });
lostItemSchema.index({ createdAt: -1 });

// Virtual: is this item for an important document?
lostItemSchema.virtual('isImportantDoc').get(function () {
  return this.category === 'Important Documents';
});

// Method: increment view count
lostItemSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

const LostItem = mongoose.model('LostItem', lostItemSchema);
module.exports = LostItem;
