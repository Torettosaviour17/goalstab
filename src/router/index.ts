import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Route definitions
const routes = [
  {
    path: "/",
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
    path: "/admin",
    name: "admin",
    component: () => import("@/views/admin/AdminDashboard.vue"),
    meta: { requiresAuth: true, adminOnly: true, title: "Admin" },
  },
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
    path: "/terms",
    name: "terms",
    component: () => import("@/views/Terms.vue"),
    meta: { title: "Terms of Service" },
  },
  {
    path: "/help",
    name: "help",
    component: () => import("@/views/Help.vue"),
    meta: { requiresAuth: true, title: "Help & Support" },
  },
  // {
  //   path: "/privacy",
  //   name: "privacy",
  //   component: () => import("@/views/Privacy.vue"),
  //   meta: { title: "Privacy Policy" },
  // },
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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});

// Global navigation guard
let authChecked = false;

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Only check auth once at startup to avoid repeated calls
  if (!authChecked) {
    await authStore.checkAuth();
    authChecked = true;
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const adminOnly = to.matched.some((record) => record.meta.adminOnly);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login with the intended destination
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (adminOnly && !authStore.user?.isAdmin) {
    // Non‑admin trying to access admin area -> dashboard
    next({ name: "dashboard" });
  } else if (guestOnly && authStore.isAuthenticated) {
    // Already logged in user trying to access login/register -> dashboard
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
