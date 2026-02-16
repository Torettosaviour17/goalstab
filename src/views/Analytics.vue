<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">Analytics</h1>
    <p class="text-gray-400 mb-8">
      Track your savings performance and insights
    </p>

    <!-- Time Period Selector -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button
        v-for="period in periods"
        :key="period.value"
        @click="selectedPeriod = period.value"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          selectedPeriod === period.value
            ? 'bg-primary-500 text-white'
            : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700',
        ]"
      >
        {{ period.label }}
      </button>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="glass-card p-6">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center"
          >
            <span class="text-2xl">💰</span>
          </div>
          <div>
            <p class="text-sm text-gray-400">Total Saved</p>
            <p class="text-2xl font-bold text-white">
              ₦{{ formatNumber(totalSaved) }}
            </p>
            <p class="text-xs text-green-400">+12.5%</p>
          </div>
        </div>
      </div>
      <div class="glass-card p-6">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center"
          >
            <span class="text-2xl">📈</span>
          </div>
          <div>
            <p class="text-sm text-gray-400">Avg. Progress</p>
            <p class="text-2xl font-bold text-white">{{ avgProgress }}%</p>
            <p class="text-xs text-green-400">+8%</p>
          </div>
        </div>
      </div>
      <div class="glass-card p-6">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center"
          >
            <span class="text-2xl">🎯</span>
          </div>
          <div>
            <p class="text-sm text-gray-400">Goals Completed</p>
            <p class="text-2xl font-bold text-white">{{ completedCount }}</p>
            <p class="text-xs text-green-400">+2</p>
          </div>
        </div>
      </div>
      <div class="glass-card p-6">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-secondary-500/20 flex items-center justify-center"
          >
            <span class="text-2xl">⚡</span>
          </div>
          <div>
            <p class="text-sm text-gray-400">Savings Streak</p>
            <p class="text-2xl font-bold text-white">42 days</p>
            <p class="text-xs text-green-400">+5</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="glass-card p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-white">Savings Trend</h2>
          <span class="text-sm text-gray-400">Last 30 days</span>
        </div>

        <div class="h-64 flex items-end gap-2 overflow-x-auto pb-4 px-2">
          <div
            v-for="(value, i) in trendData"
            :key="i"
            class="flex-1 min-w-[14px] flex flex-col items-center gap-2 group"
          >
            <div class="relative w-full h-full flex items-end">
              <div
                class="w-full bg-primary-500/80 hover:bg-primary-500 rounded-t-sm transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary-500/40"
                :style="{
                  height:
                    value > 0
                      ? (value / Math.max(...trendData, 1)) * 100 + '%'
                      : '2px',
                }"
              ></div>

              <div
                v-if="value > 0"
                class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-xl border border-white/10"
              >
                ₦{{ formatNumber(value * 1000) }}
              </div>
            </div>

            <span class="text-[9px] text-gray-500 font-medium uppercase mt-1">
              {{ ["M", "T", "W", "T", "F", "S", "S"][i % 7] }}{{ i + 1 }}
            </span>
          </div>
        </div>
      </div>

      <!-- Goal Distribution -->
      <div class="glass-card p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-white">Goal Distribution</h2>
          <span class="text-sm text-gray-400">By category</span>
        </div>
        <div class="space-y-4">
          <div
            v-for="cat in categories"
            :key="cat.name"
            class="flex items-center gap-4"
          >
            <div class="w-24 text-sm text-gray-300">{{ cat.name }}</div>
            <div class="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full"
                :class="cat.color"
                :style="{ width: cat.percentage + '%' }"
              ></div>
            </div>
            <div class="w-16 text-right text-sm text-white">
              {{ cat.percentage }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity Table -->
    <div class="mt-8 glass-card p-6">
      <h2 class="text-xl font-bold text-white mb-4">Transaction History</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr
              class="text-left text-sm text-gray-400 border-b border-gray-800"
            >
              <th class="pb-3">Date</th>
              <th class="pb-3">Description</th>
              <th class="pb-3">Goal</th>
              <th class="pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr v-for="tx in transactions" :key="tx.id" class="text-sm">
              <td class="py-3 text-gray-300">{{ formatDate(tx.date) }}</td>
              <td class="py-3 text-white">{{ tx.description }}</td>
              <td class="py-3 text-gray-400">{{ tx.goal }}</td>
              <td
                class="py-3 text-right font-medium"
                :class="tx.amount >= 0 ? 'text-green-400' : 'text-red-400'"
              >
                {{ tx.amount >= 0 ? "+" : "" }}₦{{
                  formatNumber(Math.abs(tx.amount))
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useGoalsStore } from "@/stores/goals";

const goalsStore = useGoalsStore();
const selectedPeriod = ref("month");

const periods = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year", value: "year" },
];

// Mock data for charts (replace with real data later)
const trendData = ref([
  45, 52, 38, 65, 48, 53, 40, 42, 38, 47, 52, 58, 62, 55, 48, 42, 38, 45, 50,
  48,
]);

const categories = ref([
  { name: "Electronics", percentage: 48, color: "bg-primary-500" },
  { name: "Travel", percentage: 30, color: "bg-success" },
  { name: "Savings", percentage: 35, color: "bg-warning" },
  { name: "Education", percentage: 22, color: "bg-secondary-500" },
  { name: "Health", percentage: 15, color: "bg-danger" },
]);

const transactions = ref([
  {
    id: 1,
    date: new Date(Date.now() - 86400000),
    description: "Manual deposit",
    goal: "MacBook Pro",
    amount: 50000,
  },
  {
    id: 2,
    date: new Date(Date.now() - 172800000),
    description: "Auto-save",
    goal: "Emergency Fund",
    amount: 25000,
  },
  {
    id: 3,
    date: new Date(Date.now() - 259200000),
    description: "Withdrawal",
    goal: "Vacation",
    amount: -150000,
  },
  {
    id: 4,
    date: new Date(Date.now() - 345600000),
    description: "Goal completed",
    goal: "iPhone",
    amount: 0,
  },
  {
    id: 5,
    date: new Date(Date.now() - 432000000),
    description: "Deposit",
    goal: "Car",
    amount: 100000,
  },
]);

const totalSaved = computed(() => goalsStore.totalSaved);
const avgProgress = computed(() => Math.round(goalsStore.overallProgress));
const completedCount = computed(() => goalsStore.completedGoalsCount || 0);

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
</script>
