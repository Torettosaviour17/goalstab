import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";
import { useUIStore } from "./ui";

export interface SharedUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "contributor" | "viewer";
}

export interface Goal {
  _id: string;
  id: string; // frontend alias
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
  category?: string;
  accountId?: string;
  sharedWith: SharedUser[];
  autoSaveEnabled?: boolean;
  nextAutoSave?: string;
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
  category?: string;
  accountId?: string;
  autoSaveEnabled?: boolean;
}

export const useGoalsStore = defineStore("goals", () => {
  const uiStore = useUIStore();
  const goals = ref<Goal[]>([]);
  const recentlyCompletedGoal = ref<Goal | null>(null);
  const loading = ref(false);

  const generateId = () => crypto.randomUUID();

  const recalculateProgress = (goal: Goal) => {
    if (goal.target <= 0) {
      goal.progress = 0;
      return;
    }
    const previousProgress = goal.progress;
    goal.progress = Math.min(100, Math.round((goal.saved / goal.target) * 100));
    if (previousProgress < 100 && goal.progress >= 100) {
      goal.locked = false;
      recentlyCompletedGoal.value = goal;
    }
  };

  const recalculateAll = () => goals.value.forEach(recalculateProgress);

  const totalSaved = computed(() =>
    goals.value.reduce((sum, g) => sum + g.saved, 0),
  );
  const totalTarget = computed(() =>
    goals.value.reduce((sum, g) => sum + g.target, 0),
  );
  const overallProgress = computed(() =>
    totalTarget.value
      ? Math.min(100, Math.round((totalSaved.value / totalTarget.value) * 100))
      : 0,
  );
  const activeGoals = computed(() =>
    goals.value.filter((g) => g.progress < 100),
  );
  const completedGoals = computed(() =>
    goals.value.filter((g) => g.progress >= 100),
  );
  const activeGoalsCount = computed(() => activeGoals.value.length);
  const completedGoalsCount = computed(() => completedGoals.value.length);

  // API actions
  const fetchGoals = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/goals");
      // Ensure id field is set for compatibility
      goals.value = data.map((g: any) => ({
        ...g,
        id: g.id || g._id,
      }));
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to load goals" });
    } finally {
      loading.value = false;
    }
  };

  const addGoal = async (goalData: GoalFormData) => {
    try {
      const payload = {
        title: goalData.title,
        target: Number(goalData.target),
        icon: goalData.icon || "🎯",
        color: goalData.color || "from-blue-500 to-cyan-400",
        type: goalData.type || "percentage",
        autoSave: Number(goalData.autoSave) || 10,
        frequency: goalData.frequency || "monthly",
        deadline: goalData.deadline || undefined,
        category: goalData.category || undefined,
        accountId: goalData.accountId || undefined,
        autoSaveEnabled: goalData.autoSaveEnabled ?? true,
      };
      const { data } = await api.post("/goals", payload);
      if (data._id && !data.id) data.id = data._id;
      goals.value.unshift(data);
      uiStore.addToast({ type: "success", message: "Goal created!" });
      return data;
    } catch (err: any) {
      console.error("Add goal error:", err.response?.data || err.message);
      uiStore.addToast({
        type: "error",
        message: err.response?.data?.msg || "Failed to create goal",
      });
      throw err;
    }
  };

  const addFunds = async (id: string, amount: number) => {
    try {
      const { data } = await api.post(`/goals/${id}/add-funds`, { amount });
      if (data._id && !data.id) data.id = data._id;
      const index = goals.value.findIndex((g) => g._id === id || g.id === id);
      if (index !== -1) goals.value[index] = data;
      if (data.progress >= 100) recentlyCompletedGoal.value = data;
      uiStore.addToast({
        type: "success",
        message: `₦${amount.toLocaleString()} added`,
      });
      return data;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to add funds" });
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<GoalFormData>) => {
    try {
      const { data } = await api.put(`/goals/${id}`, updates);
      if (data._id && !data.id) data.id = data._id;
      const index = goals.value.findIndex((g) => g._id === id || g.id === id);
      if (index !== -1) goals.value[index] = data;
      uiStore.addToast({ type: "success", message: "Goal updated" });
      return data;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to update goal" });
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await api.delete(`/goals/${id}`);
      goals.value = goals.value.filter((g) => g._id !== id);
      uiStore.addToast({ type: "success", message: "Goal deleted" });
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to delete goal" });
      throw err;
    }
  };

  // 🔥 New share actions
  const shareGoal = async (
    goalId: string,
    email: string,
    role: "viewer" | "contributor",
  ) => {
    try {
      const { data } = await api.post(`/goals/${goalId}/share`, {
        email,
        role,
      });
      if (data._id && !data.id) data.id = data._id;
      const index = goals.value.findIndex((g) => g._id === goalId);
      if (index !== -1) goals.value[index] = data;
      uiStore.addToast({
        type: "success",
        message: `Goal shared with ${email}`,
      });
      return data;
    } catch (err: any) {
      uiStore.addToast({
        type: "error",
        message: err.response?.data?.msg || "Failed to share goal",
      });
      throw err;
    }
  };

  const unshareGoal = async (goalId: string, userId: string) => {
    try {
      const { data } = await api.delete(`/goals/${goalId}/share/${userId}`);
      if (data._id && !data.id) data.id = data._id;
      const index = goals.value.findIndex((g) => g._id === goalId);
      if (index !== -1) goals.value[index] = data;
      uiStore.addToast({ type: "success", message: "User removed from goal" });
      return data;
    } catch (err: any) {
      uiStore.addToast({
        type: "error",
        message: err.response?.data?.msg || "Failed to remove user",
      });
      throw err;
    }
  };

  const clearCompleted = () => {
    recentlyCompletedGoal.value = null;
  };

  return {
    goals,
    loading,
    recentlyCompletedGoal,
    clearCompleted,
    totalSaved,
    totalTarget,
    overallProgress,
    activeGoals,
    completedGoals,
    activeGoalsCount,
    completedGoalsCount,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    addFunds,
    shareGoal,
    unshareGoal,
  };
});
