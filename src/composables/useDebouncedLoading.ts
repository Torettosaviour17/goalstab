import { ref, onUnmounted } from "vue";

export function useDebouncedLoading(threshold = 800) {
  const loading = ref(false);
  const showSkeleton = ref(false);
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const clearPendingTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const startLoading = () => {
    clearPendingTimeout();
    loading.value = true;
    showSkeleton.value = false;

    // Delay only the appearance of the skeleton to avoid a flash on fast
    // requests. It never delays completion or controls how long loading lasts.
    timeout = setTimeout(() => {
      if (loading.value) showSkeleton.value = true;
      timeout = null;
    }, Math.max(0, threshold));
  };

  const finishLoading = () => {
    loading.value = false;
    clearPendingTimeout();
    showSkeleton.value = false;
  };

  onUnmounted(clearPendingTimeout);

  return {
    loading,
    showSkeleton,
    startLoading,
    finishLoading,
  };
}
