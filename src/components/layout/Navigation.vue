<template>
  <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <div
          class="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
        >
          <span class="text-xl font-bold">GT</span>
        </div>
        <h1
          class="text-xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent"
        >
          GoalTabs
        </h1>
        <span
          class="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
        >
          Beta
        </span>
      </router-link>

      <!-- Desktop Navigation -->
      <div
        class="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-xl rounded-2xl p-1"
      >
        <router-link
          v-for="route in navigationRoutes"
          :key="route.name"
          :to="{ name: route.name }"
          class="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          :class="{
            'bg-gradient-to-r from-primary/20 to-secondary/20 text-white':
              isActive(route.name),
            'text-gray-400 hover:text-white hover:bg-white/5': !isActive(
              route.name,
            ),
          }"
        >
          <span class="text-lg">{{ route.meta?.icon }}</span>
          {{ route.meta?.title }}
        </router-link>
      </div>

      <!-- User Menu -->
      <div v-if="isAuthenticated" class="flex items-center gap-4">
        <button
          class="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition relative"
        >
          <span class="text-xl">🔔</span>
          <span
            v-if="hasNotifications"
            class="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full animate-pulse"
          ></span>
        </button>

        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition"
          >
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-400"
            ></div>
            <div class="hidden md:block text-left">
              <p class="font-medium">{{ user?.name }}</p>
              <p class="text-xs opacity-60">
                {{ user?.isPremium ? "Premium User" : "Free User" }}
              </p>
            </div>
            <span
              class="text-xl transition-transform duration-200"
              :class="{ 'rotate-180': showUserMenu }"
              >⌄</span
            >
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 glass-card rounded-xl py-2 shadow-2xl"
            v-click-outside="closeUserMenu"
          >
            <router-link
              to="/settings"
              class="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition"
              @click="closeUserMenu"
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

      <!-- Auth Buttons -->
      <div v-else class="flex gap-3">
        <router-link to="/login" class="btn-secondary px-6 py-2">
          Sign In
        </router-link>
      </div>

      <!-- Mobile Menu Toggle -->
      <MobileMenu />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { routes } from "@/router/routes";
import MobileMenu from "./MobileMenu.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const showUserMenu = ref(false);
const hasNotifications = ref(true);

const user = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const navigationRoutes = computed(() => {
  return routes.filter((r) => r.meta?.showInNav && r.name !== "dashboard");
});

const isActive = (routeName: string | symbol | null | undefined): boolean => {
  return route.name === routeName;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const handleLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
  closeUserMenu();
};
</script>
