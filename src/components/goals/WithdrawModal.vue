<template>
  <BaseModal v-model="show" title="Request Withdrawal">
    <div class="space-y-6">
      <div v-if="goal" class="p-4 bg-gray-800/50 rounded-xl">
        <p class="text-sm text-gray-400">Requesting withdrawal from:</p>
        <p class="font-medium text-white">{{ goal.title }}</p>
        <p class="text-sm text-gray-300 mt-1">
          Available balance: ₦{{ formatNumber(goal.availableBalance ?? goal.saved) }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Amount (₦)
          </label>
          <input
            v-model.number="form.amount"
            type="number"
            required
            min="1"
            :max="maxAllowed"
            step="1"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p v-if="amountError" class="mt-1 text-xs text-danger">{{ amountError }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Bank Name
          </label>
          <select
            v-model="form.bankName"
            required
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="" disabled>Select bank</option>
            <option v-for="bank in banks" :key="bank" :value="bank">{{ bank }}</option>
          </select>
          <p v-if="bankError" class="mt-1 text-xs text-danger">{{ bankError }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Account Name
          </label>
          <input
            v-model="form.accountName"
            type="text"
            required
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p v-if="nameError" class="mt-1 text-xs text-danger">{{ nameError }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Account Number
          </label>
          <input
            v-model="form.accountNumber"
            type="text"
            required
            maxlength="11"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p v-if="accountNumberError" class="mt-1 text-xs text-danger">{{ accountNumberError }}</p>
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
import { ref, computed, watch } from "vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import type { Goal } from "@/types/goal";

const props = defineProps<{
  modelValue: boolean;
  goal?: Goal | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", data: any): void;
}>();

const show = ref(props.modelValue);
const loading = ref(false);

const banks = [
  "Access Bank", "FCMB", "Fidelity Bank", "First Bank", "Guaranty Trust Bank",
  "United Bank for Africa", "Zenith Bank", "Standard Chartered", "Sterling Bank",
  "Union Bank", "Polaris Bank", "Wema Bank", "EcoBank",
];

const form = ref({
  amount: 0,
  bankName: "",
  accountName: "",
  accountNumber: "",
});

const maxAllowed = computed(() => {
  if (!props.goal) return 0;
  return props.goal.availableBalance ?? props.goal.saved;
});

watch(
  () => props.goal,
  (goal) => {
    if (goal) form.value.amount = maxAllowed.value;
  },
  { immediate: true }
);

watch(show, (val) => {
  emit("update:modelValue", val);
  if (!val) {
    form.value = { amount: 0, bankName: "", accountName: "", accountNumber: "" };
  }
});

watch(() => props.modelValue, (val) => { show.value = val; });

const amountError = computed(() => {
  const amount = form.value.amount;
  if (amount <= 0) return "Amount must be positive";
  if (amount > maxAllowed.value) return "Amount exceeds your available balance";
  return null;
});

const bankError = computed(() => {
  if (!form.value.bankName) return "Select a bank";
  if (!banks.includes(form.value.bankName)) return "Please select a valid bank";
  return null;
});

const nameError = computed(() => {
  const name = form.value.accountName;
  if (!name) return "Account name is required";
  if (!/^[A-Za-z\s]+$/.test(name)) return "Only letters and spaces allowed";
  return null;
});

const accountNumberError = computed(() => {
  const num = form.value.accountNumber;
  if (!num) return "Account number is required";
  if (!/^\d{11}$/.test(num)) return "Account number must be exactly 11 digits";
  return null;
});

const isValid = computed(() => {
  return !amountError.value && !bankError.value && !nameError.value && !accountNumberError.value;
});

const close = () => { show.value = false; };

const handleSubmit = async () => {
  if (!isValid.value) return;
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 500));
  emit("submit", { ...form.value });
  loading.value = false;
  close();
};

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
</script>