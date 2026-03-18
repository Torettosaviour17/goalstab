const mongoose = require("mongoose");

const GoalActivitySchema = new mongoose.Schema({
  goal: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: [
      "goal_created",
      "goal_updated",
      "goal_completed",
      "funds_added",
      "withdrawal_requested",
      "withdrawal_approved",
      "withdrawal_rejected",
      "goal_shared",
      "user_removed",
      "auto_save",
    ],
    required: true,
  },
  amount: Number,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GoalActivity", GoalActivitySchema);
