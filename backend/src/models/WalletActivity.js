const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  kind: { type: String, enum: ["fund", "transfer", "withdraw", "save"], required: true },
  amountMinor: { type: Number, required: true, min: 1 },
  currency: { type: String, enum: ["NGN"], default: "NGN" },
  status: { type: String, enum: ["draft", "pending", "completed", "failed", "cancelled"], default: "draft" },
  idempotencyKey: { type: String, required: true },
  description: { type: String, maxlength: 180 },
}, { timestamps: true });
schema.index({ user: 1, idempotencyKey: 1 }, { unique: true });
module.exports = mongoose.model("WalletActivity", schema);
