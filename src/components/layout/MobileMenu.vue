<template>
  <div class="md:hidden">
    <!-- Mobile Menu Button -->
    <button
      @click="isOpen = !isOpen"
      class="p-2 rounded-lg bg-white/10"
      aria-label="Toggle menu"
    >
      <span class="text-xl">{{ isOpen ? "✕" : "☰" }}</span>
    </button>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute top-16 left-4 right-4 glass-card rounded-2xl p-4 shadow-2xl z-50"
        v-click-outside="closeMenu"
      >
        <div class="space-y-2">
          <router-link
            v-for="route in navigationRoutes"
            :key="route.name"
            :to="{ name: route.name }"
            @click="closeMenu"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
            :class="{
              'bg-gradient-to-r from-primary/20 to-secondary/20 text-white':
                isActive(route.name),
              'text-gray-400 hover:bg-white/5': !isActive(route.name),
            }"
          >
            <span class="text-lg">{{ route.meta?.icon }}</span>
            <span class="font-medium">{{ route.meta?.title }}</span>
          </router-link>
        </div>

        <!-- User Section -->
        <div v-if="isAuthenticated" class="border-t border-white/10 mt-4 pt-4">
          <div class="flex items-center gap-3 px-4 py-3">
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-400"
            ></div>
            <div>
              <p class="font-medium">{{ user?.name }}</p>
              <p class="text-sm opacity-60">
                {{ user?.isPremium ? "Premium" : "Free" }}
              </p>
            </div>
          </div>
          <router-link
            to="/settings"
            @click="closeMenu"
            class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition"
          >
            <span>⚙️</span> Settings
          </router-link>
          <button
            @click="handleLogout"
            class="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-red-400 transition"
          >
            <span>🚪</span> Logout
          </button>
        </div>

        <!-- Auth Section -->
        <div v-else class="border-t border-white/10 mt-4 pt-4 space-y-2">
          <router-link
            to="/login"
            @click="closeMenu"
            class="block w-full text-center btn-secondary py-3"
          >
            Sign In
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { routes } from "@/router/routes";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isOpen = ref(false);

const user = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const navigationRoutes = computed(() => {
  return routes.filter((r) => r.meta?.showInNav);
});

const isActive = (routeName: string | symbol | null | undefined): boolean => {
  return route.name === routeName;
};

const closeMenu = () => {
  isOpen.value = false;
};

const handleLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
  closeMenu();
};
</script>
