<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div
      class="w-20 h-20 mb-4 rounded-full bg-gray-800 flex items-center justify-center"
    >
      <span class="text-3xl">{{ icon }}</span>
    </div>
    <h3 class="text-xl font-bold text-white mb-2">{{ title }}</h3>
    <p class="text-gray-400 mb-6 max-w-md">{{ description }}</p>
    <slot>
      <BaseButton @click="$emit('action')">
        {{ actionLabel }}
      </BaseButton>
    </slot>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/shared/BaseButton.vue";

defineProps<{
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
}>();

defineEmits<{
  (e: "action"): void;
}>();
</script>
