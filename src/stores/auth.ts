import { defineStore } from "pinia";
import { ref, computed } from "vue";
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
  isAdmin?: boolean;
  avatar?: string;
  googleId?: string;
  profilePicture?: string;
  preferences: {
    currency: string;
    theme: string;
    autoSaveDefault: boolean;
    monthlyIncome?: number;
    onboardingCompleted?: boolean;
    notifications: NotificationSettings;
  };
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
  }),
  persist: true,
  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
  },
  actions: {
    async checkAuth() {
      console.log("[Auth] checkAuth called, token:", !!this.token);
      if (!this.token) {
        console.log("[Auth] No token, skipping auth check");
        return Promise.resolve();
      }
      // Sync token to localStorage for axios interceptor
      localStorage.setItem("token", this.token);
      try {
        console.log("[Auth] Making API call to /auth/me");
        const response = await api.get("/auth/me");
        this.user = response.data;
        this.error = null;
        console.log("[Auth] token valid, user updated");
      } catch (error: any) {
        console.error("[Auth] API call failed:", error);
        if (error.response?.status === 401) {
          console.log("[Auth] token invalid, logging out");
          this.logout();
        } else {
          console.warn("[Auth] network error, keeping cached user");
          const uiStore = useUIStore();
          uiStore.addToast({
            type: "warning",
            message: "Offline mode: using cached user data",
          });
        }
      }
    },

    async login(email: string, password: string, rememberMe: boolean = false) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/auth/login", { email, password });
        const { token, user } = response.data;
        this.token = token;
        this.user = user;
        localStorage.setItem("token", token);
        useUIStore().addToast({
          type: "success",
          message: "Login successful!",
        });
      } catch (error: any) {
        const message = error.response?.data?.msg || "Login failed";
        this.error = message;
        useUIStore().addToast({ type: "error", message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(
      name: string,
      email: string,
      password: string,
      rememberMe: boolean = false,
    ) {
      this.loading = true;
      this.error = null;
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
        this.error = message;
        useUIStore().addToast({ type: "error", message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async signInWithGoogle(googleToken: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/auth/google-signin", {
          token: googleToken,
        });
        const { token, user } = response.data;
        this.token = token;
        this.user = user;
        localStorage.setItem("token", token);
        useUIStore().addToast({
          type: "success",
          message: "Welcome to GoalTabs!",
        });
      } catch (error: any) {
        const message = error.response?.data?.msg || "Google sign-in failed";
        this.error = message;
        useUIStore().addToast({ type: "error", message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.error = null;
      localStorage.removeItem("token");
      useUIStore().addToast({ type: "info", message: "Logged out" });
    },

    async updateUser(userData: Partial<User>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put("/users/profile", userData);
        this.user = response.data;
        useUIStore().addToast({ type: "success", message: "Profile updated" });
      } catch (error: any) {
        const message = error.response?.data?.msg || "Update failed";
        this.error = message;
        useUIStore().addToast({
          type: "error",
          message,
        });
      } finally {
        this.loading = false;
      }
    },

    async updatePreferences(prefs: Partial<User["preferences"]>) {
      if (!this.user) return;
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put("/users/preferences", prefs);
        this.user.preferences = response.data.preferences;
        useUIStore().addToast({
          type: "success",
          message: "Preferences saved",
        });
      } catch (error: any) {
        const message = error.response?.data?.msg || "Update failed";
        this.error = message;
        useUIStore().addToast({
          type: "error",
          message,
        });
      } finally {
        this.loading = false;
      }
    },

    async changePassword(currentPassword: string, newPassword: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put("/users/password", {
          currentPassword,
          newPassword,
        });
        useUIStore().addToast({
          type: "success",
          message: response.data.msg || "Password changed successfully",
        });
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.msg || "Password change failed";
        this.error = message;
        useUIStore().addToast({ type: "error", message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateAvatar(avatar: string | null) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put("/users/avatar", {
          avatar: avatar || "",
        });
        if (this.user) {
          this.user = { ...this.user, avatar: response.data.avatar };
          localStorage.setItem("user", JSON.stringify(this.user));
        }
        useUIStore().addToast({ type: "success", message: "Avatar updated" });
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.msg || "Avatar update failed";
        this.error = message;
        useUIStore().addToast({ type: "error", message });
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
