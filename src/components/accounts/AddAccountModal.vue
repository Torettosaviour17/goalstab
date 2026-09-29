<template>
  <BaseModal v-model="show" :title="isEditing ? 'Edit Account' : 'Add Account'">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">Bank Name</label>
        <select v-model="form.bankName" required
          class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="" disabled>Select your bank</option>
          <option v-for="bank in banks" :key="bank.code" :value="bank.name">{{ bank.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">Account Name</label>
        <input v-model="form.accountName" type="text" required readonly placeholder="Account name will appear here"
          class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <p v-if="resolvingAccount" class="text-xs text-primary-400 mt-1">Verifying account...</p>
        <p v-else-if="resolveError" class="text-xs text-red-400 mt-1">{{ resolveError }}</p>
        <p v-else-if="form.accountName" class="text-xs text-green-400 mt-1">Account verified</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">Account Number</label>
        <input v-model="form.accountNumber" type="text" inputmode="numeric" required maxlength="10"
          pattern="[0-9]{10}" placeholder="0123456789"
          class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <p class="text-xs text-gray-500 mt-1">Enter exactly 10 digits.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Account Type</label>
          <select v-model="form.type"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="savings">Savings</option>
            <option value="checking">Checking</option>
            <option value="credit">Credit</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Currency</label>
          <select v-model="form.currency"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="NGN">NGN (₦)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <input id="isDefault" v-model="form.isDefault" type="checkbox"
          class="w-4 h-4 rounded bg-gray-800 border-gray-700 text-primary-500 focus:ring-primary-500" />
        <label for="isDefault" class="text-sm text-gray-300">Set as default account</label>
      </div>
      <div class="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
        <BaseButton variant="secondary" type="button" @click="close">Cancel</BaseButton>
        <BaseButton type="submit" :loading="loading" :disabled="loading">
          {{ isEditing ? 'Update' : 'Add Account' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, computed, watch, onMounted, ref } from 'vue'
import BaseModal from '@/components/shared/BaseModal.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import type { Account } from '@/stores/accounts'
import api from '@/services/api'

interface Props {
  modelValue: boolean
  account?: Account | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  account: null,
  loading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', account: {
    bankName: string
    accountName: string
    accountNumber: string
    type: 'savings' | 'checking' | 'credit'
    currency: string
    isDefault: boolean
  }): void
}>()

const show = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const isEditing = computed(() => !!props.account)

const banks = ref<Array<{ name: string; code: string }>>([])
const resolvingAccount = ref(false)
const resolveError = ref('')

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
    resolveError.value = ''
  } else {
    form.bankName = ''
    form.accountName = ''
    form.accountNumber = ''
    form.type = 'savings'
    form.currency = 'NGN'
    form.isDefault = false
    resolveError.value = ''
  }
}, { immediate: true })

const close = () => {
  show.value = false
}

const resolveAccount = async () => {
  resolveError.value = ''
  form.accountName = ''

  if (!form.bankName || !/^\d{10}$/.test(form.accountNumber)) return

  const bank = banks.value.find((item) => item.name === form.bankName)
  if (!bank) return

  resolvingAccount.value = true
  try {
    const { data } = await api.get<{ accountName: string }>('/accounts/resolve', {
      params: {
        accountNumber: form.accountNumber,
        bankCode: bank.code
      }
    })
    form.accountName = data.accountName
  } catch (err: any) {
    resolveError.value = err?.response?.data?.message || 'Could not verify this account. Check the bank and account number.'
  } finally {
    resolvingAccount.value = false
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get<Array<{ name: string; code: string }>>('/accounts/banks')
    banks.value = data
  } catch {
    resolveError.value = 'Unable to load banks. Please try again.'
  }
})

watch(() => [form.bankName, form.accountNumber], () => {
  if (form.accountName) form.accountName = ''
  resolveError.value = ''
  void resolveAccount()
})

const handleSubmit = () => {
  if (!/^\d{10}$/.test(form.accountNumber) || !form.accountName) return
  emit('submit', { ...form })
}
</script>