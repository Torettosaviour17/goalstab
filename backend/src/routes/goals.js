const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Goal = require("../models/Goal");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const User = require("../models/User"); // <-- ADD THIS
const { sendNotification } = require("./notifications");
const { runAutoSave } = require("../services/autoSave");

// @route   GET api/goals
// @desc    Get all goals for user
router.get("/", auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id })
      .populate("sharedWith.user", "name email")
      .sort({ createdAt: -1 });

    res.json(goals.map((g) => (g.toObject ? g.toObject() : g)));
  } catch (err) {
    console.error("GET goals error:", err);
    res.status(500).send("Server error");
  }
});

// @route   POST api/goals
// @desc    Create a goal
router.post("/", auth, async (req, res) => {
  try {
    if (req.body.accountId === "") {
      req.body.accountId = undefined;
    }

    req.body.target = Number(req.body.target);
    req.body.autoSave = Number(req.body.autoSave);

    const newGoal = new Goal({
      user: req.user.id,
      ...req.body,
    });

    if (newGoal.autoSaveEnabled) {
      const now = new Date();

      if (newGoal.frequency === "daily")
        newGoal.nextAutoSave = new Date(now.setDate(now.getDate() + 1));
      else if (newGoal.frequency === "weekly")
        newGoal.nextAutoSave = new Date(now.setDate(now.getDate() + 7));
      else if (newGoal.frequency === "monthly")
        newGoal.nextAutoSave = new Date(now.setMonth(now.getMonth() + 1));
    }

    const goal = await newGoal.save();

    res.json(goal.toObject ? goal.toObject() : goal);
  } catch (err) {
    console.error("POST goal error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// @route   PUT api/goals/:id
// @desc    Update a goal
router.put("/:id", auth, async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ msg: "Goal not found" });

    if (goal.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, lastUpdated: Date.now() },
      { new: true },
    );

    res.json(goal.toObject ? goal.toObject() : goal);
  } catch (err) {
    console.error("PUT goal error:", err);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/goals/:id
// @desc    Delete a goal
router.delete("/:id", auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ msg: "Goal not found" });

    if (goal.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    await goal.deleteOne();

    res.json({ msg: "Goal removed" });
  } catch (err) {
    console.error("DELETE goal error:", err);
    res.status(500).send("Server error");
  }
});

// @route   POST api/goals/:id/add-funds
// @desc    Add funds to a goal
router.post("/:id/add-funds", auth, async (req, res) => {
  try {
    let { amount } = req.body;
    amount = Number(amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ msg: "Goal not found" });

    if (goal.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    goal.saved = Math.min(goal.saved + amount, goal.target);
    goal.lastUpdated = Date.now();

    await goal.save();

    await Transaction.create({
      user: req.user.id,
      goal: goal.id,
      type: "deposit",
      amount,
      description: `Added funds to ${goal.title}`,
    });

    await Notification.create({
      user: req.user.id,
      type: "deposit_received",
      title: "Funds Added",
      message: `₦${amount.toLocaleString()} added to ${goal.title}`,
      goal: goal.id,
    });

    sendNotification(req.user.id, {
      type: "deposit",
      message: `Funds added to ${goal.title}`,
    });

    if (goal.saved >= goal.target) {
      await Notification.create({
        user: req.user.id,
        type: "goal_completed",
        title: "Goal Completed 🎉",
        message: `Congratulations! You've reached your goal: ${goal.title}`,
        goal: goal.id,
      });

      sendNotification(req.user.id, {
        type: "goal_completed",
        message: `Goal completed: ${goal.title}`,
      });
    }

    res.json(goal.toObject ? goal.toObject() : goal);
  } catch (err) {
    console.error("Add funds error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ================================
// SHARE GOAL FEATURE
// ================================

// @route   POST api/goals/:id/share
// @desc    Share goal with another user
router.post("/:id/share", auth, async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role || !["viewer", "contributor"].includes(role)) {
    return res.status(400).json({ msg: "Email and valid role required" });
  }

  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ msg: "Goal not found" });

    if (goal.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    const userToShare = await User.findOne({ email });

    if (!userToShare) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (goal.sharedWith.some((u) => u.user.toString() === userToShare.id)) {
      return res.status(400).json({ msg: "User already has access" });
    }

    goal.sharedWith.push({
      user: userToShare.id,
      role,
    });

    await goal.save();

    await goal.populate("sharedWith.user", "name email");

    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   DELETE api/goals/:id/share/:userId
// @desc    Remove shared user
router.delete("/:id/share/:userId", auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ msg: "Goal not found" });

    if (goal.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    goal.sharedWith = goal.sharedWith.filter(
      (u) => u.user.toString() !== req.params.userId,
    );

    await goal.save();

    await goal.populate("sharedWith.user", "name email");

    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================================
// AUTO SAVE
// ================================

// @route   POST api/goals/auto-save/trigger
// @desc    Manually trigger auto-save
router.post("/auto-save/trigger", auth, async (req, res) => {
  try {
    await runAutoSave();

    res.json({ msg: "Auto-save triggered successfully" });
  } catch (err) {
    console.error("Auto-save trigger error:", err);

    res.status(500).json({ msg: "Auto-save failed" });
  }
});

module.exports = router;
