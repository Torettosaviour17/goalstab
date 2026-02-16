<template>
  <button
    @click="$emit('click')"
    class="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-2xl z-50 bg-linear-to-br from-primary-500 to-primary-600 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] active:shadow-inner hover:scale-110 active:scale-95 transition-all duration-300 animate-float"
    :aria-label="ariaLabel"
  >
    <slot>＋</slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  ariaLabel?: string;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>
