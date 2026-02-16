<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <!-- Welcome -->
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">
        Welcome back, <span class="text-primary-400">{{ userName }}</span> 👋
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

    <!-- Add Funds Modal -->
    <BaseModal v-model="showAddFundsModal" title="Add Funds">
      <form @submit.prevent="handleAddFunds" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >Amount (₦)</label
          >
          <input
            v-model.number="addFundsAmount"
            type="number"
            required
            min="100"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl"
          />
        </div>
        <div class="flex gap-2 justify-end">
          <BaseButton variant="secondary" @click="showAddFundsModal = false">
            Cancel
          </BaseButton>
          <BaseButton type="submit"> Add Funds </BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
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
import BaseButton from "@/components/shared/BaseButton.vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import EmptyState from "@/components/dashboard/EmptyState.vue";

const router = useRouter();
const goalsStore = useGoalsStore();
const authStore = useAuthStore();
const uiStore = useUIStore();

const { goals, totalSaved, overallProgress, activeGoalsCount } =
  storeToRefs(goalsStore);
const { user } = storeToRefs(authStore);

const userName = computed(() => user.value?.name || "User");
const monthlyGrowth = computed(() => totalSaved.value * 0.153);

const showAddFundsModal = ref(false);
const addFundsAmount = ref(0);
const selectedGoalId = ref<string | null>(null);

const formatCurrency = (value: number) =>
  `₦${new Intl.NumberFormat().format(value)}`;

const viewGoal = (id: string) => {
  router.push(`/goals/${id}`);
};

const openAddFunds = (id: string) => {
  selectedGoalId.value = id;
  addFundsAmount.value = 0;
  showAddFundsModal.value = true;
};

const handleAddFunds = async () => {
  if (selectedGoalId.value && addFundsAmount.value > 0) {
    goalsStore.addFunds(selectedGoalId.value, addFundsAmount.value);
    uiStore.addToast({
      type: "success",
      message: `₦${addFundsAmount.value.toLocaleString()} added to goal!`,
    });
    showAddFundsModal.value = false;
  }
};

const handleWithdraw = (id: string) => {
  const goal = goals.value.find((g) => g.id === id);
  if (goal && goal.progress >= 100) {
    // In a real app, initiate withdrawal
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
</script>
