import { defineStore } from "pinia";
import api from "@/services/api";
import { useUIStore } from "./ui";

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

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  persist: true,
  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
  },
  actions: {
    initializeAuth() {
      // Restore token from localStorage on app startup
      const storedToken = localStorage.getItem("token");
      if (storedToken && !this.token) {
        this.token = storedToken;
      }
    },
    async checkAuth() {
      if (!this.token) return;
      // Sync token to localStorage for axios interceptor
      if (!localStorage.getItem("token")) {
        localStorage.setItem("token", this.token);
      }
      try {
        const response = await api.get("/auth/me");
        this.user = response.data;
        console.log("[Auth] token valid, user updated");
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.log("[Auth] token invalid, logging out");
          this.logout();
        } else {
          console.warn("[Auth] network error, keeping cached user");
          useUIStore().addToast({
            type: "warning",
            message: "Offline mode: using cached user data",
          });
        }
      }
    },
    async login(email: string, password: string, rememberMe: boolean = false) {
      try {
        console.log("[Auth] login attempt");
        const response = await api.post("/auth/login", { email, password });
        const { token, user } = response.data;
        this.token = token;
        this.user = user;
        localStorage.setItem("token", token); // for axios interceptor
        console.log("[Auth] login successful, token stored");
        useUIStore().addToast({
          type: "success",
          message: "Login successful!",
        });
      } catch (error: any) {
        console.error("[Auth] login error", error);
        const message = error.response?.data?.msg || "Login failed";
        useUIStore().addToast({ type: "error", message });
        throw error;
      }
    },
    async register(
      name: string,
      email: string,
      password: string,
      rememberMe: boolean = false,
    ) {
      try {
        const response = await api.post("/auth/register", {
          name,
          email,
          password,
        });
        const { token, user } = response.data;
        this.token = token;
        this.user = user;
        localStorage.setItem("token", token);
        useUIStore().addToast({
          type: "success",
          message: "Registration successful!",
        });
      } catch (error: any) {
        const message = error.response?.data?.msg || "Registration failed";
        useUIStore().addToast({ type: "error", message });
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      useUIStore().addToast({ type: "info", message: "Logged out" });
    },
    async updateUser(userData: Partial<User>) {
      try {
        const response = await api.put("/users/profile", userData);
        this.user = response.data;
        useUIStore().addToast({ type: "success", message: "Profile updated" });
      } catch (error: any) {
        useUIStore().addToast({
          type: "error",
          message: error.response?.data?.msg || "Update failed",
        });
      }
    },
    async updatePreferences(prefs: Partial<User["preferences"]>) {
      if (!this.user) return;
      try {
        const response = await api.put("/users/preferences", prefs);
        this.user.preferences = response.data.preferences;
        useUIStore().addToast({
          type: "success",
          message: "Preferences saved",
        });
      } catch (error: any) {
        useUIStore().addToast({
          type: "error",
          message: error.response?.data?.msg || "Update failed",
        });
      }
    },
  },
});
