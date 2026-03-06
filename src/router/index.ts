import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

let authChecked = false;

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
    meta: { requiresAuth: true, adminOnly: true }, // Only admins can access
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/Settings.vue"),
    meta: { requiresAuth: true },
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
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0, behavior: "smooth" };
  },
});

// --- AUTH & ADMIN GUARD ---
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Make sure auth state is loaded once
  if (!authChecked) {
    await authStore.checkAuth();
    authChecked = true;
  }

  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  const guestOnly = to.matched.some((r) => r.meta.guestOnly);
  const adminOnly = to.matched.some((r) => r.meta.adminOnly);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect non-auth users to login
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (guestOnly && authStore.isAuthenticated) {
    // Prevent logged-in users from visiting login/register pages
    next({ name: "dashboard" });
  } else if (adminOnly && !authStore.user?.isAdmin) {
    // Redirect non-admins trying to access admin pages
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
