"use strict";
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  provider: { type: String, required: true, trim: true },
  reference: { type: String, required: true, maxlength: 128 },
  providerReference: { type: String, default: null },
  currency: { type: String, required: true, uppercase: true, match: /^[A-Z]{3}$/ },
  amountMinor: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  purpose: { type: String, enum: ["wallet_funding"], required: true },
  status: { type: String, enum: ["pending", "settled", "failed", "reversed"], default: "pending" },
  settledAt: Date,
  ledgerReference: String,
}, { timestamps: true });
schema.index({ reference: 1 }, { unique: true });
schema.index({ provider: 1, providerReference: 1 }, { unique: true, partialFilterExpression: { providerReference: { $type: "string" } } });
schema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model("PaymentIntent", schema);
