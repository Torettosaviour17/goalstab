<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto pt-16 px-4"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 transition-opacity"
        :class="{ 'backdrop-blur-sm': blur }"
        @click.self="close"
      ></div>

      <!-- Modal panel -->
      <div
        class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 mb-4 shadow-2xl transition-all animate-fade-in"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
          <button
            @click="close"
            class="rounded-lg p-1 hover:bg-gray-700 transition"
            type="button"
          >
            <span class="text-xl text-gray-400 hover:text-white">✕</span>
          </button>
        </div>

        <!-- Content -->
        <div>
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  title?: string;
  blur?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}>();

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};
</script>
