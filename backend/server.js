require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");
const ensureAdmin = require("./src/initAdmin");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await ensureAdmin();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
