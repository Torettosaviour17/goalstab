import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  connectedAccounts: any[];
  preferences: {
    theme: "dark" | "light" | "auto";
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      goalCompleted: boolean;
      depositReceived: boolean;
      withdrawalRequested: boolean;
      weeklyReport: boolean;
    };
    autoSaveEnabled: boolean;
    twoFactorEnabled: boolean;
  };
  createdAt: string;
  lastLogin: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));

  const isAuthenticated = computed(() => !!user.value && !!token.value);
  const isPremium = computed(() => user.value?.isPremium || false);

  const login = (userData: User, authToken?: string) => {
    user.value = userData;
    if (authToken) {
      token.value = authToken;
      localStorage.setItem("token", authToken);
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
  };

  const updateUser = (updates: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updates };
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isPremium,
    login,
    logout,
    updateUser,
  };
});
