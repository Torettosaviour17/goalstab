<template>
  <div class="glass-card p-5 hover:bg-white/[0.08] transition-all duration-300">
    <div class="flex items-center gap-3">
      <div
        :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
          color,
        ]"
      >
        {{ icon }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm opacity-60">{{ title }}</p>
        <div class="flex items-center gap-2 flex-wrap">
          <p class="text-xl sm:text-2xl font-bold text-white break-all">
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
