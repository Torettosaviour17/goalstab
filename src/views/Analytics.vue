<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-white">Analytics</h1>
        <p class="text-gray-400">Track your savings performance</p>
      </div>

      <!-- Period selector -->
      <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        <button
          v-for="period in periods"
          :key="period.value"
          @click="changePeriod(period.value)"
          :class="[
            'px-4 py-2 text-sm md:text-base rounded-lg font-medium whitespace-nowrap transition flex-shrink-0',
            selectedPeriod === period.value
              ? 'bg-primary-500 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700',
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
      ></div>
    </div>

    <div v-else class="space-y-6">
      <!-- Overview cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card p-4 sm:p-5">
          <p class="text-sm text-gray-400 mb-1">Total Saved</p>
          <p class="text-xl sm:text-2xl font-bold text-white">
            ₦{{ formatNumber(overview.totalSaved) }}
          </p>
          <p class="text-xs text-green-400 mt-1">
            +{{ overview.growth }}% vs last period
          </p>
        </div>

        <div class="glass-card p-4 sm:p-5">
          <p class="text-sm text-gray-400 mb-1">Total Deposits</p>
          <p class="text-xl sm:text-2xl font-bold text-green-400">
            ₦{{ formatNumber(overview.totalDeposits) }}
          </p>
        </div>

        <div class="glass-card p-4 sm:p-5">
          <p class="text-sm text-gray-400 mb-1">Total Withdrawals</p>
          <p class="text-xl sm:text-2xl font-bold text-red-400">
            ₦{{ formatNumber(overview.totalWithdrawals) }}
          </p>
        </div>

        <div class="glass-card p-4 sm:p-5">
          <p class="text-sm text-gray-400 mb-1">Active Goals</p>
          <p class="text-xl sm:text-2xl font-bold text-white">
            {{ overview.activeGoals || 0 }}
          </p>
        </div>
      </div>

      <!-- Chart -->
      <div class="glass-card p-4 md:p-6">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4"
        >
          <h2 class="text-lg md:text-xl font-bold text-white">Savings Trend</h2>

          <span class="text-sm text-gray-400">
            {{ periodLabels[selectedPeriod] }}
          </span>
        </div>

        <div class="h-64 sm:h-72 md:h-80">
          <apexchart
            type="area"
            height="100%"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>
      </div>

      <!-- Transactions -->
      <div class="glass-card p-4 md:p-6">
        <h2 class="text-lg md:text-xl font-bold text-white mb-4">
          Recent Transactions
        </h2>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[650px] text-sm">
            <thead>
              <tr class="text-left text-gray-400 border-b border-gray-800">
                <th class="pb-3 font-medium">Type</th>
                <th class="pb-3 font-medium">Goal</th>
                <th class="pb-3 font-medium text-right">Amount</th>
                <th class="pb-3 font-medium text-right">Date</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-800">
              <tr
                v-for="tx in transactions"
                :key="tx._id"
                class="text-gray-300"
              >
                <td class="py-3 capitalize">
                  <span class="flex items-center gap-2">
                    <span class="text-lg">
                      {{ transactionIcon(tx.type) }}
                    </span>
                    {{ tx.type.replace("_", " ") }}
                  </span>
                </td>

                <td class="py-3">
                  {{ tx.goal?.title || "-" }}
                </td>

                <td
                  class="py-3 text-right font-medium"
                  :class="transactionColor(tx.type)"
                >
                  {{ tx.type === "deposit" ? "+" : "" }}₦{{
                    formatNumber(tx.amount)
                  }}
                </td>

                <td class="py-3 text-right text-gray-400">
                  {{ formatDate(tx.createdAt) }}
                </td>
              </tr>

              <tr v-if="transactions.length === 0">
                <td colspan="4" class="py-8 text-center text-gray-500">
                  No transactions yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import apexchart from "vue3-apexcharts";

const loading = ref(false);
const selectedPeriod = ref("week");
const overview = ref({
  totalSaved: 0,
  growth: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  activeGoals: 0,
});
const transactions = ref([]);
const chartSeries = ref([]);
const chartOptions = ref({});

const periods = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

const periodLabels = {
  week: "Last 7 days",
  month: "Last 30 days",
  year: "Last 12 months",
};

const changePeriod = (period) => {
  selectedPeriod.value = period;
  fetchAnalytics();
};

const fetchAnalytics = async () => {
  loading.value = true;
  try {
    // Fetch analytics data
  } catch (error) {
    console.error("Error fetching analytics:", error);
  } finally {
    loading.value = false;
  }
};

const formatNumber = (num) => {
  return num?.toLocaleString() || "0";
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const transactionIcon = (type) => {
  return type === "deposit" ? "📥" : "📤";
};

const transactionColor = (type) => {
  return type === "deposit" ? "text-green-400" : "text-red-400";
};

onMounted(() => {
  fetchAnalytics();
});
</script>
