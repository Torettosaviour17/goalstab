// src/stores/goals.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface SharedUser {
  id: string;
  name: string; // always string now
  email: string;
  role: "owner" | "contributor" | "viewer";
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
      sharedWith: [
        { id: "user-1", name: "Alice", email: "alice@example.com", role: "viewer" },
        { id: "user-2", name: "Bob", email: "bob@example.com", role: "contributor" }
      ],
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

  const generateId = () => crypto.randomUUID();

  const recalculateProgress = (goal: Goal) => {
    if (goal.target <= 0) {
      goal.progress = 0;
      return;
    }
    goal.progress = Math.min(100, Math.round((goal.saved / goal.target) * 100));
    if (goal.progress >= 100) goal.locked = false;
  };

  const recalculateAll = () => goals.value.forEach(recalculateProgress);

  /* =========================
       COMPUTED
  ========================== */
  const totalSaved = computed(() => goals.value.reduce((sum, g) => sum + g.saved, 0));
  const totalTarget = computed(() => goals.value.reduce((sum, g) => sum + g.target, 0));
  const overallProgress = computed(() => totalTarget.value ? Math.min(100, Math.round((totalSaved.value / totalTarget.value) * 100)) : 0);
  const activeGoals = computed(() => goals.value.filter((g) => g.progress < 100));
  const completedGoals = computed(() => goals.value.filter((g) => g.progress >= 100));
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
    const goal = goals.value.find((g) => g.id === id);
    if (!goal || amount <= 0) return;
    goal.saved = Math.min(goal.saved + amount, goal.target);
    goal.lastUpdated = new Date().toISOString();
    recalculateProgress(goal);
  };

  const withdrawFunds = (id: string, amount: number) => {
    const goal = goals.value.find((g) => g.id === id);
    if (!goal || goal.locked || amount <= 0) return;
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

  const shareGoal = (goalId: string, user: { email: string; role: "owner" | "contributor" | "viewer" }) => {
    const goal = goals.value.find((g) => g.id === goalId);
    if (!goal) return;

    if (goal.sharedWith.some(u => u.email === user.email)) return;

    const newUser: SharedUser = {
      id: generateId(),
      name: user.email.split("@")[0] ?? "user",
      email: user.email,
      role: user.role,
    };
    goal.sharedWith.push(newUser);
  };

  const unshareGoal = (goalId: string, userId: string) => {
    const goal = goals.value.find((g) => g.id === goalId);
    if (!goal) return;
    goal.sharedWith = goal.sharedWith.filter(u => u.id !== userId);
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
