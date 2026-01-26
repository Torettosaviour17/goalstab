<template>
  <div class="max-w-7xl mx-auto">
    <!-- Hero Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="Total Saved"
        :value="formatNumber(totalSaved)"
        icon="💰"
        trend="+12.5%"
        color="bg-primary/20 text-primary"
      />
      <StatsCard
        title="Active Goals"
        :value="activeGoals.length"
        icon="🎯"
        trend="+2"
        color="bg-emerald-500/20 text-emerald-400"
      />
      <StatsCard
        title="Progress"
        :value="overallProgress"
        icon="📈"
        trend="+8%"
        suffix="%"
        color="bg-amber-500/20 text-amber-400"
      />
    </div>

    <!-- Quick Actions -->
    <QuickActions class="mb-8" />

    <!-- Goals Grid -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold flex items-center gap-3">
          <span class="p-2 rounded-lg bg-primary/20">🎯</span>
          Your Goals
          <span class="px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
            {{ activeGoals.length }} active
          </span>
        </h2>
      </div>

      <!-- Goals Grid -->
      <div
        v-if="activeGoals.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="(goal, index) in activeGoals"
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

          <div class="flex justify-between items-center mb-4">
            <div>
              <p class="text-2xl font-bold">₦{{ formatNumber(goal.saved) }}</p>
              <p class="text-sm opacity-60">
                of ₦{{ formatNumber(goal.target) }}
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="addFundsToGoal(goal.id)"
              class="flex-1 btn-secondary py-2 text-sm"
            >
              Add Funds
            </button>
            <button
              @click="withdrawFromGoal(goal.id)"
              :disabled="goal.locked"
              :class="[
                'flex-1 py-2 text-sm rounded-lg font-medium transition',
                goal.locked
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'btn-primary',
              ]"
            >
              {{ goal.locked ? "Locked" : "Withdraw" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div
          class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-float"
        >
          <span class="text-4xl">🎯</span>
        </div>
        <h3 class="text-xl font-bold mb-2">No goals yet</h3>
        <p class="opacity-60 mb-6">
          Create your first savings goal to get started!
        </p>
        <button
          @click="goalsStore.showCreateModal = true"
          class="btn-primary px-8"
        >
          Create First Goal
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <RecentActivity class="mb-8" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import StatsCard from "@/components/dashboard/StatsCard.vue";
import QuickActions from "@/components/dashboard/QuickActions.vue";
import RecentActivity from "@/components/dashboard/RecentActivity.vue";
import { useGoalsStore } from "@/stores/useGoals";

const goalsStore = useGoalsStore();

const activeGoals = computed(() => goalsStore.activeGoals);
const totalSaved = computed(() => goalsStore.totalSaved);
const overallProgress = computed(() => goalsStore.overallProgress);

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

const getProgressColor = (colorClass: string): string => {
  if (colorClass.includes("blue")) return "bg-blue-400";
  if (colorClass.includes("emerald")) return "bg-emerald-400";
  if (colorClass.includes("amber")) return "bg-amber-400";
  return "bg-primary";
};

const addFundsToGoal = (id: string) => {
  const amount = prompt("Enter amount to add:");
  if (amount && !isNaN(parseFloat(amount))) {
    goalsStore.addToGoal(id, parseFloat(amount));
  }
};

const withdrawFromGoal = (id: string) => {
  if (goalsStore.requestWithdrawal(id)) {
    alert("Withdrawal request sent! Goal unlocked.");
  } else {
    alert("Complete the goal first!");
  }
};
</script>
