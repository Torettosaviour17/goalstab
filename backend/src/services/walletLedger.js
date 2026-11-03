const WalletLedgerAccount = require("../models/WalletLedgerAccount");
const WalletJournal = require("../models/WalletJournal");

// Internal-only primitive. Do not expose this to client routes or invoke it
// until the settlement, authorization and reconciliation workflows are ready.
async function postBalancedJournal({ reference, currency = "NGN", source, createdBy, postings }) {
  if (typeof reference !== "string" || !reference.trim() || reference.length > 128) throw new Error("Invalid reference");
  if (!Array.isArray(postings) || postings.length < 2 ||
      !postings.every(p => p.account && Number.isSafeInteger(p.deltaMinor) && p.deltaMinor !== 0) ||
      postings.reduce((sum, p) => sum + p.deltaMinor, 0) !== 0) throw new Error("Unbalanced journal");
  const ids = postings.map(p => String(p.account));
  if (new Set(ids).size !== ids.length) throw new Error("Duplicate journal account");
  const mongoose = require("mongoose");
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      const existing = await WalletJournal.findOne({ reference }).session(session);
      if (existing) throw new Error("Duplicate journal reference");
      const accounts = await WalletLedgerAccount.find({ _id: { $in: ids }, currency }).session(session);
      if (accounts.length !== ids.length) throw new Error("Missing or mismatched ledger account");
      for (const posting of postings) {
        const account = accounts.find(a => String(a._id) === String(posting.account));
        if (account.kind === "available" && account.balanceMinor + posting.deltaMinor < 0)
          throw new Error("Insufficient wallet funds");
        const condition = { _id: account._id };
        if (posting.deltaMinor < 0 && account.kind === "available")
          condition.balanceMinor = { $gte: -posting.deltaMinor };
        const updated = await WalletLedgerAccount.updateOne(condition,
          { $inc: { balanceMinor: posting.deltaMinor } }, { session });
        if (updated.modifiedCount !== 1) throw new Error("Insufficient wallet funds or concurrent update");
      }
      const [journal] = await WalletJournal.create([{
        reference, currency, source, createdBy, postings,
      }], { session });
      return journal;
    });
  } finally { await session.endSession(); }
}
module.exports = { postBalancedJournal };
