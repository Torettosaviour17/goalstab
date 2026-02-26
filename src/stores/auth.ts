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

export interface UserPreferences {
  currency: string;
  theme: string;
  autoSaveDefault: boolean;
  notifications: NotificationSettings;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isPremium: boolean;
  avatar?: string;
  preferences: UserPreferences;
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

    // 1️⃣ Try localStorage first for an instant UI load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (e) {
        localStorage.removeItem("user");
      }
    }

    // 2️⃣ Verify/Refresh data with backend
    try {
      const response = await api.get("/auth/me");
      user.value = response.data;
      localStorage.setItem("user", JSON.stringify(user.value));
    } catch (error) {
      console.error("Session expired or invalid token");
      logout();
    }
  };

  /* ===============================
      LOGIN / REGISTER
  ================================ */

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      handleAuthSuccess(response.data);
      uiStore.addToast({ type: "success", message: "Welcome back!" });
    } catch (error: any) {
      handleAuthError(error, "Login failed");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      handleAuthSuccess(response.data);
      uiStore.addToast({ type: "success", message: "Account created successfully!" });
    } catch (error: any) {
      handleAuthError(error, "Registration failed");
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
    uiStore.addToast({ type: "info", message: "Logged out" });
  };

  /* ===============================
      PROFILE UPDATES
  ================================ */

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await api.put("/auth/me", userData);
      user.value = response.data;
      localStorage.setItem("user", JSON.stringify(user.value));
      uiStore.addToast({ type: "success", message: "Profile updated" });
    } catch (error: any) {
      uiStore.addToast({ 
        type: "error", 
        message: error.response?.data?.msg || "Update failed" 
      });
    }
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    if (!user.value) return;
    try {
      const response = await api.put("/auth/preferences", prefs);
      user.value.preferences = response.data.preferences;
      localStorage.setItem("user", JSON.stringify(user.value));
      uiStore.addToast({ type: "success", message: "Preferences saved" });
    } catch (error: any) {
      uiStore.addToast({ 
        type: "error", 
        message: error.response?.data?.msg || "Failed to save preferences" 
      });
    }
  };

  /* ===============================
      PRIVATE HELPERS
  ================================ */

  const handleAuthSuccess = (data: { token: string; user: User }) => {
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const handleAuthError = (error: any, defaultMsg: string) => {
    const message = error.response?.data?.msg || defaultMsg;
    uiStore.addToast({ type: "error", message });
    throw error;
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