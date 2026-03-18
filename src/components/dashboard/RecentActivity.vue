<template>
  <div class="glass-card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-white">Recent Activity</h3>
      <router-link
        to="/transactions"
        class="text-sm text-primary-400 hover:text-primary-300 transition flex items-center gap-1"
      >
        View All <span>→</span>
      </router-link>
    </div>

    <div v-if="loading" class="flex justify-center py-6">
      <div
        class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"
      ></div>
    </div>

    <div v-else-if="displayedTransactions.length" class="space-y-3">
      <div
        v-for="tx in displayedTransactions"
        :key="tx._id"
        class="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center',
              getActivityColor(tx.type),
            ]"
          >
            <span>{{ getActivityIcon(tx.type) }}</span>
          </div>
          <div>
            <p class="font-medium text-white">
              {{ tx.description || formatDefaultDescription(tx) }}
            </p>
            <p class="text-sm text-gray-400">{{ formatTime(tx.createdAt) }}</p>
            <span
              v-if="tx.type === 'withdrawal' && tx.status"
              class="inline-block text-xs px-2 py-1 rounded-full mt-1"
              :class="statusClass(tx.status)"
            >
              {{ tx.status }}
            </span>
          </div>
        </div>
        <div class="text-right">
          <p
            class="font-bold"
            :class="
              tx.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
            "
          >
            {{ tx.type === "withdrawal" ? "-" : "+" }}₦{{
              formatNumber(tx.amount)
            }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-6 text-gray-400">No recent activity</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTransactionsStore } from "@/stores/transactions";

const transactionsStore = useTransactionsStore();
const { transactions, loading } = storeToRefs(transactionsStore);

onMounted(() => {
  transactionsStore.fetchRecentTransactions(3); // limit to 3 for dashboard
});

const displayedTransactions = computed(() => transactions.value.slice(0, 3));

const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    deposit: "💰",
    withdrawal: "💸",
    goal_completed: "🎉",
    auto_save: "⚡",
  };
  return icons[type] || "📝";
};

const getActivityColor = (type: string): string => {
  const colors: Record<string, string> = {
    deposit: "bg-green-500/20 text-green-400",
    withdrawal: "bg-red-500/20 text-red-400",
    goal_completed: "bg-blue-500/20 text-blue-400",
    auto_save: "bg-purple-500/20 text-purple-400",
  };
  return colors[type] || "bg-gray-500/20 text-gray-400";
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(Math.abs(num));
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const formatDefaultDescription = (tx: any): string => {
  if (tx.description) return tx.description;
  if (tx.type === "deposit") return `Deposit to ${tx.goal?.title || "goal"}`;
  if (tx.type === "withdrawal") {
    if (tx.status === "pending")
      return `Withdrawal pending from ${tx.goal?.title || "goal"}`;
    if (tx.status === "approved")
      return `Withdrawal approved from ${tx.goal?.title || "goal"}`;
    if (tx.status === "rejected")
      return `Withdrawal rejected from ${tx.goal?.title || "goal"}`;
    return `Withdrawal from ${tx.goal?.title || "goal"}`;
  }
  if (tx.type === "goal_completed")
    return `Goal completed: ${tx.goal?.title || ""}`;
  if (tx.type === "auto_save")
    return `Auto-save to ${tx.goal?.title || "goal"}`;
  return tx.type.replace("_", " ");
};

const statusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    approved: "bg-green-500/20 text-green-400",
    rejected: "bg-red-500/20 text-red-400",
    completed: "bg-gray-500/20 text-gray-400",
  };
  return classes[status] || "bg-gray-500/20";
};
</script>
