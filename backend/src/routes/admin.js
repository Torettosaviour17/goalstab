const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const User = require("../models/User");
const Goal = require("../models/Goal");
const Withdrawal = require("../models/Withdrawal");
const Notification = require("../models/Notification");
const { sendNotification } = require("./notifications");

// @route   POST api/admin/users
// @desc    Create a new user (admin only)
router.post("/users", [auth, admin], async (req, res) => {
  const {
    name,
    email,
    password,
    isPremium = false,
    isAdmin = false,
  } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ msg: "Please provide name, email and password" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters" });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "User already exists with this email" });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      isPremium,
      isAdmin,
    });
    await user.save();

    // Return user data (without password)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      msg: "User created successfully",
      user: userResponse,
    });
  } catch (err) {
    console.error("Admin create user error:", err);
    res.status(500).json({ msg: "Server error during user creation" });
  }
});

// @route   GET api/admin/users
router.get("/users", [auth, admin], async (req, res) => {
  const { page = 1, limit = 20, search = "" } = req.query;
  try {
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await User.countDocuments(query);
    res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/admin/users/:id/toggle-admin
// @desc    Toggle admin status for a user
router.put("/users/:id/toggle-admin", [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.id === req.user.id)
      return res
        .status(400)
        .json({ msg: "Cannot change your own admin status" });
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json({
      msg: "Admin status updated",
      user: { id: user.id, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user (and all their data)
router.delete("/users/:id", [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.id === req.user.id)
      return res.status(400).json({ msg: "Cannot delete yourself" });

    // Delete user's goals, accounts, transactions, notifications
    await Goal.deleteMany({ user: user.id });
    await Account.deleteMany({ user: user.id });
    await Transaction.deleteMany({ user: user.id });
    await Notification.deleteMany({ user: user.id });
    await Withdrawal.deleteMany({ user: user.id });
    await user.deleteOne();

    res.json({ msg: "User and all associated data deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/withdrawals
// @desc    Get all withdrawals (with pagination, filtering)
router.get("/withdrawals", [auth, admin], async (req, res) => {
  const { page = 1, limit = 20, status = "pending" } = req.query;
  try {
    const query = status !== "all" ? { status } : {};
    const withdrawals = await Withdrawal.find(query)
      .populate("user", "name email")
      .populate("goal", "title")
      .sort({ requestedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Withdrawal.countDocuments(query);
    res.json({
      withdrawals,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/admin/withdrawals/:id/approve
// @desc    Approve a withdrawal
router.put("/withdrawals/:id/approve", [auth, admin], async (req, res) => {
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
      await goal.save();
    }

    // Notify user
    sendNotification(withdrawal.user.toString(), {
      type: "withdrawal_processed",
      message: `Your withdrawal of ₦${withdrawal.amount.toLocaleString()} has been approved.`,
    });

    res.json(withdrawal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/admin/withdrawals/:id/reject
// @desc    Reject a withdrawal
router.put("/withdrawals/:id/reject", [auth, admin], async (req, res) => {
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

    // Notify user
    sendNotification(withdrawal.user.toString(), {
      type: "withdrawal_processed",
      message: `Your withdrawal request was rejected. Reason: ${adminNote || "No reason provided"}`,
    });

    res.json(withdrawal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/stats
// @desc    Get platform stats
router.get("/stats", [auth, admin], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGoals = await Goal.countDocuments();
    const totalSaved = await Goal.aggregate([
      { $group: { _id: null, total: { $sum: "$saved" } } },
    ]);
    const pendingWithdrawals = await Withdrawal.countDocuments({
      status: "pending",
    });
    const completedWithdrawals = await Withdrawal.countDocuments({
      status: "approved",
    });

    res.json({
      totalUsers,
      totalGoals,
      totalSaved: totalSaved[0]?.total || 0,
      pendingWithdrawals,
      completedWithdrawals,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
