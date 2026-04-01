import { ref, onUnmounted } from "vue";

export function useDebouncedLoading(threshold = 200) {
  const loading = ref(true);
  const showSkeleton = ref(false);
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const startLoading = () => {
    loading.value = true;
    timeout = setTimeout(() => {
      showSkeleton.value = true;
    }, threshold);
  };

  const finishLoading = () => {
    loading.value = false;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    showSkeleton.value = false;
  };

  onUnmounted(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });

  return {
    loading,
    showSkeleton,
    startLoading,
    finishLoading,
  };
}
