<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 overflow-y-auto"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 transition-opacity"
        :class="{ 'backdrop-blur-sm': blur }"
        @click="close"
      ></div>

      <!-- Modal container -->
      <div class="flex min-h-full items-center justify-center p-6">
        <div
          class="relative w-full transform rounded-2xl bg-gray-800 border border-gray-700 shadow-2xl animate-fade-in"
          :style="{ maxWidth: computedMaxWidth }"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-700">
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

          <!-- Scrollable content -->
          <div class="max-h-[70vh] overflow-y-auto p-6">
            <slot />
          </div>

        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: boolean
  title?: string
  blur?: boolean
  maxWidth?: number
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "close"): void
}>()

const close = () => {
  emit("update:modelValue", false)
  emit("close")
}

const computedMaxWidth = computed(() =>
  props.maxWidth ? `${props.maxWidth}px` : "448px"
)
</script>