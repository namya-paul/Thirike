const mongoose = require('mongoose');
const crypto = require('crypto');

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

const foundItemSchema = new mongoose.Schema(
  {
    // ─── Core Info ───────────────────────────────
    type: { type: String, default: 'found', enum: ['found'] },

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
    locationName: { type: String, trim: true, default: '' }, // Allow empty string
finderPhone: {
  type: String,
  set: (v) => v ? encrypt(v.trim()) : '', // Trim spaces before encrypting
},
imageUrl: {
  type: String,
  required: false, // Make image optional
},

    // ─── Date/Time ───────────────────────────────
    dateLostOrFound: { type: Date },
    dateFoundOrFound: { type: Date, required: [true, 'Date found is required'] },
    timeFound: { type: String },

    // ─── Image ───────────────────────────────────
    imageUrl: {
      type: String,
      required: [true, 'Image of found item is recommended'],
    },

    // ─── Finder Contact (encrypted) ──────────────
    finderEmail: {
      type: String,
      required: [true, 'Finder email is required'],
      set: (v) => v ? encrypt(v) : '',
    },
    finderPhone: {
      type: String,
      set: (v) => v ? encrypt(v) : '',
    },

    // ─── Police handover ─────────────────────────
    handedToPolice: { type: Boolean, default: false },
    policeStation: { type: String, trim: true },

    // ─── Status ──────────────────────────────────
    status: {
      type: String,
      enum: ['active', 'matched', 'claimed', 'resolved', 'expired'],
      default: 'active',
    },

    resolvedAt: { type: Date },
    matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'LostItem' },

    // ─── Metadata ────────────────────────────────
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
foundItemSchema.index({ location: '2dsphere' });
foundItemSchema.index({ category: 1, status: 1 });
foundItemSchema.index({ createdAt: -1 });

foundItemSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

const FoundItem = mongoose.model('FoundItem', foundItemSchema);
module.exports = FoundItem;
