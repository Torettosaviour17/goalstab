<template>
  <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <div
          class="w-10 h-10 rounded-xl bg-linear-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
        >
          <span class="text-xl font-bold text-white">GT</span>
        </div>
        <h1 class="text-xl font-bold text-white">GoalTabs</h1>
        <span
          class="px-2 py-1 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] text-xs font-medium"
        >
          Beta
        </span>
      </router-link>

      <!-- Desktop Navigation -->
      <div
        class="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-xl rounded-2xl p-1"
      >
        <router-link
          to="/"
          class="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-white bg-white/10"
        >
          <span class="text-lg">📊</span>
          Dashboard
        </router-link>

        <router-link
          to="/goals"
          class="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5"
        >
          <span class="text-lg">🎯</span>
          Goals
        </router-link>

        <router-link
          to="/analytics"
          class="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5"
        >
          <span class="text-lg">📈</span>
          Analytics
        </router-link>

        <router-link
          to="/settings"
          class="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5"
        >
          <span class="text-lg">⚙️</span>
          Settings
        </router-link>
      </div>

      <!-- User Menu -->
      <div class="flex items-center gap-4">
        <button
          class="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition relative"
        >
          <span class="text-xl">🔔</span>
          <span
            class="absolute -top-1 -right-1 w-2 h-2 bg-[#ef4444] rounded-full animate-pulse-soft"
          ></span>
        </button>

        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition"
          >
            <div
              class="w-10 h-10 rounded-full bg-linear-to-br from-[#f59e0b] to-[#fb923c]"
            ></div>
            <div class="hidden md:block text-left">
              <p class="font-medium text-white">Demo User</p>
              <p class="text-xs text-gray-400">Premium User</p>
            </div>
            <span
              class="text-xl text-white transition-transform duration-200"
              :class="{ 'rotate-180': showUserMenu }"
              >⌄</span
            >
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl py-2 shadow-2xl"
          >
            <router-link
              to="/settings"
              class="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition text-white"
            >
              <span>⚙️</span> Settings
            </router-link>
            <button
              @click="handleLogout"
              class="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-[#ef4444] transition"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showUserMenu = ref(false);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = () => {
  localStorage.removeItem("token");
  router.push({ name: "login" });
};
</script>
