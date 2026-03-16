import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/api";
import { useUIStore } from "./ui";

export interface Transaction {
  _id: string;
  type: "deposit" | "withdrawal" | "goal_completed" | "auto_save";
  amount: number;
  description?: string;
  goal?: { _id: string; title: string };
  status?: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
}

export const useTransactionsStore = defineStore("transactions", () => {
  const uiStore = useUIStore();
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);

  const fetchRecentTransactions = async (limit = 10) => {
    loading.value = true;
    try {
      const { data } = await api.get(`/analytics/transactions?limit=${limit}`);
      transactions.value = data;
    } catch (err: any) {
      // Silently ignore 404 (endpoint not implemented yet)
      if (err.response?.status !== 404) {
        uiStore.addToast({
          type: "error",
          message: "Failed to load recent activity",
        });
      }
      // Keep empty array
    } finally {
      loading.value = false;
    }
  };

  const refreshTransactions = async () => {
    await fetchRecentTransactions();
  };

  return {
    transactions,
    loading,
    fetchRecentTransactions,
    refreshTransactions,
  };
});
