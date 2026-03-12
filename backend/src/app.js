const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// ⚠️ IMPORTANT: Create the app instance FIRST
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes (after app is created)
const authRoutes = require("./routes/auth");
const goalRoutes = require("./routes/goals");
const accountRoutes = require("./routes/accounts");
const userRoutes = require("./routes/users");
const notificationRoutes = require("./routes/notifications").router;
const withdrawalRoutes = require("./routes/withdrawals");
const adminRoutes = require("./routes/admin");
const analyticsRoutes = require("./routes/analytics");

// Mount routes
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/admin", adminRoutes); // ✅ admin routes used here

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong!" });
});

module.exports = app;
