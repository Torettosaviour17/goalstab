<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <!-- Welcome -->
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">
        Welcome back,
        <span class="text-primary-400">{{ userName }}</span> 👋
      </h1>
      <p class="text-gray-400">
        Track your savings and reach your financial goals
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard
        title="Total Saved"
        :value="formatCurrency(totalSaved)"
        icon="💰"
        trend="+12.5%"
      />
      <StatsCard
        title="Active Goals"
        :value="activeGoalsCount"
        icon="🎯"
        trend="+2"
      />
      <StatsCard
        title="Progress"
        :value="`${overallProgress}%`"
        icon="📈"
        trend="+8%"
      />
      <StatsCard
        title="Monthly Growth"
        :value="formatCurrency(monthlyGrowth)"
        icon="🚀"
        trend="+15.3%"
      />
    </div>

    <!-- Goals Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-white">Your Goals</h2>
          <BaseButton @click="uiStore.openCreateGoalModal()" size="sm">
            <template #icon>＋</template>
            New Goal
          </BaseButton>
        </div>

        <div v-if="goals.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GoalCard
            v-for="goal in goals"
            :key="goal.id"
            :goal="goal"
            @click="viewGoal(goal.id)"
            @add-funds="openAddFunds(goal.id)"
            @withdraw="handleWithdraw(goal.id)"
          />
        </div>

        <EmptyState
          v-else
          title="No goals yet"
          description="Create your first savings goal to get started"
          icon="🎯"
          @action="uiStore.openCreateGoalModal"
        />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>

    <!-- Create Goal Modal -->
    <BaseModal v-model="uiStore.showCreateGoalModal" title="Create New Goal">
      <GoalForm @submit="handleCreateGoal" />
    </BaseModal>

    <!-- ✅ FIXED Add Funds Modal -->
    <AddFundsModal
      v-model="showAddFundsModal"
      :goal="selectedGoal"
      @add="handleAddFunds"
    />

    <!-- 🎉 Confetti -->
    <Confetti
      v-if="showConfetti"
      :duration="3000"
      @done="showConfetti = false"
    />

    <!-- 🏆 Goal Completed Modal -->
    <GoalCompletedModal
      v-model="showCompletedModal"
      :goal="completedGoal"
      @share="handleShare"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useGoalsStore } from "@/stores/goals";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

import StatsCard from "@/components/dashboard/StatsCard.vue";
import QuickActions from "@/components/dashboard/QuickActions.vue";
import RecentActivity from "@/components/dashboard/RecentActivity.vue";
import GoalCard from "@/components/goals/GoalCard.vue";
import GoalForm from "@/components/goals/GoalForm.vue";
import GoalCompletedModal from "@/components/goals/GoalCompletedModal.vue";
import AddFundsModal from "@/components/goals/AddFundsModal.vue";
import Confetti from "@/components/shared/Confetti.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import EmptyState from "@/components/dashboard/EmptyState.vue";

const router = useRouter();
const goalsStore = useGoalsStore();
const authStore = useAuthStore();
const uiStore = useUIStore();

const {
  goals,
  totalSaved,
  overallProgress,
  activeGoalsCount,
  recentlyCompletedGoal,
} = storeToRefs(goalsStore);

const { user } = storeToRefs(authStore);

const userName = computed(() => user.value?.name || "User");
const monthlyGrowth = computed(() => totalSaved.value * 0.153);

const showAddFundsModal = ref(false);
const selectedGoalId = ref<string | null>(null);

const selectedGoal = computed(() => {
  return goals.value.find((g) => g.id === selectedGoalId.value) || null;
});

const showConfetti = ref(false);
const showCompletedModal = ref(false);
const completedGoal = ref<any>(null);

const formatCurrency = (value: number) =>
  `₦${new Intl.NumberFormat().format(value)}`;

const viewGoal = (id: string) => {
  router.push(`/goals/${id}`);
};

const openAddFunds = (id: string) => {
  selectedGoalId.value = id;
  showAddFundsModal.value = true;
};

const handleAddFunds = (amount: number) => {
  if (!selectedGoal.value) return;

  goalsStore.addFunds(selectedGoal.value.id, amount);

  uiStore.addToast({
    type: "success",
    message: `₦${amount.toLocaleString()} added to ${selectedGoal.value.title}`,
  });
};

const handleWithdraw = (id: string) => {
  const goal = goals.value.find((g) => g.id === id);

  if (goal && goal.progress >= 100) {
    uiStore.addToast({
      type: "success",
      message: "Withdrawal request sent!",
    });
  } else {
    uiStore.addToast({
      type: "warning",
      message: "Complete the goal first!",
    });
  }
};

const handleCreateGoal = (formData: any) => {
  goalsStore.addGoal(formData);
  uiStore.closeCreateGoalModal();

  uiStore.addToast({
    type: "success",
    message: "Goal created successfully!",
  });
};

/* 🎉 Completion Watcher */
watch(recentlyCompletedGoal, (newGoal) => {
  if (newGoal) {
    completedGoal.value = newGoal;
    showConfetti.value = true;

    setTimeout(() => {
      showCompletedModal.value = true;
    }, 500);
  }
});

/* 🧹 Clear completion */
watch(showCompletedModal, (isOpen) => {
  if (!isOpen) {
    goalsStore.clearCompleted();
  }
});

/* 📤 Share */
const handleShare = () => {
  if (!completedGoal.value) return;

  if (navigator.share) {
    navigator.share({
      title: "Goal Completed!",
      text: `I just completed my goal: ${completedGoal.value.title}`,
      url: window.location.origin,
    });
  } else {
    uiStore.addToast({
      type: "info",
      message: "Sharing not supported on this device.",
    });
  }
};
</script>
