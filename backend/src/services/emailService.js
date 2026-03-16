const nodemailer = require("nodemailer");
const User = require("../models/User");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true", // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email to a user if they have email notifications enabled
 * @param {string} userId - User ID
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
const sendEmailToUser = async (userId, subject, html) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    // Check if user has email notifications enabled
    if (!user.preferences?.notifications?.email) return;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `GoalTabs <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject,
      html,
    });
    console.log(`Email sent to ${user.email}: ${subject}`);
  } catch (err) {
    console.error("Email sending failed:", err);
  }
};

module.exports = { sendEmailToUser };
