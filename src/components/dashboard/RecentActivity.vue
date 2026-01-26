<template>
  <div class="glass-card p-6">
    <h3 class="text-lg font-bold mb-4">Recent Activity</h3>
    <div class="space-y-3">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center',
              getActivityColor(activity.type),
            ]"
          >
            <span>{{ getActivityIcon(activity.type) }}</span>
          </div>
          <div>
            <p class="font-medium">{{ activity.description }}</p>
            <p class="text-sm opacity-60">
              {{ formatTime(activity.timestamp) }}
            </p>
          </div>
        </div>
        <div class="text-right">
          <p
            class="font-bold"
            :class="activity.amount >= 0 ? 'text-green-400' : 'text-red-400'"
          >
            {{ activity.amount >= 0 ? "+" : "" }}₦{{
              formatNumber(activity.amount)
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Activity {
  id: string;
  type: "deposit" | "withdrawal" | "goal_completed" | "auto_save";
  amount: number;
  timestamp: string;
  description: string;
}

const activities = ref<Activity[]>([
  {
    id: "1",
    type: "deposit",
    amount: 50000,
    timestamp: new Date().toISOString(),
    description: "Manual deposit to MacBook Fund",
  },
  {
    id: "2",
    type: "auto_save",
    amount: 25000,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    description: "Auto-save to Emergency Fund",
  },
  {
    id: "3",
    type: "goal_completed",
    amount: 0,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    description: "iPhone Purchase Goal Completed!",
  },
  {
    id: "4",
    type: "withdrawal",
    amount: -150000,
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    description: "Withdrawal from Vacation Fund",
  },
]);

const getActivityIcon = (type: Activity["type"]): string => {
  const icons = {
    deposit: "💰",
    withdrawal: "💸",
    goal_completed: "🎉",
    auto_save: "⚡",
  };
  return icons[type];
};

const getActivityColor = (type: Activity["type"]): string => {
  const colors = {
    deposit: "bg-green-500/20 text-green-400",
    withdrawal: "bg-red-500/20 text-red-400",
    goal_completed: "bg-blue-500/20 text-blue-400",
    auto_save: "bg-purple-500/20 text-purple-400",
  };
  return colors[type];
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(Math.abs(num));
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};
</script>
