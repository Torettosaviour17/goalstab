const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  kind: { type: String, enum: ["available", "pending", "savings", "clearing"], required: true },
  currency: { type: String, enum: ["NGN"], default: "NGN" },
  // Cached minor-unit balance is only a projection; journal entries are the source of truth.
  balanceMinor: { type: Number, default: 0, validate: Number.isSafeInteger },
}, { timestamps: true });
schema.index({ owner: 1, kind: 1, currency: 1 }, { unique: true });
module.exports = mongoose.model("WalletLedgerAccount", schema);
