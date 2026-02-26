<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
    <div class="container mx-auto px-4 md:px-6">
      <div class="flex items-center justify-between h-16">
        
        <div class="flex items-center gap-3">
          <router-link to="/" class="flex items-center gap-3 group">
            <div class="w-9 h-9 rounded-lg bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <span class="text-lg font-bold text-white">GT</span>
            </div>
            <div>
              <h1 class="text-lg font-bold text-white tracking-tight">GoalTabs</h1>
              <p class="text-xs text-gray-400 hidden md:block">Smart Savings Platform</p>
            </div>
          </router-link>
          <span class="px-2 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-medium hidden md:block">Beta</span>
        </div>

        <nav class="hidden md:flex items-center gap-1">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
            :class="$route.path === link.path ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'"
          >
            <span class="text-lg">{{ link.icon }}</span> {{ link.name }}
          </router-link>
        </nav>

        <div class="flex items-center gap-3">
          
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

          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-800/50 transition border border-transparent"
              :class="{ 'border-gray-700 bg-gray-800/50': showUserMenu }"
            >
              <div class="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-inner">
                <span class="text-sm font-bold text-white">{{ userInitials }}</span>
              </div>
              <div class="hidden md:block text-left">
                <p class="text-sm font-medium text-white leading-tight">{{ userName }}</p>
                <p class="text-[10px] uppercase tracking-wider text-primary-400 font-bold">{{ userPlan }}</p>
              </div>
              <svg
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': showUserMenu }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition name="fade-slide">
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-56 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
              >
                <div class="px-4 py-3 border-b border-gray-700/50 bg-white/5">
                  <p class="text-xs text-gray-400">Signed in as</p>
                  <p class="text-sm font-medium text-white truncate">{{ userEmail }}</p>
                </div>
                
                <router-link
                  to="/settings"
                  @click="closeUserMenu"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-gray-300 hover:text-white"
                >
                  <span>⚙️</span> Settings
                </router-link>

                <div class="border-t border-gray-700/50 mt-1 pt-1">
                  <button
                    @click="handleLogout"
                    class="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/10 transition text-red-400 font-medium"
                  >
                    <span>🚪</span> Sign out
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition"
          >
            <span class="text-xl">{{ mobileMenuOpen ? "✕" : "☰" }}</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="md:hidden bg-gray-900 border-t border-gray-800/50 animate-slide-down"
    >
      <div class="px-4 py-4 space-y-2">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          @click="closeMobileMenu"
          class="flex items-center gap-4 px-4 py-3 rounded-xl transition"
          :class="$route.path === link.path ? 'bg-primary-500/20 text-white' : 'text-gray-400 hover:bg-white/5'"
        >
          <span class="text-xl">{{ link.icon }}</span> {{ link.name }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const showUserMenu = ref(false)
const mobileMenuOpen = ref(false)
const hasUnreadNotifications = ref(true)

// Navigation Config
const navLinks = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Goals', path: '/goals', icon: '🎯' },
  { name: 'Analytics', path: '/analytics', icon: '📈' },
  { name: 'Settings', path: '/settings', icon: '⚙️' }
]

// Computed User Data
const userName = computed(() => user.value?.name || 'User')
const userEmail = computed(() => user.value?.email || 'user@example.com')
const userPlan = computed(() => user.value?.isPremium ? 'Premium' : 'Free')
const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .filter(n => n)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// UI Actions
const toggleUserMenu = () => (showUserMenu.value = !showUserMenu.value)
const closeUserMenu = () => (showUserMenu.value = false)
const toggleMobileMenu = () => (mobileMenuOpen.value = !mobileMenuOpen.value)
const closeMobileMenu = () => (mobileMenuOpen.value = false)

const handleLogout = () => {
  closeUserMenu()
  authStore.logout()
  router.push('/login')
}

// Global Event Listeners
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeUserMenu()
    closeMobileMenu()
  }
}

onMounted(() => document.addEventListener('keydown', handleEscapeKey))
onUnmounted(() => document.removeEventListener('keydown', handleEscapeKey))
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.2s ease-out;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-down {
  animation: slide-down 0.3s ease-out forwards;
}
</style>