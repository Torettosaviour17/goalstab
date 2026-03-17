const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Withdrawal = require("../models/Withdrawal");
const Goal = require("../models/Goal");
const Transaction = require("../models/Transaction");
const { sendNotification } = require("./notifications");
const { sendEmailToUser } = require("../services/emailService");

// @route   POST api/withdrawals
// @desc    Request a withdrawal from a completed goal
router.post("/", auth, async (req, res) => {
  const { goalId, amount, accountDetails } = req.body;
  try {
    const goal = await Goal.findById(goalId);
    if (!goal) return res.status(404).json({ msg: "Goal not found" });
    if (goal.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });
    if (goal.progress < 100)
      return res.status(400).json({ msg: "Goal not completed yet" });

    // Check if there's already a pending withdrawal for this goal
    const pendingWithdrawal = await Withdrawal.findOne({
      goal: goalId,
      status: "pending",
    });
    if (pendingWithdrawal) {
      return res
        .status(400)
        .json({ msg: "A withdrawal request is already pending for this goal" });
    }

    // Calculate maximum withdrawable amount
    const maxWithdrawable = Math.min(
      goal.saved,
      goal.userTarget - (goal.withdrawn || 0),
    );

    if (amount > maxWithdrawable) {
      return res
        .status(400)
        .json({ msg: "Amount exceeds your available withdrawal limit" });
    }
    if (amount <= 0) {
      return res.status(400).json({ msg: "Amount must be positive" });
    }

    // Create withdrawal request
    const withdrawal = new Withdrawal({
      user: req.user.id,
      goal: goalId,
      amount,
      accountDetails,
    });
    await withdrawal.save();

    // Create transaction record for withdrawal
    const transaction = new Transaction({
      user: req.user.id,
      goal: goalId,
      type: "withdrawal",
      amount,
      description: `Withdrawal request from ${goal.title}`,
      status: "pending",
    });
    await transaction.save();

    // Optionally lock the goal or mark that a withdrawal is pending
    // goal.withdrawalPending = true; (if you add that field)
    // await goal.save();

    res.json(withdrawal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/withdrawals/user
// @desc    Get all withdrawals for the logged-in user
router.get("/user", auth, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user.id })
      .populate("goal", "title")
      .sort({ requestedAt: -1 });
    res.json(withdrawals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Admin routes (should be protected by admin middleware)
// For simplicity, we'll add an isAdmin flag on user later, but for now we'll check via a secret or role.

// @route   GET api/withdrawals/admin
// @desc    Get all pending withdrawals (admin only)
router.get("/admin", auth, async (req, res) => {
  // TODO: Add admin check
  try {
    const withdrawals = await Withdrawal.find({ status: "pending" })
      .populate("user", "name email")
      .populate("goal", "title")
      .sort({ requestedAt: 1 });
    res.json(withdrawals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/withdrawals/:id/approve
// @desc    Approve a withdrawal (admin) - MOVED TO ADMIN ROUTES
/*
router.put("/:id/approve", auth, async (req, res) => {
  // TODO: Add admin check
  const { adminNote } = req.body;
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal)
      return res.status(404).json({ msg: "Withdrawal not found" });

    withdrawal.status = "approved";
    withdrawal.adminNote = adminNote;
    withdrawal.processedAt = new Date();
    withdrawal.processedBy = req.user.id;
    await withdrawal.save();

    // Update goal saved amount
    const goal = await Goal.findById(withdrawal.goal);
    if (goal) {
      goal.saved -= withdrawal.amount;
      goal.locked = false; // unlock if needed
      await goal.save();

      // If goal saved becomes zero or negative, delete it and notify
      if (goal.saved <= 0) {
        const goalId = goal._id;
        const goalTitle = goal.title;
        await goal.deleteOne();
        // Send SSE event for goal deletion
        sendNotification(withdrawal.user.toString(), {
          type: "goal_deleted",
          goalId: goalId.toString(),
          message: `Goal "${goalTitle}" was removed after full withdrawal.`,
        });
      }
    }

    // Update transaction status when withdrawal is approved
    const transaction = await Transaction.findOne({
      user: withdrawal.user,
      goal: withdrawal.goal,
      type: "withdrawal",
      amount: withdrawal.amount,
    }).sort({ createdAt: -1 });
    if (transaction) {
      transaction.status = "approved";
      transaction.description = `Withdrawal approved from ${goal?.title || "goal"}`;
      await transaction.save();
    }

    // Notify user
    sendNotification(withdrawal.user.toString(), {
      type: "withdrawal_processed",
      message: `Your withdrawal of ₦${withdrawal.amount.toLocaleString()} has been approved.`,
    });

    await sendEmailToUser(
      withdrawal.user,
      "Withdrawal Approved",
      `<p>Your withdrawal of ₦${withdrawal.amount.toLocaleString()} has been approved.</p>`,
    );

    res.json(withdrawal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
*/

// @route   PUT api/withdrawals/:id/reject
// @desc    Reject a withdrawal (admin) - MOVED TO ADMIN ROUTES
/*
router.put("/:id/reject", auth, async (req, res) => {
  // TODO: Add admin check
  const { adminNote } = req.body;
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal)
      return res.status(404).json({ msg: "Withdrawal not found" });

    withdrawal.status = "rejected";
    withdrawal.adminNote = adminNote;
    withdrawal.processedAt = new Date();
    withdrawal.processedBy = req.user.id;
    await withdrawal.save();

    // Update transaction status when withdrawal is rejected
    const transaction = await Transaction.findOne({
      user: withdrawal.user,
      goal: withdrawal.goal,
      type: "withdrawal",
      amount: withdrawal.amount,
    }).sort({ createdAt: -1 });
    if (transaction) {
      transaction.status = "rejected";
      transaction.description = `Withdrawal rejected: ${adminNote || "No reason"}`;
      await transaction.save();
    }

    // Notify user
    sendNotification(withdrawal.user.toString(), {
      type: "withdrawal_processed",
      message: `Your withdrawal request was rejected. Reason: ${adminNote || "No reason provided"}`,
    });

    await sendEmailToUser(
      withdrawal.user,
      "Withdrawal Rejected",
      `<p>Your withdrawal request was rejected. Reason: ${adminNote || "Not specified"}</p>`,
    );

    res.json(withdrawal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
*/

module.exports = router;
