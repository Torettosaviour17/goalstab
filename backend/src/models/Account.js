const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },

    bankName: { 
      type: String, 
      required: true,
      trim: true
    },

    accountNumber: { 
      type: String, 
      required: true,
      minlength: 10,
      maxlength: 10
    },

    accountName: { 
      type: String, 
      required: true,
      trim: true
    },

    lastFour: { 
      type: String, 
      required: true 
    },

    balance: { 
      type: Number, 
      default: 0,
      min: 0
    },

    currency: { 
      type: String, 
      default: 'NGN'
    },

    type: { 
      type: String, 
      enum: ['checking', 'savings', 'credit'], 
      default: 'savings'
    },

    isDefault: { 
      type: Boolean, 
      default: false 
    }

  },
  { timestamps: true }
);

// Prevent duplicate account numbers per user
AccountSchema.index({ user: 1, accountNumber: 1 }, { unique: true });

module.exports = mongoose.model('Account', AccountSchema);