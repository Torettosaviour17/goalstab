<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">Transactions</h1>
    <p class="text-gray-400 mb-6">View and filter your transaction history</p>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="flex-1">
        <input
          v-model="search"
          type="text"
          placeholder="Search by goal or description..."
          class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
          @input="debouncedSearch"
        />
      </div>
      <select
        v-model="typeFilter"
        class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
      >
        <option value="all">All Types</option>
        <option value="deposit">Deposits</option>
        <option value="withdrawal">Withdrawals</option>
        <option value="goal_completed">Goal Completed</option>
        <option value="auto_save">Auto Save</option>
      </select>
      <select
        v-model="statusFilter"
        class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Transactions Table -->
    <div class="glass-card p-4 md:p-6 overflow-x-auto">
      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
        ></div>
      </div>
      <div v-else-if="filteredTransactions.length" class="min-w-[800px]">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-400 border-b border-gray-800">
              <th class="pb-3 font-medium">Type</th>
              <th class="pb-3 font-medium">Goal</th>
              <th class="pb-3 font-medium">Amount</th>
              <th class="pb-3 font-medium">Status</th>
              <th class="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr
              v-for="tx in filteredTransactions"
              :key="tx._id"
              class="text-gray-300"
            >
              <td class="py-3 capitalize">
                <span class="flex items-center gap-2">
                  <span class="text-lg">{{ transactionIcon(tx.type) }}</span>
                  {{ tx.type.replace("_", " ") }}
                </span>
              </td>
              <td class="py-3">{{ tx.goal?.title || "-" }}</td>
              <td
                class="py-3 font-medium"
                :class="
                  tx.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
                "
              >
                {{ tx.type === "withdrawal" ? "-" : "+" }}₦{{
                  formatNumber(tx.amount)
                }}
              </td>
              <td class="py-3">
                <span
                  v-if="tx.type === 'withdrawal' && tx.status"
                  class="px-2 py-1 rounded-full text-xs"
                  :class="statusClass(tx.status)"
                >
                  {{ tx.status }}
                </span>
                <span v-else class="text-gray-400">–</span>
              </td>
              <td class="py-3 text-gray-400">{{ formatDate(tx.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-12 text-gray-400">
        No transactions found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTransactionsStore } from "@/stores/transactions";
import debounce from "lodash/debounce";

const transactionsStore = useTransactionsStore();
const { transactions, loading } = storeToRefs(transactionsStore);

const search = ref("");
const typeFilter = ref("all");
const statusFilter = ref("all");

const fetchData = () => {
  transactionsStore.fetchAllTransactions(); // we'll add this method
};

onMounted(fetchData);

const filteredTransactions = computed(() => {
  return transactions.value.filter((tx) => {
    // Search filter
    const matchesSearch =
      !search.value ||
      tx.goal?.title?.toLowerCase().includes(search.value.toLowerCase()) ||
      tx.description?.toLowerCase().includes(search.value.toLowerCase());
    // Type filter
    const matchesType =
      typeFilter.value === "all" || tx.type === typeFilter.value;
    // Status filter
    const matchesStatus =
      statusFilter.value === "all" || tx.status === statusFilter.value;
    return matchesSearch && matchesType && matchesStatus;
  });
});

const debouncedSearch = debounce(() => {
  // no API call needed because we filter client‑side
}, 300);

// Helper functions
const formatNumber = (num: number) =>
  new Intl.NumberFormat().format(Math.abs(num));
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const transactionIcon = (type: string) => {
  const icons: Record<string, string> = {
    deposit: "💰",
    withdrawal: "💸",
    goal_completed: "🎉",
    auto_save: "⚡",
  };
  return icons[type] || "📝";
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
