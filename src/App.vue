<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-soft"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-soft" style="animation-delay: 1s"></div>
    </div>

    <AppHeader v-if="showHeader" />

    <div class="flex" :class="{ 'pt-16': showHeader }">
      <AppSidebar v-if="showSidebar" />
      
      <main class="flex-1 min-h-[calc(100vh-4rem)]">
        <router-view v-slot="{ Component }">
          <PageTransition>
            <component :is="Component" />
          </PageTransition>
        </router-view>
      </main>
    </div>

    <FloatingButton
      v-if="showFloatingButton"
      @click="uiStore.openCreateGoalModal"
      aria-label="Create goal"
    />
    
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import FloatingButton from '@/components/shared/FloatingButton.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'
import PageTransition from '@/components/shared/PageTransition.vue'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

// Initialize Stores
const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUIStore()
const { isAuthenticated } = storeToRefs(authStore)

/** * Auth pages where we want to hide navigation UI
 */
const authPages = ['login', 'register', 'forgot-password', 'terms']

/**
 * Logic to show/hide Header
 */
const showHeader = computed(() => {
  return isAuthenticated.value && !authPages.includes(route.name as string)
})

/**
 * Logic to show/hide Sidebar
 */
const showSidebar = computed(() => {
  return isAuthenticated.value && !authPages.includes(route.name as string)
})

/**
 * Logic for Dashboard Floating Action Button
 */
const showFloatingButton = computed(() => {
  return isAuthenticated.value && route.name === 'dashboard'
})

/**
 * IMPORTANT: Run Auth Check on App start
 * This keeps the user logged in after a page refresh
 */
onMounted(async () => {
  await authStore.checkAuth()
})
</script>

<style>
/* Ensure the page transition doesn't cause horizontal scrolling */
body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}
</style>