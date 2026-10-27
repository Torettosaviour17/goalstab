const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const NotificationSettingsSchema = new mongoose.Schema(
  {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    goalCompleted: { type: Boolean, default: true },
    depositReceived: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: false },
  },
  { _id: false },
);

const PreferencesSchema = new mongoose.Schema(
  {
    currency: { type: String, default: "NGN" },
    theme: { type: String, default: "dark" },
    autoSaveDefault: { type: Boolean, default: true },
    monthlyIncome: { type: Number, default: 500000 }, // 👈 Monthly income for percentage-based auto-saves
    onboardingCompleted: { type: Boolean, default: false }, // 👈 Onboarding tour completion flag
    notifications: { type: NotificationSettingsSchema, default: () => ({}) },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, default: null },
  phone: { type: String },
  isPremium: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false }, // ✅ admin flag added
  avatar: { type: String, default: null },
  preferences: { type: PreferencesSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
  passwordResetToken: { type: String, default: null, index: true },
  passwordResetExpires: { type: Date, default: null, index: true },
  // Passkey credentials are public-key material only; no biometric data is stored.
  webauthnCredentials: {
    type: [
      new mongoose.Schema(
        {
          id: { type: String, required: true },
          publicKey: { type: String, required: true },
          counter: { type: Number, default: 0 },
          transports: { type: [String], default: [] },
          deviceType: { type: String, default: "singleDevice" },
          backedUp: { type: Boolean, default: false },
          createdAt: { type: Date, default: Date.now },
        },
        { _id: false },
      ),
    ],
    default: [],
  },
  webauthnRegistrationChallenge: { type: String, default: null },
  webauthnRegistrationExpiresAt: { type: Date, default: null },
  webauthnRegistrationOrigin: { type: String, default: null },
  webauthnRegistrationRpID: { type: String, default: null },
  webauthnAuthenticationChallenge: { type: String, default: null },
  webauthnAuthenticationExpiresAt: { type: Date, default: null },
  webauthnAuthenticationOrigin: { type: String, default: null },
  webauthnAuthenticationRpID: { type: String, default: null },
});

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
