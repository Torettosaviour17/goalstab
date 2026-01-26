<template>
  <button
    @click="emit('click')"
    class="fixed bottom-8 right-8 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-2xl z-50 bg-linear-to-br from-primary to-primary-dark hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] active:shadow-inner hover:scale-110 active:scale-95 transition-all duration-300 animate-float"
    :class="customClass"
  >
    {{ icon }}
  </button>
</template>

<script setup lang="ts">
interface Props {
  icon?: string;
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: "＋",
  customClass: "",
});

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<script setup lang="ts">
interface Props {
  icon?: string;
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: "＋",
  customClass: "",
});

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>
