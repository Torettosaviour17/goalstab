<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <!-- Header with period selector -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-white">Analytics</h1>
        <p class="text-gray-400">Track your savings performance</p>
      </div>

      <!-- Period selector - scrollable on mobile -->
      <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        <button
          v-for="period in periods"
          :key="period.value"
          @click="changePeriod(period.value)"
          :class="[
            'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition',
            selectedPeriod === period.value
              ? 'bg-primary-500 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700',
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
      ></div>
    </div>

    <div v-else class="space-y-6">
      <!-- Overview Cards - Responsive grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card p-5">
          <p class="text-sm text-gray-400 mb-1">Total Saved</p>
          <p class="text-2xl font-bold text-white">
            ₦{{ formatNumber(overview.totalSaved) }}
          </p>
          <p class="text-xs text-green-400 mt-1">
            +{{ overview.growth }}% vs last period
          </p>
        </div>

        <div class="glass-card p-5">
          <p class="text-sm text-gray-400 mb-1">Total Deposits</p>
          <p class="text-2xl font-bold text-green-400">
            ₦{{ formatNumber(overview.totalDeposits) }}
          </p>
        </div>

        <div class="glass-card p-5">
          <p class="text-sm text-gray-400 mb-1">Total Withdrawals</p>
          <p class="text-2xl font-bold text-red-400">
            ₦{{ formatNumber(overview.totalWithdrawals) }}
          </p>
        </div>

        <div class="glass-card p-5">
          <p class="text-sm text-gray-400 mb-1">Active Goals</p>
          <p class="text-2xl font-bold text-white">
            {{ overview.activeGoals || 0 }}
          </p>
        </div>
      </div>

      <!-- Trend Chart -->
      <div class="glass-card p-4 md:p-6">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4"
        >
          <h2 class="text-lg md:text-xl font-bold text-white">Savings Trend</h2>
          <span class="text-sm text-gray-400">{{
            periodLabels[selectedPeriod]
          }}</span>
        </div>

        <!-- Chart container with proper height for mobile -->
        <div class="h-64 md:h-80">
          <apexchart
            type="area"
            height="100%"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>
      </div>

      <!-- Transactions Table - Horizontally scrollable on mobile -->
      <div class="glass-card p-4 md:p-6">
        <h2 class="text-lg md:text-xl font-bold text-white mb-4">
          Recent Transactions
        </h2>

        <div class="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <table class="w-full min-w-[600px] md:min-w-full text-sm">
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
                    <span
                      :class="transactionIcon(tx.type)"
                      class="text-lg"
                    ></span>
                    {{ tx.type.replace("_", " ") }}
                  </span>
                </td>
                <td class="py-3">{{ tx.goal?.title || "-" }}</td>
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

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from "@/services/api";

const loading = ref(false);
const selectedPeriod = ref("30d");

const periods = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
];

const periodLabels: Record<string, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

const overview = ref({
  totalSaved: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  growth: 0,
  activeGoals: 0,
});

const trendData = ref({
  labels: [],
  data: [],
});

const transactions = ref<Array<{ _id: string; type: string; goal?: { title: string }; amount: number; createdAt: string }>>([]);

const chartOptions = computed(() => ({
  chart: {
    background: "transparent",
    toolbar: { show: false },
    foreColor: "#9ca3af",
  },
  theme: { mode: "dark" },
  xaxis: {
    categories: trendData.value.labels,
    labels: {
      rotate: -45,
      rotateAlways: true,
      hideOverlappingLabels: true,
      style: { colors: "#9ca3af" },
    },
  },
  yaxis: {
    labels: {
      formatter: (value: number) => `₦${value.toLocaleString()}`,
    },
  },
  stroke: { curve: "smooth", width: 3 },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
  colors: ["#3b82f6"],
  tooltip: {
    theme: "dark",
    y: { formatter: (value: number) => `₦${value.toLocaleString()}` },
  },
  grid: {
    borderColor: "#374151",
    strokeDashArray: 4,
  },
}));

const chartSeries = computed(() => [
  {
    name: "Savings",
    data: trendData.value.data,
  },
]);

const fetchOverview = async () => {
  try {
    const res = await api.get("/analytics/overview");
    overview.value = { ...overview.value, ...res.data };
  } catch (error) {
    console.error("Failed to fetch overview:", error);
  }
};

const fetchTrend = async () => {
  try {
    const res = await api.get(
      `/analytics/trend?period=${selectedPeriod.value}`,
    );
    trendData.value = {
      labels: res.data?.labels || [],
      data: res.data?.data || [],
    };
  } catch (error) {
    console.error("Failed to fetch trend:", error);
  }
};

const fetchTransactions = async () => {
  try {
    const res = await api.get("/analytics/recent-transactions");
    transactions.value = res.data;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
  }
};

const changePeriod = async (period: string) => {
  selectedPeriod.value = period;
  loading.value = true;
  await fetchTrend();
  loading.value = false;
};

const formatNumber = (num: number) => {
  if (!num && num !== 0) return "0";
  return new Intl.NumberFormat().format(num);
};

const formatDate = (date: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const transactionIcon = (type: string) => {
  const icons: Record<string, string> = {
    deposit: "💰",
    withdrawal: "💸",
    goal_completed: "🎉",
    auto_save: "⚡",
  };
  return icons[type] || "📝";
};

const transactionColor = (type: string) => {
  const colors: Record<string, string> = {
    deposit: "text-green-400",
    withdrawal: "text-red-400",
    goal_completed: "text-yellow-400",
    auto_save: "text-blue-400",
  };
  return colors[type] || "text-gray-400";
};

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([fetchOverview(), fetchTrend(), fetchTransactions()]);
  } finally {
    loading.value = false;
  }
});
</script>
