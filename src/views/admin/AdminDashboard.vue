<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">
      Admin Dashboard
    </h1>
    <p class="text-gray-400 mb-8">
      Manage users, withdrawals, and platform fees
    </p>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="glass-card p-6">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center"
          >
            <span class="text-2xl">👥</span>
          </div>
          <div>
            <p class="text-sm text-gray-400">Total Users</p>
            <p class="text-2xl font-bold text-white">{{ stats.totalUsers }}</p>
          </div>
        </div>
      </div>
      <div class="glass-card p-6">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center"
          >
            <span class="text-2xl">🎯</span>
          </div>
          <div>
            <p class="text-sm text-gray-400">Total Goals</p>
            <p class="text-2xl font-bold text-white">{{ stats.totalGoals }}</p>
          </div>
        </div>
      </div>
      <div class="glass-card p-6">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center"
          >
            <span class="text-2xl">💰</span>
          </div>
          <div>
            <p class="text-sm text-gray-400">Total Saved</p>
            <p class="text-2xl font-bold text-white">
              ₦{{ formatNumber(stats.totalSaved) }}
            </p>
          </div>
        </div>
      </div>
      <div class="glass-card p-6">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-danger/20 flex items-center justify-center"
          >
            <span class="text-2xl">⏳</span>
          </div>
          <div>
            <p class="text-sm text-gray-400">Pending Withdrawals</p>
            <p class="text-2xl font-bold text-white">
              {{ stats.pendingWithdrawals }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-800">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="px-4 py-2 font-medium transition"
        :class="
          activeTab === tab
            ? 'text-primary-400 border-b-2 border-primary-500'
            : 'text-gray-400 hover:text-white'
        "
      >
        {{ tab }}
      </button>
    </div>

    <!-- Users Tab -->
    <div v-if="activeTab === 'Users'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-white">All Users</h2>
        <input
          v-model="search"
          @input="debouncedSearch"
          placeholder="Search users..."
          class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white"
        />
      </div>
      <div class="glass-card overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr
              class="text-left text-sm text-gray-400 border-b border-gray-800"
            >
              <th class="p-4">Name</th>
              <th class="p-4">Email</th>
              <th class="p-4">Joined</th>
              <th class="p-4">Admin</th>
              <th class="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user._id"
              class="border-b border-gray-800"
            >
              <td class="p-4 text-white">{{ user.name }}</td>
              <td class="p-4 text-gray-300">{{ user.email }}</td>
              <td class="p-4 text-gray-300">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded-full text-xs"
                  :class="
                    user.isAdmin
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'bg-gray-700 text-gray-300'
                  "
                >
                  {{ user.isAdmin ? "Admin" : "User" }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex gap-2">
                  <button
                    @click="toggleAdmin(user._id)"
                    class="text-sm px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                  >
                    Toggle Admin
                  </button>
                  <button
                    @click="deleteUser(user._id)"
                    class="text-sm px-3 py-1 rounded-lg bg-danger/20 hover:bg-danger/30 text-danger transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="changePage"
      />
    </div>

    <!-- Withdrawals Tab -->
    <div v-if="activeTab === 'Withdrawals'">
      <div class="flex gap-2 mb-4">
        <button
          v-for="status in statuses"
          :key="status"
          @click="changeStatus(status)"
          class="px-4 py-2 rounded-lg font-medium transition"
          :class="
            selectedStatus === status
              ? 'bg-primary-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          "
        >
          {{ status }}
        </button>
      </div>
      <div class="glass-card overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr
              class="text-left text-sm text-gray-400 border-b border-gray-800"
            >
              <th class="p-4">User</th>
              <th class="p-4">Goal</th>
              <th class="p-4">Amount</th>
              <th class="p-4">Account</th>
              <th class="p-4">Requested</th>
              <th class="p-4">Status</th>
              <th class="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="wd in withdrawals"
              :key="wd._id"
              class="border-b border-gray-800"
            >
              <td class="p-4 text-white">{{ wd.user?.name || "N/A" }}</td>
              <td class="p-4 text-gray-300">{{ wd.goal?.title }}</td>
              <td class="p-4 text-white">₦{{ formatNumber(wd.amount) }}</td>
              <td class="p-4 text-gray-300">
                {{ wd.accountDetails?.bankName }} ••{{
                  wd.accountDetails?.accountNumber.slice(-4)
                }}
              </td>
              <td class="p-4 text-gray-300">
                {{ formatDate(wd.requestedAt) }}
              </td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded-full text-xs"
                  :class="statusClass(wd.status)"
                >
                  {{ wd.status }}
                </span>
              </td>
              <td class="p-4">
                <div v-if="wd.status === 'pending'" class="flex gap-2">
                  <button
                    @click="openActionModal('approve', wd)"
                    class="text-sm px-3 py-1 rounded-lg bg-success/20 hover:bg-success/30 text-success transition"
                  >
                    Approve
                  </button>
                  <button
                    @click="openActionModal('reject', wd)"
                    class="text-sm px-3 py-1 rounded-lg bg-danger/20 hover:bg-danger/30 text-danger transition"
                  >
                    Reject
                  </button>
                </div>
                <span v-else class="text-gray-500 text-sm">Processed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="changePage"
      />
    </div>

    <!-- Fulfillment Tab -->
    <div v-if="activeTab === 'Fulfillment'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-white">Fulfillment Queue</h2>
        <div class="flex gap-2">
          <div class="bg-gray-800/50 px-3 py-1 rounded-full text-sm">
            <span class="text-gray-400">Products:</span>
            <span class="text-white ml-1">{{ goalTypeStats.product }}</span>
          </div>
          <div class="bg-gray-800/50 px-3 py-1 rounded-full text-sm">
            <span class="text-gray-400">Services:</span>
            <span class="text-white ml-1">{{ goalTypeStats.service }}</span>
          </div>
        </div>
      </div>
      <div class="glass-card overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-sm text-gray-400 border-b border-gray-800">
              <th class="p-4">User</th>
              <th class="p-4">Goal</th>
              <th class="p-4">Type</th>
              <th class="p-4">Target</th>
              <th class="p-4">Saved</th>
              <th class="p-4">Completed</th>
              <th class="p-4">Status</th>
              <th class="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="goal in pendingFulfillment"
              :key="goal._id"
              class="border-b border-gray-800"
            >
              <td class="p-4 text-white">{{ goal.user?.name || 'Unknown' }}</td>
              <td class="p-4 text-gray-300">{{ goal.title }}</td>
              <td class="p-4 capitalize">{{ goal.goalType }}</td>
              <td class="p-4 text-white">₦{{ formatNumber(goal.target) }}</td>
              <td class="p-4 text-white">₦{{ formatNumber(goal.saved) }}</td>
              <td class="p-4 text-gray-300">{{ formatDate(goal.createdAt) }}</td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded-full text-xs"
                  :class="
                    goal.fulfillmentStatus === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : goal.fulfillmentStatus === 'delivered'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                  "
                >
                  {{ goal.fulfillmentStatus }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex gap-2">
                  <button
                    v-if="goal.goalType === 'product'"
                    @click="markDelivered(goal)"
                    class="text-sm px-3 py-1 rounded-lg bg-success/20 hover:bg-success/30 text-success transition"
                  >
                    Mark Delivered
                  </button>
                  <button
                    v-if="goal.goalType === 'service'"
                    @click="openServiceModal(goal)"
                    class="text-sm px-3 py-1 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 transition"
                  >
                    Mark Booked
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="pendingFulfillment.length === 0">
              <td colspan="8" class="p-8 text-center text-gray-500">
                No pending fulfillment tasks
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 🆕 Fees Tab -->
    <div v-if="activeTab === 'Fees'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-white">
          Service Fees (Leftover Funds)
        </h2>
        <p class="text-sm text-gray-400">
          Total collected: ₦{{ formatTotalFees }}
        </p>
      </div>
      <div class="glass-card overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr
              class="text-left text-sm text-gray-400 border-b border-gray-800"
            >
              <th class="p-4">User</th>
              <th class="p-4">Goal</th>
              <th class="p-4">Amount</th>
              <th class="p-4">Date</th>
              <th class="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="fee in leftoverFunds"
              :key="fee._id"
              class="border-b border-gray-800"
            >
              <td class="p-4 text-white">{{ fee.user?.name || "Unknown" }}</td>
              <td class="p-4 text-gray-300">{{ fee.originalGoalTitle }}</td>
              <td class="p-4 text-green-400 font-medium">
                ₦{{ formatNumber(fee.amount) }}
              </td>
              <td class="p-4 text-gray-300">{{ formatDate(fee.createdAt) }}</td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded-full text-xs"
                  :class="
                    fee.status === 'unclaimed'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
                  "
                >
                  {{ fee.status }}
                </span>
              </td>
            </tr>
            <tr v-if="leftoverFunds.length === 0">
              <td colspan="5" class="p-8 text-center text-gray-500">
                No fees collected yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Action Modal -->
    <BaseModal
      v-model="showActionModal"
      :title="
        actionType === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'
      "
    >
      <form @submit.prevent="submitAction">
        <p class="text-gray-300 mb-4">
          {{
            actionType === "approve"
              ? "Approve this withdrawal request?"
              : "Reject this withdrawal request."
          }}
        </p>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >Admin Note (optional)</label
          >
          <textarea
            v-model="adminNote"
            rows="3"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            :placeholder="
              actionType === 'approve'
                ? 'Add a note (optional)'
                : 'Reason for rejection (optional)'
            "
          ></textarea>
        </div>
        <div class="flex gap-2 justify-end pt-4">
          <BaseButton variant="secondary" @click="showActionModal = false"
            >Cancel</BaseButton
          >
          <BaseButton
            :variant="actionType === 'approve' ? 'primary' : 'danger'"
            type="submit"
          >
            {{ actionType === "approve" ? "Approve" : "Reject" }}
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <BaseModal v-model="showServiceModal" title="Book Service">
      <form @submit.prevent="submitServiceBooking">
        <p class="text-gray-300 mb-4">
          Mark this service as booked. You can add notes (e.g., booking reference, confirmation number).
        </p>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Booking Details (optional)</label>
          <textarea
            v-model="serviceDetails"
            rows="3"
            placeholder="Add any relevant information..."
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>
        <div class="flex gap-2 justify-end pt-4">
          <BaseButton variant="secondary" @click="showServiceModal = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">Confirm Booking</BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia"; // ✅ added
import { useAdminStore } from "@/stores/admin";
import { useUIStore } from "@/stores/ui";
import BaseModal from "@/components/shared/BaseModal.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import Pagination from "@/components/shared/Pagination.vue";
import debounce from "lodash/debounce";

const adminStore = useAdminStore();
const uiStore = useUIStore();

const { users, withdrawals, stats, loading, totalPages, leftoverFunds, pendingFulfillment, goalTypeStats } =
  storeToRefs(adminStore);

const activeTab = ref("Users");
const tabs = ["Users", "Withdrawals", "Fulfillment", "Fees"];
const statuses = ["pending", "approved", "rejected", "all"];
const selectedStatus = ref("pending");
const search = ref("");
const currentPage = ref(1);

const showActionModal = ref(false);
const showServiceModal = ref(false);
const actionType = ref<"approve" | "reject">("approve");
const selectedWithdrawal = ref<any>(null);
const adminNote = ref("");

onMounted(() => {
  adminStore.fetchStats();
  adminStore.fetchUsers();
  adminStore.fetchWithdrawals(1, selectedStatus.value);
  adminStore.fetchLeftoverFunds();
  adminStore.fetchPendingFulfillment();
  adminStore.fetchGoalTypeStats();
});

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
const formatDate = (date: string) => new Date(date).toLocaleDateString();

const formatTotalFees = computed(() => {
  const total = leftoverFunds.value.reduce((sum, fee) => sum + fee.amount, 0);
  return formatNumber(total);
});

const statusClass = (status: string) =>
  ({
    pending: "bg-warning/20 text-warning",
    approved: "bg-success/20 text-success",
    rejected: "bg-danger/20 text-danger",
  })[status] || "bg-gray-700";

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  adminStore.fetchUsers(1, search.value);
}, 500);

const changePage = (page: number) => {
  currentPage.value = page;
  if (activeTab.value === "Users") {
    adminStore.fetchUsers(page, search.value);
  } else {
    adminStore.fetchWithdrawals(page, selectedStatus.value);
  }
};

const changeStatus = (status: string) => {
  selectedStatus.value = status;
  currentPage.value = 1;
  adminStore.fetchWithdrawals(1, status);
};

const toggleAdmin = async (userId: string) => {
  await adminStore.toggleAdmin(userId);
};

const deleteUser = async (userId: string) => {
  await adminStore.deleteUser(userId);
};

const openActionModal = (type: "approve" | "reject", withdrawal: any) => {
  actionType.value = type;
  selectedWithdrawal.value = withdrawal;
  adminNote.value = "";
  showActionModal.value = true;
};

const submitAction = async () => {
  if (actionType.value === "approve") {
    await adminStore.approveWithdrawal(
      selectedWithdrawal.value._id,
      adminNote.value,
    );
  } else {
    await adminStore.rejectWithdrawal(
      selectedWithdrawal.value._id,
      adminNote.value,
    );
  }
  showActionModal.value = false;
  adminStore.fetchWithdrawals(currentPage.value, selectedStatus.value);
  adminStore.fetchLeftoverFunds(); // refresh fees after approval
};

const markDelivered = async (goal: any) => {
  await adminStore.updateFulfillmentStatus(goal._id, 'delivered', {
    deliveredAt: new Date(),
  });
};

const openServiceModal = (goal: any) => {
  selectedGoalForService.value = goal;
  serviceDetails.value = '';
  showServiceModal.value = true;
};

const submitServiceBooking = async () => {
  await adminStore.updateFulfillmentStatus(
    selectedGoalForService.value._id,
    'booked',
    { bookingDetails: serviceDetails.value, bookedAt: new Date() },
  );
  showServiceModal.value = false;
};

const selectedGoalForService = ref<any>(null);
const serviceDetails = ref('');
</script>
