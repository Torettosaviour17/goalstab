<template>
  <div class="glass-card p-5 hover:bg-white/[0.08] transition-all duration-300 group cursor-default">
    <div class="flex items-center gap-4">
      <div
        :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg',
          color || 'bg-gray-800 text-white'
        ]"
      >
        {{ icon }}
      </div>

      <div class="min-w-0 flex-1">
        <p class="text-sm opacity-60 truncate font-medium tracking-wide">{{ title }}</p>
        <div class="flex items-center gap-2">
          <p class="text-2xl font-bold text-white truncate">
            {{ suffix ? `${value}${suffix}` : value }}
          </p>
          
          <span
            v-if="trend"
            :class="[
              'text-[10px] md:text-xs px-2 py-1 rounded-full flex-shrink-0 font-bold',
              trend.startsWith('+') 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            ]"
          >
            {{ trend }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * StatCard Props
 * @param title - The label (e.g., "Total Savings")
 * @param value - The numerical or string value
 * @param icon - Emoji or Icon character
 * @param trend - Percentage change (e.g., "+12%")
 * @param color - Tailwind background/text classes for the icon container
 * @param suffix - Optional unit (e.g., "k", "M", "NGN")
 */
defineProps<{
  title: string
  value: string | number
  icon: string
  trend?: string
  color?: string
  suffix?: string
}>()
</script>

<style scoped>
/**
 * Glassmorphism effect 
 * In Tailwind v4, we use standard CSS properties here to avoid 
 * "@apply unknown utility" errors when @reference is missing.
 */
.glass-card {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem; /* Equivalent to rounded-2xl */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}
</style>  