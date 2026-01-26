<template>
  <div
    class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"
  >
    <div
      class="w-48 h-48 mb-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-float"
    >
      <span class="text-6xl">🔍</span>
    </div>

    <h1 class="text-4xl font-bold mb-4">404</h1>
    <p class="text-xl text-gray-400 mb-8">
      Oops! The page you're looking for doesn't exist.
    </p>

    <div class="flex gap-4">
      <button @click="$router.go(-1)" class="btn-secondary px-6 py-3">
        ← Go Back
      </button>
      <router-link to="/" class="btn-primary px-6 py-3">
        Go to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
