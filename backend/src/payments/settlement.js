"use strict";
const mongoose = require("mongoose");
const PaymentIntent = require("./models/PaymentIntent");
const WalletLedgerAccount = require("../models/WalletLedgerAccount");
const WalletJournal = require("../models/WalletJournal");
const { validateMoney } = require("./money");

// Internal service only. Always verify directly with the configured gateway.
// Browser callbacks and webhook payloads cannot authorize a wallet credit.
async function settleVerifiedWalletFunding({ intentId, providerRegistry }) {
  if (!mongoose.isValidObjectId(intentId)) throw new TypeError("Invalid intent");
  if (!providerRegistry || typeof providerRegistry.get !== "function") throw new TypeError("Provider registry required");
  // Resolve the intent first; the adapter verifies against the provider API.
  // No caller-supplied success flag can authorize a wallet credit.
  const initialIntent = await PaymentIntent.findById(intentId).lean();
  if (!initialIntent) throw new Error("Payment intent not found");
  const verified = await providerRegistry.get(initialIntent.provider).verify({ reference: initialIntent.reference });
  if (!verified || verified.status !== "success" || verified.reference !== initialIntent.reference ||
      verified.provider !== initialIntent.provider) throw new Error("Provider did not verify payment");
  const money = validateMoney({ amountMinor: verified.amountMinor, currency: verified.currency });
  if (initialIntent.currency !== money.currency || initialIntent.amountMinor !== money.amountMinor ||
      initialIntent.purpose !== "wallet_funding") throw new Error("Provider verification does not match intent");
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      const intent = await PaymentIntent.findById(intentId).session(session);
      if (!intent) throw new Error("Payment intent not found");
      if (intent.status === "settled") {
        if (intent.provider !== verified.provider || intent.reference !== verified.reference ||
            intent.currency !== money.currency || intent.amountMinor !== money.amountMinor) {
          throw new Error("Conflicting verification for settled payment");
        }
        return { alreadySettled: true, ledgerReference: intent.ledgerReference };
      }
      if (intent.status !== "pending") throw new Error("Payment intent is not pending");
      if (intent.purpose !== "wallet_funding" || intent.provider !== verified.provider ||
          intent.reference !== verified.reference || intent.currency !== money.currency ||
          intent.amountMinor !== money.amountMinor) throw new Error("Provider verification does not match payment intent");

      // Each wallet balance is backed by a balanced journal entry. A clearing
      // account represents provider receivables, not spendable customer funds.
      const accounts = [];
      for (const kind of ["available", "clearing"]) {
        const account = await WalletLedgerAccount.findOneAndUpdate(
          { owner: intent.user, kind, currency: intent.currency },
          { $setOnInsert: { owner: intent.user, kind, currency: intent.currency, balanceMinor: 0 } },
          { session, upsert: true, new: true, runValidators: true },
        );
        accounts.push(account);
      }
      const journalReference = "fund_" + intent.reference;
      if (journalReference.length > 128) throw new Error("Ledger reference too long");
      const credit = await WalletLedgerAccount.updateOne({ _id: accounts[0]._id }, { $inc: { balanceMinor: money.amountMinor } }, { session });
      const clearing = await WalletLedgerAccount.updateOne({ _id: accounts[1]._id }, { $inc: { balanceMinor: -money.amountMinor } }, { session });
      if (credit.modifiedCount !== 1 || clearing.modifiedCount !== 1) throw new Error("Ledger account update failed");
      await WalletJournal.create([{
        reference: journalReference,
        currency: intent.currency,
        source: "provider_wallet_funding",
        createdBy: intent.user,
        postings: [
          { account: accounts[0]._id, deltaMinor: money.amountMinor },
          { account: accounts[1]._id, deltaMinor: -money.amountMinor },
        ],
      }], { session });
      intent.status = "settled";
      intent.settledAt = new Date();
      intent.ledgerReference = journalReference;
      await intent.save({ session });
      return { alreadySettled: false, ledgerReference: journalReference };
    });
  } finally {
    await session.endSession();
  }
}

module.exports = { settleVerifiedWalletFunding };
