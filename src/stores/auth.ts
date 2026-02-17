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

  /* ===============================
       AUTH INITIALIZATION
  ================================ */
  const checkAuth = () => {
    if (token.value) {
      // Try to restore user from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        user.value = JSON.parse(storedUser);
      } else {
        // Fallback demo user
        user.value = {
          id: "1",
          email: "demo@example.com",
          name: "Demo User",
          isPremium: true,
          preferences: {},
        };
      }
    }
  };

  /* ===============================
       LOGIN / LOGOUT
  ================================ */
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "demo@example.com" && password === "password123") {
      user.value = {
        id: "1",
        email,
        name: "Demo User",
        isPremium: true,
        preferences: {},
      };
      token.value = "fake-jwt-token";

      localStorage.setItem("token", token.value);
      localStorage.setItem("user", JSON.stringify(user.value));

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
    localStorage.removeItem("user");

    uiStore.addToast({ type: "info", message: "Logged out" });
  };

  return { user, token, isAuthenticated, login, logout, checkAuth };
});
