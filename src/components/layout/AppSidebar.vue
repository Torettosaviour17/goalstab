<template>
  <aside class="hidden md:block w-64 shrink-0 border-r border-gray-800/50 bg-gray-900/50 min-h-[calc(100vh-4rem)]">
    <div class="p-6 sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-lg shrink-0"
            :class="{ 'bg-linear-to-br from-primary-500 to-secondary-500': !userAvatar }"
          >
            <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else class="text-xl font-bold text-white">{{ userInitials }}</span>
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
            <span
              class="text-xs font-medium"
              :class="overview.monthlyGrowth >= 0 ? 'text-green-400' : 'text-red-400'"
            >
              {{ overview.monthlyGrowth >= 0 ? "+" : "" }}{{ overview.monthlyGrowth.toFixed(1) }}%
            </span>
            <span class="text-[10px] text-gray-500">monthly savings growth</span>
          </div>
        </div>
      </div>

      <nav class="space-y-1">
        <router-link
          v-for="link in navItems"
          :key="link.path"
          :to="link.path"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
          :class="isActive(link.path)
            ? 'bg-primary-500/10 text-primary-400 border-l-4 border-primary-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">{{ link.icon }}</span>
          <span class="font-medium">{{ link.name }}</span>
        </router-link>
      </nav>

      <div class="mt-10 p-5 bg-gray-800/50 rounded-2xl border border-gray-700/30">
        <div class="text-center">
          <div class="w-12 h-12 mx-auto mb-3 bg-primary-500/10 rounded-full flex items-center justify-center">
            <span class="text-xl">🎯</span>
          </div>
          <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Goals in progress</h4>
          <p class="text-2xl font-black text-primary-400">{{ activeGoalsCount }}</p>
          <p class="text-[10px] text-gray-500 mt-2">Keep building your savings plan.</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useGoalsStore } from "@/stores/goals";
import { useAnalyticsStore } from "@/stores/analytics";

const authStore = useAuthStore();
const goalsStore = useGoalsStore();
const analyticsStore = useAnalyticsStore();
const { user } = storeToRefs(authStore);
const { totalSaved, activeGoalsCount } = storeToRefs(goalsStore);
const { overview } = storeToRefs(analyticsStore);

const navItems = computed(() => {
  const baseItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Goals", path: "/goals", icon: "🎯" },
    { name: "Analytics", path: "/analytics", icon: "📈" },
    { name: "Transactions", path: "/transactions", icon: "💳" },
    { name: "Accounts", path: "/accounts", icon: "🏦" },
  ];
  if (user.value?.isAdmin) baseItems.push({ name: "Admin", path: "/admin", icon: "🛡️" });
  baseItems.push({ name: "Settings", path: "/settings", icon: "⚙️" });
  return baseItems;
});

const isActive = (path: string) =>
  routePath.value === path || (path === "/goals" && routePath.value.startsWith("/goals/"));

import { useRoute } from "vue-router";
const route = useRoute();

const userName = computed(() => user.value?.name || "Guest User");
const userPlan = computed(() => (user.value?.isPremium ? "Premium" : "Free"));
const userAvatar = computed(() => user.value?.avatar || null);
const userInitials = computed(() =>
  user.value?.name
    ? user.value.name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?",
);

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return new Intl.NumberFormat().format(num);
};
</script>
