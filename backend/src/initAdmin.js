const User = require("./models/User");

const ensureAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL is not configured; skipping admin bootstrap.");
    return;
  }

  try {
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      admin.isAdmin = true;
      admin.isPremium = true;
      await admin.save();
      return;
    }

    if (!adminPassword) {
      console.warn("ADMIN_PASSWORD is not configured; cannot create the admin user.");
      return;
    }

    admin = new User({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
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
    console.log("Admin user created successfully.");
  } catch (err) {
    console.error("Error creating/updating admin user:", err.message);
  }
};

module.exports = ensureAdmin;
