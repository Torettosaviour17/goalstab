<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
          <span class="text-3xl">🔐</span>
        </div>
        <h1 class="text-3xl font-bold mb-2">Choose a new password</h1>
        <p class="text-gray-400">Create a new password for your GoalTabs account.</p>
      </div>

      <div class="glass-card p-8">
        <form v-if="!success" @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">New password</label>
            <input id="password" v-model="password" type="password" minlength="6" required
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" />
          </div>
          <div>
            <label for="confirm" class="block text-sm font-medium text-gray-300 mb-2">Confirm password</label>
            <input id="confirm" v-model="confirm" type="password" minlength="6" required
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" />
          </div>
          <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
          <button type="submit" :disabled="loading"
            class="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? "Resetting..." : "Reset Password" }}
          </button>
        </form>

        <div v-else class="text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span class="text-2xl">✓</span>
          </div>
          <h2 class="text-xl font-bold mb-2">Password reset complete</h2>
          <p class="text-gray-400 mb-6">Your password has been updated. You can now sign in.</p>
          <router-link to="/login" class="btn-primary inline-block px-6 py-3">Go to login</router-link>
        </div>

        <div class="mt-8 text-center">
          <router-link to="/login" class="text-gray-400 hover:text-white transition">← Back to login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import api from "@/services/api";

const route = useRoute();
const token = String(route.query.token || "");
const password = ref("");
const confirm = ref("");
const error = ref("");
const loading = ref(false);
const success = ref(false);

const handleSubmit = async () => {
  error.value = "";
  if (!token) {
    error.value = "This reset link is missing its token.";
    return;
  }
  if (password.value !== confirm.value) {
    error.value = "Passwords do not match.";
    return;
  }

  loading.value = true;
  try {
    await api.post("/auth/reset-password", {
      token,
      password: password.value,
    });
    success.value = true;
  } catch (err: any) {
    error.value = err.response?.data?.msg || "Unable to reset password.";
  } finally {
    loading.value = false;
  }
};
</script>