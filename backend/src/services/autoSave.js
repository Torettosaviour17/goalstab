const cron = require("node-cron");
const Goal = require("../models/Goal");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const { sendNotification } = require("../routes/notifications");

/**
 * Calculate next auto‑save date based on frequency
 */
const getNextDate = (frequency) => {
  const now = new Date();
  switch (frequency) {
    case "daily":
      return new Date(now.setDate(now.getDate() + 1));
    case "weekly":
      return new Date(now.setDate(now.getDate() + 7));
    case "monthly":
      return new Date(now.setMonth(now.getMonth() + 1));
    default:
      return new Date(now.setDate(now.getDate() + 1));
  }
};

/**
 * Process auto‑save for a single goal
 */
const processGoalAutoSave = async (goal) => {
  // Determine amount to add
  let amount = 0;
  if (goal.type === "percentage") {
    // For demo, assume a fixed monthly income of 500,000.
    // In a real app, you could store this in the user's preferences.
    const monthlyIncome = 500000;
    amount = (goal.autoSave / 100) * monthlyIncome;
    // Adjust for frequency
    if (goal.frequency === "daily") amount /= 30;
    if (goal.frequency === "weekly") amount /= 4;
  } else {
    amount = goal.autoSave; // fixed amount
  }

  // Apply the addition
  goal.saved = Math.min(goal.saved + amount, goal.target);
  goal.lastAutoSave = new Date();
  goal.nextAutoSave = getNextDate(goal.frequency);
  await goal.save();

  // Create transaction record
  await Transaction.create({
    user: goal.user,
    goal: goal._id,
    type: "auto_save",
    amount,
    description: `Auto-save to ${goal.title}`,
  });

  // Send real‑time notification
  sendNotification(goal.user.toString(), {
    type: "auto_save",
    message: `₦${amount.toLocaleString()} auto-saved to ${goal.title}`,
  });

  // Check if goal completed (optional)
  if (goal.saved >= goal.target) {
    await Notification.create({
      user: goal.user,
      type: "goal_completed",
      title: "Goal Completed! 🎉",
      message: `Congratulations! You've reached your goal: ${goal.title}`,
      goal: goal._id,
    });
    sendNotification(goal.user.toString(), {
      type: "goal_completed",
      message: `Goal completed: ${goal.title}`,
    });
  }
};

/**
 * Run auto‑save for all eligible goals
 */
const runAutoSave = async () => {
  console.log("Running auto‑save scheduler...");
  const now = new Date();
  // Find goals that are enabled, not locked, not completed, and due
  const goals = await Goal.find({
    autoSaveEnabled: true,
    locked: false,
    progress: { $lt: 100 },
    $or: [
      { nextAutoSave: { $lte: now } },
      { nextAutoSave: null }, // first time
    ],
  });

  console.log(`Found ${goals.length} goals due for auto‑save.`);

  for (const goal of goals) {
    try {
      await processGoalAutoSave(goal);
    } catch (err) {
      console.error(`Auto‑save failed for goal ${goal._id}:`, err);
    }
  }
};

// Schedule the job to run every hour (you can adjust the cron expression)
cron.schedule("0 * * * *", () => {
  runAutoSave();
});

module.exports = { runAutoSave };
