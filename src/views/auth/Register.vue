<template>
  <div
    class="min-h-screen flex items-center justify-center px-3 py-6 sm:px-4 sm:py-12 relative overflow-hidden"
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
      <div class="text-center mb-5 sm:mb-8 animate-fade-in">
        <img
          src="@/assets/goaltab-logo.png"
          alt="GoalTabs"
          class="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-2xl shadow-2xl object-contain"
        />
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Join GoalTabs</h1>
        <p class="text-xs sm:text-base text-gray-400">Start your savings journey today</p>
      </div>

      <!-- Register form -->
      <div class="glass-card p-5 sm:p-8 animate-slide-up">
        <!-- Google Sign-In Button -->
        <div class="mb-6">
          <div id="google_signin_button" class="w-full min-h-10 flex justify-center"></div>
          <p v-if="googleError" class="mt-2 text-xs text-red-400">
            {{ googleError }}
          </p>
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
        <form @submit.prevent="handleRegister" class="space-y-4 sm:space-y-5">
          <!-- Name -->
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
              >Full Name</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none"
              >
                <span class="text-gray-500 text-base sm:text-lg">👤</span>
              </div>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="John Doe"
                class="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
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
                class="w-full pl-9 pr-10 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-gray-400 hover:text-white transition"
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
            class="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
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
        <p class="mt-4 sm:mt-8 text-center text-xs sm:text-base text-gray-400">
          Already have an account?
          <router-link
            to="/login"
            class="text-primary-400 hover:text-primary-300 font-medium transition"
          >
            Sign in
          </router-link>
        </p>

        <!-- Terms -->
        <p class="mt-3 text-center text-[11px] sm:text-xs text-gray-500">
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
const googleError = ref("");
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

const handleGoogleCallback = async (response: any) => {
  try {
    googleError.value = "";
    if (!response?.credential) throw new Error("No Google credential received");
    await authStore.signInWithGoogle(response.credential);
    await router.push("/dashboard");
  } catch (error: any) {
    googleError.value =
      error.response?.data?.msg || error.message || "Google sign-in failed";
  }
};

// Initialize Google Sign-In once, then render the official Google button.
const initializeGoogleSignIn = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    googleError.value = "Google Client ID not configured";
    return;
  }

  if (!window.google?.accounts?.id) {
    googleError.value = "Google Sign-In library is unavailable";
    return;
  }

  try {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCallback,
    });

    const container = document.getElementById("google_signin_button");
    if (container) {
      container.innerHTML = "";
      window.google.accounts.id.renderButton(container, {
        theme: "outline",
        size: "large",
        width: Math.min(400, container.clientWidth || 400),
        text: "continue_with",
        shape: "rectangular",
      });
    }
  } catch (error) {
    googleError.value = "Failed to initialize Google Sign-In";
    console.error("[Google] Initialization error:", error);
  }
};

onMounted(() => {
  const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]') as HTMLScriptElement | null;

  if (window.google?.accounts?.id) {
    initializeGoogleSignIn();
    return;
  }

  const script = existing || document.createElement("script");
  if (!existing) {
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  script.addEventListener("load", initializeGoogleSignIn, { once: true });
});

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

    await router.push("/dashboard");
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
