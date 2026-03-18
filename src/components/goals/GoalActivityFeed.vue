<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center py-4">
      <div
        class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"
      ></div>
    </div>
    <div v-else-if="activities.length" class="space-y-3">
      <div
        v-for="act in activities"
        :key="act._id"
        class="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50"
      >
        <div
          class="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0"
        >
          <span class="text-sm">{{ getActivityIcon(act.type) }}</span>
        </div>
        <div class="flex-1">
          <p class="text-sm text-white">
            <span class="font-medium">{{ act.user.name }}</span>
            {{ getActivityDescription(act) }}
          </p>
          <p class="text-xs text-gray-400">{{ formatTime(act.createdAt) }}</p>
        </div>
        <div v-if="act.amount" class="text-sm font-medium text-green-400">
          +₦{{ formatNumber(act.amount) }}
        </div>
      </div>
    </div>
    <div v-else class="text-center py-6 text-gray-400">No activity yet</div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from "@/stores/activities";

defineProps<{
  activities: Activity[];
  loading: boolean;
}>();

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    goal_created: "🎯",
    goal_updated: "✏️",
    goal_completed: "🎉",
    funds_added: "💰",
    withdrawal_requested: "⏳",
    withdrawal_approved: "✅",
    withdrawal_rejected: "❌",
    goal_shared: "🔗",
    user_removed: "🚫",
    auto_save: "⚡",
  };
  return icons[type] || "📝";
};

const getActivityDescription = (act: Activity) => {
  switch (act.type) {
    case "goal_created":
      return "created this goal";
    case "goal_updated":
      return "updated the goal";
    case "goal_completed":
      return "completed the goal!";
    case "funds_added":
      return `added ₦${act.amount?.toLocaleString()}`;
    case "withdrawal_requested":
      return `requested withdrawal of ₦${act.amount?.toLocaleString()}`;
    case "withdrawal_approved":
      return "withdrawal approved";
    case "withdrawal_rejected":
      return "withdrawal rejected";
    case "goal_shared":
      return `shared with ${act.metadata?.email} (${act.metadata?.role})`;
    case "user_removed":
      return "removed user";
    case "auto_save":
      return `auto‑saved ₦${act.amount?.toLocaleString()}`;
    default:
      return "performed an action";
  }
};

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};
</script>
