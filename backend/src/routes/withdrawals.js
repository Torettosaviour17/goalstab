const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const Withdrawal = require("../models/Withdrawal");
const Goal = require("../models/Goal");
const Transaction = require("../models/Transaction");
const AdminLog = require("../models/AdminLog");

const { sendNotification } = require("./notifications");
const { sendEmailToUser } = require("../services/emailService");

const PLATFORM_FEE = 100;

/**
 * =========================
 * CREATE WITHDRAWAL
 * =========================
 */
router.post("/", auth, async (req, res) => {
  const { goalId, amount, accountDetails } = req.body;

  try {
    const goal = await Goal.findById(goalId);
    if (!goal) return res.status(404).json({ msg: "Goal not found" });

    if (goal.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    if (goal.progress < 100)
      return res.status(400).json({ msg: "Goal not completed" });

    const existing = await Withdrawal.findOne({
      goal: goalId,
      status: "pending",
    });

    if (existing)
      return res.status(400).json({ msg: "Withdrawal already pending" });

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0)
      return res.status(400).json({ msg: "Invalid amount" });

    if (numAmount > goal.saved)
      return res.status(400).json({ msg: "Insufficient balance" });

    const remaining = goal.saved - numAmount;
    const isFinal = remaining <= PLATFORM_FEE;

    if (isFinal && numAmount > goal.saved - PLATFORM_FEE) {
      return res.status(400).json({
        msg: `Leave at least ₦${PLATFORM_FEE} for platform fee`,
      });
    }

    const withdrawal = await Withdrawal.create({
      user: req.user.id,
      goal: goalId,
      amount: numAmount,
      fee: isFinal ? PLATFORM_FEE : 0,
      accountDetails,
      status: "pending",
    });

    await Transaction.create({
      user: req.user.id,
      goal: goalId,
      type: "withdrawal",
      amount: numAmount,
      status: "pending",
      description: `Withdrawal request from ${goal.title}`,
    });

    sendNotification(req.user.id, {
      type: "withdrawal_requested",
      message: `Withdrawal request of ₦${numAmount.toLocaleString()} submitted`,
    });

    await sendEmailToUser(
      req.user.id,
      "Withdrawal Request",
      `<p>Your withdrawal request of ₦${numAmount.toLocaleString()} is pending.</p>`,
    );

    res.json(withdrawal);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * =========================
 * USER WITHDRAWALS
 * =========================
 */
router.get("/user", auth, async (req, res) => {
  try {
    const data = await Withdrawal.find({ user: req.user.id })
      .populate("goal", "title saved")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

/**
 * =========================
 * ADMIN LIST
 * =========================
 */
router.get("/admin", [auth, admin], async (req, res) => {
  try {
    const data = await Withdrawal.find()
      .populate("user", "name email")
      .populate("goal", "title saved")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

/**
 * =========================
 * APPROVE WITHDRAWAL
 * =========================
 */
router.put("/:id/approve", [auth, admin], async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ msg: "Not found" });

    if (withdrawal.status !== "pending")
      return res.status(400).json({ msg: "Already processed" });

    const goal = await Goal.findById(withdrawal.goal);
    if (!goal) return res.status(404).json({ msg: "Goal missing" });

    goal.saved -= withdrawal.amount;
    goal.withdrawn = (goal.withdrawn || 0) + withdrawal.amount;

    if (goal.saved <= PLATFORM_FEE) {
      goal.saved = 0;
    }

    await goal.save();

    withdrawal.status = "approved";
    withdrawal.processedAt = new Date();
    withdrawal.processedBy = req.user.id;
    await withdrawal.save();

    await Transaction.updateOne(
      { _id: withdrawal._id },
      { status: "approved" },
    );

    await AdminLog.create({
      user: req.user.id,
      action: "approve_withdrawal",
      targetType: "Withdrawal",
      targetId: withdrawal._id,
      details: { amount: withdrawal.amount },
    });

    sendNotification(withdrawal.user.toString(), {
      type: "withdrawal_approved",
      message: `₦${withdrawal.amount.toLocaleString()} approved`,
    });

    await sendEmailToUser(
      withdrawal.user,
      "Withdrawal Approved",
      `<p>Your withdrawal was approved.</p>`,
    );

    res.json(withdrawal);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

/**
 * =========================
 * REJECT WITHDRAWAL
 * =========================
 */
router.put("/:id/reject", [auth, admin], async (req, res) => {
  const { adminNote } = req.body;

  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ msg: "Not found" });

    withdrawal.status = "rejected";
    withdrawal.adminNote = adminNote;
    withdrawal.processedAt = new Date();
    withdrawal.processedBy = req.user.id;

    await withdrawal.save();

    await AdminLog.create({
      user: req.user.id,
      action: "reject_withdrawal",
      targetType: "Withdrawal",
      targetId: withdrawal._id,
      details: { adminNote },
    });

    sendNotification(withdrawal.user.toString(), {
      type: "withdrawal_rejected",
      message: `Withdrawal rejected`,
    });

    await sendEmailToUser(
      withdrawal.user,
      "Withdrawal Rejected",
      `<p>${adminNote || "No reason"}</p>`,
    );

    res.json(withdrawal);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
