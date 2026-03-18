import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/api";
import { useUIStore } from "./ui";

export interface Overview {
  totalSaved: number;
  activeGoals: number;
  completedGoals: number;
  overallProgress: number;
  monthlyGrowth: number;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface DistributionItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description?: string;
  goal?: { _id: string; title: string };
  status?: string;
  createdAt: string;
}

export interface LifetimeStats {
  totalSavedLifetime: number;
  totalWithdrawnLifetime: number;
  goalsCompletedLifetime: number;
  totalTransactions: number;
}

export const useAnalyticsStore = defineStore("analytics", () => {
  const uiStore = useUIStore();
  const overview = ref<Overview>({
    totalSaved: 0,
    activeGoals: 0,
    completedGoals: 0,
    overallProgress: 0,
    monthlyGrowth: 0,
  });
  const trendData = ref<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });
  const distribution = ref<DistributionItem[]>([]);
  const transactions = ref<Transaction[]>([]);
  const lifetime = ref<LifetimeStats>({
    totalSavedLifetime: 0,
    totalWithdrawnLifetime: 0,
    goalsCompletedLifetime: 0,
    totalTransactions: 0,
  });
  const loading = ref(false);

  const fetchOverview = async () => {
    try {
      const { data } = await api.get("/analytics/overview");
      overview.value = { ...overview.value, ...data };
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to load overview" });
    }
  };

  const fetchTrend = async (period: string) => {
    try {
      const { data } = await api.get(`/analytics/trend?period=${period}`);
      trendData.value = {
        labels: data.labels || [],
        data: data.data || [],
      };
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to load trend" });
    }
  };

  const fetchDistribution = async () => {
    try {
      const { data } = await api.get("/analytics/distribution");
      distribution.value = data;
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to load distribution",
      });
    }
  };

  const fetchTransactions = async (limit = 10) => {
    try {
      const { data } = await api.get(`/analytics/transactions?limit=${limit}`);
      transactions.value = data;
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to load transactions",
      });
    }
  };

  const fetchLifetimeStats = async () => {
    try {
      const { data } = await api.get("/analytics/lifetime");
      lifetime.value = data;
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to load lifetime stats",
      });
    }
  };

  const fetchAll = async (period = "month") => {
    loading.value = true;
    try {
      await Promise.all([
        fetchOverview(),
        fetchTrend(period),
        fetchDistribution(),
        fetchTransactions(),
        fetchLifetimeStats(), // 👈 new
      ]);
    } finally {
      loading.value = false;
    }
  };

  return {
    overview,
    trendData,
    distribution,
    transactions,
    lifetime,
    loading,
    fetchAll,
    fetchTrend,
    fetchLifetimeStats,
  };
});
