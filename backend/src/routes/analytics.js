const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Goal = require("../models/Goal");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

// @route   GET api/analytics/overview
// @desc    Get overview stats
router.get("/overview", auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
    const activeGoals = goals.filter((g) => g.progress < 100).length;
    const completedGoals = goals.filter((g) => g.progress >= 100).length;
    const overallProgress = totalTarget
      ? Math.round((totalSaved / totalTarget) * 100)
      : 0;

    // Monthly growth calculation using transactions
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const transactionsThisMonth = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: firstDayThisMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const savedThisMonth = transactionsThisMonth[0]?.total || 0;

    const transactionsLastMonth = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const savedLastMonth = transactionsLastMonth[0]?.total || 0;

    const monthlyGrowth = savedLastMonth
      ? (((savedThisMonth - savedLastMonth) / savedLastMonth) * 100).toFixed(1)
      : 0;

    res.json({
      totalSaved,
      activeGoals,
      completedGoals,
      overallProgress,
      monthlyGrowth: parseFloat(monthlyGrowth),
    });
  } catch (err) {
    console.error("Overview error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// @route   GET api/analytics/trend
// @desc    Get savings trend (grouped by day/week/month)
router.get("/trend", auth, async (req, res) => {
  const { period = "month" } = req.query; // week, month, year
  let groupFormat;
  let startDate;

  const now = new Date();
  switch (period) {
    case "week":
      startDate = new Date(now.setDate(now.getDate() - 7));
      groupFormat = {
        year: { $year: "$date" },
        month: { $month: "$date" },
        day: { $dayOfMonth: "$date" },
      };
      break;
    case "month":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      groupFormat = {
        year: { $year: "$date" },
        month: { $month: "$date" },
        day: { $dayOfMonth: "$date" },
      };
      break;
    case "year":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      groupFormat = { year: { $year: "$date" }, month: { $month: "$date" } };
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      groupFormat = {
        year: { $year: "$date" },
        month: { $month: "$date" },
        day: { $dayOfMonth: "$date" },
      };
  }

  try {
    const trend = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDate },
        },
      },
      { $group: { _id: groupFormat, total: { $sum: "$amount" } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Format labels based on period
    const labels = trend.map((item) => {
      if (period === "year")
        return `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      return `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`;
    });
    const data = trend.map((item) => item.total);

    res.json({ labels, data });
  } catch (err) {
    console.error("Trend error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// @route   GET api/analytics/distribution
// @desc    Get goal distribution by category
router.get("/distribution", auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    const categories = {};
    goals.forEach((goal) => {
      const cat = goal.category || "Other";
      if (!categories[cat]) categories[cat] = { count: 0, total: 0, saved: 0 };
      categories[cat].count++;
      categories[cat].total += goal.target;
      categories[cat].saved += goal.saved;
    });

    const result = Object.entries(categories).map(([name, data]) => ({
      name,
      count: data.count,
      percentage: data.total ? Math.round((data.saved / data.total) * 100) : 0,
      color: getCategoryColor(name),
    }));

    res.json(result);
  } catch (err) {
    console.error("Distribution error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

function getCategoryColor(category) {
  const colors = {
    Electronics: "bg-primary-500",
    Travel: "bg-success",
    Savings: "bg-warning",
    Education: "bg-secondary-500",
    Health: "bg-danger",
    Other: "bg-gray-500",
  };
  return colors[category] || "bg-gray-500";
}

// @route   GET api/analytics/transactions
// @desc    Get recent transactions
router.get("/transactions", auth, async (req, res) => {
  const { limit = 10 } = req.query;
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .populate("goal", "title")
      .sort({ date: -1 })
      .limit(parseInt(limit));
    res.json(transactions);
  } catch (err) {
    console.error("Transactions error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
