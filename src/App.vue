<template>
  <div
    class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
  >
    <!-- Animated background elements (unchanged) -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-soft"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-soft"
        style="animation-delay: 1s"
      ></div>
    </div>

    <!-- Header (always visible) -->
    <AppHeader />

    <div class="flex pt-16">
      <!-- Sidebar only on desktop -->
      <AppSidebar v-if="showSidebar" class="hidden md:block" />

      <!-- Main content: add bottom padding on mobile for bottom nav -->
      <main class="flex-1 min-h-[calc(100vh-4rem)] pb-16 md:pb-0">
        <router-view v-slot="{ Component }">
          <PageTransition>
            <component :is="Component" />
          </PageTransition>
        </router-view>
      </main>
    </div>

    <!-- Mobile Bottom Navigation (only when authenticated and not on auth pages) -->
    <MobileBottomNav v-if="showMobileNav" />

    <!-- Floating button only on dashboard -->
    <FloatingButton
      v-if="showFloatingButton"
      @click="uiStore.openCreateGoalModal"
      aria-label="Create goal"
    />

    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import MobileBottomNav from "@/components/layout/MobileBottomNav.vue";
import FloatingButton from "@/components/shared/FloatingButton.vue";
import ToastNotification from "@/components/shared/ToastNotification.vue";
import PageTransition from "@/components/shared/PageTransition.vue";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUIStore();
const { isAuthenticated } = storeToRefs(authStore);

const authPages = ["login", "register", "forgot-password", "terms"];

const showSidebar = computed(() => {
  return isAuthenticated.value && !authPages.includes(route.name as string);
});

const showMobileNav = computed(() => {
  return isAuthenticated.value && !authPages.includes(route.name as string);
});

const showFloatingButton = computed(() => {
  return isAuthenticated.value && route.name === "dashboard";
});
</script>
