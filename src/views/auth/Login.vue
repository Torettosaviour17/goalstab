<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div
          class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-float"
        >
          <span class="text-3xl font-bold">GT</span>
        </div>
        <h1
          class="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
        >
          Welcome Back
        </h1>
        <p class="text-gray-400 mt-2">Sign in to continue to GoalTabs</p>
      </div>

      <!-- Login Form -->
      <div class="glass-card p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <!-- Password -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label
                for="password"
                class="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition pr-12"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {{ showPassword ? "👁️" : "👁️‍🗨️" }}
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center">
            <input
              id="remember"
              v-model="form.rememberMe"
              type="checkbox"
              class="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-primary focus:ring-2"
            />
            <label for="remember" class="ml-2 text-sm text-gray-300">
              Remember me
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <span class="animate-spin">⟳</span>
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-8 p-4 bg-primary/10 rounded-xl">
          <p class="text-sm text-center text-gray-300">
            Demo Credentials:<br />
            Email: <span class="font-mono">demo@example.com</span><br />
            Password: <span class="font-mono">password123</span>
          </p>
        </div>

        <!-- Sign Up Link -->
        <p class="mt-8 text-center text-gray-400">
          Don't have an account?
          <button
            @click="handleDemoLogin"
            class="text-primary hover:text-primary/80 font-medium transition ml-2"
          >
            Try Demo
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const showPassword = ref(false);

const form = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

const handleLogin = async () => {
  loading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Demo login
    authStore.login({
      id: "user-123",
      email: form.email || "demo@example.com",
      name: "Demo User",
      isPremium: true,
      connectedAccounts: [],
      preferences: {
        theme: "dark",
        currency: "NGN",
        notifications: {
          email: true,
          push: true,
          goalCompleted: true,
          depositReceived: true,
          withdrawalRequested: true,
          weeklyReport: true,
        },
        autoSaveEnabled: true,
        twoFactorEnabled: false,
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    const redirect = route.query.redirect as string;
    router.push(redirect || { name: "dashboard" });
  } catch (error) {
    console.error("Login failed:", error);
  } finally {
    loading.value = false;
  }
};

const handleDemoLogin = () => {
  form.email = "demo@example.com";
  form.password = "password123";
  handleLogin();
};
</script>
