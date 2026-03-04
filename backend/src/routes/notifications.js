const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// Store connected clients (for SSE)
const clients = new Map();

// @route   GET api/notifications/stream
// @desc    Server-Sent Events stream
router.get('/stream', auth, (req, res) => {
  const userId = req.user.id;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  const keepAlive = setInterval(() => res.write(': keepalive\n\n'), 30000);
  clients.set(userId, res);
  req.on('close', () => {
    clients.delete(userId);
    clearInterval(keepAlive);
  });
});

// @route   GET api/notifications
// @desc    Get recent notifications
router.get('/', auth, async (req, res) => {
  const { limit = 20 } = req.query;
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('goal', 'title')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Not found' });
    if (notification.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/notifications/read-all
// @desc    Mark all as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { $set: { read: true } });
    res.json({ msg: 'All marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Helper to send notification to a connected client
const sendNotification = (userId, notification) => {
  const client = clients.get(userId.toString());
  if (client) {
    client.write(`data: ${JSON.stringify(notification)}\n\n`);
  }
};

module.exports = { router, sendNotification };