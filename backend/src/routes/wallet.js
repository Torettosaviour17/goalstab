const express = require("express");
const auth = require("../middleware/auth");
const WalletActivity = require("../models/WalletActivity");
const WalletPreferences = require("../models/WalletPreferences");
const router = express.Router();
router.use(auth);
router.use((_req, res, next) => { res.set("Cache-Control", "no-store"); next(); });

// No balance exists until a reconciled ledger and verified funding provider are live.
router.get("/", async (req, res, next) => {
  try {
    const [transactions, preferences] = await Promise.all([
      WalletActivity.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(30).lean(),
      WalletPreferences.findOne({ user: req.user.id }).lean(),
    ]);
    res.json({
      currency: "NGN", status: "not_activated",
      availableBalance: null, pendingBalance: null, transactions,
      preferences: preferences ? {
        smartSaveEnabled: preferences.smartSaveEnabled,
        frequency: preferences.frequency, percentage: preferences.percentage,
        monthlyCapMinor: preferences.monthlyCapMinor,
        minimumRemainingMinor: preferences.minimumRemainingMinor,
        fundingSource: preferences.fundingSource,
      } : { smartSaveEnabled: false, frequency: "monthly", percentage: 5, monthlyCapMinor: 0, minimumRemainingMinor: 0, fundingSource: "wallet" },
      capabilities: { fund: false, transfer: false, withdraw: false, saveFromWallet: false },
    });
  } catch (err) { next(err); }
});

router.put("/preferences", async (req, res, next) => {
  try {
    const { smartSaveEnabled, frequency, percentage, monthlyCapMinor, minimumRemainingMinor, fundingSource } = req.body || {};
    if (typeof smartSaveEnabled !== "boolean" || !["daily", "weekly", "monthly"].includes(frequency) ||
        !Number.isInteger(percentage) || percentage < 1 || percentage > 20 ||
        !Number.isSafeInteger(monthlyCapMinor) || monthlyCapMinor < 0 || monthlyCapMinor > 100000000 ||
        !Number.isSafeInteger(minimumRemainingMinor) || minimumRemainingMinor < 0 || minimumRemainingMinor > 100000000 ||
        !["wallet", "connected_account"].includes(fundingSource)) {
      return res.status(400).json({ msg: "Invalid saving preferences." });
    }
    // Explicit opt-in is stored for future activation, but never authorizes a debit now.
    const preferences = await WalletPreferences.findOneAndUpdate(
      { user: req.user.id },
      { $set: { smartSaveEnabled, frequency, percentage, monthlyCapMinor, minimumRemainingMinor, fundingSource } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return res.json({ msg: "Preferences saved. Automatic deductions are not active.", preferences });
  } catch (err) { next(err); }
});

router.post(["/fund", "/transfer", "/withdraw", "/save"], (_req, res) =>
  res.status(503).json({ msg: "Wallet money movement is not activated yet." }),
);
module.exports = router;
