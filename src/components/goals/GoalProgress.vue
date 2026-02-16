<template>
  <div class="space-y-2">
    <div class="flex justify-between text-sm">
      <span class="text-gray-400">{{ label }}</span>
      <span class="font-semibold text-white">{{ value }}%</span>
    </div>
    <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500"
        :class="colorClass"
        :style="{ width: `${value}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  value: number;
  label?: string;
  color?: "primary" | "success" | "warning" | "danger";
}

const props = withDefaults(defineProps<Props>(), {
  label: "Progress",
  color: "primary",
});

const colorClass = computed(() => {
  const colors = {
    primary: "bg-primary-500",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  };
  return colors[props.color];
});
</script>
