import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";
import { useUIStore } from "./ui";

export interface Account {
  _id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  lastFour: string;
  balance: number;
  currency: string;
  type: "checking" | "savings" | "credit";
  isDefault: boolean;
  createdAt: string;
}

export const useAccountsStore = defineStore("accounts", () => {
  const uiStore = useUIStore();
  const accounts = ref<Account[]>([]);
  const loading = ref(false);
  let fetching = false; // Guard flag to prevent concurrent fetches

  const defaultAccount = computed(() =>
    accounts.value.find((acc) => acc.isDefault),
  );

  const fetchAccounts = async () => {
    if (fetching) {
      console.log("[Accounts] fetchAccounts already in progress, skipping");
      return;
    }
    console.trace("fetchAccounts called");
    fetching = true;
    loading.value = true;
    try {
      const { data } = await api.get("/accounts");
      accounts.value = data;
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to load accounts",
      });
    } finally {
      loading.value = false;
      fetching = false;
    }
  };

  const addAccount = async (accountData: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    type: string;
  }) => {
    try {
      const { data } = await api.post("/accounts", accountData);
      accounts.value.push(data);

      uiStore.addToast({
        type: "success",
        message: "Account added successfully",
      });

      return data;
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to add account",
      });
      throw err;
    }
  };

  const updateAccount = async (id: string, updates: Partial<Account>) => {
    try {
      const { data } = await api.put(`/accounts/${id}`, updates);

      const index = accounts.value.findIndex((a) => a._id === id);
      if (index !== -1) accounts.value[index] = data;

      uiStore.addToast({
        type: "success",
        message: "Account updated",
      });

      return data;
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to update account",
      });
      throw err;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await api.delete(`/accounts/${id}`);
      accounts.value = accounts.value.filter((a) => a._id !== id);

      uiStore.addToast({
        type: "success",
        message: "Account removed",
      });
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to delete account",
      });
      throw err;
    }
  };

  const setDefaultAccount = async (id: string) => {
    try {
      await api.post(`/accounts/${id}/default`);

      accounts.value.forEach((acc) => {
        acc.isDefault = acc._id === id;
      });

      uiStore.addToast({
        type: "success",
        message: "Default account updated",
      });
    } catch (err) {
      uiStore.addToast({
        type: "error",
        message: "Failed to set default account",
      });
    }
  };

  return {
    accounts,
    loading,
    defaultAccount,
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    setDefaultAccount,
  };
});
