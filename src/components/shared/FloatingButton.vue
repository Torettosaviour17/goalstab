<template>
  <button
    @click="$emit('click')"
    class="fixed bottom-8 right-8 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-2xl z-50 bg-linear-to-br from-[#3b82f6] to-[#1d4ed8] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] active:shadow-inner hover:scale-110 active:scale-95 transition-all duration-300 animate-float"
  >
    {{ icon }}
  </button>
</template>

<script setup lang="ts">
interface Props {
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: "＋",
});

defineEmits<{
  (e: "click"): void;
}>();
</script>
