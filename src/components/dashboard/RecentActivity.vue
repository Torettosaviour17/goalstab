<template>
  <div class="glass-card p-6">
    <h3 class="text-lg font-bold mb-4">Recent Activity</h3>

    <div v-if="loading" class="flex justify-center py-6">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
    </div>

    <div v-else-if="transactions.length" class="space-y-3">
      <div
        v-for="tx in transactions"
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
            <p class="font-medium">{{ tx.description || formatDefaultDescription(tx) }}</p>
            <p class="text-sm opacity-60">{{ formatTime(tx.createdAt) }}</p>
          </div>
        </div>
        <div class="text-right">
          <p
            class="font-bold"
            :class="tx.amount >= 0 ? 'text-green-400' : 'text-red-400'"
          >
            {{ tx.amount >= 0 ? "+" : "" }}₦{{ formatNumber(tx.amount) }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-6 text-gray-400">
      No recent activity
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionsStore } from '@/stores/transactions'

const transactionsStore = useTransactionsStore()
const { transactions, loading } = storeToRefs(transactionsStore)

// Load transactions when component mounts
onMounted(() => {
  transactionsStore.fetchRecentTransactions()
})

const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    deposit: '💰',
    withdrawal: '💸',
    goal_completed: '🎉',
    auto_save: '⚡'
  }
  return icons[type] || '📝'
}

const getActivityColor = (type: string): string => {
  const colors: Record<string, string> = {
    deposit: 'bg-green-500/20 text-green-400',
    withdrawal: 'bg-red-500/20 text-red-400',
    goal_completed: 'bg-blue-500/20 text-blue-400',
    auto_save: 'bg-purple-500/20 text-purple-400'
  }
  return colors[type] || 'bg-gray-500/20 text-gray-400'
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(Math.abs(num))
}

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const formatDefaultDescription = (tx: any): string => {
  if (tx.description) return tx.description
  if (tx.type === 'deposit') return `Deposit to ${tx.goal?.title || 'goal'}`
  if (tx.type === 'withdrawal') return `Withdrawal from ${tx.goal?.title || 'goal'}`
  if (tx.type === 'goal_completed') return `Goal completed: ${tx.goal?.title || ''}`
  if (tx.type === 'auto_save') return `Auto-save to ${tx.goal?.title || 'goal'}`
  return tx.type.replace('_', ' ')
}
</script>