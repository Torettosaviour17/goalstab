<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
  >
    <!-- Animated background elements (always visible) -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
      ></div>
    </div>

    <!-- Header – only shown on non-auth pages when logged in (not on landing/login/register) -->
    <AppHeader v-if="showHeader" class="relative z-40" />

    <!-- Main content wrapper -->
    <div class="flex relative z-10" :class="{ 'pt-1': showHeader }">
      <!-- Sidebar – only shown on desktop when logged in and not on public/auth pages -->
      <AppSidebar v-if="showSidebar" class="hidden md:block" />

      <!-- Main content – add bottom padding on mobile for bottom nav -->
      <main class="flex-1 min-h-screen" :class="{ 'pb-16': showMobileNav }">
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0 }"
          :leave="{ opacity: 0, y: -20 }"
          :duration="300"
        >
          <router-view />
        </div>
      </main>
    </div>

    <!-- Mobile Bottom Navigation – only when authenticated and not on public/auth pages -->
    <MobileBottomNav v-if="showMobileNav" class="relative z-40" />

    <!-- Floating button only on dashboard -->
    <FloatingButton
      v-if="showFloatingButton"
      class="relative z-30"
      @click="uiStore.openCreateGoalModal"
      aria-label="Create goal"
    />

    <!-- Global notifications -->
    <ToastNotification />

    <!-- Global confetti effect -->
    <Confetti v-if="uiStore.showConfetti" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

// Stores
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
import { useThemeStore } from "@/stores/theme";

// Components
import AppHeader from "@/components/layout/AppHeader.vue";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import MobileBottomNav from "@/components/layout/MobileBottomNav.vue";
import FloatingButton from "@/components/shared/FloatingButton.vue";
import ToastNotification from "@/components/shared/ToastNotification.vue";
import Confetti from "@/components/shared/Confetti.vue";

// ── Stores ────────────────────────────────────────────
const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUIStore();
const themeStore = useThemeStore();
const { isAuthenticated } = storeToRefs(authStore);

// ── Pages where header/sidebar/nav should be hidden ──
const publicPages = [
  "landing",
  "login",
  "register",
  "forgot-password",
  "terms",
];

// ── Show/Hide logic ────────────────────────────────────
const showHeader = computed(() => {
  return isAuthenticated.value && !publicPages.includes(route.name as string);
});

const showSidebar = computed(() => {
  return isAuthenticated.value && !publicPages.includes(route.name as string);
});

const showMobileNav = computed(() => {
  return isAuthenticated.value && !publicPages.includes(route.name as string);
});

const showFloatingButton = computed(() => {
  return isAuthenticated.value && route.name === "dashboard";
});
</script>

<style scoped>
@keyframes pulse-soft {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

:deep(.animate-pulse) {
  animation: pulse-soft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
