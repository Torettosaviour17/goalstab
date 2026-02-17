<template>
  <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
    <div
      class="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-sm font-bold"
    >
      {{ initials }}
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-white truncate">{{ user.name }}</p>
      <p class="text-xs text-gray-400">{{ user.email }}</p>
    </div>
    <span class="text-xs px-2 py-1 rounded-full" :class="roleClass">
      {{ user.role }}
    </span>
    <button
      v-if="canRemove"
      @click="$emit('remove')"
      class="p-1 hover:bg-gray-700 rounded transition"
    >
      <span class="text-sm">✕</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SharedUser } from "@/types/goal";

const props = defineProps<{
  user: SharedUser;
  canRemove?: boolean;
}>();

defineEmits<{
  (e: "remove"): void;
}>();

const initials = computed(() => {
  return props.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const roleClass = computed(() => {
  const classes = {
    owner: "bg-primary-500/20 text-primary-300",
    contributor: "bg-success/20 text-success",
    viewer: "bg-gray-700 text-gray-300",
  };
  return classes[props.user.role];
});
</script>
