import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useGoalsStore = defineStore("goals", () => {
  const showCreateModal = ref(false);

  const goals = ref([
    {
      id: "goal-1",
      title: "MacBook Pro M3",
      target: 2500000,
      saved: 1200000,
      icon: "💻",
      color: "from-blue-500 to-cyan-400",
      type: "percentage" as const,
      autoSave: 10,
      frequency: "weekly" as const,
      deadline: "2024-06-30",
      locked: true,
      progress: 48,
      lastUpdated: "2024-01-20",
      createdAt: "2024-01-15",
    },
    {
      id: "goal-2",
      title: "Bali Vacation",
      target: 1500000,
      saved: 450000,
      icon: "🏝️",
      color: "from-emerald-500 to-teal-400",
      type: "fixed" as const,
      autoSave: 50000,
      frequency: "monthly" as const,
      deadline: "2024-12-15",
      locked: true,
      progress: 30,
      lastUpdated: "2024-01-15",
      createdAt: "2024-01-01",
    },
    {
      id: "goal-3",
      title: "Emergency Fund",
      target: 1000000,
      saved: 350000,
      icon: "🛡️",
      color: "from-amber-500 to-orange-400",
      type: "percentage" as const,
      autoSave: 15,
      frequency: "monthly" as const,
      locked: true,
      progress: 35,
      lastUpdated: "2024-01-18",
      createdAt: "2024-01-01",
    },
  ]);

  const totalSaved = computed(() =>
    goals.value.reduce((sum, goal) => sum + goal.saved, 0),
  );

  const totalTarget = computed(() =>
    goals.value.reduce((sum, goal) => sum + goal.target, 0),
  );

  const overallProgress = computed(() =>
    totalTarget.value > 0
      ? Math.round((totalSaved.value / totalTarget.value) * 100)
      : 0,
  );

  const activeGoals = computed(() =>
    goals.value.filter((goal) => goal.progress < 100),
  );

  const completedGoals = computed(() =>
    goals.value.filter((goal) => goal.progress >= 100),
  );

  const addGoal = (goalData: any) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      saved: 0,
      progress: 0,
      locked: true,
      lastUpdated: new Date().toISOString().split("T")[0] ?? "",
      createdAt: new Date().toISOString().split("T")[0] ?? "",
      ...goalData,
    };
    goals.value.unshift(newGoal);
    return newGoal;
  };

  const updateGoal = (id: string, updates: any) => {
    const index = goals.value.findIndex((g) => g.id === id);
    if (index !== -1) {
      goals.value[index] = { ...goals.value[index], ...updates };
    }
  };

  const addToGoal = (id: string, amount: number) => {
    const goal = goals.value.find((g) => g.id === id);
    if (goal) {
      goal.saved += amount;
      goal.progress = Math.min(
        100,
        Math.round((goal.saved / goal.target) * 100),
      );
      goal.lastUpdated = new Date().toISOString().split("T")[0] ?? "";
    }
  };

  const requestWithdrawal = (id: string) => {
    const goal = goals.value.find((g) => g.id === id);
    if (goal && goal.progress >= 100) {
      goal.locked = false;
      return true;
    }
    return false;
  };

  return {
    goals,
    showCreateModal,
    totalSaved,
    totalTarget,
    overallProgress,
    activeGoals,
    completedGoals,
    addGoal,
    updateGoal,
    addToGoal,
    requestWithdrawal,
  };
});
