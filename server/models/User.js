const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@^\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Don't return password in API responses by default
  },
  role: {
    type: String,
    enum: ['customer', 'center_admin', 'super_admin'],
    default: 'customer'
  },
  // KYC Section (Crucial for your OCR feature)
  kyc: {
    isVerified: { type: Boolean, default: false },
    dlNumber: { type: String }, // Extracted via Tesseract.js
    aadhaarNumber: { type: String },
    dlImage: { type: String }, // URL from Cloudinary
    aadhaarImage: { type: String }
  },
  // Wallet Section (For deposits & refunds)
  wallet: {
    balance: { type: Number, default: 0 },
    frozenAmount: { type: Number, default: 0 } // Security deposit locks here
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper method to match user entered password to hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);