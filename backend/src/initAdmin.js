const User = require("./models/User");
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL = "saviourchidubem17@gmail.com";
const ADMIN_PASSWORD = "081toretto78";

const ensureAdmin = async () => {
  try {
    // Delete any existing user with that email
    await User.deleteOne({ email: ADMIN_EMAIL });
    console.log(`Deleted any existing user with email ${ADMIN_EMAIL}`);

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const admin = new User({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
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
    console.log("Admin user created successfully");
  } catch (err) {
    console.error("Error ensuring admin user:", err);
  }
};

module.exports = ensureAdmin;
