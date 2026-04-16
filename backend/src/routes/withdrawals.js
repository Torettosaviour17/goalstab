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

    if (goal.isClosed)
      return res.status(400).json({ msg: "Goal is already closed" });

    // Prevent multiple pending withdrawals
    const existing = await Withdrawal.findOne({
      goal: goalId,
      status: "pending",
    });
    if (existing)
      return res.status(400).json({ msg: "Withdrawal already pending" });

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0)
      return res.status(400).json({ msg: "Invalid amount" });

    // FIX: Allow withdrawal up to full saved balance.
    // Platform fee was already deducted in Goal pre-save hook when goal was funded.
    if (numAmount > goal.saved)
      return res.status(400).json({ msg: "Insufficient balance" });

    const withdrawal = await Withdrawal.create({
      user: req.user.id,
      goal: goalId,
      amount: numAmount,
      fee: 0, // FIX: fee is handled by pre-save hook, not here
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
      reference: withdrawal._id,
    });

    sendNotification(req.user.id, {
      type: "withdrawal_requested",
      message: `Withdrawal request of ₦${numAmount.toLocaleString()} submitted`,
    });

    await sendEmailToUser(
      req.user.id,
      "Withdrawal Request Submitted",
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
      .populate("goal", "title saved isClosed lockedBalance availableBalance")
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
    // Atomic update — prevents duplicate approvals even if button is clicked multiple times
    const withdrawal = await Withdrawal.findOneAndUpdate(
      { _id: req.params.id, status: "pending" },
      {
        status: "approved",
        processedAt: new Date(),
        processedBy: req.user.id,
      },
      { new: true },
    );

    if (!withdrawal)
      return res.status(400).json({ msg: "Already processed or not found" });

    const goal = await Goal.findById(withdrawal.goal);
    if (!goal) return res.status(404).json({ msg: "Goal not found" });

    // FIX: Just deduct the withdrawal amount from saved and track withdrawn.
    // Do NOT touch fee here — it was already handled by Goal pre-save hook.
    goal.saved -= withdrawal.amount;
    goal.withdrawn += withdrawal.amount;

    // Goal pre-save hook will handle auto-closing if saved hits 0
    await goal.save();

    // Update related transaction
    await Transaction.findOneAndUpdate(
      { reference: withdrawal._id, type: "withdrawal" },
      { status: "approved" },
    );

    // Log admin action (atomic update above ensures this only runs once)
    await AdminLog.create({
      user: req.user.id,
      action: "approve_withdrawal",
      targetType: "Withdrawal",
      targetId: withdrawal._id,
      details: {
        amount: withdrawal.amount,
        goalId: goal._id,
      },
    });

    const message = goal.isClosed
      ? `Your withdrawal of ₦${withdrawal.amount.toLocaleString()} has been approved. Your goal "${goal.title}" is now closed.`
      : `Your withdrawal of ₦${withdrawal.amount.toLocaleString()} has been approved.`;

    sendNotification(withdrawal.user.toString(), {
      type: "withdrawal_approved",
      message,
    });

    await sendEmailToUser(
      withdrawal.user,
      "Withdrawal Approved",
      `<p>${message}</p>`,
    );

    res.json(withdrawal);
  } catch (err) {
    console.error(err);
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
    const withdrawal = await Withdrawal.findOneAndUpdate(
      { _id: req.params.id, status: "pending" },
      {
        status: "rejected",
        adminNote,
        processedAt: new Date(),
        processedBy: req.user.id,
      },
      { new: true },
    );

    if (!withdrawal)
      return res.status(400).json({ msg: "Already processed or not found" });

    await Transaction.findOneAndUpdate(
      { reference: withdrawal._id, type: "withdrawal" },
      {
        status: "rejected",
        description: `Withdrawal rejected: ${adminNote || "No reason provided"}`,
      },
    );

    await AdminLog.create({
      user: req.user.id,
      action: "reject_withdrawal",
      targetType: "Withdrawal",
      targetId: withdrawal._id,
      details: { adminNote },
    });

    sendNotification(withdrawal.user.toString(), {
      type: "withdrawal_rejected",
      message: `Your withdrawal request was rejected. ${adminNote || ""}`,
    });

    await sendEmailToUser(
      withdrawal.user,
      "Withdrawal Rejected",
      `<p>${adminNote || "No reason provided"}</p>`,
    );

    res.json(withdrawal);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
