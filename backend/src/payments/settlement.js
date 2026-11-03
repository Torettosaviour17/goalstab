"use strict";
const mongoose = require("mongoose");
const PaymentIntent = require("./models/PaymentIntent");
const WalletLedgerAccount = require("../models/WalletLedgerAccount");
const WalletJournal = require("../models/WalletJournal");
const { validateMoney } = require("./money");

// Internal service only. Caller MUST supply a result obtained through a
// provider adapter's authenticated server-side verification, not a browser
// callback or an unverified webhook body. This is not an API endpoint.
async function settleVerifiedWalletFunding({ intentId, verified }) {
  if (!mongoose.isValidObjectId(intentId)) throw new TypeError("Invalid intent");
  if (!verified || verified.authenticated !== true || verified.status !== "success" ||
      typeof verified.reference !== "string" || !verified.reference ||
      typeof verified.provider !== "string" || !verified.provider) {
    throw new Error("Authenticated successful provider verification required");
  }
  const money = validateMoney({ amountMinor: verified.amountMinor, currency: verified.currency });
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
      await WalletLedgerAccount.updateOne({ _id: accounts[0]._id }, { $inc: { balanceMinor: money.amountMinor } }, { session });
      await WalletLedgerAccount.updateOne({ _id: accounts[1]._id }, { $inc: { balanceMinor: -money.amountMinor } }, { session });
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
