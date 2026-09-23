<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <button
      @click="router.back()"
      class="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
    >
      ← Back
    </button>

    <div v-if="goal" class="space-y-6">
      <!-- Header -->
      <div
        class="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            :class="goal.color + ' bg-opacity-20'"
          >
            {{ goal.icon }}
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white">
              {{ goal.title }}
            </h1>
            <p class="text-gray-400">
              {{ goal.category || "General" }} • Created
              {{ formatDate(goal.createdAt) }}
            </p>
          </div>
        </div>
        <span
          class="px-3 py-1 rounded-full text-sm self-start"
          :class="goal.locked ? 'bg-gray-700' : 'bg-success/20 text-success'"
        >
          {{ goal.locked ? "Locked" : "Unlocked" }}
        </span>
      </div>

      <!-- Progress -->
      <div class="glass-card p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-white">Progress</h2>
          <p class="text-3xl font-bold text-white">{{ goal.progress }}%</p>
        </div>
        <GoalProgress
          :value="goal.progress"
          :color="progressColor"
          class="mb-6"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-gray-800/50 p-4 rounded-xl">
            <p class="text-sm text-gray-400">Saved</p>
            <p class="text-2xl font-bold text-white">
              ₦{{ formatNumber(goal.saved) }}
            </p>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-xl">
            <p class="text-sm text-gray-400">Target</p>
            <p class="text-2xl font-bold text-white">
              ₦{{ formatNumber(goal.target) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Auto-save Settings -->
      <div class="glass-card p-6">
        <h2 class="text-xl font-bold text-white mb-4">Auto-save Settings</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-gray-800/50 p-4 rounded-xl">
            <p class="text-sm text-gray-400">Type</p>
            <p class="text-lg font-semibold text-white capitalize">
              {{ goal.type }}
            </p>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-xl">
            <p class="text-sm text-gray-400">Amount</p>
            <p class="text-lg font-semibold text-white">
              {{
                goal.type === "percentage"
                  ? `${goal.autoSave}%`
                  : `₦${formatNumber(goal.autoSave)}`
              }}
            </p>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-xl">
            <p class="text-sm text-gray-400">Frequency</p>
            <p class="text-lg font-semibold text-white capitalize">
              {{ goal.frequency }}
            </p>
          </div>
        </div>
      </div>

      <!-- Linked Account -->
      <div v-if="goal.accountId" class="glass-card p-6">
        <h2 class="text-xl font-bold text-white mb-4">Linked Account</h2>
        <div v-if="linkedAccount" class="bg-gray-800/50 p-4 rounded-xl">
          <p class="font-medium text-white">{{ linkedAccount.bankName }}</p>
          <p class="text-sm text-gray-400">•••• {{ linkedAccount.lastFour }}</p>
          <p class="text-sm text-gray-400 mt-1">{{ linkedAccount.accountName }}</p>
        </div>
        <p v-else class="text-sm text-gray-400">Linked account not found.</p>
      </div>

      <!-- Deadline -->
      <div v-if="goal.deadline" class="glass-card p-6">
        <h2 class="text-xl font-bold text-white mb-2">Deadline</h2>
        <p class="text-lg">{{ formatDate(goal.deadline) }}</p>
      </div>

      <!-- Actions -->
      <!-- If platform fulfillment is enabled -->
      <template v-if="goal.usePlatformFulfillment">
        <div v-if="goal.fulfillmentStatus === 'pending'">
          <p class="text-gray-400 text-center py-2">
            Goal completed! We'll process your fulfillment soon.
          </p>
        </div>
        <div v-else-if="goal.fulfillmentStatus === 'processing'">
          <p class="text-yellow-400 text-center py-2">
            Fulfillment in progress...
          </p>
        </div>
        <div
          v-else-if="
            goal.fulfillmentStatus === 'delivered' ||
            goal.fulfillmentStatus === 'booked'
          "
        >
          <p class="text-green-400 text-center py-2">
            {{
              goal.goalType === "product"
                ? "Product delivered!"
                : "Service booked!"
            }}
          </p>
        </div>
      </template>

      <!-- Regular withdrawal buttons (if not using platform fulfillment) -->
      <template v-else>
        <div class="flex flex-col sm:flex-row gap-4">
          <BaseButton
            variant="primary"
            size="lg"
            class="flex-1"
            @click="openAddFunds"
          >
            <template #icon>💰</template>
            Add Funds
          </BaseButton>
          <BaseButton
            :variant="goal.locked || pendingWithdrawal ? 'ghost' : 'primary'"
            size="lg"
            class="flex-1"
            :disabled="goal.locked || pendingWithdrawal || goal.progress < 100 || goal.isClosed"
            @click="handleWithdraw"
          >
            <template #icon>💸</template>
            {{ pendingWithdrawal ? "Pending" : goal.locked ? "Locked" : goal.isClosed ? "Closed" : "Withdraw" }}
          </BaseButton>
        </div>

        <!-- Fulfillment button (only when goal completed and not yet fulfilled) -->
        <BaseButton
          v-if="goal.progress >= 100 && goal.fulfillmentStatus === 'pending'"
          variant="secondary"
          size="lg"
          class="flex-1"
          @click="requestFulfillment"
        >
          <template #icon>{{
            goal.goalType === "product" ? "🛒" : "📅"
          }}</template>
          {{
            goal.goalType === "product" ? "Request Fulfillment" : "Book Service"
          }}
        </BaseButton>

        <!-- Purchase button for product goals -->
        <BaseButton
          v-if="
            goal.progress >= 100 &&
            goal.goalType === 'product' &&
            goal.fulfillmentStatus === 'pending'
          "
          variant="primary"
          size="lg"
          @click="initiatePurchase"
        >
          🛒 Purchase with Goal Funds
        </BaseButton>
      </template>

      <!-- Tabs -->
      <div class="flex gap-4 border-b border-gray-800">
        <button
          @click="activeDetailTab = 'overview'"
          class="px-4 py-2 font-medium transition"
          :class="
            activeDetailTab === 'overview'
              ? 'text-primary-400 border-b-2 border-primary-500'
              : 'text-gray-400'
          "
        >
          Overview
        </button>
        <button
          @click="activeDetailTab = 'activity'"
          class="px-4 py-2 font-medium transition"
          :class="
            activeDetailTab === 'activity'
              ? 'text-primary-400 border-b-2 border-primary-500'
              : 'text-gray-400'
          "
        >
          Activity
        </button>
      </div>

      <!-- Activity tab -->
      <div v-if="activeDetailTab === 'activity'" class="glass-card p-6">
        <GoalActivityFeed
          :activities="activities"
          :loading="activitiesLoading"
        />
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-400">Goal not found</p>
    </div>

    <!-- Add Funds Modal -->
    <AddFundsModal
      v-model="showAddFundsModal"
      :goal="goal"
      @add="handleAddFunds"
    />

    <WithdrawModal
      v-model="showWithdrawModal"
      :goal="goal"
      @submit="submitWithdrawRequest"
    />

    <ServiceBookingModal
      v-model="showServiceModal"
      @submit="submitServiceBooking"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useGoalsStore } from "@/stores/goals";
