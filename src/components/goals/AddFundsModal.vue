<template>
  <BaseModal v-model="show" title="Add Funds" :max-width="500">
    <div class="space-y-6">
      <!-- Goal Summary -->
      <div
        v-if="goal"
        class="flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-700"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gray-700"
        >
          {{ goal.icon }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-white truncate">{{ goal.title }}</p>
          <p class="text-sm text-gray-400">
            ₦{{ formatNumber(goal.saved) }} of ₦{{
              formatNumber(goal.target)
            }}
            · {{ goal.progress }}%
          </p>
          <div
            class="w-full h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden"
          >
            <div
              class="h-1.5 rounded-full transition-all duration-500 bg-primary-500"
              :style="{ width: goal.progress + '%' }"
            />
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
            class="w-full pl-12 pr-4 py-4 text-2xl font-bold bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
        <p v-if="amountError" class="mt-2 text-sm text-red-400">
          {{ amountError }}
        </p>
        <p v-if="isExceedingTarget" class="mt-2 text-sm text-yellow-400">
          ⚠️ This exceeds your target — you can still save extra.
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

      <!-- Payment method -->
      <div>
        <p class="text-sm font-medium text-gray-300 mb-3">Payment method</p>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="paymentMethod = 'manual'"
            class="p-3 rounded-xl border-2 text-left transition-all"
            :class="
              paymentMethod === 'manual'
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-gray-700 hover:border-gray-600'
            "
          >
            <span class="text-lg block mb-1">🏦</span>
            <span class="text-xs font-medium text-white block"
              >Manual / Internal</span
            >
            <p class="text-[11px] text-gray-400 mt-0.5">Add funds directly</p>
          </button>
          <button
            type="button"
            @click="paymentMethod = 'paystack'"
            class="p-3 rounded-xl border-2 text-left transition-all"
            :class="
              paymentMethod === 'paystack'
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-gray-700 hover:border-gray-600'
            "
          >
            <span class="text-lg block mb-1">💳</span>
            <span class="text-xs font-medium text-white block"
              >Pay with Card</span
            >
            <p class="text-[11px] text-gray-400 mt-0.5">
              Paystack — debit/credit
            </p>
          </button>
        </div>

        <!-- Paystack email field -->
        <div v-if="paymentMethod === 'paystack'" class="mt-3">
          <label class="block text-xs font-medium text-gray-300 mb-1"
            >Email for receipt</label
          >
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p v-if="emailError" class="mt-1 text-xs text-red-400">
            {{ emailError }}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-2">
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
          {{ paymentMethod === "paystack" ? "Pay with Card →" : "Add Funds" }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import { useGoalsStore } from "@/stores/goals";
import { useAuthStore } from "@/stores/auth";
import type { Goal } from "@/stores/goals";

const props = defineProps<{
  modelValue: boolean;
  goal?: Goal | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "add", amount: number): void;
}>();

const goalsStore = useGoalsStore();
const authStore = useAuthStore();

const show = ref(props.modelValue);
const amount = ref<number | null>(null);
const loading = ref(false);
const paymentMethod = ref<"manual" | "paystack">("manual");
const email = ref(authStore.user?.email ?? "");

const quickAmounts = [1000, 5000, 10000, 20000, 50000, 100000];

// ── Validation ─────────────────────────────────────────
const amountError = computed(() => {
  if (amount.value === null) return null;
  if (amount.value <= 0) return "Please enter an amount greater than 0";
  return null;
});

const emailError = computed(() => {
  if (paymentMethod.value !== "paystack") return null;
  if (!email.value) return "Email is required for card payments";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
    return "Enter a valid email";
  return null;
});

const isExceedingTarget = computed(() => {
  if (!props.goal) return false;
  return (props.goal.saved || 0) + (amount.value || 0) > props.goal.target;
});

const canSubmit = computed(() => {
  if (!amount.value || amount.value <= 0) return false;
  if (paymentMethod.value === "paystack" && emailError.value) return false;
  return true;
});

// ── Sync ───────────────────────────────────────────────
watch(
  () => props.modelValue,
  (val) => {
    show.value = val;
    if (!val) {
      amount.value = null;
    }
  },
);

watch(show, (val) => emit("update:modelValue", val));

// ── Actions ────────────────────────────────────────────
const setAmount = (val: number) => {
  amount.value = val;
};
const close = () => {
  show.value = false;
};

const handleSubmit = async () => {
  if (!canSubmit.value || !props.goal) return;
  loading.value = true;

  try {
    if (paymentMethod.value === "paystack") {
      // Redirects to Paystack — page will leave
      await goalsStore.initializePaystackPayment(
        props.goal._id,
        amount.value!,
        email.value,
      );
    } else {
      emit("add", amount.value!);
      close();
    }
  } finally {
    loading.value = false;
  }
};

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
</script>
