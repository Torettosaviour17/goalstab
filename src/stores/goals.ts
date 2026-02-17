// src/stores/goals.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface SharedUser {
  id: string;
  name?: string;
  email: string;
  role: string;
}

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
  const goals = ref<Goal[]>([]);

  /* =========================
       INTERNAL HELPERS
  ========================== */

  const generateId = () => crypto.randomUUID();

  const recalculateProgress = (goal: Goal) => {
    if (goal.target <= 0) {
      goal.progress = 0;
      return;
    }

    goal.progress = Math.min(100, Math.round((goal.saved / goal.target) * 100));

    if (goal.progress >= 100) {
      goal.locked = false;
    }
  };

  const recalculateAll = () => {
    goals.value.forEach(recalculateProgress);
  };

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
    return Math.min(
      100,
      Math.round((totalSaved.value / totalTarget.value) * 100),
    );
  });

  const activeGoals = computed(() =>
    goals.value.filter((g) => g.progress < 100),
  );

  const completedGoals = computed(() =>
    goals.value.filter((g) => g.progress >= 100),
  );

  const activeGoalsCount = computed(() => activeGoals.value.length);
  const completedGoalsCount = computed(() => completedGoals.value.length);

  /* =========================
       ACTIONS
  ========================== */

  const addGoal = (goalData: GoalFormData) => {
    const now = new Date().toISOString();

    const newGoal: Goal = {
      id: generateId(),
      title: goalData.title,
      target: goalData.target,
      saved: 0,
      icon: goalData.icon,
      color: goalData.color,
      type: goalData.type,
      autoSave: goalData.autoSave,
      frequency: goalData.frequency,
      deadline: goalData.deadline || undefined,
      locked: true,
      progress: 0,
      lastUpdated: now,
      createdAt: now,
      sharedWith: [],
    };

    goals.value.unshift(newGoal);
    return newGoal;
  };

  const addFunds = (id: string, amount: number) => {
    if (amount <= 0) return;

    const goal = goals.value.find((g) => g.id === id);
    if (!goal) return;

    goal.saved = Math.min(goal.saved + amount, goal.target);
    goal.lastUpdated = new Date().toISOString();

    recalculateProgress(goal);
  };

  const withdrawFunds = (id: string, amount: number) => {
    if (amount <= 0) return;

    const goal = goals.value.find((g) => g.id === id);
    if (!goal || goal.locked) return;

    goal.saved = Math.max(0, goal.saved - amount);
    goal.lastUpdated = new Date().toISOString();

    recalculateProgress(goal);
  };

  const updateGoal = (id: string, updates: Partial<GoalFormData>) => {
    const goal = goals.value.find((g) => g.id === id);
    if (!goal) return;

    Object.assign(goal, updates);
    goal.lastUpdated = new Date().toISOString();

    recalculateProgress(goal);
  };

  const deleteGoal = (id: string) => {
    goals.value = goals.value.filter((g) => g.id !== id);
  };

  const shareGoal = (goalId: string, user: { email: string; role: string }) => {
    const goal = goals.value.find((g) => g.id === goalId);
    if (!goal) return;

    const exists = goal.sharedWith.some((u) => u.email === user.email);

    if (exists) return;

    const newSharedUser: SharedUser = {
      id: generateId(),
      name: user.email.split("@")[0],
      email: user.email,
      role: user.role,
    };

    goal.sharedWith.push(newSharedUser);
  };

  const unshareGoal = (goalId: string, userId: string) => {
    const goal = goals.value.find((g) => g.id === goalId);
    if (!goal) return;

    goal.sharedWith = goal.sharedWith.filter((u) => u.id !== userId);
  };

  return {
    goals,
    totalSaved,
    totalTarget,
    overallProgress,
    activeGoals,
    completedGoals,
    activeGoalsCount,
    completedGoalsCount,
    addGoal,
    addFunds,
    withdrawFunds,
    updateGoal,
    deleteGoal,
    shareGoal,
    unshareGoal,
    recalculateAll,
  };
});
