const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  type: { type: String, enum: ['deposit', 'withdrawal', 'auto_save', 'goal_completed'], required: true },
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);