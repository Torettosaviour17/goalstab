<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
  >
    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-soft"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-soft"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute top-1/4 left-1/4 w-40 h-40 bg-success/5 rounded-full blur-2xl animate-pulse-soft"
        style="animation-delay: 0.5s"
      ></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo and welcome -->
      <div class="text-center mb-8 animate-fade-in">
        <img
          src="@/assets/goaltab-logo.png"
          alt="GoalTabs"
          class="w-40 h-40 mx-auto shadow-2xl object-contain"
        />
        <h1 class="text-3xl font-bold text-white mb-2">Join GoalTabs</h1>
        <p class="text-gray-400">Start your savings journey today</p>
      </div>

      <!-- Register form -->
      <div class="glass-card p-8 animate-slide-up">
        <!-- Google Sign-In Button -->
        <div class="mb-6">
          <button
            @click="handleGoogleSignIn"
            :disabled="googleLoading || loading"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-900 hover:bg-gray-50 border border-gray-300 rounded-xl transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="!googleLoading" class="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span v-if="googleLoading" class="inline-block animate-spin"
              >⏳</span
            >
            <span>{{
              googleLoading ? "Signing in..." : "Continue with Google"
            }}</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-gray-800 text-gray-400 rounded-full"
              >Or register with email</span
            >
          </div>
        </div>

        <!-- Email/Password Form -->
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Full Name</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <span class="text-gray-500 text-lg">👤</span>
              </div>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="John Doe"
                class="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Email Address</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <span class="text-gray-500 text-lg">📧</span>
              </div>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="you@example.com"
                class="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Password</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <span class="text-gray-500 text-lg">🔒</span>
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition"
              >
                {{ showPassword ? "👁️" : "👁️‍🗨️" }}
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Confirm Password</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <span class="text-gray-500 text-lg">🔒</span>
              </div>
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                :class="{ 'border-red-500': passwordError }"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition"
              >
                {{ showConfirmPassword ? "👁️" : "👁️‍🗨️" }}
              </button>
            </div>
            <p v-if="passwordError" class="mt-1 text-xs text-red-400">
              {{ passwordError }}
            </p>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading || !passwordsMatch"
            class="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg
                class="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Other options -->
        <div class="grid grid-cols-1 gap-3 mt-6">
          <a
            href="https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_LINKEDIN_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=profile%20email"
            class="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl transition text-gray-300 hover:text-white"
          >
            <span class="text-lg">💼</span>
            LinkedIn
          </a>
        </div>

        <!-- Login link -->
        <p class="mt-8 text-center text-gray-400">
          Already have an account?
          <router-link
            to="/login"
            class="text-primary-400 hover:text-primary-300 font-medium transition"
          >
            Sign in
          </router-link>
        </p>

        <!-- Terms -->
        <p class="mt-4 text-center text-xs text-gray-500">
          By joining, you agree to our
          <router-link
            to="/terms"
            class="text-primary-400 hover:text-primary-300"
            >Terms</router-link
          >
          and
          <router-link
            to="/privacy"
            class="text-primary-400 hover:text-primary-300"
            >Privacy Policy</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

declare global {
  interface Window {
    google: any;
  }
}

const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUIStore();

const loading = ref(false);
const googleLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const passwordsMatch = computed(() => form.password === form.confirmPassword);
const passwordError = computed(() => {
  if (form.confirmPassword && !passwordsMatch.value) {
    return "Passwords do not match";
  }
  return "";
});

// Initialize Google Sign-In
onMounted(() => {
  // Load Google Sign-In script
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});

// Handle Google Sign-In
const handleGoogleSignIn = async () => {
  try {
    googleLoading.value = true;

    // Initialize Google Sign-In with callback
    if (!window.google) {
      uiStore.addToast({
        type: "error",
        message: "Google Sign-In not loaded. Please refresh the page.",
      });
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    });

    // Trigger the One Tap UI or redirect
    window.google.accounts.id.renderButton(
      document.querySelector("#google_signin_button"),
      { theme: "filled_black", size: "large" },
    );

    // Or use prompt instead
    window.google.accounts.id.prompt(handleGoogleCallback);
  } catch (error) {
    console.error("Google sign-in error:", error);
    uiStore.addToast({
      type: "error",
      message: "Failed to initialize Google Sign-In",
    });
  } finally {
    googleLoading.value = false;
  }
};

// Handle Google callback
const handleGoogleCallback = async (response: any) => {
  try {
    googleLoading.value = true;

    if (!response.credential) {
      uiStore.addToast({
        type: "error",
        message: "No credential received from Google",
      });
      return;
    }

    // Send token to backend
    await authStore.signInWithGoogle(response.credential);

    uiStore.addToast({
      type: "success",
      message: "Welcome to GoalTabs!",
    });

    // Redirect to dashboard
    router.push("/dashboard");
  } catch (error: any) {
    console.error("Google callback error:", error);
    uiStore.addToast({
      type: "error",
      message: error.message || "Google sign-in failed",
    });
  } finally {
    googleLoading.value = false;
  }
};

// Handle email/password registration
const handleRegister = async () => {
  if (!passwordsMatch.value) {
    uiStore.addToast({
      type: "error",
      message: "Passwords do not match",
    });
    return;
  }

  loading.value = true;
  try {
    await authStore.register(form.name, form.email, form.password);

    uiStore.addToast({
      type: "success",
      message: "Account created successfully!",
    });

    router.push("/dashboard");
  } catch (error: any) {
    uiStore.addToast({
      type: "error",
      message: error.response?.data?.msg || "Registration failed",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
.animate-slide-up {
  animation: slide-up 0.5s ease-out;
}
</style>
