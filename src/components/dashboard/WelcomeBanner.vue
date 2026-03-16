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
        <h3 class="font-semibold text-white">Welcome back, {{ userName }}!</h3>
        <p class="text-sm text-gray-300">
          Ready to continue your savings journey✨?
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
import { ref, onMounted } from "vue";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{
  userName: string;
}>();

const uiStore = useUIStore();
const visible = ref(!uiStore.welcomeBannerShown);

const dismiss = () => {
  visible.value = false;
  uiStore.welcomeBannerShown = true;
};

onMounted(() => {
  const timer = setTimeout(() => {
    if (visible.value) {
      dismiss();
    }
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
