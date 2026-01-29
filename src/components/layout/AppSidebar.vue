<template>
  <aside
    class="hidden md:block w-64 border-r border-gray-800/50 bg-gray-900/50"
  >
    <div class="p-6">
      <!-- User profile -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-12 h-12 rounded-full bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center"
          >
            <span class="text-xl font-bold text-white">U</span>
          </div>
          <div>
            <p class="font-medium text-white">Demo User</p>
            <p class="text-sm text-gray-400">Premium Account</p>
          </div>
        </div>

        <div class="bg-gray-800/50 rounded-xl p-4">
          <p class="text-sm text-gray-400 mb-1">Total Saved</p>
          <p class="text-2xl font-bold text-white">₦1.85M</p>
          <p class="text-xs text-green-400 mt-1">+12.5% this month</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="space-y-1">
        <router-link
          to="/"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
          :class="{
            'bg-primary-500/20 text-primary-300 border-l-4 border-primary-500':
              $route.path === '/',
            'text-gray-400 hover:text-white hover:bg-gray-800/50':
              $route.path !== '/',
          }"
        >
          <span class="text-lg">📊</span>
          Dashboard
        </router-link>

        <router-link
          to="/goals"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
          :class="{
            'bg-primary-500/20 text-primary-300 border-l-4 border-primary-500':
              $route.path === '/goals',
            'text-gray-400 hover:text-white hover:bg-gray-800/50':
              $route.path !== '/goals',
          }"
        >
          <span class="text-lg">🎯</span>
          Goals
        </router-link>

        <router-link
          to="/analytics"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
          :class="{
            'bg-primary-500/20 text-primary-300 border-l-4 border-primary-500':
              $route.path === '/analytics',
            'text-gray-400 hover:text-white hover:bg-gray-800/50':
              $route.path !== '/analytics',
          }"
        >
          <span class="text-lg">📈</span>
          Analytics
        </router-link>

        <router-link
          to="/settings"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
          :class="{
            'bg-primary-500/20 text-primary-300 border-l-4 border-primary-500':
              $route.path === '/settings',
            'text-gray-400 hover:text-white hover:bg-gray-800/50':
              $route.path !== '/settings',
          }"
        >
          <span class="text-lg">⚙️</span>
          Settings
        </router-link>
      </nav>

      <!-- Savings streak -->
      <div
        class="mt-8 p-4 bg-linear-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/50"
      >
        <div class="text-center">
          <div
            class="w-12 h-12 mx-auto mb-3 bg-linear-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center"
          >
            <span class="text-xl">🔥</span>
          </div>
          <h4 class="font-bold text-white mb-1">Savings Streak</h4>
          <p class="text-2xl font-bold text-yellow-400">42 days</p>
          <p class="text-xs text-gray-400 mt-1">Keep going! 🚀</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// Sidebar component
</script>
