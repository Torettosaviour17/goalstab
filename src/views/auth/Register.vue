<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div
          class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center animate-float"
        >
          <span class="text-3xl font-bold">GT</span>
        </div>
        <h1
          class="text-3xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent"
        >
          Create Account
        </h1>
        <p class="text-gray-400 mt-2">Join GoalTabs and start saving</p>
      </div>

      <!-- Register Form -->
      <div class="glass-card p-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="John Doe"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-400">
              {{ errors.name }}
            </p>
          </div>

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
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-400">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition pr-12"
                :class="{ 'border-red-500': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {{ showPassword ? "👁️" : "👁️‍🗨️" }}
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-400">
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              :class="{ 'border-red-500': errors.confirmPassword }"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-400">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Terms -->
          <div class="flex items-center">
            <input
              id="terms"
              v-model="form.agreeTerms"
              type="checkbox"
              class="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-primary focus:ring-2"
            />
            <label for="terms" class="ml-2 text-sm text-gray-300">
              I agree to the
              <router-link
                to="/terms"
                class="text-primary hover:text-primary/80"
                >Terms of Service</router-link
              >
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
              Creating account...
            </span>
            <span v-else>Sign Up</span>
          </button>
        </form>

        <!-- Sign In Link -->
        <p class="mt-8 text-center text-gray-400">
          Already have an account?
          <router-link
            to="/login"
            class="text-primary hover:text-primary/80 font-medium transition"
          >
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const showPassword = ref(false);

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
});

const errors = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const validateForm = (): boolean => {
  let valid = true;

  // Clear previous errors
  errors.name = "";
  errors.email = "";
  errors.password = "";
  errors.confirmPassword = "";

  // Name validation
  if (!form.name) {
    errors.name = "Name is required";
    valid = false;
  }

  // Email validation
  if (!form.email) {
    errors.email = "Email is required";
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = "Email is invalid";
    valid = false;
  }

  // Password validation
  if (!form.password) {
    errors.password = "Password is required";
    valid = false;
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    valid = false;
  }

  // Confirm password validation
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
    valid = false;
  }

  return valid;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Login user after registration
    authStore.login({
      id: "user-123",
      email: form.email,
      name: form.name,
      isPremium: false,
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

    router.push({ name: "dashboard" });
  } catch (error) {
    console.error("Registration failed:", error);
  } finally {
    loading.value = false;
  }
};
</script>
