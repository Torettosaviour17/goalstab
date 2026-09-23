require("dotenv").config();
const app = require("./src/app");
const ensureAdmin = require("./src/initAdmin");
require("./src/services/autoSave"); // 👈 starts the cron job

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await ensureAdmin();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
