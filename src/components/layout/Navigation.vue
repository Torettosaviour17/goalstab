<template>
  <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <div
          class="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
        >
          <span class="text-xl font-bold text-white">GT</span>
        </div>
        <h1 class="text-xl font-bold text-white">GoalTabs</h1>
        <span
          class="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium"
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
          class="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          :class="{
            'bg-white/10 text-white': $route.path === '/',
            'text-gray-400 hover:text-white hover:bg-white/5':
              $route.path !== '/',
          }"
        >
          <span class="text-lg">📊</span>
          Dashboard
        </router-link>

        <router-link
          to="/goals"
          class="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          :class="{
            'bg-white/10 text-white': $route.path === '/goals',
            'text-gray-400 hover:text-white hover:bg-white/5':
              $route.path !== '/goals',
          }"
        >
          <span class="text-lg">🎯</span>
          Goals
        </router-link>

        <router-link
          to="/analytics"
          class="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          :class="{
            'bg-white/10 text-white': $route.path === '/analytics',
            'text-gray-400 hover:text-white hover:bg-white/5':
              $route.path !== '/analytics',
          }"
        >
          <span class="text-lg">📈</span>
          Analytics
        </router-link>

        <router-link
          to="/settings"
          class="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          :class="{
            'bg-white/10 text-white': $route.path === '/settings',
            'text-gray-400 hover:text-white hover:bg-white/5':
              $route.path !== '/settings',
          }"
        >
          <span class="text-lg">⚙️</span>
          Settings
        </router-link>
      </div>

      <!-- User Menu & Mobile Toggle -->
      <div class="flex items-center gap-4">
        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          <span class="text-xl text-white">{{
            isMobileMenuOpen ? "✕" : "☰"
          }}</span>
        </button>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="hidden md:flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition"
          >
            <div
              class="w-10 h-10 rounded-full bg-linear-to-br from-yellow-500 to-orange-500"
            ></div>
            <div class="text-left">
              <p class="font-medium text-white">Demo User</p>
              <p class="text-xs text-gray-400">Premium</p>
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
            class="absolute right-0 mt-2 w-48 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl py-2 shadow-2xl z-50"
          >
            <router-link
              to="/settings"
              class="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition text-white"
              @click="showUserMenu = false"
            >
              <span>⚙️</span> Settings
            </router-link>
            <button
              @click="handleLogout"
              class="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-red-400 transition"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden mt-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
    >
      <div class="space-y-2">
        <router-link
          to="/"
          @click="closeMobileMenu"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
          :class="{
            'bg-white/10 text-white': $route.path === '/',
            'text-gray-400 hover:text-white hover:bg-white/5':
              $route.path !== '/',
          }"
        >
          <span class="text-lg">📊</span>
          Dashboard
        </router-link>

        <router-link
          to="/goals"
          @click="closeMobileMenu"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
          :class="{
            'bg-white/10 text-white': $route.path === '/goals',
            'text-gray-400 hover:text-white hover:bg-white/5':
              $route.path !== '/goals',
          }"
        >
          <span class="text-lg">🎯</span>
          Goals
        </router-link>

        <router-link
          to="/analytics"
          @click="closeMobileMenu"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
          :class="{
            'bg-white/10 text-white': $route.path === '/analytics',
            'text-gray-400 hover:text-white hover:bg-white/5':
              $route.path !== '/analytics',
          }"
        >
          <span class="text-lg">📈</span>
          Analytics
        </router-link>

        <router-link
          to="/settings"
          @click="closeMobileMenu"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
          :class="{
            'bg-white/10 text-white': $route.path === '/settings',
            'text-gray-400 hover:text-white hover:bg-white/5':
              $route.path !== '/settings',
          }"
        >
          <span class="text-lg">⚙️</span> Settings
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showUserMenu = ref(false);
const isMobileMenuOpen = ref(false);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  // In a real app, clear auth state
  router.push("/login");
  showUserMenu.value = false;
};
</script>
