const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// Import routes
const authRoutes = require("./routes/auth");
const goalRoutes = require("./routes/goals");
const accountRoutes = require("./routes/accounts");
const userRoutes = require("./routes/users");
const notificationRoutes = require("./routes/notifications"); // exports { router, sendNotification }
const withdrawalRoutes = require("./routes/withdrawals"); // if exists

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes.router); // 👈 use .router
if (withdrawalRoutes) app.use("/api/withdrawals", withdrawalRoutes); // ensure it's a router

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong!" });
});

module.exports = app;
