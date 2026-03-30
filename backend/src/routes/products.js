const express = require("express");
const router = express.Router();

// Mock product catalog – replace with real API later
const products = [
  {
    id: "macbook-pro",
    name: "MacBook Pro M3",
    price: 2500000,
    image: "https://via.placeholder.com/150",
    description: "Apple MacBook Pro with M3 chip",
    link: "https://apple.com/macbook-pro",
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    price: 850000,
    image: "https://via.placeholder.com/150",
    description: "Apple iPhone 15, 6.1‑inch display",
  },
  {
    id: "sony-wh1000xm5",
    name: "Sony WH-1000XM5",
    price: 350000,
    image: "https://via.placeholder.com/150",
    description: "Noise cancelling headphones",
  },
  {
    id: "ps5",
    name: "PlayStation 5",
    price: 500000,
    image: "https://via.placeholder.com/150",
    description: "Sony PlayStation 5 Console",
  },
  {
    id: "dyson-v15",
    name: "Dyson V15 Detect",
    price: 450000,
    image: "https://via.placeholder.com/150",
    description: "Cordless vacuum cleaner",
  },
  {
    id: "nike-air-max",
    name: "Nike Air Max",
    price: 50000,
    image: "https://via.placeholder.com/150",
    description: "Running shoes",
  },
];

// @route   GET api/products/search?q=query
// @desc    Search products by name
router.get("/search", (req, res) => {
  const q = req.query.q?.toLowerCase() || "";
  if (!q) return res.json([]);
  const results = products.filter((p) => p.name.toLowerCase().includes(q));
  res.json(results);
});

module.exports = router;
