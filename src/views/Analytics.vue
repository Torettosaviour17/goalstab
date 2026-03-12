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
          v-for="p in periods"
          :key="p.value"
          @click="changePeriod(p.value)"
          :class="[
            'px-4 py-2 text-sm md:text-base rounded-lg font-medium whitespace-nowrap transition shrink-0',
            selectedPeriod === p.value
              ? 'bg-primary-500 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700',
          ]"
        >
          {{ p.label }}
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
      <!-- Overview cards (using only data from backend) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card p-4 sm:p-5">
          <p class="text-sm text-gray-400 mb-1">Total Saved</p>
          <p class="text-xl sm:text-2xl font-bold text-white">
            ₦{{ formatNumber(overview.totalSaved) }}
          </p>
          <p class="text-xs text-green-400 mt-1">
            +{{ overview.monthlyGrowth.toFixed(1) }}% vs last month
          </p>
        </div>

        <div class="glass-card p-4 sm:p-5">
          <p class="text-sm text-gray-400 mb-1">Active Goals</p>
          <p class="text-xl sm:text-2xl font-bold text-white">
            {{ overview.activeGoals }}
          </p>
        </div>

        <div class="glass-card p-4 sm:p-5">
          <p class="text-sm text-gray-400 mb-1">Completed Goals</p>
          <p class="text-xl sm:text-2xl font-bold text-white">
            {{ overview.completedGoals }}
          </p>
        </div>

        <div class="glass-card p-4 sm:p-5">
          <p class="text-sm text-gray-400 mb-1">Overall Progress</p>
          <p class="text-xl sm:text-2xl font-bold text-white">
            {{ overview.overallProgress }}%
          </p>
        </div>
      </div>

      <!-- Two‑column layout for charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Savings Trend Chart -->
        <div class="glass-card p-4 md:p-6">
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4"
          >
            <h2 class="text-lg md:text-xl font-bold text-white">
              Savings Trend
            </h2>
            <span class="text-sm text-gray-400">{{
              periodLabels[selectedPeriod]
            }}</span>
          </div>
          <div class="h-64 sm:h-72 md:h-80">
            <apexchart
              type="area"
              height="100%"
              :options="trendChartOptions"
              :series="trendSeries"
            />
          </div>
        </div>

        <!-- Goal Distribution Chart -->
        <div class="glass-card p-4 md:p-6">
          <h2 class="text-lg md:text-xl font-bold text-white mb-4">
            Goal Distribution
          </h2>
          <div class="h-64 sm:h-72 md:h-80">
            <apexchart
              v-if="distribution.length"
              type="donut"
              height="100%"
              :options="distributionChartOptions"
              :series="distributionSeries"
            />
            <div
              v-else
              class="flex items-center justify-center h-full text-gray-400"
            >
              No categories yet
            </div>
          </div>
          <!-- Legend as list -->
          <div v-if="distribution.length" class="mt-4 space-y-2">
            <div
              v-for="cat in distribution"
              :key="cat.name"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: getColorValue(cat.color) }"
                ></div>
                <span class="text-gray-300">{{ cat.name }}</span>
              </div>
              <span class="text-white">{{ cat.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Goal Completion Forecast -->
      <div class="glass-card p-4 md:p-6">
        <h2 class="text-lg md:text-xl font-bold text-white mb-4">
          Goal Completion Forecast
        </h2>
        <div v-if="forecast.length" class="space-y-3">
          <div
            v-for="item in forecast"
            :key="item.goalId"
            class="flex items-center justify-between"
          >
            <div>
              <p class="font-medium text-white">{{ item.title }}</p>
              <p class="text-xs text-gray-400">
                ₦{{ formatNumber(item.saved) }} of ₦{{
                  formatNumber(item.target)
                }}
                ({{ item.progress }}%)
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-primary-400">
                {{ item.estimatedDate }}
              </p>
              <p class="text-xs text-gray-400">at current rate</p>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-400 text-center py-4">
          No active goals to forecast
        </p>
      </div>

      <!-- Recent Transactions -->
      <div class="glass-card p-4 md:p-6">
        <h2 class="text-lg md:text-xl font-bold text-white mb-4">
          Recent Transactions
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
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
                    <span class="text-lg">{{ transactionIcon(tx.type) }}</span>
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
import { storeToRefs } from "pinia";
import { useAnalyticsStore } from "@/stores/analytics";
import { useGoalsStore } from "@/stores/goals";

const analyticsStore = useAnalyticsStore();
const goalsStore = useGoalsStore();
const { overview, trendData, distribution, transactions, loading } =
  storeToRefs(analyticsStore);
const { goals } = storeToRefs(goalsStore);

const selectedPeriod = ref("month");
const periods = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];
const periodLabels: Record<string, string> = {
  week: "Last 7 days",
  month: "Last 30 days",
  year: "Last 12 months",
};

// Trend chart options
const trendChartOptions = computed(() => ({
  chart: {
    background: "transparent",
    toolbar: { show: false },
    foreColor: "#9ca3af",
  },
  theme: { mode: "dark" },
  xaxis: {
    categories: trendData.value.labels,
    labels: { rotate: -45, style: { colors: "#9ca3af" } },
  },
  yaxis: {
    labels: { formatter: (val: number) => `₦${val.toLocaleString()}` },
  },
  stroke: { curve: "smooth", width: 3 },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 },
  },
  colors: ["#3b82f6"],
  tooltip: {
    theme: "dark",
    y: { formatter: (val: number) => `₦${val.toLocaleString()}` },
  },
}));

