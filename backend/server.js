require("dotenv").config();
const app = require("./src/app");

// Use PORT from environment (Render sets this automatically), fallback to 5000 for local dev
const PORT = process.env.PORT || 5000;

// Bind to '0.0.0.0' so Render can forward requests
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
