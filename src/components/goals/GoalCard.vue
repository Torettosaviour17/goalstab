<template>
  <div
    class="glass-card p-5 hover:scale-[1.02] transition-all duration-300 border border-gray-700/50 hover:border-primary-500/30"
  >
    <!-- Header -->
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
          <p class="text-sm text-gray-400">
            {{ goal.category || "General" }}
          </p>
        </div>
      </div>

      <span class="text-xs px-2 py-1 rounded-full" :class="lockedClass">
        {{ goal.locked ? "Locked" : "Unlocked" }}
      </span>
    </div>

    <!-- Progress -->
    <GoalProgress :value="goal.progress" :color="progressColor" class="mb-4" />

    <!-- Amount -->
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
          <span class="text-xs text-gray-400"> /{{ goal.frequency }} </span>
        </p>
      </div>
    </div>

    <!-- Next autosave -->
    <div
      v-if="goal.autoSaveEnabled && goal.nextAutoSave"
      class="mt-2 text-xs text-gray-400 flex items-center gap-1"
    >
      <span>⏰</span>
      Next auto-save: {{ formatDate(goal.nextAutoSave) }}
    </div>

    <!-- Buttons -->
    <div class="flex gap-2 mt-4">
      <!-- Add Funds -->
      <BaseButton
        variant="secondary"
        size="sm"
        class="flex-1"
        @click.stop="$emit('add-funds')"
      >
        <template #icon>💰</template>
        Add
      </BaseButton>

      <!-- Withdraw -->
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

      <!-- Share -->
      <BaseButton
        variant="ghost"
        size="sm"
        class="flex-1"
        @click.stop="$emit('share')"
      >
        <template #icon>🔗</template>
        Share
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

const emit = defineEmits<{
  (e: "add-funds"): void;
  (e: "withdraw"): void;
  (e: "share"): void;
}>();

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

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

const handleWithdrawClick = () => {
  console.log("Withdraw clicked:", props.goal);

  if (!props.goal.locked) {
    emit("withdraw");
  } else {
    console.log("Goal is locked");
  }
};
</script>
