<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useGoalsStore } from "@/stores/goals";
import BaseButton from "@/components/shared/BaseButton.vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import GoalProgress from "@/components/goals/GoalProgress.vue";

const route = useRoute();
const router = useRouter();
const goalsStore = useGoalsStore();
const { goals } = storeToRefs(goalsStore);

// Ensure ID type consistency
const goalId = computed(() => String(route.params.id));

const goal = computed(() => {
  return goals.value.find((g) => String(g.id) === goalId.value);
});

const showAddFundsModal = ref(false);
const addAmount = ref<number | null>(null);

const progress = computed(() => {
  if (!goal.value) return 0;
  return Math.min(
    Math.round((goal.value.saved / goal.value.target) * 100),
    100,
  );
});

const remainingAmount = computed(() => {
  if (!goal.value) return 0;
  return Math.max(goal.value.target - goal.value.saved, 0);
});

const progressColor = computed(() => {
  const p = progress.value;
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

const openAddFundsModal = () => {
  addAmount.value = null;
  showAddFundsModal.value = true;
};

const handleAddFunds = async () => {
  if (!goal.value) return;

  if (!addAmount.value || addAmount.value <= 0) return;

  goalsStore.addToGoal(goal.value.id, addAmount.value);

  showAddFundsModal.value = false;
};

const handleWithdraw = () => {
  if (!goal.value) return;

  if (progress.value < 100) {
    console.warn("Goal not completed yet");
    return;
  }

  goalsStore.requestWithdrawal(goal.value.id);
};

// Remove this block.
// Instead, define addFunds as an action in your Pinia store (see below).
</script>
