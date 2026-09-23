const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Account = require('../models/Account');

const ownsAccount = async (id, userId) => Account.findOne({ _id: id, user: userId });


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
    const { bankName, accountNumber, accountName, type, currency, isDefault } = req.body;

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
      currency: currency || 'NGN',
      isDefault: isDefault === true || existingAccounts === 0,
    });

    if (newAccount.isDefault) {
      await Account.updateMany({ user: req.user.id }, { $set: { isDefault: false } });
    }

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


// @route   PUT api/accounts/:id
// @desc    Update an account owned by the current user
router.put('/:id', auth, async (req, res) => {
  try {
    const { bankName, accountNumber, accountName, type } = req.body;
    const account = await ownsAccount(req.params.id, req.user.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });

    if (bankName !== undefined) account.bankName = bankName;
    if (accountNumber !== undefined) {
      if (!/^\\d{11}$/.test(String(accountNumber))) {
        return res.status(400).json({ message: 'Account number must be 11 digits' });
      }
      account.accountNumber = String(accountNumber);
      account.lastFour = String(accountNumber).slice(-4);
    }
    if (accountName !== undefined) account.accountName = accountName;
    if (type !== undefined) account.type = type;
    if (currency !== undefined) account.currency = currency;
    if (isDefault === true) {
      await Account.updateMany({ user: req.user.id, _id: { $ne: account._id } }, { $set: { isDefault: false } });
      account.isDefault = true;
    }

    await account.save();
    res.json(account);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Account already exists' });
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/accounts/:id
// @desc    Delete an account owned by the current user
router.delete('/:id', auth, async (req, res) => {
  try {
    const account = await ownsAccount(req.params.id, req.user.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    const wasDefault = account.isDefault;
    await account.deleteOne();

    if (wasDefault) {
      const replacement = await Account.findOne({ user: req.user.id }).sort({ createdAt: 1 });
      if (replacement) {
        replacement.isDefault = true;
        await replacement.save();
      }
    }
    res.json({ message: 'Account removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/accounts/:id/default
// @desc    Make an account the user's default account
router.post('/:id/default', auth, async (req, res) => {
  try {
    const account = await ownsAccount(req.params.id, req.user.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    await Account.updateMany({ user: req.user.id }, { $set: { isDefault: false } });
    account.isDefault = true;
    await account.save();
    res.json(account);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;