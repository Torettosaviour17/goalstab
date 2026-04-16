import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";
import { useUIStore } from "./ui";
import { useLevelStore } from "./level";

export interface SharedUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "contributor" | "viewer";
}

export interface Goal {
  _id: string;
  id: string;
  title: string;
  userTarget: number;
  fee: number;
  target: number;
  saved: number;
  withdrawn: number;
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
  goalType?: "product" | "service";
  fulfillmentStatus?: "pending" | "processing" | "delivered" | "booked";
  fulfillmentDetails?: any;
  usePlatformFulfillment?: boolean;
  selectedProduct?: any;
  sharedWith: SharedUser[];
  autoSaveEnabled?: boolean;
  nextAutoSave?: string;
  availableBalance: number; // ✅ required
  pendingPlatformFee?: number;
}

export interface GoalFormData {
  title: string;
  userTarget: number;
  icon: string;
  color: string;
  type: "percentage" | "fixed";
  autoSave: number;
  frequency: "daily" | "weekly" | "monthly";
  deadline?: string;
  category?: string;
  accountId?: string;
  autoSaveEnabled?: boolean;
  usePlatformFulfillment?: boolean;
  selectedProduct?: any;
  goalType?: "product" | "service";
}

// Helper to normalize any goal object from the API
const normalizeGoal = (goal: any): Goal => {
  return {
    ...goal,
    id: goal.id || goal._id,
    availableBalance:
      typeof goal.availableBalance === "number"
        ? goal.availableBalance
        : goal.saved - goal.withdrawn,
  };
};

export const useGoalsStore = defineStore("goals", () => {
  const uiStore = useUIStore();
  const levelStore = useLevelStore();
  const goals = ref<Goal[]>([]);
  const recentlyCompletedGoal = ref<Goal | null>(null);
  const loading = ref(false);
  let fetching = false;

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
    if (fetching) {
      console.log("[Goals] fetchGoals already in progress, skipping");
      return;
    }
    fetching = true;
    loading.value = true;
    try {
      const { data } = await api.get("/goals");
      goals.value = data.map((g: any) => normalizeGoal(g));
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to load goals" });
    } finally {
      loading.value = false;
      fetching = false;
    }
  };

  const addGoal = async (goalData: GoalFormData) => {
    try {
      const payload = {
        title: goalData.title,
        userTarget: Number(goalData.userTarget),
        icon: goalData.icon || "🎯",
        color: goalData.color || "from-blue-500 to-cyan-400",
        type: goalData.type || "percentage",
        autoSave: Number(goalData.autoSave) || 10,
        frequency: goalData.frequency || "monthly",
        deadline: goalData.deadline || undefined,
        category: goalData.category || undefined,
        accountId: goalData.accountId || undefined,
        autoSaveEnabled: goalData.autoSaveEnabled ?? true,
        usePlatformFulfillment: goalData.usePlatformFulfillment ?? false,
        selectedProduct: goalData.selectedProduct || undefined,
        goalType: goalData.goalType || "product",
      };
      const { data } = await api.post("/goals", payload);
      const normalized = normalizeGoal(data);
      goals.value.unshift(normalized);
      uiStore.addToast({ type: "success", message: "Goal created!" });
      return normalized;
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
      const normalized = normalizeGoal(data);
      const index = goals.value.findIndex((g) => g._id === id || g.id === id);
      if (index !== -1) goals.value[index] = normalized;

      const xpGained = Math.floor(amount / 100);
      levelStore.addXP(xpGained);

      if (normalized.progress >= 100) {
        recentlyCompletedGoal.value = normalized;
        levelStore.addXP(200);
      }

      uiStore.addToast({
        type: "success",
        message: `₦${amount.toLocaleString()} added (+${xpGained} XP 🔥)`,
      });

      return normalized;
    } catch (err) {
      console.error("Add funds error:", err);
      uiStore.addToast({
        type: "error",
        message: "Failed to add funds",
      });
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<GoalFormData>) => {
    try {
      const { data } = await api.put(`/goals/${id}`, updates);
      const normalized = normalizeGoal(data);
      const index = goals.value.findIndex((g) => g._id === id || g.id === id);
      if (index !== -1) goals.value[index] = normalized;
      uiStore.addToast({ type: "success", message: "Goal updated" });
      return normalized;
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
      const normalized = normalizeGoal(data);
      const index = goals.value.findIndex((g) => g._id === goalId);
      if (index !== -1) goals.value[index] = normalized;
      uiStore.addToast({
        type: "success",
        message: `Goal shared with ${email}`,
      });
      return normalized;
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
      const normalized = normalizeGoal(data);
      const index = goals.value.findIndex((g) => g._id === goalId);
      if (index !== -1) goals.value[index] = normalized;
      uiStore.addToast({ type: "success", message: "User removed from goal" });
      return normalized;
    } catch (err: any) {
      uiStore.addToast({
        type: "error",
        message: err.response?.data?.msg || "Failed to remove user",
      });
      throw err;
    }
  };

  const requestFulfillment = async (goalId: string, details?: any) => {
    try {
      const { data } = await api.post(`/goals/${goalId}/fulfillment-request`, {
        details,
      });
      const index = goals.value.findIndex((g) => g._id === goalId);
      if (index !== -1) {
        goals.value[index] = {
          ...goals.value[index],
          fulfillmentStatus: "processing",
          fulfillmentDetails: details,
        } as Goal;
      }
      uiStore.addToast({ type: "success", message: data.msg });
      return data;
    } catch (err: any) {
      uiStore.addToast({
        type: "error",
        message: err.response?.data?.msg || "Request failed",
      });
      throw err;
    }
  };

  const clearCompleted = () => {
    recentlyCompletedGoal.value = null;
  };

  const removeGoalById = (goalId: string) => {
    goals.value = goals.value.filter(
      (g) => g._id !== goalId && g.id !== goalId,
    );
  };

  return {
    goals,
    loading,
    recentlyCompletedGoal,
    clearCompleted,
    removeGoalById,
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
    requestFulfillment,
  };
});