import { useUIStore } from "@/stores/ui";
import { useActivitiesStore } from "@/stores/activities";
import { useAccountsStore } from "@/stores/accounts";
import BaseButton from "@/components/shared/BaseButton.vue";
import GoalProgress from "@/components/goals/GoalProgress.vue";
import AddFundsModal from "@/components/goals/AddFundsModal.vue";
import WithdrawModal from "@/components/goals/WithdrawModal.vue";
import GoalActivityFeed from "@/components/goals/GoalActivityFeed.vue";
import ServiceBookingModal from "@/components/goals/ServiceBookingModal.vue";
import api from "@/services/api";

const route = useRoute();
const router = useRouter();
const goalsStore = useGoalsStore();
const uiStore = useUIStore();
const activitiesStore = useActivitiesStore();
const accountsStore = useAccountsStore();
const { activities, loading: activitiesLoading } = storeToRefs(activitiesStore);

const goal = computed(() => {
  return goalsStore.goals.find((g) => g.id === route.params.id);
});

const linkedAccount = computed(() => accountsStore.accounts.find((account) => account._id === goal.value?.accountId));

const activeDetailTab = ref("overview");

const showAddFundsModal = ref(false);
const showWithdrawModal = ref(false);
const pendingWithdrawal = ref(false);

const showServiceModal = ref(false);

