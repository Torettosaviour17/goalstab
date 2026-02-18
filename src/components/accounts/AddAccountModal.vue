<template>
  <BaseModal v-model="show" :title="isEditing ? 'Edit Account' : 'Add Account'">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1"
          >Bank Name</label
        >
        <input
          v-model="form.bankName"
          type="text"
          required
          placeholder="e.g., GTBank"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1"
          >Account Name</label
        >
        <input
          v-model="form.accountName"
          type="text"
          required
          placeholder="John Doe"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1"
          >Account Number</label
        >
        <input
          v-model="form.accountNumber"
          type="text"
          required
          placeholder="0123456789"
          maxlength="10"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1"
          >Account Type</label
        >
        <select
          v-model="form.type"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl"
        >
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="credit">Credit</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1"
          >Currency</label
        >
        <select
          v-model="form.currency"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl"
        >
          <option value="NGN">NGN (₦)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <input
          id="isDefault"
          v-model="form.isDefault"
          type="checkbox"
          class="w-4 h-4 rounded bg-gray-700 border-gray-600"
        />
        <label for="isDefault" class="text-sm text-gray-300"
          >Set as default account</label
        >
      </div>
      <div class="flex gap-2 justify-end pt-4">
        <BaseButton variant="secondary" @click="show = false"
          >Cancel</BaseButton
        >
        <BaseButton type="submit" :loading="loading">
          {{ isEditing ? "Update" : "Add Account" }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import type { BankAccount } from "@/types/user";

interface Props {
  modelValue: boolean;
  account?: BankAccount | null;
}

const props = withDefaults(defineProps<Props>(), {
  account: null,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", account: any): void;
}>();

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const isEditing = computed(() => !!props.account);

const loading = ref(false);

const form = reactive({
  bankName: "",
  accountName: "",
  accountNumber: "",
  type: "savings" as "checking" | "savings" | "credit",
  currency: "NGN",
  isDefault: false,
});

watch(
  () => props.account,
  (account) => {
    if (account) {
      form.bankName = account.bankName;
      form.accountName = account.accountName;
      form.accountNumber = account.accountNumber;
      form.type = account.type;
      form.currency = account.currency;
      form.isDefault = account.isDefault;
    } else {
      form.bankName = "";
      form.accountName = "";
      form.accountNumber = "";
      form.type = "savings";
      form.currency = "NGN";
      form.isDefault = false;
    }
  },
  { immediate: true },
);

const handleSubmit = async () => {
  loading.value = true;
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  emit("submit", { ...form, lastFour: form.accountNumber.slice(-4) });
  loading.value = false;
  show.value = false;
};
</script>
