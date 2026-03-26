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
        <div class="bg-gray-800/50 p-4 rounded-xl">
          <p class="text-sm text-gray-400">Account details would appear here</p>
        </div>
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
            :variant="goal.locked ? 'ghost' : 'primary'"
            size="lg"
            class="flex-1"
            :disabled="goal.locked"
            @click="handleWithdraw"
          >
            <template #icon>💸</template>
            {{ goal.locked ? "Locked" : "Withdraw" }}
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
import BaseButton from "@/components/shared/BaseButton.vue";
import GoalProgress from "@/components/goals/GoalProgress.vue";
import AddFundsModal from "@/components/goals/AddFundsModal.vue";
import GoalActivityFeed from "@/components/goals/GoalActivityFeed.vue";
import ServiceBookingModal from "@/components/goals/ServiceBookingModal.vue";

const route = useRoute();
const router = useRouter();
const goalsStore = useGoalsStore();
const uiStore = useUIStore();
const activitiesStore = useActivitiesStore();
const { activities, loading: activitiesLoading } = storeToRefs(activitiesStore);

const goal = computed(() => {
  return goalsStore.goals.find((g) => g.id === route.params.id);
});

const activeDetailTab = ref("overview");

const showAddFundsModal = ref(false);

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

const handleAddFunds = (amount: number) => {
  if (goal.value) {
    goalsStore.addFunds(goal.value.id, amount);
    uiStore.addToast({
      type: "success",
      message: `₦${amount.toLocaleString()} added to ${goal.value.title}`,
    });
  }
};

const handleWithdraw = () => {
  if (goal.value) {
    if (goal.value.progress >= 100) {
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
