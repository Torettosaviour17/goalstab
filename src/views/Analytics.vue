<template>
  <div class="p-6 space-y-6">

    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Analytics</h1>

      <div class="flex gap-2">
        <button
          v-for="period in ['7d','30d','90d']"
          :key="period"
          @click="changePeriod(period)"
          :class="[
            'px-3 py-1 rounded-lg text-sm',
            selectedPeriod === period
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          ]"
        >
          {{ period }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10">
      Loading analytics...
    </div>

    <div v-else class="space-y-6">

      <!-- Overview Cards -->
      <div class="grid md:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-white dark:bg-gray-800 shadow">
          <p class="text-sm text-gray-500">Total Saved</p>
          <p class="text-xl font-bold">₦{{ overview.totalSaved }}</p>
        </div>

        <div class="p-4 rounded-xl bg-white dark:bg-gray-800 shadow">
          <p class="text-sm text-gray-500">Total Deposits</p>
          <p class="text-xl font-bold text-green-500">
            ₦{{ overview.totalDeposits }}
          </p>
        </div>

        <div class="p-4 rounded-xl bg-white dark:bg-gray-800 shadow">
          <p class="text-sm text-gray-500">Total Withdrawals</p>
          <p class="text-xl font-bold text-red-500">
            ₦{{ overview.totalWithdrawals }}
          </p>
        </div>

        <div class="p-4 rounded-xl bg-white dark:bg-gray-800 shadow">
          <p class="text-sm text-gray-500">Savings Growth</p>
          <p class="text-xl font-bold">
            {{ overview.growth }}%
          </p>
        </div>
      </div>

      <!-- Trend Chart -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h2 class="font-semibold mb-4">Savings Trend</h2>
        <apexchart
          type="line"
          height="300"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>

      <!-- Transactions Table -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h2 class="font-semibold mb-4">Recent Transactions</h2>

        <table class="w-full text-sm">
          <thead>
            <tr class="text-left border-b border-gray-200 dark:border-gray-700">
              <th class="py-2">Type</th>
              <th>Goal</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="tx in transactions"
              :key="tx._id"
              class="border-b border-gray-100 dark:border-gray-700"
            >
              <td class="py-2 capitalize">{{ tx.type }}</td>
              <td>{{ tx.goal?.title || '-' }}</td>
              <td
                :class="{
                  'text-green-500': tx.type === 'deposit',
                  'text-red-500': tx.type === 'withdrawal',
                  'text-yellow-500': tx.type === 'goal_completed'
                }"
              >
                ₦{{ tx.amount }}
              </td>
              <td>{{ formatDate(tx.createdAt) }}</td>
            </tr>

            <tr v-if="transactions.length === 0">
              <td colspan="4" class="py-6 text-center text-gray-500">
                No transactions yet.
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import axios from '@/utils/axios'
import api from '@/services/api'

const loading = ref(false)
const selectedPeriod = ref('30d')

const overview = ref({
  totalSaved: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  growth: 0
})

const trendData = ref({
  labels: [],
  data: []
})

const transactions = ref([])

const chartOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  xaxis: { categories: trendData.value.labels },
  stroke: { curve: 'smooth' }
}))

const chartSeries = computed(() => ([
  {
    name: 'Savings',
    data: trendData.value.data
  }
]))

const fetchOverview = async () => {
  const res = await axios.get('/analytics/overview')
  overview.value = res.data
}

const fetchTrend = async () => {
  const res = await axios.get(`/analytics/trend?period=${selectedPeriod.value}`)
  trendData.value = {
    labels: res.data?.labels || [],
    data: res.data?.data || []
  }
}

const fetchTransactions = async () => {
  const res = await axios.get('/analytics/recent-transactions')
  transactions.value = res.data
}

const changePeriod = async (period) => {
  selectedPeriod.value = period
  loading.value = true
  await fetchTrend()
  loading.value = false
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchOverview(),
      fetchTrend(),
      fetchTransactions()
    ])
  } finally {
    loading.value = false
  }
})
</script>