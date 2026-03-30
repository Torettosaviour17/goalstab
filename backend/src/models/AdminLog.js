const mongoose = require("mongoose");

const AdminLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  targetType: {
    type: String,
    enum: ["user", "withdrawal", "goal"],
    required: true,
  },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminLog", AdminLogSchema);
