<template>
  <div class="container mx-auto px-4 py-6 md:px-8 md:py-10">
    <!-- Welcome Banner (only when data loaded) -->
    <WelcomeBanner v-if="!showSkeleton" :user-name="userName" />

    <!-- Skeleton Loader -->
    <SkeletonDashboard v-if="showSkeleton" />

    <!-- Real Content -->
    <div
      v-else
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
      :duration="300"
    >
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div
          v-for="(card, index) in statsData"
          :key="card.title"
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :enter="{ opacity: 1, scale: 1, transition: { delay: index * 50 } }"
        >
          <StatsCard
            class="hover:scale-[1.02] transition-all duration-300"
            :title="card.title"
            :value="card.value"
            :icon="card.icon"
            :trend="card.trend"
          />
        </div>
      </div>

      <!-- No active goals but past activity -->
      <div
        v-if="activeGoalsCount === 0 && lifetime.totalSavedLifetime > 0"
        class="mb-6 glass-card p-4 bg-primary-500/10 border border-primary-500/20"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center"
          >
            <span class="text-2xl">🎉</span>
          </div>
          <div>
            <p class="text-white font-medium">
              You've saved ₦{{ formatNumber(lifetime.totalSavedLifetime) }} in
              total and completed {{ lifetime.goalsCompletedLifetime }} goals!
            </p>
            <p class="text-sm text-gray-300">
              Ready to start a new savings journey?
            </p>
          </div>
          <BaseButton
            size="sm"
            @click="uiStore.openCreateGoalModal"
            class="ml-auto"
          >
            New Goal
          </BaseButton>
        </div>
      </div>

      <!-- Goals Section -->
      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-8"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
        :duration="400"
      >
        <div class="lg:col-span-2">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-white">Your Goals</h2>

            <BaseButton
              @click="uiStore.openCreateGoalModal()"
              size="sm"
              class="shadow-lg hover:shadow-primary-500/30 transition-all new-goal-button"
            >
              <template #icon>＋</template>
              New Goal
            </BaseButton>
          </div>

          <!-- Goals Grid -->
          <div
            v-if="goals.length"
            class="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div
              v-for="(goal, index) in goals"
              :key="goal.id || goal._id"
              v-motion
              :initial="{ opacity: 0, scale: 0.95 }"
              :enter="{
                opacity: 1,
                scale: 1,
                transition: { delay: 300 + index * 75 },
              }"
              :duration="300"
            >
              <GoalCard
                :goal="goal"
                class="hover:-translate-y-1 transition-all duration-300"
                @add-funds="openAddFunds(goal.id || goal._id)"
                @withdraw="handleWithdraw(goal.id || goal._id)"
                @share="openShareModal(goal)"
              />
            </div>
          </div>

          <!-- Empty -->
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
    </div>

    <!-- Create Goal Modal -->
    <BaseModal v-model="uiStore.showCreateGoalModal" title="Create New Goal">
      <SmartGoalForm @submit="handleCreateGoal" />
    </BaseModal>

    <!-- Add Funds -->
    <AddFundsModal
      v-model="showAddFundsModal"
      :goal="selectedGoal"
      @add="handleAddFunds"
    />

    <!-- Withdraw -->
    <WithdrawModal
      v-model="showWithdrawModal"
      :goal="selectedWithdrawGoal"
      @submit="submitWithdrawRequest"
    />

    <!-- Share Goal Modal -->
    <ShareGoalModal
      v-model="showShareModal"
      :goal-id="selectedShareGoal?._id || ''"
      :shared-users="selectedShareGoal?.sharedWith || []"
      @share="handleShare"
      @unshare="handleUnshare"
    />

    <!-- Confetti -->
    <Confetti
      v-if="showConfetti"
      :duration="3000"
      @done="showConfetti = false"
    />

    <!-- Goal Completed -->
    <GoalCompletedModal
      v-model="showCompletedModal"
      :goal="completedGoal"
      @share="handleShare"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";

// Stores
import { useGoalsStore } from "@/stores/goals";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
import { useAccountsStore } from "@/stores/accounts";
import { useTransactionsStore } from "@/stores/transactions";
import { useAnalyticsStore } from "@/stores/analytics";

// API
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
import ShareGoalModal from "@/components/goals/ShareGoalModal.vue";
import Confetti from "@/components/shared/Confetti.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import EmptyState from "@/components/dashboard/EmptyState.vue";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner.vue";
import SkeletonDashboard from "@/components/skeleton/SkeletonDashboard.vue";
import { useOnboardingTour } from "@/composables/useOnboardingTour";
import { useDebouncedLoading } from "@/composables/useDebouncedLoading";

// Stores
const goalsStore = useGoalsStore();
const authStore = useAuthStore();
const uiStore = useUIStore();
const accountsStore = useAccountsStore();
const transactionsStore = useTransactionsStore();
const analyticsStore = useAnalyticsStore();
const { shouldShowTour, startTour } = useOnboardingTour();
const { showSkeleton, startLoading, finishLoading } = useDebouncedLoading(200);

const {
  goals,
  totalSaved,
  overallProgress,
  activeGoalsCount,
  recentlyCompletedGoal,
} = storeToRefs(goalsStore);
const { user } = storeToRefs(authStore);
const { lifetime } = storeToRefs(analyticsStore);

