const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const WithdrawalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  accountDetails: {
    bankName: String,
    accountNumber: String,
    accountName: String,
  },
  adminNote: String,
  requestedAt: { type: Date, default: Date.now },
  processedAt: Date,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);