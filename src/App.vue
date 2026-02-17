<template>
  <div
    class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
  >
    <!-- Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-soft"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-soft"
        style="animation-delay: 1s"
      ></div>
    </div>

    <AppHeader />
    <div class="flex pt-16">
      <AppSidebar />
      <main class="flex-1 min-h-[calc(100vh-4rem)]">
        <router-view v-slot="{ Component }">
          <PageTransition>
            <component :is="Component" />
          </PageTransition>
        </router-view>
      </main>
    </div>

    <FloatingButton
      @click="uiStore.openCreateGoalModal"
      aria-label="Create goal"
    />
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import FloatingButton from "@/components/shared/FloatingButton.vue";
import ToastNotification from "@/components/shared/ToastNotification.vue";
import PageTransition from "@/components/shared/PageTransition.vue";
import { useUIStore } from "@/stores/ui";

const uiStore = useUIStore();
</script>
