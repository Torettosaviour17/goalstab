const axios = require("axios");
const Goal = require("../models/Goal");
const Payment = require("../models/Payment");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const { sendNotification } = require("../routes/notifications");
const { sendEmailToUser } = require("../services/emailService");

// ================================
// INITIALIZE PAYMENT
// ================================
const initializePayment = async (req, res) => {
  try {
    const { email, amount, goalId } = req.body;

    if (!email || !amount || !goalId) {
      return res
        .status(400)
        .json({ msg: "email, amount and goalId are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ msg: "Amount must be greater than 0" });
    }

    const goal = await Goal.findById(goalId);
    if (!goal) return res.status(404).json({ msg: "Goal not found" });

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: Math.round(amount * 100), // kobo
        callback_url: `${process.env.FRONTEND_URL}/payment-success`,
        metadata: {
          userId: req.user.id,
          goalId,
          goalTitle: goal.title,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { reference, authorization_url } = response.data.data;

    // Save a pending payment record
    await Payment.create({
      user: req.user.id,
      goal: goalId,
      reference,
      amount,
      status: "pending",
      rawResponse: response.data,
    });

    res.json({ authorization_url, reference });
  } catch (err) {
    console.error("Paystack init error:", err.response?.data || err.message);
    res.status(500).json({ msg: "Payment initialization failed" });
  }
};

// ================================
// VERIFY PAYMENT + UPDATE GOAL
// ================================
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ msg: "Reference is required" });
    }

    // Check if already processed (prevent duplicate crediting)
    const existingPayment = await Payment.findOne({ reference });
    if (existingPayment && existingPayment.status === "success") {
      return res.json({
        msg: "Payment already verified",
        alreadyProcessed: true,
      });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const { status, amount, metadata } = response.data.data;

    if (status !== "success") {
      // Update payment record to failed
      await Payment.findOneAndUpdate(
        { reference },
        { status: "failed", rawResponse: response.data },
      );
      return res.status(400).json({ msg: "Payment was not successful" });
    }

    const amountInNaira = amount / 100;
    const { goalId, userId } = metadata;

    // Verify the user owns this payment
    if (userId !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const goal = await Goal.findById(goalId);
    if (!goal) return res.status(404).json({ msg: "Goal not found" });

    // Credit the goal
    goal.saved += amountInNaira;
    goal.lastUpdated = Date.now();
    await goal.save();

    // Update payment record to success
    await Payment.findOneAndUpdate(
      { reference },
      { status: "success", amount: amountInNaira, rawResponse: response.data },
    );

    // Create transaction record
    await Transaction.create({
      user: req.user.id,
      goal: goal._id,
      type: "deposit",
      amount: amountInNaira,
      description: `Paystack payment for ${goal.title}`,
      reference,
    });

    // Notify user
    await Notification.create({
      user: req.user.id,
      type: "deposit_received",
      title: "Payment Successful",
      message: `₦${amountInNaira.toLocaleString()} added to ${goal.title} via Paystack`,
      goal: goal._id,
    });

    sendNotification(req.user.id, {
      type: "deposit",
      message: `₦${amountInNaira.toLocaleString()} added to ${goal.title}`,
    });

    await sendEmailToUser(
      req.user.id,
      "Payment Successful",
      `<p>₦${amountInNaira.toLocaleString()} was successfully added to your goal: <strong>${goal.title}</strong></p>`,
    );

    // Check goal completion
    if (goal.saved >= goal.target) {
      await Notification.create({
        user: req.user.id,
        type: "goal_completed",
        title: "Goal Completed 🎉",
        message: `Congratulations! You've reached your goal: ${goal.title}`,
        goal: goal._id,
      });

      sendNotification(req.user.id, {
        type: "goal_completed",
        message: `Goal completed: ${goal.title}`,
      });

      await sendEmailToUser(
        req.user.id,
        "Goal Completed! 🎉",
        `<h1>Congratulations!</h1>
         <p>You've reached your goal: <strong>${goal.title}</strong></p>
         <p>You can now withdraw your funds or request fulfillment.</p>
         <a href="${process.env.FRONTEND_URL}/goals/${goal._id}" style="background-color:#3b82f6;color:white;padding:10px 20px;text-decoration:none;border-radius:8px;">View Goal</a>`,
      );
    }

    res.json({
      msg: "Payment verified and funds added",
      goal: goal.toObject ? goal.toObject() : goal,
    });
  } catch (err) {
    console.error("Paystack verify error:", err.response?.data || err.message);
    res.status(500).json({ msg: "Verification failed" });
  }
};

// ================================
// WEBHOOK (optional but recommended for production)
// ================================
const paystackWebhook = async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const hash = require("crypto")
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).send("Invalid signature");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const { reference, amount, metadata } = event.data;

    try {
      const existing = await Payment.findOne({ reference });
      if (existing && existing.status === "success") {
        return res.sendStatus(200); // already handled
      }

      const amountInNaira = amount / 100;
      const { goalId, userId } = metadata || {};

      if (goalId && userId) {
        const goal = await Goal.findById(goalId);
        if (goal) {
          goal.saved += amountInNaira;
          goal.lastUpdated = Date.now();
          await goal.save();

          await Payment.findOneAndUpdate(
            { reference },
            {
              status: "success",
              amount: amountInNaira,
              rawResponse: event.data,
            },
            { upsert: true },
          );

          await Transaction.create({
            user: userId,
            goal: goal._id,
            type: "deposit",
            amount: amountInNaira,
            description: `Paystack webhook for ${goal.title}`,
            reference,
          });

          console.log(`Webhook: ₦${amountInNaira} added to goal ${goal._id}`);
        }
      }
    } catch (err) {
      console.error("Webhook processing error:", err.message);
    }
  }

  res.sendStatus(200);
};

module.exports = { initializePayment, verifyPayment, paystackWebhook };
