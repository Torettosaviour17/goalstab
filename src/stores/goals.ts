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
  _id: string; // Use _id to match MongoDB
  id: string;  // Keep for backward compatibility? Better to use _id consistently.
  // We'll use _id as the primary key, and provide a computed id getter if needed.
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
  // Auto‑save fields
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
  autoSaveEnabled?: boolean; // Add this
}

export const useGoalsStore = defineStore("goals", () => {
  const uiStore = useUIStore();
  const goals = ref<Goal[]>([]);
  const recentlyCompletedGoal = ref<Goal | null>(null);
  const loading = ref(false);

  /* =========================
     COMPUTED
  ========================== */
  const totalSaved = computed(() =>
    goals.value.reduce((sum, g) => sum + g.saved, 0)
  );

  const totalTarget = computed(() =>
    goals.value.reduce((sum, g) => sum + g.target, 0)
  );

  const overallProgress = computed(() =>
    totalTarget.value
      ? Math.min(100, Math.round((totalSaved.value / totalTarget.value) * 100))
      : 0
  );

  const activeGoals = computed(() =>
    goals.value.filter((g) => g.progress < 100)
  );

  const completedGoals = computed(() =>
    goals.value.filter((g) => g.progress >= 100)
  );

  const activeGoalsCount = computed(() => activeGoals.value.length);
  const completedGoalsCount = computed(() => completedGoals.value.length);

  /* =========================
     ACTIONS (API)
  ========================== */

  // Fetch all goals for the current user
  const fetchGoals = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/goals");
      goals.value = data;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to load goals" });
    } finally {
      loading.value = false;
    }
  };

  // Create a new goal
  const addGoal = async (goalData: GoalFormData) => {
    try {
      const { data } = await api.post("/goals", goalData);
      goals.value.unshift(data);
      uiStore.addToast({ type: "success", message: "Goal created!" });
      return data;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to create goal" });
      throw err;
    }
  };

  // Update an existing goal
  const updateGoal = async (id: string, updates: Partial<GoalFormData>) => {
    try {
      const { data } = await api.put(`/goals/${id}`, updates);
      const index = goals.value.findIndex((g) => g._id === id);
      if (index !== -1) goals.value[index] = data;
      uiStore.addToast({ type: "success", message: "Goal updated" });
      return data;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to update goal" });
      throw err;
    }
  };

  // Delete a goal
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

  // Add funds to a goal
  const addFunds = async (id: string, amount: number) => {
    try {
      const { data } = await api.post(`/goals/${id}/add-funds`, { amount });
      const index = goals.value.findIndex((g) => g._id === id);
      if (index !== -1) goals.value[index] = data;

      // Check if goal completed (the backend already handles notifications)
      if (data.progress >= 100) {
        recentlyCompletedGoal.value = data;
      }

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

  // (Optional) Withdraw funds – we already have a separate withdrawals store,
  // so we might not need this here. Keep for completeness.
  const withdrawFunds = async (id: string, amount: number) => {
    // This would need a backend endpoint. Currently not implemented.
    uiStore.addToast({ type: "error", message: "Not implemented" });
  };

  // Clear the completed goal flag after modal closes
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
    withdrawFunds,
  };
});