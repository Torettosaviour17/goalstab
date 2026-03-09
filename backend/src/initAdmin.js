const User = require("./models/User");
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL = "saviourchidubem17@gmail.com";

const ensureAdmin = async () => {
  try {
    // Check if admin already exists
    let admin = await User.findOne({ email: ADMIN_EMAIL });
    if (admin) {
      console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
      // Update admin properties to ensure they're correct
      admin.isAdmin = true;
      admin.isPremium = true;
      admin.name = "Admin";
      admin.password = "admin@123"; // Reset to known password
      await admin.save();
      console.log(`✅ Admin user updated: ${ADMIN_EMAIL}`);
      return;
    }

    // Only create if doesn't exist
    admin = new User({
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
    console.error("Error creating/updating admin user:", err.message);
  }
};

module.exports = ensureAdmin;
