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
          class="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-2xl object-contain"
        />
        <h1 class="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p class="text-gray-400">Sign in to continue to GoalTabs</p>
      </div>

      <!-- Login form -->
      <div class="glass-card p-8 animate-slide-up">
        <form @submit.prevent="handleLogin" class="space-y-5">
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
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium text-gray-300">Password</label>
              <router-link
                to="/forgot-password"
                class="text-xs text-primary-400 hover:text-primary-300 transition"
              >
                Forgot password?
              </router-link>
            </div>
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

          <!-- Remember me -->
          <div class="flex items-center">
            <input
              id="remember"
              v-model="form.rememberMe"
              type="checkbox"
              class="w-4 h-4 rounded bg-gray-800 border-gray-700 text-primary-500 focus:ring-primary-500"
            />
            <label for="remember" class="ml-2 text-sm text-gray-300"
              >Remember me</label
            >
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
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
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Simple savings tip (replaces social buttons) -->
        <div
          class="mt-8 text-center text-sm text-gray-500 border-t border-gray-700 pt-6"
        >
          <p class="text-primary-400 font-medium mb-1">💡 Smart Savings Tip</p>
          <p>
            Set up auto-save to build your goals without even thinking about it.
          </p>
        </div>

        <!-- Register link -->
        <p class="mt-6 text-center text-gray-400">
          Don't have an account?
          <router-link
            to="/register"
            class="text-primary-400 hover:text-primary-300 font-medium transition"
          >
            Sign up
          </router-link>
        </p>

        <!-- Terms -->
        <p class="mt-4 text-center text-xs text-gray-500">
          By signing in, you agree to our
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
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUIStore();

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
    await authStore.login(form.email, form.password, form.rememberMe);
    const redirect = (route.query.redirect as string) || "/dashboard";
    router.push(redirect);
  } catch (error) {
    // handled in store
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
.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
