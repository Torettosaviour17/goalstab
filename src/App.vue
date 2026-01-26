<template>
  <div
    class="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"
  >
    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-soft"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft"
        style="animation-delay: 1s"
      ></div>
    </div>

    <!-- Navigation -->
    <Navigation />

    <!-- Main Content -->
    <main class="relative z-10 pt-20">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta?.transition || 'fade'" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Floating Create Button -->
    <FloatingButton
      v-if="showCreateButton"
      @click="handleCreateGoal"
      class="fixed bottom-8 right-8"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import Navigation from "./components/layout/Navigation.vue";
import FloatingButton from "./components/shared/FloatingButton.vue";
import { useGoalsStore } from "./stores/useGoals";

const route = useRoute();
const goalsStore = useGoalsStore();

const showCreateButton = computed(() => {
  const hideOnRoutes = ["login", "register", "forgot-password"];
  return !hideOnRoutes.includes(route.name as string);
});

const handleCreateGoal = () => {
  goalsStore.showCreateModal = true;
};

watch(route, () => {
  // Navigation side effects
});
</script>

<style>
/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
