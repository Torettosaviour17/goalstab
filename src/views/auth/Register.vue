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
                :class="{ 'border-danger': passwordError }"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition"
              >
                {{ showConfirmPassword ? "👁️" : "👁️‍🗨️" }}
              </button>
            </div>
            <p v-if="passwordError" class="mt-1 text-xs text-danger">
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

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-gray-800 text-gray-400 rounded-full"
              >Or continue with</span
            >
          </div>
        </div>

        <!-- Social buttons (placeholders) -->
        <div class="grid grid-cols-2 gap-3">
          <button
            class="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl transition text-gray-300 hover:text-white"
          >
            <span class="text-lg">G</span>
            Google
          </button>
          <button
            class="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl transition text-gray-300 hover:text-white"
          >
            <span class="text-lg">🐙</span>
            GitHub
          </button>
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
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUIStore();

const loading = ref(false);
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

const handleRegister = async () => {
  if (!passwordsMatch.value) {
    uiStore.addToast({ type: "error", message: "Passwords do not match" });
    return;
  }

  loading.value = true;
  try {
    await authStore.register(form.name, form.email, form.password);
    router.push("/dashboard");
  } catch (error) {
    // Error already handled in store
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
