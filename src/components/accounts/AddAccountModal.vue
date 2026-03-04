<template>
  <BaseModal v-model="show" :title="isEditing ? 'Edit Account' : 'Add Account'">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">Bank Name</label>
        <input
          v-model="form.bankName"
          type="text"
          required
          placeholder="e.g., GTBank"
          class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">Account Name</label>
        <input
          v-model="form.accountName"
          type="text"
          required
          placeholder="John Doe"
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
          placeholder="0123456789"
          class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Account Type</label>
          <select
            v-model="form.type"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="savings">Savings</option>
            <option value="checking">Checking</option>
            <option value="credit">Credit</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Currency</label>
          <select
            v-model="form.currency"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="NGN">NGN (₦)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <input
          id="isDefault"
          v-model="form.isDefault"
          type="checkbox"
          class="w-4 h-4 rounded bg-gray-800 border-gray-700 text-primary-500 focus:ring-primary-500"
        />
        <label for="isDefault" class="text-sm text-gray-300">Set as default account</label>
      </div>
      <div class="flex gap-2 justify-end pt-4">
        <BaseButton variant="secondary" @click="close">Cancel</BaseButton>
        <BaseButton type="submit" :loading="loading">
          {{ isEditing ? 'Update' : 'Add Account' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '@/components/shared/BaseModal.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import type { Account } from '@/stores/accounts'

interface Props {
  modelValue: boolean
  account?: Account | null
}

const props = withDefaults(defineProps<Props>(), {
  account: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', account: any): void
}>()

const show = ref(props.modelValue)
const loading = ref(false)

const isEditing = computed(() => !!props.account)

const form = reactive({
  bankName: '',
  accountName: '',
  accountNumber: '',
  type: 'savings' as 'savings' | 'checking' | 'credit',
  currency: 'NGN',
  isDefault: false
})

watch(() => props.account, (account) => {
  if (account) {
    form.bankName = account.bankName
    form.accountName = account.accountName
    form.accountNumber = account.accountNumber
    form.type = account.type
    form.currency = account.currency
    form.isDefault = account.isDefault
  } else {
    form.bankName = ''
    form.accountName = ''
    form.accountNumber = ''
    form.type = 'savings'
    form.currency = 'NGN'
    form.isDefault = false
  }
}, { immediate: true })

watch(show, (val) => {
  emit('update:modelValue', val)
})

const close = () => {
  show.value = false
}

const handleSubmit = async () => {
  loading.value = true
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  emit('submit', { ...form })
  loading.value = false
  close()
}
</script>