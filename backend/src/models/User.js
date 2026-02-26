const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const NotificationSettingsSchema = new mongoose.Schema({
  email: { type: Boolean, default: true },
  push: { type: Boolean, default: true },
  goalCompleted: { type: Boolean, default: true },
  depositReceived: { type: Boolean, default: true },
  weeklyReport: { type: Boolean, default: false }
}, { _id: false });

const PreferencesSchema = new mongoose.Schema({
  currency: { type: String, default: 'NGN' },
  theme: { type: String, default: 'dark' },
  autoSaveDefault: { type: Boolean, default: true },
  notifications: { type: NotificationSettingsSchema, default: () => ({}) }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  isPremium: { type: Boolean, default: false },
  avatar: { type: String },
  preferences: { type: PreferencesSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving – using async function (returns promise, no next needed)
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);