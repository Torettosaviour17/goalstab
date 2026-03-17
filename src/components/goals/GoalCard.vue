<template>
  <div
    class="glass-card p-5 hover:scale-[1.02] transition-all duration-300 border border-gray-700/50 hover:border-primary-500/30"
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
      <span class="text-xs px-2 py-1 rounded-full" :class="statusClass">
        {{ statusText }}
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

    <div
      v-if="goal.autoSaveEnabled && goal.nextAutoSave && !isCompleted"
      class="mt-2 text-xs text-gray-400 flex items-center gap-1"
    >
      <span>⏰</span> Next auto‑save: {{ formatDate(goal.nextAutoSave) }}
    </div>

    <div v-if="goal.fee > 0" class="mt-1 text-xs text-gray-400">
      Service fee: ₦{{ formatNumber(goal.fee) }} (included in target)
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 mt-4">
      <!-- Incomplete goal: Add + Withdraw (disabled if locked) -->
      <template v-if="!isCompleted">
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
          @click.stop="handleWithdrawClick"
        >
          <template #icon>💸</template>
          {{ goal.locked ? "Locked" : "Withdraw" }}
        </BaseButton>
      </template>

      <!-- Completed goal: Withdraw + Share -->
      <template v-else>
        <BaseButton
          variant="primary"
          size="sm"
          class="flex-1"
          @click.stop="$emit('withdraw')"
        >
          <template #icon>💸</template>
          Withdraw
        </BaseButton>
        <BaseButton
          variant="secondary"
          size="sm"
          class="flex-1"
          @click.stop="$emit('share')"
        >
          <template #icon>🔗</template>
          Share
        </BaseButton>
      </template>
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

const emit = defineEmits<{
  (e: "add-funds"): void;
  (e: "withdraw"): void;
  (e: "share"): void;
}>();

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const isCompleted = computed(() => props.goal.progress >= 100);

const statusClass = computed(() => {
  if (isCompleted.value) return "bg-success/20 text-success";
  return props.goal.locked
    ? "bg-gray-700 text-gray-300"
    : "bg-warning/20 text-warning";
});

const statusText = computed(() => {
  if (isCompleted.value) return "Completed";
  return props.goal.locked ? "Locked" : "In Progress";
});

const progressColor = computed(() => {
  if (isCompleted.value) return "success";
  if (props.goal.progress >= 75) return "primary";
  if (props.goal.progress >= 50) return "warning";
  return "danger";
});

const handleWithdrawClick = () => {
  if (!props.goal.locked) {
    emit("withdraw");
  }
};
</script>
