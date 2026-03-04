<template>
  <BaseModal v-model="show" title="Request Withdrawal">
    <div class="space-y-6">
      <div v-if="goal" class="p-4 bg-gray-800/50 rounded-xl">
        <p class="text-sm text-gray-400">Requesting withdrawal from:</p>
        <p class="font-medium text-white">{{ goal.title }}</p>
        <p class="text-sm text-gray-300 mt-1">Available balance: ₦{{ formatNumber(goal.saved) }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Amount (₦)</label>
          <input
            v-model.number="form.amount"
            type="number"
            required
            min="1"
            :max="goal?.saved"
            step="100"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p v-if="form.amount > (goal?.saved || 0)" class="mt-1 text-xs text-danger">
            Amount exceeds available balance
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Bank Name</label>
          <input
            v-model="form.bankName"
            type="text"
            required
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Account Name</label>
          <input
            v-model="form.accountName"
            type="text"
            required
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Account Number</label>
          <input
            v-model="form.accountNumber"
            type="text"
            required
            maxlength="10"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div class="flex gap-2 justify-end pt-4">
          <BaseButton variant="secondary" @click="close">Cancel</BaseButton>
          <BaseButton type="submit" :disabled="!isValid" :loading="loading">
            Submit Request
          </BaseButton>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/shared/BaseModal.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import type { Goal } from '@/types/goal'

const props = defineProps<{
  modelValue: boolean
  goal?: Goal | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: any): void
}>()

const show = ref(props.modelValue)
const loading = ref(false)

const form = ref({
  amount: 0,
  bankName: '',
  accountName: '',
  accountNumber: ''
})

watch(() => props.goal, (goal) => {
  if (goal) {
    form.value.amount = goal.saved // default to full amount
  }
}, { immediate: true })

watch(show, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    form.value = { amount: 0, bankName: '', accountName: '', accountNumber: '' }
  }
})

const isValid = computed(() => {
  const { amount, bankName, accountName, accountNumber } = form.value
  return amount > 0 && amount <= (props.goal?.saved || 0) &&
         bankName && accountName && accountNumber && accountNumber.length >= 10
})

const close = () => {
  show.value = false
}

const handleSubmit = async () => {
  if (!isValid.value) return
  loading.value = true
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500))
  emit('submit', { ...form.value })
  loading.value = false
  close()
}

const formatNumber = (num: number) => new Intl.NumberFormat().format(num)
</script>