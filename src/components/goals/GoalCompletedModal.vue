<template>
  <BaseModal v-model="show" title="🎉 Goal Completed!">
    <div class="text-center py-4">
      <div
        class="w-20 h-20 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center"
      >
        <span class="text-4xl">🏆</span>
      </div>
      <h3 class="text-xl font-bold text-white mb-2">Congratulations!</h3>
      <p class="text-gray-300 mb-4">
        You've successfully reached your goal:
        <span class="font-semibold text-primary-300">{{ goal?.title }}</span>
      </p>
      <div class="flex justify-center gap-3">
        <BaseButton variant="primary" @click="close">Awesome!</BaseButton>
        <BaseButton variant="secondary" @click="share">Share</BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import type { Goal } from "@/types/goal";

const props = defineProps<{
  modelValue: boolean;
  goal?: Goal | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "share"): void;
}>();

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const close = () => {
  show.value = false;
};

const share = () => {
  emit("share");
  close();
};
</script>
