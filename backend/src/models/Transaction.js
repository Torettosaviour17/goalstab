const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goal: { type: mongoose.Schema.Types.ObjectId, ref: "Goal" },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "auto_save", "goal_completed"],
      required: true,
    },
    amount: { type: Number, required: true },
    description: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "completed",
    },
    date: { type: Date, default: Date.now },
    reference: { type: String, index: true },
  },
  { timestamps: true },
);

TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ goal: 1, date: -1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
