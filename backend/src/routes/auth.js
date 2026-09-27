const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendEmailToUser } = require("../services/emailService");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  googleId: user.googleId,
  phone: user.phone,
  isPremium: user.isPremium,
  isAdmin: user.isAdmin,
  preferences: user.preferences,
});

// @route   POST api/auth/register
// @desc    Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ msg: "Please provide name, email and password" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters" });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "User already exists with this email" });
    }

    // Create new user
    user = new User({ name, email, password });
    await user.save();

    // Send welcome email
    await sendEmailToUser(
      user.id,
      "Welcome to GoalTabs! 🎉",
      `<h1>Welcome, ${user.name}!</h1>
       <p>We're excited to have you on board. Start by creating your first goal and begin your savings journey.</p>
       <p>If you have any questions, feel free to reply to this email.</p>
       <br/>
       <p>Happy saving!</p>
       <p>– The GoalTabs Team</p>`,
    );

    // Generate JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            preferences: user.preferences,
            isAdmin: user.isAdmin,
          },
        });
      },
    );
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error during registration" });
  }
});

// @route   POST api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            preferences: user.preferences,
            isAdmin: user.isAdmin, // ✅ added
          },
        });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/auth/google-signin
router.post("/google-signin", async (req, res) => {
  const credential = req.body.credential || req.body.token;

  if (!credential) {
    return res.status(400).json({ msg: "Missing Google credential" });
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("Google sign-in is not configured: GOOGLE_CLIENT_ID is missing");
    return res.status(503).json({ msg: "Google sign-in is not configured on the server" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("Google sign-in cannot issue a session: JWT_SECRET is missing");
    return res.status(503).json({ msg: "Authentication is not configured on the server" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      return res.status(400).json({ msg: "Google account could not be verified" });
    }

    const email = String(payload.email).trim().toLowerCase();
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: payload.name || email.split("@")[0],
        email,
        password: crypto.randomBytes(32).toString("hex"),
        avatar: payload.picture || null,
        googleId: payload.sub,
      });
      await user.save();
    } else {
      let changed = false;

      // Link an existing GoalTabs account to the verified Google identity.
      if (!user.googleId) {
        user.googleId = payload.sub;
        changed = true;
      }

      // Keep the Google profile picture in sync when the account does not
      // already have a custom avatar.
      if (!user.avatar && payload.picture) {
        user.avatar = payload.picture;
        changed = true;
      }

      if (changed) await user.save();
    }

    const jwtPayload = { user: { id: user.id } };
    const sessionToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token: sessionToken,
      user: googleUserResponse(user),
    });
  } catch (err) {
    console.error("Google sign-in error:", err);

    const isGoogleConfigError =
      err?.message?.toLowerCase?.().includes("audience") ||
      err?.message?.toLowerCase?.().includes("client");

    return res.status(isGoogleConfigError ? 503 : 401).json({
      msg: isGoogleConfigError
        ? "Google sign-in is not configured correctly"
        : "Google sign-in failed. Please try again.",
    });
  }
});

// @route   POST api/auth/forgot-password
// @desc    Create a short-lived password reset token and email the reset link
router.post("/forgot-password", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();

  // Always return the same response so account existence is not disclosed.
  const genericResponse = {
    msg: "If an account exists for that email, a password reset link has been sent.",
  };

  if (!email) return res.json(genericResponse);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json(genericResponse);

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.passwordResetToken = tokenHash;
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl.replace(/\/$/, "")}/reset-password?token=${rawToken}`;

    await sendEmailToUser(
      user.id,
      "Reset your GoalTabs password",
      `<p>We received a request to reset your GoalTabs password.</p>
       <p><a href="${resetUrl}">Reset your password</a></p>
       <p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>`,
    );

    return res.json(genericResponse);
  } catch (err) {
    console.error("Password reset request error:", err);
    return res.json(genericResponse);
  }
});

// @route   POST api/auth/reset-password
// @desc    Reset password using a single-use token
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ msg: "Reset token and new password are required" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters" });
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(String(token)).digest("hex");
    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ msg: "Reset link is invalid or expired" });

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.json({ msg: "Password reset successfully" });
  } catch (err) {
    console.error("Password reset error:", err);
    return res.status(500).json({ msg: "Unable to reset password" });
  }
});

// @route   GET api/auth/me (protected)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user); // ✅ includes isAdmin automatically
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
