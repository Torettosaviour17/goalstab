import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: {
      requiresAuth: true,
      title: "Dashboard",
      icon: "📊",
      showInNav: true,
      transition: "slide-left",
    },
  },
  {
    path: "/goals",
    name: "goals",
    component: () => import("@/views/Goals.vue"),
    meta: {
      requiresAuth: true,
      title: "Goals",
      icon: "🎯",
      showInNav: true,
      transition: "slide-right",
    },
  },
  {
    path: "/analytics",
    name: "analytics",
    component: () => import("@/views/Analytics.vue"),
    meta: {
      requiresAuth: true,
      title: "Analytics",
      icon: "📈",
      showInNav: true,
      transition: "slide-up",
    },
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/Settings.vue"),
    meta: {
      requiresAuth: true,
      title: "Settings",
      icon: "⚙️",
      showInNav: true,
      transition: "slide-down",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/Login.vue"),
    meta: {
      requiresGuest: true,
      title: "Login",
      transition: "fade",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      title: "Page Not Found",
    },
  },
  {
    path: "/accounts",
    name: "accounts",
    component: () => import("@/views/Accounts.vue"),
    meta: {
      requiresAuth: true,
      title: "Accounts",
      icon: "🏦",
      showInNav: true,
      transition: "slide-left",
    },
  },
];
