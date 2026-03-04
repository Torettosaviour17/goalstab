<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="top: 64px;"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50 transition-opacity z-0"
        :class="{ 'backdrop-blur-sm': blur }"
        @click="close"
      ></div>

      <!-- Modal panel -->
      <div
        class="relative z-10 w-full mx-4 transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 p-6 shadow-2xl transition-all animate-fade-in"
        :style="{ maxWidth: computedMaxWidth }"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">
            {{ title }}
          </h3>

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
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
  blur?: boolean
  maxWidth?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Clean computed fallback instead of inline ternary chaos
const computedMaxWidth = computed(() =>
  props.maxWidth ? `${props.maxWidth}px` : '448px'
)
</script>