<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-4xl">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-white">Bank Accounts</h1>
        <p class="text-gray-400 mt-1">Manage your connected accounts</p>
      </div>
      <BaseButton @click="openAddModal">
        <template #icon>＋</template>
        Add Account
      </BaseButton>
    </div>

    <!-- Accounts List -->
    <div v-if="accounts.length" class="space-y-4">
      <AccountCard
        v-for="account in accounts"
        :key="account.id"
        :account="account"
        @edit="openEditModal(account)"
        @delete="confirmDelete(account)"
      />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      title="No accounts connected"
      description="Add a bank account to start assigning it to your goals"
      icon="🏦"
      action-label="Add Account"
      @action="openAddModal"
    />

    <!-- Add/Edit Modal -->
    <AddAccountModal
      v-model="showModal"
      :account="editingAccount"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <BaseModal v-model="showDeleteModal" title="Remove Account">
      <p class="text-gray-300 mb-6">
        Are you sure you want to remove this account? This action cannot be
        undone.
      </p>
      <div class="flex gap-2 justify-end">
        <BaseButton variant="secondary" @click="showDeleteModal = false"
          >Cancel</BaseButton
        >
        <BaseButton variant="danger" @click="handleDelete">Remove</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAccountsStore } from "@/stores/accounts";
import { useUIStore } from "@/stores/ui";
import BaseButton from "@/components/shared/BaseButton.vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import EmptyState from "@/components/dashboard/EmptyState.vue";
import AccountCard from "@/components/accounts/AccountCard.vue";
import AddAccountModal from "@/components/accounts/AddAccountModal.vue";
import type { BankAccount } from "@/types/user";

const accountsStore = useAccountsStore();
const uiStore = useUIStore();
const { accounts } = storeToRefs(accountsStore);

const showModal = ref(false);
const showDeleteModal = ref(false);
const editingAccount = ref<BankAccount | null>(null);
const accountToDelete = ref<BankAccount | null>(null);

const openAddModal = () => {
  editingAccount.value = null;
  showModal.value = true;
};

const openEditModal = (account: BankAccount) => {
  editingAccount.value = account;
  showModal.value = true;
};

const confirmDelete = (account: BankAccount) => {
  accountToDelete.value = account;
  showDeleteModal.value = true;
};

const handleSubmit = (accountData: any) => {
  if (editingAccount.value) {
    accountsStore.updateAccount(editingAccount.value.id, accountData);
    if (accountData.isDefault) {
      accountsStore.setDefaultAccount(editingAccount.value.id);
    }
  } else {
    const newAccount = accountsStore.addAccount(accountData);
    if (accountData.isDefault) {
      accountsStore.setDefaultAccount(newAccount.id);
    }
  }
};

const handleDelete = () => {
  if (accountToDelete.value) {
    accountsStore.deleteAccount(accountToDelete.value.id);
    showDeleteModal.value = false;
    accountToDelete.value = null;
  }
};
</script>
