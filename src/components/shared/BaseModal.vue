<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        @click="close"
      ></div>

      <!-- Modal panel -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 p-6 shadow-2xl transition-all animate-fade-in"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
            <button
              @click="close"
              class="rounded-lg p-1 hover:bg-gray-700 transition"
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
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  title?: string;
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
