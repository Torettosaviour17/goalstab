import { useAuthStore } from "@/stores/auth";

export const authGuard = (to: any, from: any, next: any) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: "dashboard" });
  } else {
    next();
  }
};
