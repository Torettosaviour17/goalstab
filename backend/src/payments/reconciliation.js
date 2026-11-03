"use strict";
const WalletJournal = require("../models/WalletJournal");
const WalletLedgerAccount = require("../models/WalletLedgerAccount");
const PaymentIntent = require("./models/PaymentIntent");

// Read-only reconciliation: does not repair or move money.
async function reconcileAccount(accountId) {
  const account = await WalletLedgerAccount.findById(accountId).lean();
  if (!account) throw new Error("Ledger account not found");
  const journals = await WalletJournal.find({ "postings.account": account._id }).lean();
  const journalBalanceMinor = journals.reduce((sum, journal) =>
    sum + journal.postings.filter(p => String(p.account) === String(account._id))
      .reduce((n, p) => n + p.deltaMinor, 0), 0);
  return {
    accountId: String(account._id), currency: account.currency, kind: account.kind,
    cachedBalanceMinor: account.balanceMinor, journalBalanceMinor,
    balanced: Number.isSafeInteger(journalBalanceMinor) && journalBalanceMinor === account.balanceMinor,
  };
}
async function reconcileSettledIntent(intentId) {
  const intent = await PaymentIntent.findById(intentId).lean();
  if (!intent) throw new Error("Payment intent not found");
  const journal = intent.ledgerReference
    ? await WalletJournal.findOne({ reference: intent.ledgerReference }).lean() : null;
  return {
    intentId: String(intent._id), status: intent.status,
    journalFound: Boolean(journal),
    consistent: intent.status === "settled"
      ? Boolean(journal && journal.currency === intent.currency &&
          journal.postings.reduce((sum, p) => sum + p.deltaMinor, 0) === 0)
      : !journal,
  };
}
module.exports = { reconcileAccount, reconcileSettledIntent };
