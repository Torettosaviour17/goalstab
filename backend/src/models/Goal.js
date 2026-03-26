const mongoose = require("mongoose");

const SharedWithSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["viewer", "contributor"],
      default: "viewer",
    },
  },
  { _id: false },
);

const GoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
    // 👇 NEW: userTarget is the amount the user will receive (excluding fee)
    userTarget: {
      type: Number,
      required: true,
      min: 1,
    },
    // 👇 NEW: fee charged by platform
    fee: {
      type: Number,
      default: 100,
      min: 0,
    },
    target: {
      type: Number,
      required: true,
      min: 1,
    },

    saved: {
      type: Number,
      default: 0,
      min: 0,
    },
    // 👇 NEW: total amount already withdrawn (tracked to enforce userTarget limit)
    withdrawn: {
      type: Number,
      default: 0,
      min: 0,
    },

    icon: {
      type: String,
      default: "🎯",
    },

    color: {
      type: String,
      default: "from-blue-500 to-cyan-400",
    },

    type: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },

    autoSave: {
      type: Number,
      default: 10,
      min: 0,
    },

    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "monthly",
    },

    deadline: {
      type: Date,
    },

    locked: {
      type: Boolean,
      default: true,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    category: {
      type: String,
      trim: true,
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },

    sharedWith: [SharedWithSchema],

    goalType: {
      type: String,
      enum: ["product", "service"],
      required: true,
      default: "product",
    },
    fulfillmentStatus: {
      type: String,
      enum: ["pending", "processing", "delivered", "booked"],
      default: "pending",
    },
    fulfillmentDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    usePlatformFulfillment: {
      type: Boolean,
      default: false,
    },

    // Auto‑save tracking fields
    autoSaveEnabled: {
      type: Boolean,
      default: true,
    },

    lastAutoSave: {
      type: Date,
    },

    nextAutoSave: {
      type: Date,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  },
);

// 🔥 Auto-calculate progress before saving
GoalSchema.pre("save", function () {
  if (this.target > 0) {
    this.progress = Math.min(100, Math.round((this.saved / this.target) * 100));
  } else {
    this.progress = 0;
  }
});

// 🔥 Recalculate progress when updating with findOneAndUpdate
GoalSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (update.saved !== undefined || update.target !== undefined) {
    const doc = await this.model.findOne(this.getQuery());

    const newSaved = update.saved !== undefined ? update.saved : doc.saved;

    const newTarget = update.target !== undefined ? update.target : doc.target;

    update.progress =
      newTarget > 0
        ? Math.min(100, Math.round((newSaved / newTarget) * 100))
        : 0;
  }
});

module.exports = mongoose.model("Goal", GoalSchema);
