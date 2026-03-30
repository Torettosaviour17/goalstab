import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/api";
import { useUIStore } from "./ui";
import { useTransactionsStore } from "./transactions";

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Withdrawal {
  _id: string;
  user: User | { _id: string; name: string; email: string };
  goal: { _id: string; title: string };
  amount: number;
  status: "pending" | "approved" | "rejected";
  accountDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  adminNote?: string;
  requestedAt: string;
  processedAt?: string;
}

export interface AdminLog {
  _id: string;
  user: { _id: string; name: string; email: string };
  action: string;
  targetType: string;
  targetId: string;
  details: any;
  timestamp: string;
}

export interface EarningsData {
  labels: string[];
  data: number[];
}

export const useAdminStore = defineStore("admin", () => {
  const uiStore = useUIStore();
  const transactionsStore = useTransactionsStore();
  const users = ref<User[]>([]);
  const withdrawals = ref<Withdrawal[]>([]);
  const stats = ref({
    totalUsers: 0,
    totalGoals: 0,
    totalSaved: 0,
    pendingWithdrawals: 0,
    completedWithdrawals: 0,
  });
  const loading = ref(false);
  const totalUsers = ref(0);
  const totalWithdrawals = ref(0);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const leftoverFunds = ref<any[]>([]);
  const pendingFulfillment = ref<any[]>([]);
  const goalTypeStats = ref({ product: 0, service: 0 });

  const logs = ref<AdminLog[]>([]);
  const logsTotal = ref(0);
  const logsPage = ref(1);
  const logsTotalPages = ref(1);
  const earningsData = ref<EarningsData>({ labels: [], data: [] });
  const earningsPeriod = ref("day");

  const fetchPendingFulfillment = async () => {
    try {
      const { data } = await api.get("/admin/fulfillment/pending");
      pendingFulfillment.value = data;
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to load fulfillment queue",
      });
    }
  };

  const updateFulfillmentStatus = async (
    id: string,
    status: string,
    details?: any,
  ) => {
    try {
      const { data } = await api.put(`/admin/fulfillment/${id}`, {
        status,
        details,
      });
      const index = pendingFulfillment.value.findIndex((g) => g._id === id);
      if (index !== -1) {
        pendingFulfillment.value[index] = data;
      }
      uiStore.addToast({
        type: "success",
        message: `Fulfillment status updated to ${status}`,
      });
      fetchGoalTypeStats();
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to update fulfillment status",
      });
    }
  };

  const fetchGoalTypeStats = async () => {
    try {
      const { data } = await api.get("/admin/stats/goal-types");
      goalTypeStats.value = data;
    } catch (err) {
      console.error("Failed to load goal type stats");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      stats.value = res.data;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to load stats" });
    }
  };

  const fetchUsers = async (page = 1, search = "") => {
    loading.value = true;
    try {
      const res = await api.get("/admin/users", {
        params: { page, limit: 20, search },
      });
      users.value = res.data.users;
      totalUsers.value = res.data.total;
      totalPages.value = res.data.totalPages;
      currentPage.value = page;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to load users" });
    } finally {
      loading.value = false;
    }
  };

  const toggleAdmin = async (userId: string) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-admin`);
      const user = users.value.find((u) => u._id === userId);
      if (user) user.isAdmin = !user.isAdmin;
      uiStore.addToast({ type: "success", message: "Admin status updated" });
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to update admin status",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure? This will delete all user data permanently."))
      return;
    try {
      await api.delete(`/admin/users/${userId}`);
      users.value = users.value.filter((u) => u._id !== userId);
      uiStore.addToast({ type: "success", message: "User deleted" });
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to delete user" });
    }
  };

  const fetchWithdrawals = async (page = 1, status = "pending") => {
    loading.value = true;
    try {
      const res = await api.get("/admin/withdrawals", {
        params: { page, limit: 20, status },
      });
      withdrawals.value = res.data.withdrawals;
      totalWithdrawals.value = res.data.total;
      totalPages.value = res.data.totalPages;
      currentPage.value = page;
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to load withdrawals",
      });
    } finally {
      loading.value = false;
    }
  };

  const approveWithdrawal = async (id: string, note: string) => {
    try {
      await api.put(`/admin/withdrawals/${id}/approve`, { adminNote: note });
      const wd = withdrawals.value.find((w) => w._id === id);
      if (wd) wd.status = "approved";
      // Refresh transactions to show updated status
      transactionsStore.refreshTransactions();
      uiStore.addToast({ type: "success", message: "Withdrawal approved" });
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to approve" });
    }
  };

  const rejectWithdrawal = async (id: string, note: string) => {
    try {
      await api.put(`/admin/withdrawals/${id}/reject`, { adminNote: note });
      const wd = withdrawals.value.find((w) => w._id === id);
      if (wd) wd.status = "rejected";
      // Refresh transactions to show updated status
      transactionsStore.refreshTransactions();
      uiStore.addToast({ type: "success", message: "Withdrawal rejected" });
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to reject" });
    }
  };

  const fetchLeftoverFunds = async () => {
    try {
      const { data } = await api.get("/admin/leftover-funds");
      leftoverFunds.value = data;
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to load leftover funds",
      });
    }
  };

  const fetchLogs = async (page = 1) => {
    loading.value = true;
    try {
      const res = await api.get("/admin/logs", {
        params: { page, limit: 20 },
      });
      logs.value = res.data.logs;
      logsTotal.value = res.data.total;
      logsPage.value = res.data.page;
      logsTotalPages.value = res.data.totalPages;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to load logs" });
    } finally {
      loading.value = false;
    }
  };

  const fetchEarnings = async (period: string = earningsPeriod.value) => {
    try {
      const res = await api.get("/admin/earnings", {
        params: { period },
      });
      earningsData.value = res.data;
      earningsPeriod.value = period;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to load earnings" });
    }
  };

  return {
    users,
    withdrawals,
    stats,
    loading,
    totalUsers,
    totalWithdrawals,
    currentPage,
    totalPages,
    leftoverFunds,
    fetchStats,
    fetchUsers,
    toggleAdmin,
    deleteUser,
    fetchWithdrawals,
    approveWithdrawal,
    rejectWithdrawal,
    fetchLeftoverFunds,
    pendingFulfillment,
    goalTypeStats,
    fetchPendingFulfillment,
    updateFulfillmentStatus,
    fetchGoalTypeStats,
    logs,
    logsTotal,
    logsPage,
    logsTotalPages,
    earningsData,
    earningsPeriod,
    fetchLogs,
    fetchEarnings,
  };
});
