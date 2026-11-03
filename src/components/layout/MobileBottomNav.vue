<template>
  <nav aria-label="Mobile navigation" class="md:hidden fixed inset-x-0 bottom-0 z-[100] bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/70 shadow-[0_-12px_30px_rgba(0,0,0,0.35)] pb-[env(safe-area-inset-bottom)]">
    <div class="flex items-center h-14 px-1">
      <router-link v-for="item in navItems" :key="item.path" :to="item.path"
        class="flex flex-col items-center justify-center min-w-0 flex-1 h-full text-[9px] transition-colors"
        :class="isActive(item.path) ? 'text-primary-400' : 'text-gray-400 hover:text-white'">
        <span class="text-lg leading-none mb-0.5">{{ item.icon }}</span>
        <span class="truncate max-w-full px-1">{{ item.name }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
const isActive = (path: string) => route.path === path || (path === "/goals" && route.path.startsWith("/goals/"));
const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Goals", path: "/goals", icon: "🎯" },
  { name: "Wallet", path: "/wallet", icon: "💳" },
  { name: "Accounts", path: "/accounts", icon: "🏦" },
  { name: "Analytics", path: "/analytics", icon: "📈" },
];
</script>
