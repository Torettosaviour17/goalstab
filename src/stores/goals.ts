// src/stores/goals.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface Goal {
  id: string;
  title: string;
  target: number;
  saved: number;
  icon: string;
  color: string;
  type: "percentage" | "fixed";
  autoSave: number;
  frequency: "daily" | "weekly" | "monthly";
  deadline?: string;
  locked: boolean;
  progress: number;
  lastUpdated: string;
  createdAt: string;
  sharedWith: SharedUser[];
}

export interface SharedUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface GoalFormData {
  title: string;
  target: number;
  icon: string;
  color: string;
  type: "percentage" | "fixed";
  autoSave: number;
  frequency: "daily" | "weekly" | "monthly";
  deadline?: string;
}

export const useGoalsStore = defineStore("goals", () => {
  const goals = ref<Goal[]>([
    {
      id: "goal-1",
      title: "MacBook Pro M3",
      target: 2500000,
      saved: 1200000,
      icon: "💻",
      color: "from-blue-500 to-cyan-400",
      type: "percentage",
      autoSave: 10,
      frequency: "weekly",
      deadline: "2024-06-30",
      locked: true,
      progress: 48,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      sharedWith: [],
    },
    {
      id: "goal-2",
      title: "Bali Vacation",
      target: 1500000,
      saved: 450000,
      icon: "🏝️",
      color: "from-emerald-500 to-teal-400",
      type: "fixed",
      autoSave: 50000,
      frequency: "monthly",
      deadline: "2024-12-15",
      locked: true,
      progress: 30,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      sharedWith: [],
    },
  ]);

  /* =========================
       COMPUTED
  ========================== */
  const totalSaved = computed(() =>
    goals.value.reduce((sum, goal) => sum + goal.saved, 0),
  );

  const totalTarget = computed(() =>
    goals.value.reduce((sum, goal) => sum + goal.target, 0),
  );

  const overallProgress = computed(() => {
    if (totalTarget.value === 0) return 0;
    return Math.round((totalSaved.value / totalTarget.value) * 100);
  });

  const activeGoals = computed(() =>
    goals.value.filter((g) => g.progress < 100),
  );

  const activeGoalsCount = computed(() => activeGoals.value.length);

  const completedGoals = computed(() =>
    goals.value.filter((g) => g.progress >= 100),
  );

  const completedGoalsCount = computed(() => completedGoals.value.length);

  /* =========================
       INTERNAL HELPERS
  ========================== */
  const recalculateProgress = (goal: Goal) => {
    goal.progress = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  };

  /* =========================
       ACTIONS
  ========================== */
  const addToGoal = (id: string, amount: number) => {
    const goal = goals.value.find((g) => g.id === id);
    if (!goal) return;

    goal.saved += amount;
    goal.lastUpdated = new Date().toISOString();

    recalculateProgress(goal);
  };

  const addFunds = (id: string, amount: number) => {
    addToGoal(id, amount);
  };

  const addGoal = (goalData: GoalFormData) => {
    const now = new Date().toISOString();

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      saved: 0,
      progress: 0,
      locked: true,
      lastUpdated: now,
      createdAt: now,
      sharedWith: [],
      deadline: goalData.deadline || "",
      ...goalData,
    };

    goals.value.unshift(newGoal);
    return newGoal;
  };

  const requestWithdrawal = (id: string) => {
    const goal = goals.value.find((g) => g.id === id);
    if (!goal) return false;

    if (goal.progress >= 100) {
      goal.locked = false;
      goal.lastUpdated = new Date().toISOString();
      return true;
    }

    return false;
  };

  /* =========================
       SHARE GOALS
  ========================== */
  const shareGoal = (goalId: string, user: { email: string; role: string }) => {
    const goal = goals.value.find((g) => g.id === goalId);
    if (goal) {
      const newSharedUser: SharedUser = {
        id: `shared-${Date.now()}`,
        name: ((user.email ?? "") as string).split("@")[0],
        email: user.email ?? "",
        role: user.role,
      };
      goal.sharedWith = [...(goal.sharedWith || []), newSharedUser];
    }
  };

  const unshareGoal = (goalId: string, userId: string) => {
    const goal = goals.value.find((g) => g.id === goalId);
    if (goal && goal.sharedWith) {
      goal.sharedWith = goal.sharedWith.filter((u) => u.id !== userId);
    }
  };

  return {
    goals,
    totalSaved,
    totalTarget,
    overallProgress,
    activeGoals,
    activeGoalsCount,
    completedGoals,
    completedGoalsCount,
    addToGoal,
    addFunds,
    addGoal,
    requestWithdrawal,
    shareGoal,
    unshareGoal,
  };
});
