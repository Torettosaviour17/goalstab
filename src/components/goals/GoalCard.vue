<template>
  <div
    class="glass-card p-6 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div
        class="w-12 h-12 rounded-xl bg-linear-to-br flex items-center justify-center text-lg"
        :style="`background: linear-gradient(135deg, var(--tw-gradient-stops))`"
        :class="`from-${goal.color.split(' ')[1]} to-${goal.color.split(' ')[2]}`"
      >
        {{ goal.icon }}
      </div>
      <div
        v-if="goal.locked"
        class="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold"
      >
        Locked
      </div>
      <div
        v-else
        class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold"
      >
        Unlocked
      </div>
    </div>

    <!-- Title and Target -->
    <h3 class="text-lg font-bold mb-1">{{ goal.title }}</h3>
    <p class="text-sm text-gray-400 mb-4">
      Target: {{ formatNumber(goal.target) }}
    </p>

    <!-- Progress Bar -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-gray-400">Progress</span>
        <span class="text-sm font-semibold">{{ goal.progress }}%</span>
      </div>
      <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          class="h-full bg-linear-to-r from-primary to-secondary transition-all duration-500"
          :style="{ width: `${goal.progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Saved Amount -->
    <div class="mb-4 grow">
      <p class="text-2xl font-bold">{{ formatNumber(goal.saved) }}</p>
      <p class="text-xs text-gray-400">of {{ formatNumber(goal.target) }}</p>
    </div>

    <!-- Auto Save Info -->
    <div class="bg-white/5 rounded-lg p-3 mb-4 text-xs text-gray-400">
      <p>
        <span v-if="goal.type === 'percentage'"
          >{{ goal.autoSave }}% of income</span
        >
        <span v-else>{{ formatNumber(goal.autoSave) }}</span>
        per {{ goal.frequency }}
      </p>
    </div>

    <!-- Deadline -->
    <p class="text-xs text-gray-400 mb-4">
      Due: {{ formatDate(goal.deadline) }}
    </p>

    <!-- Actions -->
    <div class="flex gap-2 mt-auto">
      <button
        @click.stop="emit('add-funds')"
        class="flex-1 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition text-sm font-medium"
      >
        Add Funds
      </button>
      <button
        v-if="goal.progress >= 100"
        @click.stop="emit('withdraw')"
        class="flex-1 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition text-sm font-medium"
      >
        Withdraw
      </button>
      <button
        v-else
        disabled
        class="flex-1 px-4 py-2 bg-white/5 text-gray-500 rounded-lg opacity-50 cursor-not-allowed text-sm font-medium"
      >
        Complete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Goal {
  id: string;
  title: string;
  target: number;
  saved: number;
  icon: string;
  color: string;
  type: "percentage" | "fixed";
  autoSave: number;
  frequency: "weekly" | "monthly" | "yearly";
  deadline: string;
  locked: boolean;
  progress: number;
  lastUpdated: string;
  createdAt: string;
}

interface Props {
  goal: Goal;
  index?: number;
}

defineProps<Props>();

const emit = defineEmits<{
  "add-funds": [];
  withdraw: [];
}>();

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
