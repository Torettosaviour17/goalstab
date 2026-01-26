<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div
          class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center animate-float"
        >
          <span class="text-3xl">🔑</span>
        </div>
        <h1 class="text-3xl font-bold mb-2">Reset Password</h1>
        <p class="text-gray-400">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>

      <!-- Reset Form -->
      <div class="glass-card p-8">
        <form
          @submit.prevent="handleSubmit"
          class="space-y-6"
          v-if="!submitted"
        >
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
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              :class="{ 'border-red-500': error }"
            />
            <p v-if="error" class="mt-1 text-sm text-red-400">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <span class="animate-spin">⟳</span>
              Sending...
            </span>
            <span v-else>Send Reset Link</span>
          </button>
        </form>

        <!-- Success Message -->
        <div v-else class="text-center py-8">
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center"
          >
            <span class="text-2xl">✓</span>
          </div>
          <h2 class="text-xl font-bold mb-2">Check your email</h2>
          <p class="text-gray-400 mb-6">
            We've sent a password reset link to {{ email }}
          </p>
          <button
            @click="submitted = false"
            class="text-primary hover:text-primary/80 font-medium transition"
          >
            Try another email
          </button>
        </div>

        <!-- Back to Login -->
        <div class="mt-8 text-center">
          <router-link
            to="/login"
            class="text-gray-400 hover:text-white transition"
          >
            ← Back to login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const error = ref("");
const loading = ref(false);
const submitted = ref(false);

const handleSubmit = async () => {
  error.value = "";

  if (!email.value) {
    error.value = "Email is required";
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email.value)) {
    error.value = "Email is invalid";
    return;
  }

  loading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    submitted.value = true;
  } catch (err) {
    error.value = "Failed to send reset link";
  } finally {
    loading.value = false;
  }
};
</script>
