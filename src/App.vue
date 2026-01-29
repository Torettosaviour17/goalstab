<template>
  <div
    class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
  >
    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-soft"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-soft"
        style="animation-delay: 1s"
      ></div>
    </div>

    <!-- Header -->
    <AppHeader />

    <!-- Main Layout -->
    <div class="flex pt-16">
      <!-- Sidebar (desktop) -->
      <AppSidebar />

      <!-- Main Content -->
      <main class="flex-1 min-h-[calc(100vh-4rem)] p-4 md:p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Floating Button -->
    <button
      @click="handleCreateGoal"
      class="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-2xl z-50 bg-linear-to-br from-primary-500 to-primary-600 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] active:shadow-inner hover:scale-110 active:scale-95 transition-all duration-300 animate-float"
    >
      ＋
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "./components/layout/AppHeader.vue";
import AppSidebar from "./components/layout/AppSidebar.vue";

const route = useRoute();

const handleCreateGoal = () => {
  console.log("Create goal clicked");
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
