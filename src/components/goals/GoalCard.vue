<template>
  <div
    class="glass-card p-5 hover:scale-[1.01] transition-all duration-300 border border-gray-700/50 hover:border-primary-500/30 goal-card cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-linear-to-br shrink-0"
          :class="goal.color"
        >
          {{ goal.icon }}
        </div>
        <div class="min-w-0">
          <h3 class="font-bold text-white truncate">{{ goal.title }}</h3>
          <p class="text-xs text-gray-400">{{ goal.category || "General" }}</p>
        </div>
      </div>
      <span
        class="text-xs px-2 py-1 rounded-full shrink-0 ml-2"
        :class="statusClass"
      >
        {{ statusText }}
      </span>
    </div>

    <!-- Milestone badges -->
    <div v-if="earnedMilestones.length" class="flex gap-1.5 mb-3 flex-wrap">
      <span
        v-for="m in earnedMilestones"
        :key="m.pct"
        class="text-[10px] px-2 py-0.5 rounded-full font-medium"
        :class="m.class"
      >
        {{ m.label }}
      </span>
    </div>

    <!-- Progress bar with milestone markers -->
    <div class="mb-3">
      <div class="flex justify-between text-xs mb-1.5">
        <span class="text-gray-400">Progress</span>
        <span class="font-semibold text-white">{{ goal.progress }}%</span>
      </div>
      <div class="relative h-2 bg-gray-700 rounded-full overflow-visible">
        <!-- Fill -->
        <div
          class="h-full rounded-full transition-all duration-700"
          :class="progressBarColor"
          :style="{ width: `${goal.progress}%` }"
        />
        <!-- Milestone tick marks -->
        <div
          v-for="pct in [25, 50, 75]"
          :key="pct"
          class="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 rounded-full transition-colors"
          :class="goal.progress >= pct ? 'bg-white/40' : 'bg-gray-600'"
          :style="{ left: `${pct}%` }"
        />
      </div>
      <!-- Milestone labels -->
      <div class="flex justify-between mt-1 px-0">
        <span
          v-for="pct in [25, 50, 75, 100]"
          :key="pct"
          class="text-[9px] transition-colors"
          :class="goal.progress >= pct ? 'text-primary-400' : 'text-gray-600'"
          >{{ pct }}%</span
        >
      </div>
    </div>

    <!-- Amounts -->
    <div class="flex justify-between items-end mb-3">
      <div>
        <p class="text-xl font-bold text-white">
          ₦{{ formatNumber(goal.saved) }}
        </p>
        <p class="text-xs text-gray-400">of ₦{{ formatNumber(goal.target) }}</p>
      </div>
      <div class="text-right">
        <p class="text-[10px] text-gray-400">Auto-save</p>
        <p class="text-sm font-semibold text-white">
          {{
            goal.type === "percentage"
              ? `${goal.autoSave}%`
              : `₦${formatNumber(goal.autoSave)}`
          }}
          <span class="text-xs text-gray-400">/{{ goal.frequency }}</span>
        </p>
      </div>
    </div>

    <!-- Remaining amount insight -->
    <div
      v-if="!isCompleted && remaining > 0"
      class="text-xs text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2 mb-3"
    >
      <span class="text-white font-medium">₦{{ formatNumber(remaining) }}</span>
      left to go
      <span v-if="goal.autoSave > 0 && periodsLeft > 0">
        · ~{{ periodsLeft }} {{ goal.frequency }}
        {{ periodsLeft === 1 ? "period" : "periods" }} at current rate
      </span>
    </div>

    <!-- Fee line -->
    <div v-if="goal.fee > 0" class="text-[10px] text-gray-500 mb-2">
      Includes ₦{{ formatNumber(goal.fee) }} platform fee
    </div>

    <!-- Next auto-save -->
    <div
      v-if="goal.autoSaveEnabled && goal.nextAutoSave && !isCompleted"
      class="text-[10px] text-gray-400 flex items-center gap-1 mb-3"
    >
      ⏰ Next auto-save: {{ formatDate(goal.nextAutoSave) }}
    </div>

    <!-- Fulfillment badge -->
    <div
      v-if="goal.usePlatformFulfillment && goal.fulfillmentStatus"
      class="text-[10px] px-2 py-1 rounded-lg mb-3 inline-block"
      :class="fulfillmentClass"
    >
      {{ fulfillmentLabel }}
    </div>

    <!-- Actions — only shown when showActions prop is true -->
    <div
      v-if="showActions"
      class="flex gap-2 mt-3 pt-3 border-t border-gray-700/50"
      @click.stop
    >
      <template v-if="!isCompleted">
        <BaseButton
          variant="secondary"
          size="sm"
          class="flex-1"
          @click="$emit('add-funds')"
        >
          <template #icon>💰</template>
          Add
        </BaseButton>
        <BaseButton
          :variant="goal.locked ? 'ghost' : 'primary'"
          size="sm"
          class="flex-1"
          :disabled="goal.locked"
          @click="handleWithdrawClick"
        >
          <template #icon>💸</template>
          {{ goal.locked ? "Locked" : "Withdraw" }}
        </BaseButton>
      </template>
      <template v-else>
        <BaseButton
          variant="primary"
          size="sm"
          class="flex-1"
          @click="$emit('withdraw')"
        >
          <template #icon>💸</template>
          Withdraw
        </BaseButton>
        <BaseButton
          variant="secondary"
          size="sm"
          class="flex-1"
          @click="$emit('share')"
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
import type { Goal } from "@/types/goal";

