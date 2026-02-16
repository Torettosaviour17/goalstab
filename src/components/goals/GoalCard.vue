<template>
  <div
    class="glass-card p-5 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          :class="goal.color + ' bg-opacity-20'"
        >
          {{ goal.icon }}
        </div>
        <div>
          <h3 class="font-bold text-white">{{ goal.title }}</h3>
          <p class="text-sm text-gray-400">{{ goal.category || "General" }}</p>
        </div>
      </div>
      <span class="text-xs px-2 py-1 rounded-full" :class="lockedClass">
        {{ goal.locked ? "Locked" : "Unlocked" }}
      </span>
    </div>

    <GoalProgress :value="goal.progress" :color="progressColor" class="mb-4" />

    <div class="flex justify-between items-center mb-4">
      <div>
        <p class="text-2xl font-bold text-white">
          ₦{{ formatNumber(goal.saved) }}
        </p>
        <p class="text-sm text-gray-400">of ₦{{ formatNumber(goal.target) }}</p>
      </div>
      <div class="text-right">
        <p class="text-xs text-gray-400">Auto-save</p>
        <p class="font-semibold text-white">
          {{
            goal.type === "percentage"
              ? `${goal.autoSave}%`
              : `₦${formatNumber(goal.autoSave)}`
          }}
          <span class="text-xs text-gray-400">/{{ goal.frequency }}</span>
        </p>
      </div>
    </div>

    <div class="flex gap-2">
      <BaseButton
        variant="secondary"
        size="sm"
        class="flex-1"
        @click.stop="$emit('add-funds')"
      >
        <template #icon>💰</template>
        Add
      </BaseButton>
      <BaseButton
        :variant="goal.locked ? 'ghost' : 'primary'"
        size="sm"
        class="flex-1"
        :disabled="goal.locked"
        @click.stop="$emit('withdraw')"
      >
        <template #icon>💸</template>
        {{ goal.locked ? "Locked" : "Withdraw" }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import GoalProgress from "./GoalProgress.vue";
import type { Goal } from "@/types/goal";

interface Props {
  goal: Goal;
}

const props = defineProps<Props>();

defineEmits<{
  (e: "click"): void;
  (e: "add-funds"): void;
  (e: "withdraw"): void;
}>();

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const lockedClass = computed(() => {
  return props.goal.locked
    ? "bg-gray-700 text-gray-300"
    : "bg-success/20 text-success";
});

const progressColor = computed(() => {
  if (props.goal.progress >= 100) return "success";
  if (props.goal.progress >= 75) return "primary";
  if (props.goal.progress >= 50) return "warning";
  return "danger";
});
</script>
