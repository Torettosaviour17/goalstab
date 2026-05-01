<template>
  <BaseModal v-model="show" title="Withdraw Funds" :max-width="500">
    <div class="space-y-6">
      <!-- Goal summary -->
      <div
        v-if="goal"
        class="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-700"
        >
          {{ goal.icon }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-white truncate">{{ goal.title }}</p>
          <p class="text-sm text-gray-400">
            Available: ₦{{ formatNumber(availableBalance) }}
          </p>
        </div>
      </div>

      <!-- Success state after submission -->
      <div v-if="submitted" class="space-y-4 text-center py-4">
        <div
          class="w-16 h-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center text-3xl"
        >
          ⏳
        </div>
        <div>
          <h3 class="text-lg font-bold text-white mb-1">Withdrawal Pending</h3>
          <p class="text-sm text-gray-400 mb-4">
            ₦{{ formatNumber(submittedAmount) }} withdrawal from
            {{ goal?.title }}
          </p>
          <div
            class="bg-gray-800/50 rounded-lg p-3 space-y-2 text-sm text-left"
          >
            <div class="flex justify-between">
              <span class="text-gray-400">Amount</span>
              <span class="text-white font-medium"
                >₦{{ formatNumber(submittedAmount) }}</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Status</span>
              <span class="text-amber-400 font-medium"
                >🟡 Pending admin approval</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Bank</span>
              <span class="text-white font-medium">{{ submittedBank }}</span>
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-4">
          You'll be notified when admin approves or rejects this withdrawal.
        </p>
        <BaseButton variant="primary" class="w-full" @click="close">
          Done
        </BaseButton>
      </div>

      <!-- Form (before submission) -->
      <div v-else class="space-y-4">
        <!-- Amount -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-1">
            Withdrawal amount (₦)
          </label>
          <div class="relative">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              >₦</span
            >
            <input
              v-model.number="amount"
              type="number"
              min="100"
              :max="availableBalance"
              placeholder="0"
              class="w-full pl-8 pr-4 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <p v-if="amountError" class="mt-1 text-xs text-red-400">
            {{ amountError }}
          </p>
          <p class="mt-1 text-xs text-gray-500">
            Max available: ₦{{ formatNumber(availableBalance) }}
          </p>
        </div>

        <!-- Quick amounts -->
        <div>
          <p class="text-xs text-gray-400 mb-2">Quick select</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="amt in quickAmounts"
              :key="amt"
              type="button"
              @click="amount = amt"
              :disabled="amt > availableBalance"
              class="px-3 py-1.5 text-xs rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed"
              :class="
                amount === amt
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              "
            >
              ₦{{ formatNumber(amt) }}
            </button>
          </div>
        </div>

        <!-- Bank selection -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-1"
            >Bank name</label
          >
          <select
            v-model="bankName"
            class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select bank...</option>
            <option v-for="bank in nigeriaBanks" :key="bank" :value="bank">
              {{ bank }}
            </option>
          </select>
          <p v-if="bankError" class="mt-1 text-xs text-red-400">
            {{ bankError }}
          </p>
        </div>

        <!-- Account name -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-1"
            >Account name</label
          >
          <input
            v-model="accountName"
            type="text"
            placeholder="e.g. John Doe"
            class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <p v-if="accountNameError" class="mt-1 text-xs text-red-400">
            {{ accountNameError }}
          </p>
        </div>

        <!-- Account number -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-1"
            >Account number</label
          >
          <input
            v-model="accountNumber"
            type="text"
            inputmode="numeric"
            maxlength="11"
            placeholder="11-digit number"
            class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
          <p v-if="accountNumberError" class="mt-1 text-xs text-red-400">
            {{ accountNumberError }}
          </p>
        </div>

        <!-- Warning if partial withdrawal -->
        <div
          v-if="amount && amount < availableBalance"
          class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm"
        >
          <p class="text-blue-300 text-xs font-medium mb-1">
            ℹ️ Partial withdrawal
          </p>
          <p class="text-blue-200/70 text-xs">
            Your goal will remain active with ₦{{
              formatNumber(availableBalance - (amount || 0))
            }}
            remaining. The goal closes only when all funds are withdrawn.
          </p>
        </div>
      </div>

      <!-- Actions (form only, not shown on success) -->
      <div v-if="!submitted" class="flex gap-3 pt-2">
        <BaseButton variant="secondary" class="flex-1" @click="close">
          Cancel
        </BaseButton>
        <BaseButton
          variant="primary"
          class="flex-1"
          :disabled="!canSubmit"
          :loading="loading"
          @click="handleSubmit"
        >
          Submit withdrawal
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import type { Goal } from "@/stores/goals";

const props = defineProps<{
  modelValue: boolean;
  goal?: Goal | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (
    e: "submit",
    data: {
      amount: number;
      bankName: string;
      accountName: string;
      accountNumber: string;
    },
  ): void;
}>();

const show = ref(props.modelValue);
const loading = ref(false);
const submitted = ref(false);
const submittedAmount = ref(0);
const submittedBank = ref("");

// Form state
const amount = ref<number | null>(null);
const bankName = ref("");
const accountName = ref("");
const accountNumber = ref("");

// Nigerian banks
const nigeriaBanks = [
  "Access Bank",
  "Zenith Bank",
  "Guaranty Trust Bank (GTB)",
  "First Bank",
  "Ecobank",
  "Fidelity Bank",
  "FCMB",
  "Stanbic IBTC",
  "UBA",
  "Wema Bank",
  "Union Bank",
  "Polaris Bank",
  "Heritage Bank",
];

// Quick amounts (10%, 25%, 50%, 75%, 100%)
const quickAmounts = computed(() => {
  const bal = props.goal?.saved ?? 0;
  return [
    Math.floor(bal * 0.1),
    Math.floor(bal * 0.25),
    Math.floor(bal * 0.5),
    Math.floor(bal * 0.75),
    bal,
  ].filter((a, i, arr) => a > 0 && (i === 0 || a !== arr[i - 1]));
});

const availableBalance = computed(() => {
  if (!props.goal) return 0;
  return Math.max(0, (props.goal.saved || 0) - (props.goal.withdrawn || 0));
});

// Validation
const amountError = computed(() => {
  if (amount.value === null) return null;
  if (amount.value <= 0) return "Amount must be greater than 0";
  if (amount.value > availableBalance.value)
    return "Amount exceeds available balance";
  return null;
});

const bankError = computed(() => {
  if (!bankName.value) return "Select a bank";
  return null;
});

const accountNameError = computed(() => {
  if (!accountName.value) return "Enter account name";
  if (!/^[a-zA-Z\s]+$/.test(accountName.value))
    return "Only letters and spaces allowed";
  return null;
});

const accountNumberError = computed(() => {
  if (!accountNumber.value) return "Enter account number";
  if (!/^\d{11}$/.test(accountNumber.value)) return "Must be exactly 11 digits";
  return null;
});

const canSubmit = computed(
  () =>
    !amountError.value &&
    !bankError.value &&
    !accountNameError.value &&
    !accountNumberError.value,
);

// Sync
watch(
  () => props.modelValue,
  (val) => {
    show.value = val;
  },
);
watch(show, (val) => {
  emit("update:modelValue", val);
  if (!val) {
    reset();
  }
});

const reset = () => {
  amount.value = null;
  bankName.value = "";
  accountName.value = "";
  accountNumber.value = "";
  submitted.value = false;
  submittedAmount.value = 0;
  submittedBank.value = "";
};

const close = () => {
  show.value = false;
};

const handleSubmit = async () => {
  if (!canSubmit.value) return;
  loading.value = true;
  try {
    submittedAmount.value = amount.value || 0;
    submittedBank.value = bankName.value;
    submitted.value = true;
    emit("submit", {
      amount: amount.value || 0,
      bankName: bankName.value,
      accountName: accountName.value,
      accountNumber: accountNumber.value,
    });
  } finally {
    loading.value = false;
  }
};

const formatNumber = (n: number) =>
  new Intl.NumberFormat().format(Math.round(n));
</script>
