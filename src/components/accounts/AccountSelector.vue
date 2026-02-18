<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-300 mb-1">{{
      label
    }}</label>
    <div class="relative">
      <select
        :value="modelValue"
        @change="
          $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
        "
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
        :required="required"
      >
        <option value="" disabled>Select an account</option>
        <option
          v-for="account in accounts"
          :key="account.id"
          :value="account.id"
        >
          {{ account.bankName }} (••{{ account.lastFour }}) - ₦{{
            formatBalance(account.balance)
          }}
        </option>
      </select>
      <div
        class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
      >
        <span class="text-gray-400">⌄</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountsStore } from "@/stores/accounts";
import { storeToRefs } from "pinia";

defineProps<{
  modelValue: string;
  label?: string;
  required?: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);

const formatBalance = (balance?: number) => {
  if (!balance) return "0";
  return new Intl.NumberFormat().format(balance);
};
</script>