const props = defineProps<{
  goal: Goal;
  showActions?: boolean;
}>();

const emit = defineEmits<{
  (e: "add-funds"): void;
  (e: "withdraw"): void;
  (e: "share"): void;
  (e: "click"): void;
}>();

// ── Helpers ────────────────────────────────────────────
const formatNumber = (n: number) =>
  new Intl.NumberFormat().format(Math.round(n));
const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });

// ── Computed ───────────────────────────────────────────
const isCompleted = computed(() => props.goal.progress >= 100);

const remaining = computed(() =>
  Math.max(0, (props.goal.target || 0) - (props.goal.saved || 0)),
);

const periodsLeft = computed(() => {
  if (!props.goal.autoSave || props.goal.autoSave <= 0) return 0;
  return Math.ceil(remaining.value / props.goal.autoSave);
});

// ── Status ─────────────────────────────────────────────
const statusClass = computed(() => {
  if (isCompleted.value) return "bg-green-500/20 text-green-400";
  return props.goal.locked
    ? "bg-gray-700 text-gray-300"
    : "bg-amber-500/20 text-amber-400";
});

const statusText = computed(() => {
  if (isCompleted.value) return "✓ Completed";
  return props.goal.locked ? "🔒 Locked" : "In Progress";
});

// ── Progress bar color ─────────────────────────────────
const progressBarColor = computed(() => {
  if (isCompleted.value) return "bg-green-400";
  if (props.goal.progress >= 75) return "bg-primary-500";
  if (props.goal.progress >= 50) return "bg-amber-400";
  if (props.goal.progress >= 25) return "bg-orange-400";
  return "bg-red-400";
});

// ── Milestones ─────────────────────────────────────────
const milestones = [
  {
    pct: 25,
    label: "🌱 25% reached",
    class: "bg-orange-500/20 text-orange-300",
  },
  {
    pct: 50,
    label: "🔥 Halfway there",
    class: "bg-amber-500/20 text-amber-300",
  },
  { pct: 75, label: "⚡ 75% done", class: "bg-blue-500/20 text-blue-300" },
  {
    pct: 100,
    label: "🎉 Goal reached",
    class: "bg-green-500/20 text-green-300",
  },
];

const earnedMilestones = computed(() =>
  milestones.filter((m) => props.goal.progress >= m.pct),
);

// ── Fulfillment ────────────────────────────────────────
const fulfillmentClass = computed(() => {
  const s = props.goal.fulfillmentStatus;
  if (s === "delivered" || s === "booked")
    return "bg-green-500/20 text-green-400";
  if (s === "processing") return "bg-blue-500/20 text-blue-400";
  return "bg-gray-700/50 text-gray-400";
});

const fulfillmentLabel = computed(() => {
  const map: Record<string, string> = {
    pending: "🚀 GoalTabs will fulfill",
    processing: "⚙️ Fulfillment in progress",
    delivered: "✅ Delivered",
    booked: "📅 Booked",
  };
  return map[props.goal.fulfillmentStatus || "pending"] || "";
});

const handleWithdrawClick = () => {
  if (!props.goal.locked) emit("withdraw");
};
</script>
