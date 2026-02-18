import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { BankAccount } from "@/types/user";
import { useUIStore } from "./ui";

export const useAccountsStore = defineStore("accounts", () => {
  const uiStore = useUIStore();

  // Always ensure id is string
  const accounts = ref<BankAccount[]>([
    {
      id: "acc-1",
      bankName: "GTBank",
      accountNumber: "0123456789",
      accountName: "John Doe",
      lastFour: "6789",
      balance: 250_000,
      isDefault: true,
      currency: "NGN",
      type: "savings",
    },
    {
      id: "acc-2",
      bankName: "Zenith Bank",
      accountNumber: "1234567890",
      accountName: "John Doe",
      lastFour: "7890",
      balance: 150_000,
      isDefault: false,
      currency: "NGN",
      type: "checking",
    },
  ]);

  const defaultAccount = computed(() =>
    accounts.value.find((a) => a.isDefault),
  );

  // Add account: generate id always
  const addAccount = (account: Omit<BankAccount, "id">) => {
    const newAccount: BankAccount = {
      id: `acc-${Date.now()}`, // TS-safe
      ...account,
    };
    accounts.value.push(newAccount);
    uiStore.addToast({
      type: "success",
      message: "Account added successfully",
    });
    return newAccount;
  };

  // Update account: id cannot be changed
  const updateAccount = (
    id: string,
    updates: Partial<Omit<BankAccount, "id">>,
  ) => {
    const index = accounts.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      // Directly spread updates since 'id' is not part of the type
      accounts.value[index] = {
        ...accounts.value[index],
        ...updates,
      } as BankAccount;
      uiStore.addToast({ type: "success", message: "Account updated" });
    }
  };

  const deleteAccount = (id: string) => {
    accounts.value = accounts.value.filter((a) => a.id !== id);
    uiStore.addToast({ type: "info", message: "Account removed" });
  };

  const setDefaultAccount = (id: string) => {
    accounts.value.forEach((a) => {
      a.isDefault = a.id === id;
    });
  };

  return {
    accounts,
    defaultAccount,
    addAccount,
    updateAccount,
    deleteAccount,
    setDefaultAccount,
  };
});
