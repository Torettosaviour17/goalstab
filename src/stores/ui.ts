import { defineStore } from "pinia";
import { ref } from "vue";

export interface Toast {
  id: number;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export const useUIStore = defineStore("ui", () => {
  const globalLoading = ref(false);
  const showCreateGoalModal = ref(false);
  const toasts = ref<Toast[]>([]);
  const authChecking = ref(true);
  const welcomeBannerShown = ref(false);

  let nextToastId = 0;

  const setAuthChecking = (value: boolean) => {
    authChecking.value = value;
  };

  const setGlobalLoading = (loading: boolean) => {
    globalLoading.value = loading;
  };

  const openCreateGoalModal = () => {
    showCreateGoalModal.value = true;
  };

  const closeCreateGoalModal = () => {
    showCreateGoalModal.value = false;
  };

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = nextToastId++;

    const newToast = {
      ...toast,
      id,
    };

    toasts.value.push(newToast);

    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return {
    globalLoading,
    showCreateGoalModal,
    toasts,
    authChecking,
    welcomeBannerShown,
    setAuthChecking,
    setGlobalLoading,
    openCreateGoalModal,
    closeCreateGoalModal,
    addToast,
    removeToast,
  };
});