const User = require("./models/User");
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL = "saviourchidubem17@gmail.com";

const ensureAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
      return;
    }

    // Only create if doesn't exist
    const admin = new User({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: "admin@123", // Will be hashed by User schema
      isPremium: true,
      isAdmin: true,
      preferences: {
        currency: "NGN",
        theme: "dark",
        autoSaveDefault: true,
        notifications: {
          email: true,
          push: true,
          goalCompleted: true,
          depositReceived: true,
          weeklyReport: false,
        },
      },
    });

    await admin.save();
    console.log(`✅ Admin user created: ${ADMIN_EMAIL}`);
  } catch (err) {
    console.error("Error creating admin user:", err.message);
  }
};

module.exports = ensureAdmin;
