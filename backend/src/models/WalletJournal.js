const mongoose = require("mongoose");
const posting = new mongoose.Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: "WalletLedgerAccount", required: true },
  deltaMinor: { type: Number, required: true, validate: Number.isSafeInteger },
}, { _id: false });
const schema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true, maxlength: 128 },
  currency: { type: String, enum: ["NGN"], required: true },
  postings: { type: [posting], validate: {
    validator: (entries) => entries.length >= 2 && entries.every(p => p.deltaMinor !== 0) &&
      entries.reduce((sum, p) => sum + p.deltaMinor, 0) === 0,
    message: "Journal postings must balance to zero",
  }},
  source: { type: String, required: true, maxlength: 80 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
schema.pre("validate", function () {
  if (this.postings?.length) {
    const seen = new Set();
    for (const p of this.postings) {
      const id = String(p.account);
      if (seen.has(id)) this.invalidate("postings", "Duplicate account postings are not allowed");
      seen.add(id);
    }
  }
});
module.exports = mongoose.model("WalletJournal", schema);
