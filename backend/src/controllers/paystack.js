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
    const { amount, goalId } = req.body;

    if (!amount || !goalId) {
      return res
        .status(400)
        .json({ msg: "amount and goalId are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ msg: "Amount must be greater than 0" });
    }

    const goal = await Goal.findById(goalId);
    if (!goal) return res.status(404).json({ msg: "Goal not found" });

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const User = require("../models/User");
    const user = await User.findById(req.user.id).select("email");
    if (!user) return res.status(404).json({ msg: "User not found" });

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
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
const creditSuccessfulPayment = async ({
  reference,
  amountInNaira,
  goalId,
  userId,
  rawResponse,
}) => {
  const session = await require("mongoose").startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      const payment = await Payment.findOne({ reference }).session(session);
      if (!payment) {
        throw new Error("Payment record not found");
      }
      if (payment.user.toString() !== userId || payment.goal.toString() !== goalId) {
        throw new Error("Payment ownership mismatch");
      }
      if (payment.status === "success") {
        result = { alreadyProcessed: true };
        return;
      }

      const goal = await Goal.findById(goalId).session(session);
      if (!goal || goal.user.toString() !== userId) {
        throw new Error("Goal ownership mismatch");
      }

      goal.saved += amountInNaira;
      goal.lastUpdated = Date.now();
      await goal.save({ session });

      payment.status = "success";
      payment.amount = amountInNaira;
      payment.rawResponse = rawResponse;
      await payment.save({ session });

      await Transaction.create([{
        user: userId,
        goal: goal._id,
        type: "deposit",
        amount: amountInNaira,
        description: `Paystack payment for ${goal.title}`,
        reference,
      }], { session });

      await Notification.create([{
        user: userId,
        type: "deposit_received",
        title: "Payment Successful",
        message: `₦${amountInNaira.toLocaleString()} added to ${goal.title} via Paystack`,
        goal: goal._id,
      }], { session });

      result = { alreadyProcessed: false, goal };
    });
    return result;
  } finally {
    await session.endSession();
  }
};

const sendPaymentSuccessNotifications = async (userId, goal, amountInNaira) => {
  sendNotification(userId, {
    type: "deposit",
    message: `₦${amountInNaira.toLocaleString()} added to ${goal.title}`,
  });

  await sendEmailToUser(
    userId,
    "Payment Successful",
    `<p>₦${amountInNaira.toLocaleString()} was successfully added to your goal: <strong>${goal.title}</strong></p>`,
  );

  if (goal.saved >= goal.target) {
    await Notification.create({
      user: userId,
      type: "goal_completed",
      title: "Goal Completed 🎉",
      message: `Congratulations! You've reached your goal: ${goal.title}`,
      goal: goal._id,
    });

    sendNotification(userId, {
      type: "goal_completed",
      message: `Goal completed: ${goal.title}`,
    });

    await sendEmailToUser(
      userId,
      "Goal Completed! 🎉",
      `<h1>Congratulations!</h1>
       <p>You've reached your goal: <strong>${goal.title}</strong></p>
       <p>You can now withdraw your funds or request fulfillment.</p>
       <a href="${process.env.FRONTEND_URL}/goals/${goal._id}">View Goal</a>`,
    );
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference) return res.status(400).json({ msg: "Reference is required" });

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } },
    );

    const paymentData = response.data.data;
    if (paymentData.status !== "success") {
      await Payment.findOneAndUpdate(
        { reference },
        { status: "failed", rawResponse: response.data },
      );
      return res.status(400).json({ msg: "Payment was not successful" });
    }

    const amountInNaira = paymentData.amount / 100;
    const { goalId, userId } = paymentData.metadata || {};

    if (!goalId || !userId || userId !== req.user.id) {
      return res.status(401).json({ msg: "Payment ownership could not be verified" });
    }

    const result = await creditSuccessfulPayment({
      reference,
      amountInNaira,
      goalId,
      userId,
      rawResponse: response.data,
    });

    if (result.alreadyProcessed) {
      return res.json({ msg: "Payment already verified", alreadyProcessed: true });
    }

    await sendPaymentSuccessNotifications(req.user.id, result.goal, amountInNaira);
    return res.json({
      msg: "Payment verified and funds added",
      goal: result.goal.toObject ? result.goal.toObject() : result.goal,
    });
  } catch (err) {
    console.error("Paystack verify error:", err.response?.data || err.message);
    return res.status(500).json({ msg: "Verification failed" });
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

  if (req.body.event !== "charge.success") return res.sendStatus(200);

  const { reference, amount, metadata } = req.body.data || {};
  const { goalId, userId } = metadata || {};

  if (!reference || !amount || !goalId || !userId) return res.sendStatus(200);

  try {
    const result = await creditSuccessfulPayment({
      reference,
      amountInNaira: amount / 100,
      goalId,
      userId,
      rawResponse: req.body,
    });

    if (!result.alreadyProcessed) {
      await sendPaymentSuccessNotifications(userId, result.goal, amount / 100);
    }
  } catch (err) {
    console.error("Webhook processing error:", err.message);
    return res.sendStatus(500);
  }

  return res.sendStatus(200);
};

module.exports = { initializePayment, verifyPayment, paystackWebhook };
