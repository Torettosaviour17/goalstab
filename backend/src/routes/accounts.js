const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Account = require('../models/Account');

const ownsAccount = async (id, userId) => Account.findOne({ _id: id, user: userId });

router.get('/', auth, async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { bankName, accountNumber, accountName, type, currency, isDefault } = req.body;

    if (!bankName || !accountNumber || !accountName) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const normalizedNumber = String(accountNumber).replace(/\s/g, '');
    if (!/^\d{11}$/.test(normalizedNumber)) {
      return res.status(400).json({ message: 'Account number must be 11 digits' });
    }

    const existingAccounts = await Account.countDocuments({ user: req.user.id });
    const newAccount = new Account({
      user: req.user.id,
      bankName: String(bankName).trim(),
      accountNumber: normalizedNumber,
      accountName: String(accountName).trim(),
      lastFour: normalizedNumber.slice(-4),
      type: type || 'savings',
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
    if (err.code === 11000) return res.status(400).json({ message: 'Account already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { bankName, accountNumber, accountName, type, currency, isDefault } = req.body;
    const account = await ownsAccount(req.params.id, req.user.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });

    if (bankName !== undefined) account.bankName = String(bankName).trim();
    if (accountNumber !== undefined) {
      const normalizedNumber = String(accountNumber).replace(/\s/g, '');
      if (!/^\d{11}$/.test(normalizedNumber)) {
        return res.status(400).json({ message: 'Account number must be 11 digits' });
      }
      account.accountNumber = normalizedNumber;
      account.lastFour = normalizedNumber.slice(-4);
    }
    if (accountName !== undefined) account.accountName = String(accountName).trim();
    if (type !== undefined) account.type = type;
    if (currency !== undefined) account.currency = currency;

    if (isDefault === true) {
      await Account.updateMany(
        { user: req.user.id, _id: { $ne: account._id } },
        { $set: { isDefault: false } },
      );
      account.isDefault = true;
    }

    await account.save();
    res.json(account);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) return res.status(400).json({ message: 'Account already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

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