// Computed
const userName = computed(() => user.value?.name || "User");
const monthlyGrowth = computed(() => totalSaved.value * 0.153);

const statsData = computed(() => [
  {
    title: "Total Saved",
    value: formatCurrency(totalSaved.value),
    icon: "💰",
    trend: "+12.5%",
  },
  {
    title: "Active Goals",
    value: activeGoalsCount.value,
    icon: "🎯",
    trend: "+2",
  },
  {
    title: "Progress",
    value: `${overallProgress.value}%`,
    icon: "📈",
    trend: "+8%",
  },
  {
    title: "Monthly Growth",
    value: formatCurrency(monthlyGrowth.value),
    icon: "🚀",
    trend: "+15.3%",
  },
]);

// Add funds
const showAddFundsModal = ref(false);
const selectedGoalId = ref<string | null>(null);

const selectedGoal = computed(
  () =>
    goals.value.find(
      (g) => g.id === selectedGoalId.value || g._id === selectedGoalId.value,
    ) || null,
);

// Withdraw
const showWithdrawModal = ref(false);
const selectedWithdrawGoal = ref<Goal | null>(null);

// Share
const showShareModal = ref(false);
const selectedShareGoal = ref<Goal | null>(null);

// Completion
const showConfetti = ref(false);
const showCompletedModal = ref(false);
const completedGoal = ref<any>(null);

// Helpers
const formatCurrency = (value: number) =>
  `₦${new Intl.NumberFormat().format(value)}`;
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

// Open add funds
const openAddFunds = (id: string | undefined) => {
  if (!id) return;
  selectedGoalId.value = id;
  showAddFundsModal.value = true;
};

// Add funds
const handleAddFunds = (amount: number) => {
  if (!selectedGoal.value) return;

  const goalId = selectedGoal.value.id || selectedGoal.value._id;
  goalsStore.addFunds(goalId, amount);

  uiStore.addToast({
    type: "success",
    message: `₦${amount.toLocaleString()} added to ${selectedGoal.value.title}`,
  });
};

// Withdraw
const handleWithdraw = (id: string | undefined) => {
  if (!id) return;

  const goal = goals.value.find((g) => g.id === id || g._id === id);

  if (goal && goal.progress >= 100) {
    selectedWithdrawGoal.value = goal;
    showWithdrawModal.value = true;
  } else {
    uiStore.addToast({
      type: "warning",
      message: "Complete the goal first!",
    });
  }
};

// Submit withdrawal
const submitWithdrawRequest = async (data: any) => {
  try {
    await api.post("/withdrawals", {
      goalId: selectedWithdrawGoal.value?.id,
      amount: data.amount,
      accountDetails: data,
    });

    uiStore.addToast({
      type: "success",
      message: "Withdrawal request submitted!",
    });

    showWithdrawModal.value = false;
  } catch {
    uiStore.addToast({
      type: "error",
      message: "Failed to submit request",
    });
  }
};

// Create goal
const handleCreateGoal = (formData: any) => {
  goalsStore.addGoal(formData);

  uiStore.closeCreateGoalModal();

  uiStore.addToast({
    type: "success",
    message: "Goal created successfully!",
  });
};

// Share goal
const openShareModal = (goal: Goal) => {
  selectedShareGoal.value = goal;
  showShareModal.value = true;
};

const handleGoalShare = async ({
  email,
  role,
}: {
  email: string;
  role: "viewer" | "contributor";
}) => {
  if (!selectedShareGoal.value) return;

  try {
    await goalsStore.shareGoal(selectedShareGoal.value._id, email, role);
  } finally {
    showShareModal.value = false;
  }
};

const handleUnshare = async (userId: string) => {
  if (!selectedShareGoal.value) return;

  try {
    await goalsStore.unshareGoal(selectedShareGoal.value._id, userId);
  } finally {
    showShareModal.value = false;
  }
};

// Goal completed
watch(recentlyCompletedGoal, (newGoal) => {
  if (newGoal) {
    completedGoal.value = newGoal;
    showConfetti.value = true;

    setTimeout(() => {
      showCompletedModal.value = true;
    }, 500);
  }
});

watch(showCompletedModal, (open) => {
  if (!open) goalsStore.clearCompleted();
});

// Lifecycle
onMounted(async () => {
  console.log(
    "[Dashboard] onMounted, starting data fetch and lifetime stats...",
  );

  startLoading();

  try {
    await Promise.all([
      goalsStore.fetchGoals(),
      accountsStore.fetchAccounts(),
      transactionsStore.fetchRecentTransactions(),
      analyticsStore.fetchLifetimeStats(),
    ]);
    console.log("[Dashboard] Data fetch completed successfully");
  } catch (error) {
    console.error("[Dashboard] Data fetch failed:", error);
  } finally {
    finishLoading();
  }

  if (shouldShowTour()) {
    setTimeout(() => {
      console.log("[Dashboard] Starting onboarding tour");
      startTour();
    }, 1000); // slight delay to ensure DOM is ready
  }
});

// Share completed goal
const handleShare = () => {
  if (!completedGoal.value) return;

  if (navigator.share) {
    navigator.share({
      title: "Goal Completed!",
      text: `I just completed my goal: ${completedGoal.value.title}`,
      url: window.location.origin,
    });
  }
};
</script>
