<template>
  <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-white">My Goals</h1>
        <p class="text-sm text-gray-400 mt-0.5">
          Track, manage and grow your savings
        </p>
      </div>
      <BaseButton
        @click="uiStore.openCreateGoalModal()"
        variant="primary"
        size="md"
      >
        <template #icon>＋</template>
        New Goal
      </BaseButton>
    </div>

    <!-- Insights bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="glass-card px-4 py-3 space-y-1">
        <p class="text-xs text-gray-400">Total saved</p>
        <p class="text-lg font-bold text-white">
          ₦{{ formatNumber(goalsStore.totalSaved) }}
        </p>
      </div>
      <div class="glass-card px-4 py-3 space-y-1">
        <p class="text-xs text-gray-400">Total target</p>
        <p class="text-lg font-bold text-white">
          ₦{{ formatNumber(goalsStore.totalTarget) }}
        </p>
      </div>
      <div class="glass-card px-4 py-3 space-y-1">
        <p class="text-xs text-gray-400">Active goals</p>
        <p class="text-lg font-bold text-amber-400">
          {{ goalsStore.activeGoalsCount }}
        </p>
      </div>
      <div class="glass-card px-4 py-3 space-y-1">
        <p class="text-xs text-gray-400">Completed</p>
        <p class="text-lg font-bold text-green-400">
          {{ goalsStore.completedGoalsCount }}
        </p>
      </div>
    </div>

    <!-- Search + Filters + Sort -->
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search -->
      <div class="relative flex-1">
        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          >🔍</span
        >
        <input
          v-model="search"
          type="text"
          placeholder="Search goals..."
          class="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <!-- Filter tabs -->
      <div class="flex gap-1 bg-gray-800 p-1 rounded-xl border border-gray-700">
        <button
          v-for="f in filters"
          :key="f.value"
          @click="activeFilter = f.value"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          :class="
            activeFilter === f.value
              ? 'bg-primary-500 text-white'
              : 'text-gray-400 hover:text-white'
          "
        >
          {{ f.label }}
          <span v-if="f.count !== undefined" class="ml-1 opacity-70"
            >({{ f.count }})</span
          >
        </button>
      </div>

      <!-- Sort -->
      <select
        v-model="sortBy"
        class="px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="newest">Newest first</option>
        <option value="progress">Most progress</option>
        <option value="amount">Highest target</option>
        <option value="name">A → Z</option>
      </select>
    </div>

    <!-- Skeleton -->
    <SkeletonGoals v-if="showSkeleton" />

    <!-- Goals grid -->
    <div
      v-else-if="filteredGoals.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <GoalCard
        v-for="goal in filteredGoals"
        :key="goal._id"
        :goal="goal"
        :show-actions="true"
        @add-funds="openAddFunds(goal)"
        @withdraw="openWithdraw(goal)"
        @share="openShare(goal)"
        @click="goToDetail(goal)"
      />
    </div>

    <!-- Empty filtered state -->
    <div v-else-if="search || activeFilter !== 'all'" class="text-center py-16">
      <p class="text-4xl mb-3">🔍</p>
      <h3 class="text-lg font-bold text-white mb-1">No goals match</h3>
      <p class="text-gray-400 text-sm">Try a different filter or search term</p>
      <button
        @click="resetFilters"
        class="mt-4 text-primary-400 text-sm hover:underline"
      >
        Clear filters
      </button>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16">
      <div
        class="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-500/10 flex items-center justify-center"
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

  <!-- Modals -->
  <BaseModal v-model="uiStore.showCreateGoalModal" title="Create New Goal">
    <SmartGoalForm @submit="handleCreateGoal" />
  </BaseModal>

  <AddFundsModal
    v-if="selectedGoal"
    v-model="showAddFunds"
    :goal="selectedGoal"
    @add="handleAddFunds"
  />

  <WithdrawModal
    v-if="selectedGoal"
    v-model="showWithdraw"
    :goal="selectedGoal"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useGoalsStore } from "@/stores/goals";
import { useUIStore } from "@/stores/ui";
import type { Goal } from "@/stores/goals";
import BaseButton from "@/components/shared/BaseButton.vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import SmartGoalForm from "@/components/goals/SmartGoalForm.vue";
import GoalCard from "@/components/goals/GoalCard.vue";
import AddFundsModal from "@/components/goals/AddFundsModal.vue";
import WithdrawModal from "@/components/goals/WithdrawModal.vue";
import SkeletonGoals from "@/components/skeleton/SkeletonGoals.vue";
import { useDebouncedLoading } from "@/composables/useDebouncedLoading";

const router = useRouter();
const goalsStore = useGoalsStore();
const uiStore = useUIStore();

const { showSkeleton, startLoading, finishLoading } = useDebouncedLoading(200);

// ── State ──────────────────────────────────────────────
const search = ref("");
const activeFilter = ref("all");
const sortBy = ref("newest");
const selectedGoal = ref<Goal | null>(null);
const showAddFunds = ref(false);
const showWithdraw = ref(false);

// ── Filters ────────────────────────────────────────────
const filters = computed(() => [
  { label: "All", value: "all", count: goalsStore.goals.length },
  { label: "Active", value: "active", count: goalsStore.activeGoalsCount },
  {
    label: "Completed",
    value: "completed",
    count: goalsStore.completedGoalsCount,
  },
  {
    label: "Locked",
    value: "locked",
    count: goalsStore.goals.filter((g) => g.locked && g.progress < 100).length,
  },
]);

// ── Filtered + sorted goals ────────────────────────────
const filteredGoals = computed(() => {
  let list = [...goalsStore.goals];

  // Search
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.category?.toLowerCase().includes(q),
    );
  }

  // Filter
  if (activeFilter.value === "active")
    list = list.filter((g) => g.progress < 100);
  if (activeFilter.value === "completed")
    list = list.filter((g) => g.progress >= 100);
  if (activeFilter.value === "locked")
    list = list.filter((g) => g.locked && g.progress < 100);

  // Sort
  if (sortBy.value === "newest")
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  if (sortBy.value === "progress") list.sort((a, b) => b.progress - a.progress);
  if (sortBy.value === "amount") list.sort((a, b) => b.target - a.target);
  if (sortBy.value === "name")
    list.sort((a, b) => a.title.localeCompare(b.title));

  return list;
});

// ── Actions ────────────────────────────────────────────
const openAddFunds = (goal: Goal) => {
  selectedGoal.value = goal;
  showAddFunds.value = true;
};
const openWithdraw = (goal: Goal) => {
  selectedGoal.value = goal;
  showWithdraw.value = true;
};
const openShare = (goal: Goal) => {
  selectedGoal.value = goal; /* wire up share modal if you have one */
};
const goToDetail = (goal: Goal) => router.push(`/goals/${goal._id}`);
const resetFilters = () => {
  search.value = "";
  activeFilter.value = "all";
};

const handleAddFunds = async (amount: number) => {
  if (!selectedGoal.value) return;
  await goalsStore.addFunds(selectedGoal.value._id, amount);
};

const handleCreateGoal = async (formData: any) => {
  await goalsStore.addGoal(formData);
  uiStore.closeCreateGoalModal();
};

const formatNumber = (n: number) => new Intl.NumberFormat().format(n);

onMounted(async () => {
  startLoading();
  await goalsStore.fetchGoals();
  finishLoading();
});
</script>
