import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/goals",
    name: "goals",
    component: () => import("@/views/Goals.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/analytics",
    name: "analytics",
    component: () => import("@/views/Analytics.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/Settings.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/views/Admin.vue"),
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/Login.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/auth/Register.vue"),
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("@/views/auth/ForgotPassword.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

// 🔐 AUTH + ADMIN GUARD (async-safe)
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Wait for token validation if user not loaded
  if (!authStore.user && authStore.token) {
    try {
      await authStore.checkAuth();
    } catch (err) {
      console.warn("[Router] Auth check failed", err);
    }
  }

  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  const guestOnly = to.matched.some((r) => r.meta.guestOnly);
  const adminOnly = to.matched.some((r) => r.meta.adminOnly);

  // Not logged in
  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  // Admin only
  if (adminOnly && !authStore.user?.isAdmin) {
    return next({ name: "dashboard" });
  }

  // Logged-in user trying to visit guest page
  if (guestOnly && authStore.isAuthenticated) {
    return next({ name: "dashboard" });
  }

  next();
});

export default router;
