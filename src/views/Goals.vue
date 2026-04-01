<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header with title and create button -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <h1 class="text-3xl font-bold text-white">All Goals</h1>
    </div>

    <!-- Loading state -->
    <SkeletonGoals v-if="goalsStore.loading" />

    <!-- Goals grid -->
    <div
      v-else-if="goals.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="goal in goals"
        :key="goal.id"
        class="glass-card p-6 hover:bg-white/[0.08] hover:scale-[1.02] transition-all duration-300"
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
              <h3 class="text-lg font-semibold text-white">{{ goal.title }}</h3>
              <p class="text-sm text-gray-400">
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
            <span class="text-gray-400">Progress</span>
            <span class="font-semibold text-white">{{ goal.progress }}%</span>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
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
            <p class="text-2xl font-bold text-white">
              ₦{{ formatNumber(goal.saved) }}
            </p>
            <p class="text-sm text-gray-400">
              of ₦{{ formatNumber(goal.target) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-400">Status</p>
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

    <!-- Empty state -->
    <div v-else class="text-center py-16">
      <div
        class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center"
      >
        <span class="text-4xl">🎯</span>
      </div>
      <h3 class="text-xl font-bold text-white mb-2">No goals yet</h3>
      <p class="text-gray-400 mb-6">
        Create your first savings goal to get started
      </p>
      <BaseButton @click="uiStore.openCreateGoalModal()" size="lg">
        <template #icon>＋</template>
        Create Goal
      </BaseButton>
    </div>
  </div>

  <!-- Create Goal Modal -->
  <BaseModal v-model="uiStore.showCreateGoalModal" title="Create New Goal">
    <SmartGoalForm @submit="handleCreateGoal" />
  </BaseModal>
</template>

<script setup lang="ts">
import { useGoalsStore } from "@/stores/goals";
import { useUIStore } from "@/stores/ui";
import BaseButton from "@/components/shared/BaseButton.vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import SmartGoalForm from "@/components/goals/SmartGoalForm.vue";
import SkeletonGoals from "@/components/skeleton/SkeletonGoals.vue";

const goalsStore = useGoalsStore();
const uiStore = useUIStore();
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

const handleCreateGoal = (formData: any) => {
  goalsStore.addGoal(formData);
  uiStore.closeCreateGoalModal();
  uiStore.addToast({
    type: "success",
    message: "Goal created successfully!",
  });
};
</script>
