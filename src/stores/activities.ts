import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/api";
import { useUIStore } from "./ui";

export interface Activity {
  _id: string;
  goal: string;
  user: { _id: string; name: string; email: string };
  type: string;
  amount?: number;
  metadata?: any;
  createdAt: string;
}

export const useActivitiesStore = defineStore("activities", () => {
  const uiStore = useUIStore();
  const activities = ref<Activity[]>([]);
  const loading = ref(false);

  const fetchGoalActivities = async (goalId: string) => {
    loading.value = true;
    try {
      const { data } = await api.get(`/goals/${goalId}/activities`);
      activities.value = data;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to load activities" });
    } finally {
      loading.value = false;
    }
  };

  return {
    activities,
    loading,
    fetchGoalActivities,
  };
});
