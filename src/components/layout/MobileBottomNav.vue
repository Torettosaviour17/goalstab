<template>
  <nav class="md:hidden fixed inset-x-0 bottom-0 z-[100] bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/70 shadow-[0_-12px_30px_rgba(0,0,0,0.35)] pb-[env(safe-area-inset-bottom)]">
    <div v-if="showMore" class="absolute right-2 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] w-52 rounded-2xl border border-gray-700 bg-gray-900/98 shadow-2xl p-2">
      <router-link v-for="item in moreItems" :key="item.path" :to="item.path" @click="showMore=false"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
        <span>{{ item.icon }}</span><span>{{ item.name }}</span>
      </router-link>
    </div>
    <div class="flex items-center h-14 px-1">
      <router-link v-for="item in navItems" :key="item.path" :to="item.path"
        class="flex flex-col items-center justify-center min-w-0 flex-1 h-full text-[9px] transition-colors"
        :class="isActive(item.path) ? 'text-primary-400' : 'text-gray-400 hover:text-white'">
        <span class="text-lg leading-none mb-0.5">{{ item.icon }}</span>
        <span class="truncate max-w-full px-1">{{ item.name }}</span>
      </router-link>
      <button @click="showMore = !showMore" class="flex flex-col items-center justify-center min-w-0 flex-1 h-full text-[9px]"
        :class="showMore ? 'text-primary-400' : 'text-gray-400'">
        <span class="text-lg leading-none mb-0.5">☰</span><span>More</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const showMore = ref(false);

const isActive = (path: string) => route.path === path || (path === "/goals" && route.path.startsWith("/goals/"));

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Goals", path: "/goals", icon: "🎯" },
  { name: "Transactions", path: "/transactions", icon: "💳" },
  { name: "Accounts", path: "/accounts", icon: "🏦" },
];

const moreItems = [
  { name: "Analytics", path: "/analytics", icon: "📈" },
  { name: "Settings", path: "/settings", icon: "⚙️" },
  { name: "Help & Support", path: "/help", icon: "❓" },
];
</script>
