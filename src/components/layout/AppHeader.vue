<template>
  <header
    class="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50"
  >
    <div class="container mx-auto px-4 md:px-6">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <router-link to="/" class="flex items-center gap-3 group">
            <div
              class="w-9 h-9 rounded-lg bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
            >
              <span class="text-lg font-bold text-white">GT</span>
            </div>
            <div>
              <h1 class="text-lg font-bold text-white tracking-tight">
                GoalTabs
              </h1>
              <p class="text-xs text-gray-400 hidden md:block">
                Smart Savings Platform
              </p>
            </div>
          </router-link>
          <span
            class="px-2 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-medium hidden md:block"
            >Beta</span
          >
        </div>

        <!-- Desktop Navigation -->

        <!-- Right section -->
        <div class="flex items-center gap-3">
          <!-- Search (desktop) -->
          <div class="hidden md:block relative">
            <input
              type="search"
              placeholder="Search goals..."
              class="w-48 lg:w-64 pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
            <div
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              🔍
            </div>
          </div>

          <!-- Notifications -->
          <button
            @click="toggleNotifications"
            class="relative p-2 rounded-lg hover:bg-gray-800/50 transition"
            aria-label="Notifications"
          >
            <span class="text-xl">🔔</span>
            <span
              v-if="hasUnreadNotifications"
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"
            ></span>
            <span
              v-if="hasUnreadNotifications"
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            ></span>
          </button>

          <!-- User menu -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-800/50 transition"
              aria-label="User menu"
            >
              <div
                class="w-8 h-8 rounded-full bg-linear-to-br from-yellow-500 to-orange-500 flex items-center justify-center"
              >
                <span class="text-sm font-semibold text-white">U</span>
              </div>
              <div class="hidden md:block text-left">
                <p class="text-sm font-medium text-white">User</p>
                <p class="text-xs text-gray-400">Premium</p>
              </div>
              <svg
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': showUserMenu }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Dropdown menu with high z-index -->
            <div
              v-if="showUserMenu"
              v-click-outside="closeUserMenu"
              class="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl py-2 z-50"
            >
              <div class="px-4 py-3 border-b border-gray-700/50">
                <p class="text-sm font-medium text-white">Signed in as</p>
                <p class="text-sm text-gray-300 truncate">user@example.com</p>
              </div>
              <router-link
                to="/settings"
                @click="closeUserMenu"
                class="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 transition text-gray-300"
              >
                <span>⚙️</span> Settings
              </router-link>
              <div class="border-t border-gray-700/50 mt-2 pt-2">
                <button
                  @click="handleLogout"
                  class="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/10 transition text-red-400"
                >
                  <span>🚪</span> Sign out
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile menu toggle -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition"
            aria-label="Menu"
          >
            <span class="text-xl">{{ mobileMenuOpen ? "✕" : "☰" }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden bg-gray-800/90 backdrop-blur-xl border-t border-gray-700/50"
    >
      <div class="container mx-auto px-4 py-3">
        <div class="space-y-1">
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
            <span class="text-lg">📊</span> Dashboard
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
            <span class="text-lg">🎯</span> Goals
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
            <span class="text-lg">📈</span> Analytics
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
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showUserMenu = ref(false);
const mobileMenuOpen = ref(false);
const hasUnreadNotifications = ref(true);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const toggleNotifications = () => {
  console.log("Toggle notifications");
};

const handleLogout = async () => {
  closeUserMenu();
  localStorage.removeItem("token");
  router.push("/login");
};

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    if (showUserMenu.value) closeUserMenu();
    if (mobileMenuOpen.value) closeMobileMenu();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscapeKey);
});
</script>
