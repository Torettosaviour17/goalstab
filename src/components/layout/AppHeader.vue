<template>
  <header
    class="sticky top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50"
  >
    <div class="container mx-auto px-4 md:px-6">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <router-link to="/dashboard" class="flex items-center group">
            <img
              src="@/assets/goaltab-logo.png"
              alt="GoalTabs"
              class="w-9 h-9 rounded-lg object-contain group-hover:scale-110 transition-transform duration-300 shadow-lg"
            />
            <div class="ml-3">
              <h1 class="text-lg font-bold text-white tracking-tight">
                GoalTabs
              </h1>
              <p class="text-xs text-gray-400 hidden md:block">
                Smart Savings Platform
              </p>
            </div>
          </router-link>
          <span
            class="px-2 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-medium hidden md:block"
            >Beta</span
          >
        </div>

        <div class="flex items-center gap-3">
          <NotificationBell />

          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-800/50 transition border border-transparent"
              :class="{ 'border-gray-700 bg-gray-800/50': showUserMenu }"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shadow-inner"
                :class="{
                  'bg-linear-to-br from-primary-500 to-secondary-500':
                    !userAvatar,
                }"
              >
                <img
                  v-if="userAvatar"
                  :src="userAvatar"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-sm font-bold text-white">{{
                  userInitials
                }}</span>
              </div>
              <div class="hidden md:block text-left">
                <p class="text-sm font-medium text-white leading-tight">
                  {{ userName }}
                </p>
                <p
                  class="text-[10px] uppercase tracking-wider text-primary-400 font-bold"
                >
                  {{ userPlan }}
                </p>
              </div>
              <svg
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': showUserMenu }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <transition name="fade-slide">
              <div
                v-if="showUserMenu"
                v-click-outside="closeUserMenu"
                class="absolute right-0 mt-2 w-56 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
              >
                <div class="px-4 py-3 border-b border-gray-700/50 bg-white/5">
                  <p class="text-xs text-gray-400">Signed in as</p>
                  <p class="text-sm font-medium text-white truncate">
                    {{ userEmail }}
                  </p>
                </div>

                <router-link
                  to="/settings"
                  @click="closeUserMenu"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-gray-300 hover:text-white"
                >
                  <span>⚙️</span> Settings
                </router-link>

                <router-link
                  to="/help"
                  @click="closeUserMenu"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-gray-300 hover:text-white"
                >
                  <span>❓</span> Help & Support
                </router-link>

                <router-link
                  v-if="user?.isAdmin"
                  to="/admin"
                  @click="closeUserMenu"
                  class="md:hidden flex items-center gap-3 px-4 py-3 hover:bg-primary-500/10 transition text-primary-300 hover:text-primary-200"
                >
                  <span>🛡️</span> Admin Dashboard
                </router-link>

                <div
                  class="border-t border-gray-700/50 mt-1 pt-1"
                >
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
        </div>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="logout-modal">
      <div
        v-if="showLogoutConfirm"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
        role="presentation"
        @click.self="cancelLogout"
      >
        <section
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
          class="w-full max-w-sm overflow-hidden rounded-3xl border border-gray-700/80 bg-gray-900 shadow-2xl shadow-black/40"
        >
          <div class="flex justify-center pt-7">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300">
              <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M10 17l5-5-5-5M15 12H3m9-7h5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          <div class="px-6 pb-6 pt-5 text-center">
            <h2 id="logout-dialog-title" class="text-lg font-bold text-white">Ready to sign out?</h2>
            <p id="logout-dialog-description" class="mt-2 text-sm leading-6 text-gray-400">
              Are you sure you want to log out of GoalTabs? Your savings progress is safe, and you can sign back in anytime.
            </p>
            <div class="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                autofocus
                @click="cancelLogout"
                class="rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-200 transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Stay signed in
              </button>
              <button
                type="button"
                @click="confirmLogout"
                class="rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Yes, log out
              </button>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import NotificationBell from "@/components/notifications/NotificationBell.vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const showUserMenu = ref(false);
const showLogoutConfirm = ref(false);

const userName = computed(() => user.value?.name || "User");
const userEmail = computed(() => user.value?.email || "user@example.com");
const userPlan = computed(() => (user.value?.isPremium ? "Premium" : "Free"));
const userAvatar = computed(() => user.value?.avatar || null);
const userInitials = computed(() => {
  if (!user.value?.name) return "U";
  return user.value.name
    .split(" ")
    .filter((n) => n)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const toggleUserMenu = () => (showUserMenu.value = !showUserMenu.value);
const closeUserMenu = () => (showUserMenu.value = false);

const handleLogout = () => {
  closeUserMenu();
  showLogoutConfirm.value = true;
};

const cancelLogout = () => {
  showLogoutConfirm.value = false;
};

const confirmLogout = () => {
  showLogoutConfirm.value = false;
  authStore.logout();
  void router.push("/login");
};

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key !== "Escape") return;

  if (showLogoutConfirm.value) {
    cancelLogout();
    return;
  }

  closeUserMenu();
};

onMounted(() => document.addEventListener("keydown", handleEscapeKey));
onUnmounted(() => document.removeEventListener("keydown", handleEscapeKey));
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease-out;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.logout-modal-enter-active,
.logout-modal-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.logout-modal-enter-active section,
.logout-modal-leave-active section {
  transition: transform 180ms ease, opacity 180ms ease;
}

.logout-modal-enter-from,
.logout-modal-leave-to {
  opacity: 0;
}

.logout-modal-enter-from section,
.logout-modal-leave-to section {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .logout-modal-enter-active,
  .logout-modal-leave-active,
  .logout-modal-enter-active section,
  .logout-modal-leave-active section {
    transition: none;
  }
}
</style>
