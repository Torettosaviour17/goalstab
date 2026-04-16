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
    platformFeeDeducted: {
      type: Number,
      default: 0,
      min: 0,
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

// =========================
// PRE-SAVE HOOK – Progress, Fee Deduction, Closure
// =========================
GoalSchema.pre("save", function (next) {
  // 1. Update progress
  if (this.target > 0) {
    this.progress = Math.min(100, Math.round((this.saved / this.target) * 100));
  } else {
    this.progress = 0;
  }

  // 2. Charge platform fee when target is reached (only once)
  if (!this.feeCharged && this.saved >= this.target && this.fee > 0) {
    const feeToDeduct = Math.min(this.fee, this.saved);
    this.saved -= feeToDeduct;
    this.platformFeeDeducted = feeToDeduct;
    this.feeCharged = true;
  }

  // 3. Auto-close ONLY when balance hits zero after withdrawals
  // FIX: Removed early closure on target reached — user hasn't withdrawn yet at that point.
  if (!this.isClosed) {
    const zeroBalanceAfterWithdrawals = this.saved <= 0 && this.withdrawn > 0;
    if (zeroBalanceAfterWithdrawals) {
      this.isClosed = true;
    }
  }

  next();
});

// =========================
// VIRTUAL: Available balance (what user can withdraw)
// =========================
GoalSchema.virtual("availableBalance").get(function () {
  // FIX: `withdrawn` is already reflected in `saved` during approval,
  // so we just return saved directly to avoid double-subtracting.
  return Math.max(0, this.saved);
});

// =========================
// VIRTUAL: Remaining platform fee that is still owed
// =========================
GoalSchema.virtual("pendingPlatformFee").get(function () {
  if (this.feeCharged) return 0;
  if (this.saved < this.target) return this.fee;
  return this.fee;
});

GoalSchema.set("toJSON", { virtuals: true });
GoalSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Goal", GoalSchema);
