const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  initializePayment,
  verifyPayment,
  paystackWebhook,
} = require("../controllers/paystack");

// @route   POST api/paystack/initialize
// @desc    Initialize a Paystack payment
// @access  Private
router.post("/initialize", auth, initializePayment);

// @route   GET api/paystack/verify
// @desc    Verify a Paystack payment and credit goal
// @access  Private
router.get("/verify", auth, verifyPayment);

// @route   POST api/paystack/webhook
// @desc    Paystack webhook (no auth — Paystack calls this directly)
// @access  Public (verified by signature)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paystackWebhook,
);

module.exports = router;
