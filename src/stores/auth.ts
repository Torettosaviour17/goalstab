import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";
import { useUIStore } from "./ui";

/* ===============================
   TYPES
================================ */

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  goalCompleted: boolean;
  depositReceived: boolean;
  weeklyReport: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isPremium: boolean;
  avatar?: string;
  preferences: {
    currency: string;
    theme: string;
    autoSaveDefault: boolean;
    notifications: NotificationSettings;
  };
}

/* ===============================
   STORE
================================ */

export const useAuthStore = defineStore("auth", () => {
  const uiStore = useUIStore();

  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  /* ===============================
     AUTH INITIALIZATION
  ================================ */

  const checkAuth = async () => {
    if (!token.value) return;

    // 1️⃣ Try localStorage first (fast load)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }

    // 2️⃣ Then verify token with backend
    try {
      const response = await api.get("/auth/me");
      user.value = response.data;
      localStorage.setItem("user", JSON.stringify(user.value));
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    }
  };

  /* ===============================
     LOGIN
  ================================ */

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token: newToken, user: userData } = response.data;

      token.value = newToken;
      user.value = userData;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));

      uiStore.addToast({
        type: "success",
        message: "Login successful!",
      });
    } catch (error: any) {
      const message = error.response?.data?.msg || "Login failed";

      uiStore.addToast({
        type: "error",
        message,
      });

      throw error;
    }
  };

  /* ===============================
     REGISTER
  ================================ */

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;

      token.value = newToken;
      user.value = userData;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));

      uiStore.addToast({
        type: "success",
        message: "Registration successful!",
      });
    } catch (error: any) {
      const message = error.response?.data?.msg || "Registration failed";

      uiStore.addToast({
        type: "error",
        message,
      });

      throw error;
    }
  };

  /* ===============================
     LOGOUT
  ================================ */

  const logout = () => {
    user.value = null;
    token.value = null;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    uiStore.addToast({
      type: "info",
      message: "Logged out",
    });
  };

  /* ===============================
     UPDATE USER
  ================================ */

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await api.put("/auth/me", userData);
      user.value = response.data;

      localStorage.setItem("user", JSON.stringify(response.data));

      uiStore.addToast({
        type: "success",
        message: "Profile updated",
      });
    } catch (error: any) {
      uiStore.addToast({
        type: "error",
        message: error.response?.data?.msg || "Update failed",
      });
    }
  };

  /* ===============================
     UPDATE PREFERENCES
  ================================ */

  const updatePreferences = async (prefs: Partial<User["preferences"]>) => {
    if (!user.value) return;

    try {
      const response = await api.put("/auth/preferences", prefs);

      user.value.preferences = response.data.preferences;

      localStorage.setItem("user", JSON.stringify(user.value));

      uiStore.addToast({
        type: "success",
        message: "Preferences saved",
      });
    } catch (error: any) {
      uiStore.addToast({
        type: "error",
        message: error.response?.data?.msg || "Update failed",
      });
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    updatePreferences,
  };
});
