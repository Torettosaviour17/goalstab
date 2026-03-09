<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800/50"
  >
    <div class="flex justify-around items-center h-16">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center flex-1 h-full text-xs transition-colors"
        :class="
          $route.path === item.path
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

const navItems = computed(() => {
  const items = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Goals", path: "/goals", icon: "🎯" },
    { name: "Analytics", path: "/analytics", icon: "📈" },
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
