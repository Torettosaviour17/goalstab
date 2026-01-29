<template>
  <div
    :class="[
      'glass-card overflow-hidden',
      paddingClasses,
      {
        'cursor-pointer hover:scale-[1.02] transition-transform duration-300': clickable,
        'animate-fade-in': animate
      }
    ]"
    @click="handleClick"
  >
    <!-- Header slot -->
    <div v-if="$slots.header || title" class="border-b border-gray-800/50 pb-4 mb-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 v-if="title" class="text-lg font-semibold text-white">{{ title }}</h3>
          <p v-if="subtitle" class="text-sm text-gray-400 mt-1">{{ subtitle }}</p>
        </div>
        <slot name="header" />
      </div>
    </div>

    <!-- Content -->
    <div :class="contentClasses">
      <slot />
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="border-t border-gray-800/50 pt-4 mt-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  clickable?: boolean
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  clickable: false,
  animate: true
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const paddingClasses = computed(() => {
  const padding = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
  return padding[props.padding]
})

const contentClasses = computed(() => {
  return props.padding === 'none' ? '' : 'mt-2'
})

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>