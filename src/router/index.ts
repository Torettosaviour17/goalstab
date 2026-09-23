import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Route definitions
const routes = [
  // ── PUBLIC LANDING PAGE (entry point) ──
  {
    path: "/",
    name: "landing",
    component: () => import("@/views/Landing.vue"),
    meta: { title: "GoalTabs - Command Your Wealth" },
  },

  // ── AUTH ROUTES ──
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/Login.vue"),
    meta: { guestOnly: true, title: "Login" },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/auth/Register.vue"),
    meta: { guestOnly: true, title: "Register" },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("@/views/auth/ForgotPassword.vue"),
    meta: { guestOnly: true, title: "Forgot Password" },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("@/views/auth/ResetPassword.vue"),
    meta: { guestOnly: true, title: "Reset Password" },
  },
  {
    path: "/terms",
    name: "terms",
    component: () => import("@/views/Terms.vue"),
    meta: { title: "Terms of Service" },
  },

  // ── PROTECTED ROUTES (authenticated users only) ──
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: { requiresAuth: true, title: "Dashboard" },
  },
  {
    path: "/goals",
    name: "goals",
    component: () => import("@/views/Goals.vue"),
    meta: { requiresAuth: true, title: "Goals" },
  },
  {
    path: "/goals/:id",
    name: "goal-detail",
    component: () => import("@/views/GoalDetail.vue"),
    meta: { requiresAuth: true, title: "Goal Details" },
  },
  {
    path: "/analytics",
    name: "analytics",
    component: () => import("@/views/Analytics.vue"),
    meta: { requiresAuth: true, title: "Analytics" },
  },
  {
    path: "/transactions",
    name: "transactions",
    component: () => import("@/views/Transactions.vue"),
    meta: { requiresAuth: true, title: "Transactions" },
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/Settings.vue"),
    meta: { requiresAuth: true, title: "Settings" },
  },
  {
    path: "/accounts",
    name: "accounts",
    component: () => import("@/views/Accounts.vue"),
    meta: { requiresAuth: true, title: "Accounts" },
  },
  {
    path: "/help",
    name: "help",
    component: () => import("@/views/Help.vue"),
    meta: { requiresAuth: true, title: "Help & Support" },
  },
  {
    path: "/payment-success",
    name: "payment-success",
    component: () => import("@/views/PaymentSuccess.vue"),
    meta: { requiresAuth: true, title: "Payment Success" },
  },

  // ── ADMIN ROUTES ──
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/views/admin/AdminDashboard.vue"),
    meta: { requiresAuth: true, adminOnly: true, title: "Admin" },
  },

  // ── 404 ──
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFound.vue"),
    meta: { title: "Page Not Found" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});

// Global navigation guard
let authCheckPromise: Promise<void> | null = null;

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // Reuse one validation request during app startup/navigation.
  if (!authCheckPromise) {
    authCheckPromise = authStore.checkAuth();
  }
  await authCheckPromise;

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const adminOnly = to.matched.some((record) => record.meta.adminOnly);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login with the intended destination
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (adminOnly && !authStore.user?.isAdmin) {
    // Non-admin trying to access admin area -> dashboard
    next({ name: "dashboard" });
  } else if (guestOnly && authStore.isAuthenticated) {
    // Already logged in user trying to access login/register -> dashboard
    next({ name: "dashboard" });
  } else {
    next();
  }

  // Keep document titles useful for users and search/social previews.
  document.title = to.meta.title ? `${String(to.meta.title)} | GoalTabs` : "GoalTabs | Smart Savings Platform";
});

export default router;