const trendSeries = computed(() => [
  { name: "Savings", data: trendData.value.data },
]);

// Distribution chart (donut)
const distributionSeries = computed(() =>
  distribution.value.map((d) => d.percentage),
);
const distributionChartOptions = computed(() => ({
  chart: {
    type: "donut",
    background: "transparent",
    foreColor: "#9ca3af",
  },
  labels: distribution.value.map((d) => d.name),
  colors: distribution.value.map((d) => getColorValue(d.color)),
  theme: { mode: "dark" },
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        labels: {
          show: true,
          name: { show: true, color: "#fff" },
          value: {
            show: true,
            color: "#9ca3af",
            formatter: (val: any) => val + "%",
          },
        },
      },
    },
  },
}));

// Helper to convert tailwind color class to hex (simplified)
function getColorValue(colorClass: string): string {
  const colorMap: Record<string, string> = {
    "bg-primary-500": "#3b82f6",
    "bg-success": "#10b981",
    "bg-warning": "#f59e0b",
    "bg-secondary-500": "#8b5cf6",
    "bg-danger": "#ef4444",
    "bg-gray-500": "#6b7280",
  };
  return colorMap[colorClass] || "#6b7280";
}

// Forecast: estimate completion date based on current saved vs target and average monthly addition
const forecast = computed(() => {
  return goals.value
    .filter((g) => g.progress < 100 && g.progress > 0)
    .map((g) => {
      // Calculate monthly contribution rate from auto‑save settings
      let monthlyRate = 0;
      if (g.autoSaveEnabled && g.autoSave > 0) {
        if (g.type === "percentage") {
          // Assume average monthly income of 500,000 (could be fetched from user profile later)
          const monthlyIncome = 500000;
          monthlyRate = (g.autoSave / 100) * monthlyIncome;
        } else {
          monthlyRate = g.autoSave;
        }
        // Adjust for frequency
        if (g.frequency === "daily") monthlyRate *= 30;
        else if (g.frequency === "weekly") monthlyRate *= 4;
      }
      if (monthlyRate <= 0) return null;
      const remaining = g.target - g.saved;
      const monthsNeeded = remaining / monthlyRate;
      const estimatedDate = new Date();
      estimatedDate.setMonth(
        estimatedDate.getMonth() + Math.ceil(monthsNeeded),
      );
      return {
        goalId: g._id,
        title: g.title,
        saved: g.saved,
        target: g.target,
        progress: g.progress,
        estimatedDate: estimatedDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
});

const changePeriod = async (period: string) => {
  selectedPeriod.value = period;
  await analyticsStore.fetchTrend(period);
};

const formatNumber = (num: number) => num?.toLocaleString() || "0";
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
  await Promise.all([
    analyticsStore.fetchAll(selectedPeriod.value),
    goalsStore.fetchGoals(), // ensure goals are loaded for forecast
  ]);
});
</script>
