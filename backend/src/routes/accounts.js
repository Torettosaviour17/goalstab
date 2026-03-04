const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Account = require('../models/Account');


// @route   GET api/accounts
// @desc    Get all accounts for user
router.get('/', auth, async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// @route   POST api/accounts
// @desc    Add an account
router.post('/', auth, async (req, res) => {
  try {
    const { bankName, accountNumber, accountName, type } = req.body;

    if (!bankName || !accountNumber || !accountName) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Auto extract last 4 digits
    const lastFour = accountNumber.slice(-4);

    // Check if first account → make default
    const existingAccounts = await Account.countDocuments({ user: req.user.id });

    const newAccount = new Account({
      user: req.user.id,
      bankName,
      accountNumber,
      accountName,
      lastFour,
      type,
      isDefault: existingAccounts === 0
    });

    const account = await newAccount.save();

    res.status(201).json(account);

  } catch (err) {
    console.error(err.message);

    if (err.code === 11000) {
      return res.status(400).json({ message: 'Account already exists' });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;