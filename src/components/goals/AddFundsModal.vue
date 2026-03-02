<template>
  <BaseModal v-model="show" title="Add Funds" :max-width="500">
    <div class="space-y-6">
      <!-- Goal Summary -->
      <div
        v-if="goal"
        class="flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-700"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          :class="goal.color + ' bg-opacity-20'"
        >
          {{ goal.icon }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-white truncate">{{ goal.title }}</p>
          <p class="text-sm text-gray-400">
            ₦{{ formatNumber(goal.saved) }} of ₦{{
              formatNumber(goal.target)
            }}
            • {{ goal.progress }}%
          </p>
          <div class="w-full h-1.5 bg-gray-700 rounded-full mt-2">
            <div
              class="h-1.5 rounded-full"
              :class="goal.color.split(' ')[0]"
              :style="{ width: goal.progress + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Amount Input -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2"
          >Amount (₦)</label
        >
        <div class="relative">
          <span
            class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400"
            >₦</span
          >
          <input
            v-model.number="amount"
            type="number"
            min="1"
            step="1"
            placeholder="0"
            class="w-full pl-12 pr-4 py-4 text-2xl font-bold bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>
        <p v-if="amountError" class="mt-2 text-sm text-danger">
          {{ amountError }}
        </p>
      </div>

      <!-- Quick Amounts -->
      <div>
        <p class="text-sm text-gray-400 mb-3">Quick add</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="amt in quickAmounts"
            :key="amt"
            @click="setAmount(amt)"
            class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-white font-medium transition"
          >
            ₦{{ formatNumber(amt) }}
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-4">
        <BaseButton variant="secondary" class="flex-1" @click="close"
          >Cancel</BaseButton
        >
        <BaseButton
          variant="primary"
          class="flex-1"
          :disabled="!isValidAmount"
          :loading="loading"
          @click="handleSubmit"
        >
          Add Funds
        </BaseButton>
      </div>
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
  (e: "add", amount: number): void;
}>();

const show = ref(props.modelValue);
const amount = ref<number | null>(null);
const loading = ref(false);

// Common quick-add amounts (in Naira)
const quickAmounts = [1000, 5000, 10000, 20000, 50000, 100000];

// Validation
const amountError = computed(() => {
  if (amount.value === null || amount.value === undefined) return null;
  if (amount.value <= 0) return "Please enter an amount greater than 0";
  return null;
});

const isValidAmount = computed(() => {
  return amount.value !== null && amount.value > 0;
});

// Sync with parent
watch(
  () => props.modelValue,
  (val) => {
    show.value = val;
    if (!val) {
      // Reset amount when modal closes
      amount.value = null;
    }
  },
);

watch(show, (val) => {
  emit("update:modelValue", val);
});

const setAmount = (val: number) => {
  amount.value = val;
};

const close = () => {
  show.value = false;
};

const handleSubmit = async () => {
  if (!isValidAmount.value) return;
  loading.value = true;
  try {
    emit("add", amount.value!);
    close();
  } finally {
    loading.value = false;
  }
};

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
</script>
