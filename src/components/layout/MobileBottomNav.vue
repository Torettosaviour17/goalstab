<template>
  <nav
    class="md:hidden fixed inset-x-0 bottom-0 z-[100] bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/70 shadow-[0_-12px_30px_rgba(0,0,0,0.35)] pb-[env(safe-area-inset-bottom)]"
  >
    <div class="flex items-center h-16 overflow-x-auto scrollbar-hide px-1">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center min-w-[72px] flex-1 h-full text-[11px] transition-colors"
        :class="
          isActive(item.path)
            ? 'text-primary-400'
            : 'text-gray-400 hover:text-white'
        "
      >
        <span class="text-xl mb-0.5">{{ item.icon }}</span>
        <span>{{ item.name }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

const route = useRoute();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const isActive = (path: string) => route.path === path || (path === "/goals" && route.path.startsWith("/goals/"));

const navItems = computed(() => {
  const items = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Goals", path: "/goals", icon: "🎯" },
    { name: "Transactions", path: "/transactions", icon: "💳" },
    { name: "Analytics", path: "/analytics", icon: "📈" },
    { name: "Accounts", path: "/accounts", icon: "🏦" },
  ];

  // Add Admin link only if user is admin
  if (user.value?.isAdmin) {
    items.push({ name: "Admin", path: "/admin", icon: "🛡️" });
  }

  // Settings always at the end
  items.push({ name: "Settings", path: "/settings", icon: "⚙️" });

  return items;
});
</script>
