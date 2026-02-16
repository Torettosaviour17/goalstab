import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUIStore } from "./ui";

export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  avatar?: string;
  preferences: any;
}

export const useAuthStore = defineStore("auth", () => {
  const uiStore = useUIStore();
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "demo@example.com" && password === "password123") {
      const userData: User = {
        id: "1",
        email: "demo@example.com",
        name: "Demo User",
        isPremium: true,
        preferences: {},
      };
      user.value = userData;
      token.value = "fake-jwt-token";
      localStorage.setItem("token", "fake-jwt-token");
      uiStore.addToast({ type: "success", message: "Login successful!" });
    } else {
      uiStore.addToast({ type: "error", message: "Invalid credentials" });
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    uiStore.addToast({ type: "info", message: "Logged out" });
  };

  const checkAuth = () => {
    if (token.value) {
      // In a real app, validate token with backend
      user.value = {
        id: "1",
        email: "demo@example.com",
        name: "Demo User",
        isPremium: true,
        preferences: {},
      };
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
});
