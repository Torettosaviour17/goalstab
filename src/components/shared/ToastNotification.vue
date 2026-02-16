<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-3 p-4 rounded-xl shadow-2xl min-w-[300px] max-w-md"
          :class="toastClasses[toast.type]"
          @click="removeToast(toast.id)"
        >
          <span class="text-xl">{{ toastIcon[toast.type] }}</span>
          <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
          <button class="opacity-50 hover:opacity-100">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUIStore } from "@/stores/ui";

const uiStore = useUIStore();
const { toasts } = storeToRefs(uiStore);

const toastClasses = {
  success: "bg-success/20 border border-success/30 text-success",
  error: "bg-danger/20 border border-danger/30 text-danger",
  warning: "bg-warning/20 border border-warning/30 text-warning",
  info: "bg-primary-500/20 border border-primary-500/30 text-primary-300",
};

const toastIcon = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

const removeToast = (id: number) => {
  uiStore.removeToast(id);
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
