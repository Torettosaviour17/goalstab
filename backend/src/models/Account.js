const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountName: { type: String, required: true },
  lastFour: { type: String, required: true },
  balance: { type: Number, default: 0 },
  isDefault: { type: Boolean, default: false },
  currency: { type: String, default: 'NGN' },
  type: { type: String, enum: ['checking', 'savings', 'credit'], default: 'savings' }
});

module.exports = mongoose.model('Account', AccountSchema);