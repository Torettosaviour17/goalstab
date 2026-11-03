const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  smartSaveEnabled: { type: Boolean, default: false },
  frequency: { type: String, enum: ["daily", "weekly", "monthly"], default: "monthly" },
  percentage: { type: Number, min: 1, max: 20, default: 5 },
  monthlyCapMinor: { type: Number, min: 0, max: 100000000, default: 0 },
  minimumRemainingMinor: { type: Number, min: 0, max: 100000000, default: 0 },
  fundingSource: { type: String, enum: ["wallet", "connected_account"], default: "wallet" },
}, { timestamps: true });
module.exports = mongoose.model("WalletPreferences", schema);
