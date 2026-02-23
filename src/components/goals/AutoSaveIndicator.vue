<template>
  <div class="flex items-center gap-2 text-sm">
    <span class="text-gray-400">⚡</span>
    <span class="text-gray-300">
      Auto-save:
      <span class="font-medium text-white">
        {{
          goal.type === "percentage"
            ? `${goal.autoSave}%`
            : `₦${formatNumber(goal.autoSave)}`
        }}
      </span>
      /{{ goal.frequency }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from "@/types/goal";

defineProps<{
  goal: Goal;
}>();

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
</script>
