import { defineStore } from "pinia";
import { ref } from "vue";

export const useUIStore = defineStore("ui", () => {
  const globalLoading = ref(false);
  const showNotifications = ref(false);

  const setGlobalLoading = (loading: boolean) => {
    globalLoading.value = loading;
  };

  const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
  };

  return {
    globalLoading,
    showNotifications,
    setGlobalLoading,
    toggleNotifications,
  };
});
