<template>
  <BaseModal v-model="show" title="Add Funds">
    <form @submit.prevent="handleSubmit" class="space-y-4 p-3">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1"
          >Amount (₦)</label
        >
        <input
          v-model.number="amount"
          type="number"
          required
          min="100"
          step="100"
          placeholder="Enter amount"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <!-- Optional: Show goal progress after adding -->
      <div v-if="goal" class="bg-gray-800/50 p-3 rounded-lg">
        <p class="text-sm text-gray-300">
          Adding to:
          <span class="font-semibold text-white">{{ goal.title }}</span>
        </p>
        <p class="text-xs text-gray-400 mt-1">
          Current progress: {{ goal.progress }}%
        </p>
      </div>

      <div class="flex gap-2 justify-end pt-4">
        <BaseButton variant="secondary" @click="close">Cancel</BaseButton>
        <BaseButton type="submit" :loading="loading">Add Funds</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
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
const amount = ref(0);
const loading = ref(false);

// Sync with parent
watch(
  () => props.modelValue,
  (val) => {
    show.value = val;
  },
);

watch(show, (val) => {
  emit("update:modelValue", val);
});

const close = () => {
  show.value = false;
  amount.value = 0;
};

const handleSubmit = async () => {
  if (amount.value <= 0) return;
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 500));
  emit("add", amount.value);
  loading.value = false;
  close();
};
</script>
