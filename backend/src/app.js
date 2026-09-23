const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// ⚠️ IMPORTANT: Create the app instance FIRST
const app = express();

// Connect Database
connectDB();

// Middleware
const allowedOrigins = new Set(
  [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:4173"]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, "")),
);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin.replace(/\/$/, ""))) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Import routes (after app is created)
const authRoutes = require("./routes/auth");
const goalRoutes = require("./routes/goals");
const accountRoutes = require("./routes/accounts");
const userRoutes = require("./routes/users");
const notificationRoutes = require("./routes/notifications").router;
const withdrawalRoutes = require("./routes/withdrawals");
const adminRoutes = require("./routes/admin");
const analyticsRoutes = require("./routes/analytics");
const productRoutes = require("./routes/products");
const paystackRoutes = require("./routes/paystack");

// Mount routes
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/admin", adminRoutes); // ✅ admin routes used here
app.use("/api/products", productRoutes);
app.use("/api/paystack", paystackRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ msg: "API route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ msg: status === 500 ? "Something went wrong!" : err.message });
});

module.exports = app;
