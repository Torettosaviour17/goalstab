<template>
  <div class="glass-card p-6 hover:bg-white/[0.08] transition-all duration-300">
    <div class="flex items-center gap-4 mb-4">
      <div
        :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center text-xl',
          color,
        ]"
      >
        {{ icon }}
      </div>
      <div>
        <p class="text-sm opacity-60">{{ title }}</p>
        <div class="flex items-center gap-2">
          <p class="text-2xl font-bold">
            {{ suffix ? `${value}${suffix}` : value }}
          </p>
          <span
            v-if="trend"
            :class="[
              'text-xs px-2 py-1 rounded-full',
              trend.startsWith('+')
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400',
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
defineProps<{
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  color?: string;
  suffix?: string;
}>();
</script>
