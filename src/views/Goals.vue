<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">All Goals</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="goal in goals"
        :key="goal.id"
        class="glass-card p-6 hover:bg-white/[0.08] transition-all duration-300"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-br',
                goal.color,
              ]"
            >
              {{ goal.icon }}
            </div>
            <div>
              <h3 class="text-lg font-semibold">{{ goal.title }}</h3>
              <p class="text-sm opacity-60">
                {{
                  goal.type === "percentage"
                    ? `${goal.autoSave}% weekly`
                    : `₦${formatNumber(goal.autoSave)} monthly`
                }}
              </p>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="opacity-60">Progress</span>
            <span class="font-semibold">{{ goal.progress }}%</span>
          </div>
          <div class="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              :class="[
                'h-full rounded-full transition-all duration-500',
                getProgressColor(goal.color),
              ]"
              :style="{ width: `${goal.progress}%` }"
            ></div>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div>
            <p class="text-2xl font-bold">₦{{ formatNumber(goal.saved) }}</p>
            <p class="text-sm opacity-60">
              of ₦{{ formatNumber(goal.target) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm opacity-60">Status</p>
            <p
              :class="[
                'font-semibold',
                goal.progress >= 100 ? 'text-green-400' : 'text-amber-400',
              ]"
            >
              {{ goal.progress >= 100 ? "Completed" : "In Progress" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGoalsStore } from "@/stores/goals";

const goalsStore = useGoalsStore();
const goals = goalsStore.goals;

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

const getProgressColor = (colorClass: string): string => {
  if (colorClass.includes("blue")) return "bg-blue-400";
  if (colorClass.includes("emerald")) return "bg-emerald-400";
  if (colorClass.includes("amber")) return "bg-amber-400";
  return "bg-primary";
};
</script>
