<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div
          class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center animate-float"
        >
          <span class="text-3xl font-bold text-white">GT</span>
        </div>
        <h1 class="text-3xl font-bold text-white">Welcome Back</h1>
        <p class="text-gray-400 mt-2">Sign in to continue to GoalTabs</p>
      </div>

      <div class="glass-card p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Email Address</label
            >
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          <!-- Password -->
          <div>
            <div class="flex justify-between mb-2">
              <label class="text-sm font-medium text-gray-300">Password</label>
              <router-link
                to="/forgot-password"
                class="text-sm text-primary-400 hover:text-primary-300"
              >
                Forgot?
              </router-link>
            </div>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 pr-12"
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
              v-model="form.remember"
              type="checkbox"
              class="w-4 h-4 rounded bg-gray-800 border-gray-700 text-primary-500 focus:ring-primary-500"
            />
            <label for="remember" class="ml-2 text-sm text-gray-300"
              >Remember me</label
            >
          </div>

          <BaseButton type="submit" :loading="loading" fullWidth>
            Sign In
          </BaseButton>
        </form>

        <!-- Demo credentials -->
        <div class="mt-6 p-4 bg-primary-500/10 rounded-xl">
          <p class="text-sm text-center text-gray-300">
            Demo: demo@example.com / password123
          </p>
        </div>

        <p class="mt-6 text-center text-gray-400">
          Don't have an account?
          <router-link
            to="/register"
            class="text-primary-400 hover:text-primary-300 font-medium"
          >
            Sign up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import BaseButton from "@/components/shared/BaseButton.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const showPassword = ref(false);

const form = reactive({
  email: "",
  password: "",
  remember: false,
});

const handleLogin = async () => {
  loading.value = true;
  try {
    await authStore.login(form.email, form.password);
    const redirect = (route.query.redirect as string) || "/";
    router.push(redirect);
  } catch (error) {
    // handled
  } finally {
    loading.value = false;
  }
};
</script>
