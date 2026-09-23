<template>
  <div class="container mx-auto w-full px-4 py-6 md:px-6 md:py-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-white">Bank Accounts</h1>
        <p class="text-gray-400 mt-1">Manage your connected accounts</p>
      </div>
      <BaseButton @click="openAddModal">
        <template #icon>＋</template>
        Add Account
      </BaseButton>
    </div>

    <div v-if="accountsStore.loading" class="glass-card p-8 text-center text-gray-400">
      Loading accounts...
    </div>

    <div v-else-if="accounts.length" class="space-y-4">
      <AccountCard
        v-for="account in accounts"
        :key="account._id"
        :account="account"
        @edit="openEditModal(account)"
        @delete="confirmDelete(account)"
        @set-default="accountsStore.setDefaultAccount(account._id)"
      />
    </div>

    <div v-else class="glass-card p-12 text-center">
      <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center">
        <span class="text-3xl">🏦</span>
      </div>
      <h3 class="text-xl font-bold text-white mb-2">No accounts yet</h3>
      <p class="text-gray-400 mb-6">Add a bank account to link it to your goals</p>
      <BaseButton @click="openAddModal">Add Account</BaseButton>
    </div>

    <AddAccountModal
      v-model="showModal"
      :account="editingAccount"
      :loading="saving"
      @submit="handleSubmit"
    />

    <BaseModal v-model="showDeleteModal" title="Remove Account">
      <p class="text-gray-300 mb-6">
        Are you sure you want to remove this account? This action cannot be undone.
      </p>
      <div class="flex flex-col-reverse sm:flex-row gap-2 justify-end">
        <BaseButton variant="secondary" @click="showDeleteModal = false">Cancel</BaseButton>
        <BaseButton variant="danger" :loading="deleting" :disabled="deleting" @click="handleDelete">Remove</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAccountsStore } from "@/stores/accounts";
import BaseButton from "@/components/shared/BaseButton.vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import AccountCard from "@/components/accounts/AccountCard.vue";
import AddAccountModal from "@/components/accounts/AddAccountModal.vue";

const accountsStore = useAccountsStore();
const accounts = accountsStore.accounts;
const showModal = ref(false);
const showDeleteModal = ref(false);
const editingAccount = ref<import("@/stores/accounts").Account | null>(null);
const accountToDelete = ref<import("@/stores/accounts").Account | null>(null);
const saving = ref(false);
const deleting = ref(false);

onMounted(() => {
  void accountsStore.fetchAccounts();
});

const openAddModal = () => {
  editingAccount.value = null;
  showModal.value = true;
};

const openEditModal = (account: import("@/stores/accounts").Account) => {
  editingAccount.value = account;
  showModal.value = true;
};

const confirmDelete = (account: import("@/stores/accounts").Account) => {
  accountToDelete.value = account;
  showDeleteModal.value = true;
};

const handleSubmit = async (accountData: Parameters<typeof accountsStore.addAccount>[0]) => {
  saving.value = true;
  try {
    if (editingAccount.value) {
      await accountsStore.updateAccount(editingAccount.value._id, accountData);
    } else {
      await accountsStore.addAccount(accountData);
    }
    showModal.value = false;
    editingAccount.value = null;
  } finally {
    saving.value = false;
  }
};

const handleDelete = async () => {
  if (!accountToDelete.value) return;
  deleting.value = true;
  try {
    await accountsStore.deleteAccount(accountToDelete.value._id);
    showDeleteModal.value = false;
    accountToDelete.value = null;
  } finally {
    deleting.value = false;
  }
};
</script>