<template>
  <div class="md:hidden">
    <button
      @click="isOpen = !isOpen"
      class="p-2 rounded-lg bg-white/10"
      aria-label="Toggle menu"
      :aria-expanded="isOpen"
    >
      <span class="text-xl">{{ isOpen ? "✕" : "☰" }}</span>
    </button>

    <Teleport to="body">
      <transition name="mobile-menu">
        <div v-if="isOpen" class="fixed inset-0 z-[110] md:hidden">
          <button
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close menu"
            @click="closeMenu"
          />

          <aside
            class="absolute top-0 right-0 h-[100dvh] w-[min(22rem,90vw)] overflow-y-auto overscroll-contain bg-gray-900 border-l border-gray-800 shadow-2xl p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))]"
          >
            <div class="flex items-center justify-between mb-6">
              <div>
                <p class="text-white font-semibold">GoalTabs</p>
                <p class="text-xs text-gray-400">Navigation</p>
              </div>
              <button @click="closeMenu" class="p-2 rounded-lg hover:bg-white/10" aria-label="Close menu">✕</button>
            </div>

            <nav class="space-y-2">
              <router-link
                v-for="item in navItems"
                :key="item.path"
                :to="item.path"
                @click="closeMenu"
                class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
                :class="isActive(item.path) ? 'bg-primary-500/15 text-primary-300' : 'text-gray-300 hover:bg-white/5'"
              >
                <span class="text-lg">{{ item.icon }}</span>
                <span class="font-medium">{{ item.name }}</span>
              </router-link>
            </nav>

            <div v-if="isAuthenticated" class="border-t border-white/10 mt-6 pt-6 space-y-2">
              <div class="px-4 pb-3">
                <p class="text-white font-medium truncate">{{ user?.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
              </div>
              <router-link to="/settings" @click="closeMenu" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5">
                <span>⚙️</span><span>Settings</span>
              </router-link>
              <button @click="handleLogout" class="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-white/5">
                <span>🚪</span><span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const isOpen = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);

const navItems = computed(() => {
  const items = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Goals", path: "/goals", icon: "🎯" },
    { name: "Transactions", path: "/transactions", icon: "💳" },
    { name: "Analytics", path: "/analytics", icon: "📈" },
    { name: "Accounts", path: "/accounts", icon: "🏦" },
    { name: "Help", path: "/help", icon: "❓" },
  ];
  if (user.value?.isAdmin) items.push({ name: "Admin", path: "/admin", icon: "🛡️" });
  return items;
});

const isActive = (path: string) =>
  route.path === path || (path === "/goals" && route.path.startsWith("/goals/"));

const closeMenu = () => {
  isOpen.value = false;
};

const handleLogout = () => {
  closeMenu();
  authStore.logout();
  router.push("/login");
};

watch(isOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 180ms ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}
</style>