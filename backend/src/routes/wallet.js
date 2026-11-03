const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

// Wallet is a separate balance from goal savings. Never infer available funds
// from savings transactions or allow a client to set a balance.
router.get("/", auth, async (_req, res) => {
  res.set("Cache-Control", "no-store");
  return res.json({
    currency: "NGN",
    status: "not_activated",
    availableBalance: null,
    pendingBalance: null,
    transactions: [],
    capabilities: { fund: false, transfer: false, withdraw: false, saveFromWallet: false },
  });
});

// Fail closed until verified funding, ledger, settlement and payout rails exist.
router.post(["/fund", "/transfer", "/withdraw", "/save"], auth, (_req, res) =>
  res.status(503).json({ msg: "Wallet money movement is not activated yet." }),
);

module.exports = router;
