<template>
  <div
    v-if="visible"
    class="mb-6 glass-card p-4 flex items-center justify-between animate-slide-down"
    role="alert"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center"
      >
        <span class="text-xl">👋</span>
      </div>

      <div>
        <h3 class="font-semibold text-white">
          {{ greeting }}, {{ userName }}!
        </h3>

        <p class="text-sm text-gray-300">
          {{ message }}
        </p>
      </div>
    </div>

    <button
      @click="dismiss"
      class="p-2 hover:bg-gray-700 rounded-lg transition"
      aria-label="Dismiss"
    >
      <span class="text-gray-400 hover:text-white">✕</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{
  userName: string;
}>();

const uiStore = useUIStore();
const visible = ref(false);

const STORAGE_KEY = "goaltabs_welcome_banner_last_shown";
const FIRST_VISIT_KEY = "goaltabs_first_visit";

/* -----------------------------
   TIME BASED GREETING
------------------------------*/
const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const greeting = computed(() => getGreeting());

/* -----------------------------
   FIRST TIME CHECK
------------------------------*/
const isFirstVisit = () => {
  return !localStorage.getItem(FIRST_VISIT_KEY);
};

/* -----------------------------
   DAILY CHECK
------------------------------*/
const getToday = () => new Date().toDateString();

const hasSeenToday = () => {
  const last = localStorage.getItem(STORAGE_KEY);
  return last === getToday();
};

const markSeenToday = () => {
  localStorage.setItem(STORAGE_KEY, getToday());
};

const markFirstVisit = () => {
  localStorage.setItem(FIRST_VISIT_KEY, "true");
};

/* -----------------------------
   MESSAGE LOGIC
------------------------------*/
const message = computed(() => {
  if (isFirstVisit()) {
    return "Welcome to GoalTabs 🚀 Let’s build your first savings goal!";
  }

  return "Ready to continue your savings journey ✨";
});

/* -----------------------------
   DISMISS
------------------------------*/
const dismiss = () => {
  visible.value = false;
  uiStore.welcomeBannerShown = true;
  markSeenToday();
};

/* -----------------------------
   INIT
------------------------------*/
onMounted(() => {
  if (uiStore.welcomeBannerShown) return;

  const firstVisit = isFirstVisit();
  const todaySeen = hasSeenToday();

  // show if:
  // - first time user OR
  // - not seen today
  if (firstVisit || !todaySeen) {
    visible.value = true;

    markSeenToday();
    if (firstVisit) markFirstVisit();
  }

  // auto close after 5s
  const timer = setTimeout(() => {
    if (visible.value) dismiss();
  }, 5000);

  return () => clearTimeout(timer);
});
</script>

<style scoped>
.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
