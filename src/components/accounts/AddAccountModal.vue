<template>
  <BaseModal v-model="show" :title="isEditing ? 'Edit Account' : 'Add Account'">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">Account Number</label>
        <input
          v-model="form.accountNumber"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          required
          maxlength="10"
          pattern="[0-9]{10}"
          placeholder="0123456789"
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">Bank</label>
        <button
          type="button"
          class="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
          @click="openBankPicker"
        >
          <span :class="form.bankName ? 'text-white' : 'text-gray-500'">
            {{ form.bankName || 'Select bank' }}
          </span>
          <span class="text-gray-400">⌄</span>
        </button>

        <p v-if="banksLoading" class="text-xs text-gray-500 mt-1">Loading banks...</p>
        <p v-else-if="banksError" class="text-xs text-red-400 mt-1">{{ banksError }}</p>
        <p v-else-if="resolveError" class="text-xs text-red-400 mt-1">{{ resolveError }}</p>

        <div
          v-if="form.accountName"
          class="mt-3 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3"
        >
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-400">
            ✓
          </div>
          <div class="min-w-0">
            <p class="text-xs text-green-400">Account verified</p>
            <p class="truncate text-sm font-medium text-white">{{ form.accountName }}</p>
          </div>
        </div>

        <div v-else-if="resolvingAccount" class="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-600 border-t-primary-400"></span>
          Verifying account...
        </div>
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
        <BaseButton type="submit" :loading="loading" :disabled="loading || resolvingAccount || !form.accountName">
          {{ isEditing ? 'Update' : 'Add Account' }}
        </BaseButton>
      </div>
    </form>

    <Teleport to="body">
      <div v-if="showBankPicker" class="fixed inset-0 z-[60]">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeBankPicker"></div>

        <div class="relative flex min-h-full items-end sm:items-center justify-center sm:p-6">
          <div class="w-full sm:max-w-md max-h-[85vh] flex flex-col bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl shadow-2xl">
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <h3 class="text-base font-semibold text-white">Select bank</h3>
              <button
                type="button"
                aria-label="Close"
                class="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-gray-800"
                @click="closeBankPicker"
              >
                ✕
              </button>
            </div>

            <div class="p-4 border-b border-gray-800">
              <div class="relative">
                <input
                  v-model="bankSearch"
                  type="search"
                  autofocus
                  placeholder="Search banks"
                  class="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">⌕</span>
              </div>
            </div>

            <div class="overflow-y-auto p-2">
              <button
                v-for="bank in filteredBanks"
                :key="bank.code"
                type="button"
                class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left hover:bg-gray-800 active:bg-gray-750 transition"
                @click="selectBank(bank)"
              >
                <span class="text-sm text-gray-200">{{ bank.name }}</span>
                <span v-if="form.bankName === bank.name" class="text-primary-400">✓</span>
              </button>

              <p v-if="!filteredBanks.length && !banksLoading" class="px-4 py-8 text-center text-sm text-gray-500">
                No banks found
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
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

interface Bank {
  name: string
  code: string
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

const banks = ref<Bank[]>([])
const banksLoading = ref(false)
const banksError = ref('')
const bankSearch = ref('')
const showBankPicker = ref(false)
const resolvingAccount = ref(false)
const resolveError = ref('')

const filteredBanks = computed(() => {
  const query = bankSearch.value.trim().toLowerCase()

  if (!query) return banks.value

  return banks.value.filter((bank) => bank.name.toLowerCase().includes(query))
})

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
  showBankPicker.value = false
  bankSearch.value = ''
  show.value = false
}

const openBankPicker = () => {
  showBankPicker.value = true
  bankSearch.value = ''
}

const closeBankPicker = () => {
  showBankPicker.value = false
  bankSearch.value = ''
}

const selectBank = (bank: Bank) => {
  form.bankName = bank.name
  closeBankPicker()
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
    resolveError.value = err?.response?.data?.message || 'Could not verify this account.'
  } finally {
    resolvingAccount.value = false
  }
}

onMounted(async () => {
  banksLoading.value = true

  try {
    const { data } = await api.get<Bank[]>('/accounts/banks')
    banks.value = Array.isArray(data) ? data : []
  } catch {
    banksError.value = 'Unable to load banks. Please try again.'
  } finally {
    banksLoading.value = false
  }
})

watch(() => [form.bankName, form.accountNumber], () => {
  if (form.accountName) form.accountName = ''
  resolveError.value = ''

  if (/^\d{10}$/.test(form.accountNumber) && banks.value.length && !form.bankName) {
    openBankPicker()
  }

  void resolveAccount()
})

const handleSubmit = () => {
  if (!/^\d{10}$/.test(form.accountNumber) || !form.bankName || !form.accountName) return
  emit('submit', { ...form })
}
</script>
