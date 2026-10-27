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


const getWebAuthn = () => import("@simplewebauthn/server");

const normalizeOrigin = (value) => String(value || "").replace(/\\/$/, "");

const getWebAuthnContext = (req) => {
  const origin = normalizeOrigin(req.get("origin"));
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://goalstab.vercel.app",
    "http://localhost:5173",
  ].filter(Boolean).map(normalizeOrigin);

  if (!origin || !allowedOrigins.includes(origin)) {
    const error = new Error("This origin is not allowed to configure device authentication");
    error.status = 403;
    throw error;
  }

  const rpID = process.env.WEBAUTHN_RP_ID || new URL(origin).hostname;
  return { origin, rpID };
};

const clearWebAuthnChallenge = (user, flow) => {
  user[`webauthn${flow}Challenge`] = null;
  user[`webauthn${flow}ExpiresAt`] = null;
  user[`webauthn${flow}Origin`] = null;
  user[`webauthn${flow}RpID`] = null;
};

// Device biometrics are represented by a platform passkey. The server stores
// only the public key and verifies every signed assertion; no fingerprint or
// face data ever leaves the device.
router.get("/webauthn/status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("webauthnCredentials");
    if (!user) return res.status(404).json({ msg: "User not found" });
    return res.json({ enabled: user.webauthnCredentials.length > 0 });
  } catch (err) {
    console.error("WebAuthn status error:", err);
    return res.status(500).json({ msg: "Unable to read device security status" });
  }
});

router.post("/webauthn/register/options", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    const { origin, rpID } = getWebAuthnContext(req);
    const { generateRegistrationOptions } = await getWebAuthn();
    const options = await generateRegistrationOptions({
      rpName: "GoalTabs",
      rpID,
      userID: Buffer.from(String(user._id)),
      userName: user.email,
      userDisplayName: user.name || user.email,
      attestationType: "none",
      supportedAlgorithmIDs: [-7, -257],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        residentKey: "preferred",
        userVerification: "required",
      },
      excludeCredentials: (user.webauthnCredentials || []).map((credential) => ({
        id: credential.id,
        transports: credential.transports,
      })),
    });

    user.webauthnRegistrationChallenge = options.challenge;
    user.webauthnRegistrationExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.webauthnRegistrationOrigin = origin;
    user.webauthnRegistrationRpID = rpID;
    await user.save();
    return res.json(options);
  } catch (err) {
    console.error("WebAuthn registration options error:", err);
    return res.status(err.status || 500).json({
      msg: err.status ? err.message : "Unable to start device authentication setup",
    });
  }
});

router.post("/webauthn/register/verify", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (
      !user.webauthnRegistrationChallenge ||
      !user.webauthnRegistrationExpiresAt ||
      user.webauthnRegistrationExpiresAt.getTime() < Date.now()
    ) {
      clearWebAuthnChallenge(user, "Registration");
      await user.save();
      return res.status(400).json({ msg: "Device setup expired. Please try again." });
    }

    const { verifyRegistrationResponse } = await getWebAuthn();
    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: user.webauthnRegistrationChallenge,
      expectedOrigin: user.webauthnRegistrationOrigin,
      expectedRPID: user.webauthnRegistrationRpID,
      requireUserVerification: true,
      supportedAlgorithmIDs: [-7, -257],
    });

    if (!verification.verified || !verification.registrationInfo?.credential) {
      clearWebAuthnChallenge(user, "Registration");
      await user.save();
      return res.status(400).json({ msg: "Device authentication could not be verified" });
    }

    const credential = verification.registrationInfo.credential;
    const existing = (user.webauthnCredentials || []).some((item) => item.id === credential.id);
    if (!existing) {
      user.webauthnCredentials.push({
        id: credential.id,
        publicKey: Buffer.from(credential.publicKey).toString("base64url"),
        counter: credential.counter,
        transports: credential.transports || req.body.response?.transports || [],
        deviceType: verification.registrationInfo.credentialDeviceType || "singleDevice",
        backedUp: Boolean(verification.registrationInfo.credentialBackedUp),
      });
    }
    clearWebAuthnChallenge(user, "Registration");
    await user.save();
    return res.json({ verified: true, enabled: true });
  } catch (err) {
    console.error("WebAuthn registration verification error:", err);
    return res.status(400).json({ msg: "Device authentication setup failed. Please try again." });
  }
});

router.post("/webauthn/auth/options", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (!user.webauthnCredentials?.length) {
      return res.status(404).json({ msg: "No device authentication is registered" });
    }
    const { origin, rpID } = getWebAuthnContext(req);
    const { generateAuthenticationOptions } = await getWebAuthn();
    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: user.webauthnCredentials.map((credential) => ({
        id: credential.id,
        transports: credential.transports,
      })),
      userVerification: "required",
    });

    user.webauthnAuthenticationChallenge = options.challenge;
    user.webauthnAuthenticationExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.webauthnAuthenticationOrigin = origin;
    user.webauthnAuthenticationRpID = rpID;
    await user.save();
    return res.json(options);
  } catch (err) {
    console.error("WebAuthn authentication options error:", err);
    return res.status(err.status || 500).json({
      msg: err.status ? err.message : "Unable to start device authentication",
    });
  }
});

router.post("/webauthn/auth/verify", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (
      !user.webauthnAuthenticationChallenge ||
      !user.webauthnAuthenticationExpiresAt ||
      user.webauthnAuthenticationExpiresAt.getTime() < Date.now()
    ) {
      clearWebAuthnChallenge(user, "Authentication");
      await user.save();
      return res.status(400).json({ msg: "Device verification expired. Please try again." });
    }

    const credentialId = req.body.id || req.body.rawId;
    const savedCredential = (user.webauthnCredentials || []).find(
      (credential) => credential.id === credentialId,
    );
    if (!savedCredential) {
      clearWebAuthnChallenge(user, "Authentication");
      await user.save();
      return res.status(400).json({ msg: "This device is not registered for GoalTabs" });
    }

    const { verifyAuthenticationResponse } = await getWebAuthn();
    const verification = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge: user.webauthnAuthenticationChallenge,
      expectedOrigin: user.webauthnAuthenticationOrigin,
      expectedRPID: user.webauthnAuthenticationRpID,
      requireUserVerification: true,
      credential: {
        id: savedCredential.id,
        publicKey: Buffer.from(savedCredential.publicKey, "base64url"),
        counter: savedCredential.counter,
        transports: savedCredential.transports,
      },
    });

    if (!verification.verified) {
      clearWebAuthnChallenge(user, "Authentication");
      await user.save();
      return res.status(401).json({ msg: "Device verification failed" });
    }

    savedCredential.counter = verification.authenticationInfo.newCounter;
    clearWebAuthnChallenge(user, "Authentication");
    await user.save();
    return res.json({ verified: true });
  } catch (err) {
    console.error("WebAuthn authentication verification error:", err);
    return res.status(401).json({ msg: "Device verification failed. Use your app PIN instead." });
  }
});

router.delete("/webauthn/credentials", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    user.webauthnCredentials = [];
    clearWebAuthnChallenge(user, "Registration");
    clearWebAuthnChallenge(user, "Authentication");
    await user.save();
    return res.json({ enabled: false });
  } catch (err) {
    console.error("WebAuthn credential removal error:", err);
    return res.status(500).json({ msg: "Unable to remove device authentication" });
  }
});

module.exports = router;
