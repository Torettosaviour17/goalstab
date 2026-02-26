const mongoose = require('mongoose');

const SharedWithSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, enum: ['viewer', 'contributor'], default: 'viewer' }
}, { _id: false });

const GoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  target: { type: Number, required: true },
  saved: { type: Number, default: 0 },
  icon: { type: String, default: '🎯' },
  color: { type: String, default: 'from-blue-500 to-cyan-400' },
  type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  autoSave: { type: Number, default: 10 },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'monthly' },
  deadline: { type: Date },
  locked: { type: Boolean, default: true },
  progress: { type: Number, default: 0 },
  category: { type: String },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  sharedWith: [SharedWithSchema],
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

GoalSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  if (this.target > 0) {
    this.progress = Math.min(100, Math.round((this.saved / this.target) * 100));
  }
  next();
});

module.exports = mongoose.model('Goal', GoalSchema);