const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Goal = require("../models/Goal");
const Transaction = require("../models/Transaction");
const Withdrawal = require("../models/Withdrawal");
const Payment = require("../models/Payment");
const Account = require("../models/Account");
const Notification = require("../models/Notification");
const GoalActivity = require("../models/GoalActivity");
const LeftoverFunds = require("../models/LeftoverFunds");

// @route   PUT api/users/profile
// @desc    Update user profile (name, email, phone, avatar)
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (name) user.name = name;
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing && existing.id !== user.id) {
        return res.status(400).json({ msg: "Email is already taken" });
      }
      user.email = email;
    }
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    const updatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      isPremium: user.isPremium,
      isAdmin: user.isAdmin,
      preferences: user.preferences,
      createdAt: user.createdAt,
    };

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/users/preferences
// @desc    Update user preferences
router.put("/preferences", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.preferences = { ...user.preferences.toObject(), ...req.body };
    await user.save();
    res.json({ preferences: user.preferences });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/users/avatar
// @desc    Update user avatar (base64 or null)
router.put("/avatar", auth, async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (avatar && avatar !== "" && !avatar.startsWith("data:image/")) {
      return res.status(400).json({ msg: "Invalid image format" });
    }

    user.avatar = avatar || null;
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/users/password
// @desc    Change password
router.put("/password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ msg: "Please provide current and new password" });
  }
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;


// @route   DELETE api/users/account
// @desc    Permanently delete the authenticated user's account and personal data
router.delete("/account", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await Promise.all([
      Goal.deleteMany({ user: userId }),
      Transaction.deleteMany({ user: userId }),
      Withdrawal.deleteMany({ user: userId }),
      Payment.deleteMany({ user: userId }),
      Account.deleteMany({ user: userId }),
      Notification.deleteMany({ user: userId }),
      GoalActivity.deleteMany({ user: userId }),
      LeftoverFunds.deleteMany({ user: userId }),
    ]);

    await User.deleteOne({ _id: userId });
    res.json({ msg: "Account deleted successfully" });
  } catch (err) {
    console.error("Account deletion error:", err);
    res.status(500).json({ msg: "Unable to delete account" });
  }
});
