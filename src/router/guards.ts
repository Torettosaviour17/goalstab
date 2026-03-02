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

// Wait for auth before routing
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // If auth not checked yet, wait
  if (!authStore.user && !authStore.token) {
    await authStore.checkAuth();
  }

  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  const guestOnly = to.matched.some((r) => r.meta.guestOnly);

  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "login", query: { redirect: to.fullPath } });
  }
  if (guestOnly && authStore.isAuthenticated) {
    return next({ name: "dashboard" });
  }

  next();
});

export default router;
