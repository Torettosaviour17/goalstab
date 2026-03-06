const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

// @route   POST api/auth/register
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    console.log("User found:", user.email);
    const isMatch = await user.comparePassword(password);
    console.log("Password match result:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    // ... rest of login (token generation)
    console.log("Login successful, generating token");
    // ... (rest of your code)
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
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
