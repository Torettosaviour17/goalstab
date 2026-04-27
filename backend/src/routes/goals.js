const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Goal = require("../models/Goal");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const GoalActivity = require("../models/GoalActivity");
const User = require("../models/User");
const { sendNotification } = require("./notifications");
const { runAutoSave } = require("../services/autoSave");
const { sendEmailToUser } = require("../services/emailService");
const shoppingService = require("../services/shoppingService");

// ================================
// HELPER
// ================================

async function recordGoalActivity(
  goalId,
  userId,
  type,
  amount = null,
  metadata = {},
) {
  try {
    await GoalActivity.create({
      goal: goalId,
      user: userId,
      type,
      amount,
      metadata,
    });
  } catch (err) {
    console.error("Failed to record activity:", err);
  }
}

// ================================
// GOALS CRUD
// ================================

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
const createGoal = async (req, res) => {
  try {
    if (req.body.accountId === "") {
      req.body.accountId = undefined;
    }

    const { userTarget, ...rest } = req.body;
    const fee = 100;
    const target = Number(userTarget) + fee;

    const newGoal = new Goal({
      user: req.user.id,
      userTarget: Number(userTarget),
      fee,
      target,
      goalType: req.body.goalType || "product",
      ...rest,
    });

    if (newGoal.autoSaveEnabled) {
      const now = new Date();
      if (newGoal.frequency === "daily")
        newGoal.nextAutoSave = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      else if (newGoal.frequency === "weekly")
        newGoal.nextAutoSave = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      else if (newGoal.frequency === "monthly")
        newGoal.nextAutoSave = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }

    const goal = await newGoal.save();

    await recordGoalActivity(goal._id, req.user.id, "goal_created");

    res.json(goal.toObject ? goal.toObject() : goal);
  } catch (err) {
    console.error("POST goal error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

router.post("/", auth, createGoal);

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

// ================================
// ADD FUNDS
// ================================

// @route   POST api/goals/:id/add-funds
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

    goal.saved += amount;
    goal.lastUpdated = Date.now();

    await goal.save();

    await recordGoalActivity(goal._id, req.user.id, "funds_added", amount);

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

    await sendEmailToUser(
      req.user.id,
      "Funds Added",
      `<p>₦${amount.toLocaleString()} added to your goal: <strong>${goal.title}</strong></p>`,
    );

    if (goal.saved >= goal.target) {
      await recordGoalActivity(goal._id, req.user.id, "goal_completed");

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

      await sendEmailToUser(
        req.user.id,
        "Goal Completed! 🎉",
        `<h1>Congratulations!</h1>
         <p>You've reached your goal: <strong>${goal.title}</strong></p>
         <p>You can now withdraw your funds or request fulfillment.</p>
         <a href="${process.env.FRONTEND_URL}/goals/${goal.id}" style="background-color:#3b82f6; color:white; padding:10px 20px; text-decoration:none; border-radius:8px;">View Goal</a>`,
      );

      if (goal.usePlatformFulfillment) {
        goal.fulfillmentStatus = "processing";
        await goal.save();

        await recordGoalActivity(
          goal._id,
          req.user.id,
          "fulfillment_started",
          null,
          { details: goal.fulfillmentDetails },
        );

        const adminUsers = await User.find({ isAdmin: true });
        for (const admin of adminUsers) {
          await sendEmailToUser(
            admin.id,
            "New Fulfillment Request",
            `<p>Goal "${goal.title}" (${goal._id}) needs fulfillment.</p>
             <p>Details: ${JSON.stringify(goal.fulfillmentDetails)}</p>
             <a href="${process.env.FRONTEND_URL}/admin/fulfillment">Go to Admin Dashboard</a>`,
          );
        }

        console.log(`Auto-fulfillment triggered for goal ${goal._id}`);
      }
    }

    res.json(goal.toObject ? goal.toObject() : goal);
  } catch (err) {
    console.error("Add funds error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ================================
// SHARE GOAL
// ================================

// @route   POST api/goals/:id/share
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

    if (!userToShare) return res.status(404).json({ msg: "User not found" });

    if (goal.sharedWith.some((u) => u.user.toString() === userToShare.id)) {
      return res.status(400).json({ msg: "User already has access" });
    }

    goal.sharedWith.push({ user: userToShare.id, role });

    await goal.save();

    await sendEmailToUser(
      userToShare.id,
      `${req.user.name} shared a goal with you!`,
      `<h2>Goal: ${goal.title}</h2>
       <p>${req.user.name} has invited you to collaborate on this goal as a <strong>${role}</strong>.</p>
       <a href="${process.env.FRONTEND_URL}/goals/${goal.id}" style="background-color:#3b82f6; color:white; padding:10px 20px; text-decoration:none; border-radius:8px;">View Goal</a>
       <p>If you don't have an account yet, you'll need to register to view it.</p>`,
    );

    await recordGoalActivity(goal._id, req.user.id, "goal_shared", null, {
      email,
      role,
      targetUserId: userToShare.id,
    });

    await goal.populate("sharedWith.user", "name email");

    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   DELETE api/goals/:id/share/:userId
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

    await recordGoalActivity(goal._id, req.user.id, "user_removed", null, {
      userId: req.params.userId,
    });

    await goal.populate("sharedWith.user", "name email");

    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================================
// FULFILLMENT
// ================================

// @route   POST api/goals/:id/fulfillment-request
router.post("/:id/fulfillment-request", auth, async (req, res) => {
  const { details } = req.body;
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: "Goal not found" });
    if (goal.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });
    if (goal.progress < 100)
      return res.status(400).json({ msg: "Goal not completed yet" });
    if (goal.fulfillmentStatus !== "pending")
      return res
        .status(400)
        .json({ msg: "Fulfillment already requested or completed" });

    goal.fulfillmentStatus = "processing";
    if (details) goal.fulfillmentDetails = details;
    await goal.save();

    await recordGoalActivity(
      goal._id,
      req.user.id,
      "fulfillment_requested",
      null,
      details,
    );

    res.json({ msg: "Fulfillment request submitted", goal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================================
// AUTO SAVE
// ================================

// @route   POST api/goals/auto-save/trigger
router.post("/auto-save/trigger", auth, async (req, res) => {
  try {
    await runAutoSave();
    res.json({ msg: "Auto-save triggered successfully" });
  } catch (err) {
    console.error("Auto-save trigger error:", err);
    res.status(500).json({ msg: "Auto-save failed" });
  }
});

// ================================
// ACTIVITIES
// ================================

// @route   GET api/goals/:id/activities
router.get("/:id/activities", auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: "Goal not found" });

    const hasAccess =
      goal.user.toString() === req.user.id ||
      goal.sharedWith.some((u) => u.user.toString() === req.user.id);
    if (!hasAccess) return res.status(403).json({ msg: "Access denied" });

    const activities = await GoalActivity.find({ goal: goal._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================================
// SHOPPING INTEGRATION
// ================================

// @route   GET api/goals/shopping/search
// NOTE: must be defined BEFORE /:id routes to avoid conflict
router.get("/shopping/search", auth, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const results = await shoppingService.searchProducts(q);
    res.json(results);
  } catch (err) {
    console.error("Shopping search error:", err);
    res.status(500).json({ msg: "Search failed" });
  }
});

// @route   POST api/goals/:id/shopping/purchase
router.post("/:id/shopping/purchase", auth, async (req, res) => {
  const { productId, provider = "mock" } = req.body;
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: "Goal not found" });
    if (goal.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });
    if (goal.progress < 100)
      return res.status(400).json({ msg: "Goal not completed" });
    if (goal.saved < goal.target)
      return res.status(400).json({ msg: "Insufficient funds" });

    const user = await User.findById(req.user.id);
    const result = await shoppingService.purchaseProduct(
      productId,
      { name: user.name, email: user.email },
      provider,
    );

    if (result.success) {
      goal.fulfillmentStatus = "processing";
      goal.fulfillmentDetails = { purchase: result };
      await goal.save();

      await recordGoalActivity(
        goal._id,
        req.user.id,
        "fulfillment_requested",
        null,
        { purchase: result },
      );

      res.json(result);
    } else {
      res.status(400).json({ msg: "Purchase failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================================
// SINGLE EXPORT AT THE BOTTOM
// ================================
module.exports = router;
