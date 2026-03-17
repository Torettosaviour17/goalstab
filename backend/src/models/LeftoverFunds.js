const mongoose = require("mongoose");

const LeftoverFundsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goal: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", required: true },
  amount: { type: Number, required: true },
  originalGoalTitle: { type: String, required: true },
  withdrawal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Withdrawal",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["unclaimed", "transferred"],
    default: "unclaimed",
  },
});

module.exports = mongoose.model("LeftoverFunds", LeftoverFundsSchema);
