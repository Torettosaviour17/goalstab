<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <!-- Welcome section -->
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">
        Welcome back, <span class="text-blue-400">User</span> 👋
      </h1>
      <p class="text-gray-400">
        Track your savings and reach your financial goals
      </p>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"
          >
            <span class="text-2xl text-blue-400">💰</span>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Total Saved</p>
            <p class="text-2xl font-bold text-white">₦1,850,000</p>
          </div>
        </div>
      </div>

      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center"
          >
            <span class="text-2xl text-green-400">🎯</span>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Active Goals</p>
            <p class="text-2xl font-bold text-white">3</p>
          </div>
        </div>
      </div>

      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center"
          >
            <span class="text-2xl text-yellow-400">📈</span>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Progress</p>
            <p class="text-2xl font-bold text-white">62%</p>
          </div>
        </div>
      </div>

      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center"
          >
            <span class="text-2xl text-purple-400">🚀</span>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Monthly Growth</p>
            <p class="text-2xl font-bold text-white">+15.3%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Goals section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Goals list -->
      <div class="lg:col-span-2">
        <div
          class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-bold text-white">Your Goals</h2>
              <p class="text-gray-400">
                Track progress towards your financial targets
              </p>
            </div>
            <button
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition"
            >
              + New Goal
            </button>
          </div>

          <!-- Goals grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="goal in goals"
              :key="goal.id"
              class="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition"
            >
              <div class="flex items-center gap-3 mb-4">
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center text-xl',
                    'bg-gradient-to-br ' + goal.color,
                  ]"
                >
                  {{ goal.icon }}
                </div>
                <div>
                  <h3 class="font-bold text-white">{{ goal.title }}</h3>
                  <p class="text-sm text-gray-400">
                    {{ goal.progress }}% complete
                  </p>
                </div>
              </div>

              <div class="h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                <div
                  :class="[
                    'h-full rounded-full transition-all duration-500',
                    getProgressColor(goal.color),
                  ]"
                  :style="{ width: `${goal.progress}%` }"
                ></div>
              </div>

              <div class="flex justify-between items-center">
                <div>
                  <p class="text-lg font-bold text-white">
                    ₦{{ formatNumber(goal.saved) }}
                  </p>
                  <p class="text-sm text-gray-400">
                    of ₦{{ formatNumber(goal.target) }}
                  </p>
                </div>
                <div class="flex gap-2">
                  <button
                    class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition"
                  >
                    Add Funds
                  </button>
                  <button
                    :disabled="goal.locked"
                    :class="[
                      'px-3 py-1.5 rounded-lg text-sm text-white transition',
                      goal.locked
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600',
                    ]"
                  >
                    {{ goal.locked ? "Locked" : "Withdraw" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick actions -->
        <div
          class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
        >
          <h3 class="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="action in quickActions"
              :key="action.label"
              @click="action.handler"
              class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-900/50 hover:bg-gray-900 transition group"
            >
              <span
                class="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200"
              >
                {{ action.icon }}
              </span>
              <span class="text-sm font-medium text-white">{{
                action.label
              }}</span>
            </button>
          </div>
        </div>

        <!-- Recent activity -->
        <div
          class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
        >
          <h3 class="text-lg font-bold text-white mb-4">Recent Activity</h3>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  activity.type === 'deposit'
                    ? 'bg-green-500/20 text-green-400'
                    : activity.type === 'withdrawal'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-blue-500/20 text-blue-400',
                ]"
              >
                <span>{{ getActivityIcon(activity.type) }}</span>
              </div>

              <div class="flex-1">
                <p class="text-sm font-medium text-white">
                  {{ activity.description }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ formatTimeAgo(activity.timestamp) }}
                </p>
              </div>

              <div class="text-right">
                <p
                  :class="[
                    'text-sm font-semibold',
                    activity.amount >= 0 ? 'text-green-400' : 'text-red-400',
                  ]"
                >
                  {{ activity.amount >= 0 ? "+" : "" }}₦{{
                    formatNumber(activity.amount)
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGoalsStore } from "@/stores/goals";

const router = useRouter();
const goalsStore = useGoalsStore();

const goals = goalsStore.goals;

const quickActions = [
  { label: "Add Funds", icon: "💰", handler: () => console.log("Add Funds") },
  { label: "New Goal", icon: "🎯", handler: () => console.log("New Goal") },
  { label: "Analytics", icon: "📊", handler: () => router.push("/analytics") },
  { label: "Settings", icon: "⚙️", handler: () => router.push("/settings") },
];

const recentActivities = ref([
  {
    id: 1,
    type: "deposit",
    amount: 50000,
    description: "Added to MacBook Goal",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 2,
    type: "goal_completed",
    amount: 0,
    description: "Emergency Fund completed",
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: 3,
    type: "withdrawal",
    amount: -150000,
    description: "Withdrawal from Vacation",
    timestamp: new Date(Date.now() - 172800000),
  },
]);

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    deposit: "💰",
    withdrawal: "💸",
    goal_completed: "🎉",
  };
  return icons[type] || "📝";
};

const getProgressColor = (colorClass: string): string => {
  if (colorClass.includes("blue")) return "bg-blue-400";
  if (colorClass.includes("emerald")) return "bg-green-400";
  if (colorClass.includes("amber")) return "bg-yellow-400";
  return "bg-blue-400";
};
</script>
