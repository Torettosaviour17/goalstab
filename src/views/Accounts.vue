<template>
  <div class="container mx-2 px-4 py-6 md:px-6 md:py-8">
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
        :key="account._id"
        :account="account"
        @edit="openEditModal(account)"
        @delete="confirmDelete(account)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="glass-card p-12 text-center">
      <div
        class="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center"
      >
        <span class="text-3xl">🏦</span>
      </div>
      <h3 class="text-xl font-bold text-white mb-2">No accounts yet</h3>
      <p class="text-gray-400 mb-6">
        Add a bank account to link it to your goals
      </p>
      <BaseButton @click="openAddModal">Add Account</BaseButton>
    </div>

    <!-- Add/Edit Modal -->
    <AddAccountModal
      v-model="showModal"
      :account="editingAccount"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation -->
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
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAccountsStore } from "@/stores/accounts";
import { useUIStore } from "@/stores/ui";
import BaseButton from "@/components/shared/BaseButton.vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import AccountCard from "@/components/accounts/AccountCard.vue";
import AddAccountModal from "@/components/accounts/AddAccountModal.vue";
import type { Account } from "@/stores/accounts";

const accountsStore = useAccountsStore();
const uiStore = useUIStore();
const { accounts } = storeToRefs(accountsStore);

const showModal = ref(false);
const showDeleteModal = ref(false);
const editingAccount = ref<Account | null>(null);
const accountToDelete = ref<Account | null>(null);

onMounted(() => {
  accountsStore.fetchAccounts();
});

const openAddModal = () => {
  editingAccount.value = null;
  showModal.value = true;
};

const openEditModal = (account: Account) => {
  editingAccount.value = account;
  showModal.value = true;
};

const confirmDelete = (account: Account) => {
  accountToDelete.value = account;
  showDeleteModal.value = true;
};

const handleSubmit = async (accountData: any) => {
  if (editingAccount.value) {
    await accountsStore.updateAccount(editingAccount.value._id, accountData);
  } else {
    await accountsStore.addAccount(accountData);
  }
};

const handleDelete = async () => {
  if (accountToDelete.value) {
    await accountsStore.deleteAccount(accountToDelete.value._id);
    showDeleteModal.value = false;
    accountToDelete.value = null;
  }
};
</script>
