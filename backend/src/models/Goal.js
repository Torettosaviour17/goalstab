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

    userTarget: {
      type: Number,
      required: true,
      min: 1,
    },

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

    withdrawn: {
      type: Number,
      default: 0,
      min: 0,
    },

    feeCharged: {
      type: Boolean,
      default: false,
    },

    lockedBalance: {
      type: Number,
      default: 0,
    },

    isClosed: {
      type: Boolean,
      default: false,
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

    deadline: Date,

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

    category: String,

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },

    sharedWith: [SharedWithSchema],

    goalType: {
      type: String,
      enum: ["product", "service"],
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

    selectedProduct: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    autoSaveEnabled: {
      type: Boolean,
      default: true,
    },

    lastAutoSave: Date,
    nextAutoSave: Date,
  },
  {
    timestamps: true,
  },
);

/**
 * =========================
 * PROGRESS CALCULATION
 * =========================
 */
GoalSchema.pre("save", function () {
  if (this.target > 0) {
    this.progress = Math.min(100, Math.round((this.saved / this.target) * 100));
  } else {
    this.progress = 0;
  }

  // 🔥 auto close logic
  if (this.saved <= 0 && this.withdrawn > 0) {
    this.isClosed = true;
  }
});

/**
 * =========================
 * VIRTUAL BALANCE (IMPORTANT)
 * =========================
 */
GoalSchema.virtual("availableBalance").get(function () {
  return Math.max(0, this.saved - this.withdrawn);
});

GoalSchema.set("toJSON", { virtuals: true });
GoalSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Goal", GoalSchema);
