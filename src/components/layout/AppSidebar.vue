<template>
  <aside 
    class="hidden md:block w-64 border-r border-gray-800/50 bg-gray-900/50 min-h-[calc(100vh-4rem)]"
  >
    <div class="p-6 sticky top-16">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
            <span class="text-xl font-bold text-white">{{ userInitials }}</span>
          </div>
          <div class="overflow-hidden">
            <p class="font-medium text-white truncate">{{ userName }}</p>
            <p class="text-xs text-gray-400">{{ userPlan }} Account</p>
          </div>
        </div>
        
        <div class="bg-gray-800/40 backdrop-blur-md rounded-2xl p-4 border border-white/5">
          <p class="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">Total Saved</p>
          <p class="text-2xl font-bold text-white">₦{{ formatNumber(totalSaved) }}</p>
          <div class="flex items-center gap-1 mt-1">
            <span class="text-xs text-green-400 font-medium">+12.5%</span>
            <span class="text-[10px] text-gray-500">this month</span>
          </div>
        </div>
      </div>

      <nav class="space-y-1">
        <router-link
          v-for="link in navItems"
          :key="link.path"
          :to="link.path"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
          :class="[
            $route.path === link.path 
              ? 'bg-primary-500/10 text-primary-400 border-l-4 border-primary-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          ]"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">{{ link.icon }}</span>
          <span class="font-medium">{{ link.name }}</span>
        </router-link>
      </nav>

      <div class="mt-10 p-5 bg-linear-to-br from-gray-800/80 to-gray-900/80 rounded-2xl border border-gray-700/30 relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 w-16 h-16 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors"></div>
        
        <div class="text-center relative z-10">
          <div class="w-12 h-12 mx-auto mb-3 bg-linear-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-900/20">
            <span class="text-xl">🔥</span>
          </div>
          <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Savings Streak</h4>
          <p class="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">
            42 days
          </p>
          <p class="text-[10px] text-gray-500 mt-2 italic">Don't break the chain! 🚀</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useGoalsStore } from '@/stores/goals'

const authStore = useAuthStore()
const goalsStore = useGoalsStore()
const { user } = storeToRefs(authStore)
const { totalSaved } = storeToRefs(goalsStore)

const navItems = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Goals', path: '/goals', icon: '🎯' },
  { name: 'Analytics', path: '/analytics', icon: '📈' },
  { name: 'Settings', path: '/settings', icon: '⚙️' }
]

const userName = computed(() => user.value?.name || 'Guest User')
const userPlan = computed(() => user.value?.isPremium ? 'Premium' : 'Free')
const userInitials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .filter(n => n)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return new Intl.NumberFormat().format(num)
}
</script>