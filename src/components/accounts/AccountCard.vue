<template>
  <div class="glass-card p-4 flex items-start justify-between">
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center"
      >
        <span class="text-xl">{{ getBankIcon(account.bankName) }}</span>
      </div>

      <div>
        <p class="font-medium text-white">
          {{ account.bankName }}
        </p>

        <p class="text-sm text-gray-400">
          •••• {{ account.lastFour }}
        </p>

        <p
          v-if="account.balance !== undefined"
          class="text-sm font-semibold text-white mt-1"
        >
          {{ formatCurrency(account.balance, account.currency) }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <span
        v-if="account.isDefault"
        class="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-300"
      >
        Default
      </span>

      <button
        @click="$emit('edit')"
        class="p-2 hover:bg-gray-700 rounded transition"
        title="Edit"
      >
        ✎
      </button>

      <button
        @click="$emit('delete')"
        class="p-2 hover:bg-gray-700 rounded transition text-red-400"
        title="Remove"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Account } from '@/stores/accounts'

defineProps<{
  account: Account
}>()

defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const getBankIcon = (bankName: string) => {
  const icons: Record<string, string> = {
    GTBank: '🏦',
    'Zenith Bank': '💎',
    'First Bank': '🔷',
    UBA: '🔴',
    Access: '🟢'
  }

  return icons[bankName] || '🏛️'
}

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency
  }).format(value)
}
</script>