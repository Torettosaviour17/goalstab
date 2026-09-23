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

type AccountInput = Pick<Account, "bankName" | "accountNumber" | "accountName" | "type" | "currency" | "isDefault">;

export const useAccountsStore = defineStore("accounts", () => {
  const uiStore = useUIStore();
  const accounts = ref<Account[]>([]);
  const loading = ref(false);
  let fetching = false;

  const defaultAccount = computed(() => accounts.value.find((acc) => acc.isDefault));

  const fetchAccounts = async () => {
    if (fetching) return;
    fetching = true;
    loading.value = true;
    try {
      const { data } = await api.get<Account[]>("/accounts");
      accounts.value = data;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to load accounts" });
    } finally {
      loading.value = false;
      fetching = false;
    }
  };

  const addAccount = async (accountData: AccountInput) => {
    try {
      const { data } = await api.post<Account>("/accounts", accountData);
      accounts.value.push(data);
      uiStore.addToast({ type: "success", message: "Account added successfully" });
      return data;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to add account" });
      throw err;
    }
  };

  const updateAccount = async (id: string, updates: Partial<AccountInput>) => {
    try {
      const { data } = await api.put<Account>(`/accounts/${id}`, updates);
      const index = accounts.value.findIndex((a) => a._id === id);
      if (index !== -1) accounts.value[index] = data;
      uiStore.addToast({ type: "success", message: "Account updated" });
      return data;
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to update account" });
      throw err;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await api.delete(`/accounts/${id}`);
      accounts.value = accounts.value.filter((a) => a._id !== id);
      uiStore.addToast({ type: "success", message: "Account removed" });
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to delete account" });
      throw err;
    }
  };

  const setDefaultAccount = async (id: string) => {
    try {
      const { data } = await api.post<Account>(`/accounts/${id}/default`);
      accounts.value = accounts.value.map((acc) => ({
        ...acc,
        isDefault: acc._id === data._id,
      }));
      uiStore.addToast({ type: "success", message: "Default account updated" });
    } catch (err) {
      uiStore.addToast({ type: "error", message: "Failed to set default account" });
      throw err;
    }
  };

  return { accounts, loading, defaultAccount, fetchAccounts, addAccount, updateAccount, deleteAccount, setDefaultAccount };
});