<template>
  <div class="container mx-auto px-4 py-6 md:px-8 md:py-10">
    <!-- Welcome Banner -->
    <WelcomeBanner :user-name="userName" />

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      <StatsCard
        class="hover:scale-[1.02] transition-all duration-300"
        title="Total Saved"
        :value="formatCurrency(totalSaved)"
        icon="💰"
        trend="+12.5%"
      />
      <StatsCard
        class="hover:scale-[1.02] transition-all duration-300"
        title="Active Goals"
        :value="activeGoalsCount"
        icon="🎯"
        trend="+2"
      />
      <StatsCard
        class="hover:scale-[1.02] transition-all duration-300"
        title="Progress"
        :value="`${overallProgress}%`"
        icon="📈"
        trend="+8%"
      />
      <StatsCard
        class="hover:scale-[1.02] transition-all duration-300"
        title="Monthly Growth"
        :value="formatCurrency(monthlyGrowth)"
        icon="🚀"
        trend="+15.3%"
      />
    </div>

    <!-- Goals Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Goals -->
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-white">Your Goals</h2>
          <BaseButton
            @click="uiStore.openCreateGoalModal()"
            size="sm"
            class="shadow-lg hover:shadow-primary-500/30 transition-all"
          >
            <template #icon>＋</template>
            New Goal
          </BaseButton>
        </div>

        <div v-if="goals.length" class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GoalCard
            v-for="goal in goals"
            :key="goal.id || goal._id"
            :goal="goal"
            class="hover:-translate-y-1 transition-all duration-300"
            @add-funds="openAddFunds(goal.id || goal._id)"
            @withdraw="handleWithdraw(goal.id || goal._id)"
          />
        </div>

        <div
          v-else
          class="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
        >
          <EmptyState
            title="No goals yet"
            description="Create your first savings goal to get started"
            icon="🎯"
            @action="uiStore.openCreateGoalModal"
          />
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-8">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>

    <!-- Modals -->
    <BaseModal v-model="uiStore.showCreateGoalModal" title="Create New Goal">
      <SmartGoalForm @submit="handleCreateGoal" />
    </BaseModal>

    <AddFundsModal
      v-model="showAddFundsModal"
      :goal="selectedGoal"
      @add="handleAddFunds"
    />

    <WithdrawModal
      v-model="showWithdrawModal"
      :goal="selectedWithdrawGoal"
      @submit="submitWithdrawRequest"
    />

    <!-- Confetti -->
    <Confetti
      v-if="showConfetti"
      :duration="3000"
      @done="showConfetti = false"
    />

    <GoalCompletedModal
      v-model="showCompletedModal"
      :goal="completedGoal"
      @share="handleShare"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

// Stores
import { useGoalsStore } from "@/stores/goals";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
import { useAccountsStore } from "@/stores/accounts";
import { useTransactionsStore } from "@/stores/transactions"; // ✅ added

// API & types
import api from "@/services/api";
import type { Goal } from "@/types/goal";

// Components
import StatsCard from "@/components/dashboard/StatsCard.vue";
import QuickActions from "@/components/dashboard/QuickActions.vue";
import RecentActivity from "@/components/dashboard/RecentActivity.vue";
import GoalCard from "@/components/goals/GoalCard.vue";
import SmartGoalForm from "@/components/goals/SmartGoalForm.vue";
import GoalCompletedModal from "@/components/goals/GoalCompletedModal.vue";
import AddFundsModal from "@/components/goals/AddFundsModal.vue";
import WithdrawModal from "@/components/goals/WithdrawModal.vue";
import Confetti from "@/components/shared/Confetti.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import EmptyState from "@/components/dashboard/EmptyState.vue";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner.vue";

const router = useRouter();

// Store instances
const goalsStore = useGoalsStore();
const authStore = useAuthStore();
const uiStore = useUIStore();
const accountsStore = useAccountsStore();
const transactionsStore = useTransactionsStore(); // ✅ defined

// Store refs
const {
  goals,
  totalSaved,
  overallProgress,
  activeGoalsCount,
  recentlyCompletedGoal,
} = storeToRefs(goalsStore);

const { user } = storeToRefs(authStore);

// Computed
const userName = computed(() => user.value?.name || "User");
const monthlyGrowth = computed(() => totalSaved.value * 0.153);

// Add Funds modal
const showAddFundsModal = ref(false);
const selectedGoalId = ref<string | null>(null);
const selectedGoal = computed(() => {
  return (
    goals.value.find(
      (g) => g.id === selectedGoalId.value || g._id === selectedGoalId.value,
    ) || null
  );
});

// Withdrawals modal
const showWithdrawModal = ref(false);
const selectedWithdrawGoal = ref<Goal | null>(null);

// Confetti & completion
const showConfetti = ref(false);
const showCompletedModal = ref(false);
const completedGoal = ref<any>(null);

// Helpers
const formatCurrency = (value: number) =>
  `₦${new Intl.NumberFormat().format(value)}`;

// Actions
const openAddFunds = (id: string | undefined) => {
  if (!id || id === "undefined") {
    console.warn("openAddFunds called with invalid id", id, goals.value);
    return;
  }
  // accept either frontend `id` or MongoDB `_id`
  selectedGoalId.value = id;
  showAddFundsModal.value = true;
};

const handleAddFunds = (amount: number) => {
  if (!selectedGoal.value) return;
  const goalId = selectedGoal.value.id || selectedGoal.value._id;
  if (!goalId || goalId === "undefined") {
    console.error(
      "Attempted to add funds with invalid goalId",
      goalId,
      selectedGoal.value,
    );
    return;
  }
  console.log("Adding funds to goal", {
    goalId,
    selectedGoal: selectedGoal.value,
  });
  goalsStore.addFunds(goalId, amount);
  uiStore.addToast({
    type: "success",
    message: `₦${amount.toLocaleString()} added to ${selectedGoal.value.title}`,
  });
};

const handleWithdraw = (id: string | undefined) => {
  if (!id) return;
  const goal = goals.value.find((g) => g.id === id || g._id === id);
  if (goal && goal.progress >= 100) {
    selectedWithdrawGoal.value = goal;
    showWithdrawModal.value = true;
  } else {
    uiStore.addToast({ type: "warning", message: "Complete the goal first!" });
  }
};

const submitWithdrawRequest = async (data: any) => {
  try {
    await api.post("/withdrawals", {
      goalId: selectedWithdrawGoal.value?.id,
      amount: data.amount,
      accountDetails: {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
      },
    });
    uiStore.addToast({
      type: "success",
      message: "Withdrawal request submitted!",
    });
    showWithdrawModal.value = false;
  } catch (err) {
    uiStore.addToast({ type: "error", message: "Failed to submit request" });
  }
};

const handleCreateGoal = (formData: any) => {
  goalsStore.addGoal(formData);
  uiStore.closeCreateGoalModal();
  uiStore.addToast({ type: "success", message: "Goal created successfully!" });
};

watch(recentlyCompletedGoal, (newGoal) => {
  if (newGoal) {
    completedGoal.value = newGoal;
    showConfetti.value = true;
    setTimeout(() => {
      showCompletedModal.value = true;
    }, 500);
  }
});

watch(showCompletedModal, (isOpen) => {
  if (!isOpen) goalsStore.clearCompleted();
});

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

// Lifecycle – fetch all user data on mount
onMounted(async () => {
  await Promise.all([
    goalsStore.fetchGoals(),
    accountsStore.fetchAccounts(),
    transactionsStore.fetchRecentTransactions(), // ✅ now works
  ]);
});
</script>