const progressColor = computed(() => {
  const p = goal.value?.progress || 0;
  if (p >= 100) return "success";
  if (p >= 75) return "primary";
  if (p >= 50) return "warning";
  return "danger";
});

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const openAddFunds = () => {
  showAddFundsModal.value = true;
};

const handleAddFunds = async (amount: number) => {
  if (goal.value) {
    await goalsStore.addFunds(goal.value.id, amount);
    uiStore.addToast({
      type: "success",
      message: `₦${amount.toLocaleString()} added to ${goal.value.title}`,
    });
  }
};

const handleWithdraw = () => {
  if (!goal.value) return;
  if (pendingWithdrawal.value) {
    uiStore.addToast({ type: "info", message: "A withdrawal is already pending." });
    return;
  }
  if (goal.value.progress < 100 || goal.value.locked || goal.value.isClosed) {
    uiStore.addToast({ type: "warning", message: "Complete and unlock the goal before withdrawing." });
    return;
  }
  showWithdrawModal.value = true;
};

const loadPendingWithdrawal = async () => {
  if (!goal.value) return;
  try {
    const { data } = await api.get("/withdrawals/user");
    pendingWithdrawal.value = data.some(
      (withdrawal: any) =>
        (withdrawal.goal?._id || withdrawal.goal) === goal.value?._id &&
        withdrawal.status === "pending",
    );
  } catch {
    pendingWithdrawal.value = false;
  }
};

const submitWithdrawRequest = async (data: any) => {
  if (!goal.value) return;
  try {
    await api.post("/withdrawals", {
      goalId: goal.value._id,
      amount: data.amount,
      accountDetails: data,
    });
    pendingWithdrawal.value = true;
    uiStore.addToast({ type: "success", message: "Withdrawal request submitted!" });
  } catch (err: any) {
    uiStore.addToast({
      type: "error",
      message: err.response?.data?.msg || "Failed to submit withdrawal request",
    });
    throw err;
  }
};

const requestFulfillment = () => {
  if (goal.value?.goalType === "service") {
    showServiceModal.value = true;
  } else if (goal.value) {
    goalsStore.requestFulfillment(goal.value.id);
  }
};

const submitServiceBooking = async (details: any) => {
  if (goal.value) {
    await goalsStore.requestFulfillment(goal.value.id, details);
  }
};

const initiatePurchase = async () => {
  if (!goal.value) return;
  try {
    const response = await api.post(
      `/goals/${goal.value.id}/shopping/purchase`,
      {
        productId: goal.value.selectedProduct?.id,
        provider: "mock",
      },
    );
    uiStore.addToast({ type: "success", message: response.data.message });
    // Refresh goal to show updated fulfillment status
    goalsStore.fetchGoals();
  } catch (err) {
    uiStore.addToast({ type: "error", message: "Purchase failed" });
  }
};

// Load the goal list for direct/deep links, then refresh withdrawal state.
watch(
  () => route.params.id,
  async () => {
    try {
      await Promise.all([
        goalsStore.fetchGoal(String(route.params.id)),
        accountsStore.fetchAccounts(),
      ]);
      await loadPendingWithdrawal();
    } catch {
      uiStore.addToast({ type: "error", message: "Failed to load goal" });
    }
  },
  { immediate: true },
);

// Load activities when goal changes
watch(
  () => goal.value,
  (newGoal) => {
    if (newGoal) {
      activitiesStore.fetchGoalActivities(newGoal.id);
    }
  },
  { immediate: true },
);
</script>
