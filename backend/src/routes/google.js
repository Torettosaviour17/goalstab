import express from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /auth/google-signin
 * Handle Google OAuth token and create/update user
 */
router.post("/google-signin", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ msg: "Google token is required" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    if (!email) {
      return res.status(400).json({ msg: "Email not provided by Google" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user from Google profile
      // Generate a secure random password (OAuth users won't use it)
      const randomPassword = require("crypto").randomBytes(32).toString("hex");

      user = new User({
        name: name || email.split("@")[0],
        email,
        password: randomPassword, // Hashed internally by schema
        profilePicture: picture || null,
        googleId: sub,
        isVerified: true, // Google-verified email
      });

      await user.save();
    } else if (!user.googleId) {
      // Existing user, link Google account
      user.googleId = sub;
      if (!user.profilePicture && picture) {
        user.profilePicture = picture;
      }
      await user.save();
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { user: { id: user._id } },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Return token + user info
    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Google signin error:", err);
    res.status(500).json({ msg: "Google sign-in failed", error: err.message });
  }
});

export default router;
