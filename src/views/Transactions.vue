<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">Transactions</h1>
    <p class="text-gray-400 mb-6">
      View, filter, and export your transaction history
    </p>

    <!-- Filters and Export Buttons -->
    <div class="flex flex-col lg:flex-row gap-4 mb-6">
      <div class="flex-1">
        <input
          v-model="search"
          type="text"
          placeholder="Search by goal or description..."
          class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
          @input="debouncedSearch"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <select
          v-model="typeFilter"
          class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
        >
          <option value="all">All Types</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="goal_completed">Goal Completed</option>
          <option value="auto_save">Auto Save</option>
        </select>
        <select
          v-model="statusFilter"
          class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
        <button
          @click="handleCSVExport"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition flex items-center gap-2"
          :disabled="!filteredTransactions.length"
        >
          <span>📥</span> CSV
        </button>
        <button
          @click="exportToPDF"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition flex items-center gap-2"
          :disabled="!filteredTransactions.length || pdfLoading"
        >
          <span v-if="!pdfLoading">📄</span>
          <span v-else class="animate-spin">⟳</span>
          {{ pdfLoading ? "Generating..." : "PDF" }}
        </button>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="glass-card p-4 md:p-6 overflow-x-auto">
      <!-- Summary Stats -->
      <div
        v-if="filteredTransactions.length"
        class="flex flex-wrap gap-4 mb-4 text-sm"
      >
        <div class="bg-gray-800/50 px-4 py-2 rounded-lg">
          <span class="text-gray-400">Deposits:</span>
          <span class="text-green-400 ml-2"
            >₦{{ formatNumber(totalDeposits) }}</span
          >
        </div>
        <div class="bg-gray-800/50 px-4 py-2 rounded-lg">
          <span class="text-gray-400">Withdrawals:</span>
          <span class="text-red-400 ml-2"
            >₦{{ formatNumber(totalWithdrawals) }}</span
          >
        </div>
        <div class="bg-gray-800/50 px-4 py-2 rounded-lg">
          <span class="text-gray-400">Net:</span>
          <span class="text-blue-400 ml-2">₦{{ formatNumber(netChange) }}</span>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
        ></div>
      </div>
      <div v-else-if="filteredTransactions.length" class="min-w-[800px]">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-400 border-b border-gray-800">
              <th class="pb-3 font-medium">Type</th>
              <th class="pb-3 font-medium">Goal</th>
              <th class="pb-3 font-medium">Amount</th>
              <th class="pb-3 font-medium">Status</th>
              <th class="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr
              v-for="tx in filteredTransactions"
              :key="tx._id"
              class="text-gray-300"
            >
              <td class="py-3 capitalize">
                <span class="flex items-center gap-2">
                  <span class="text-lg">{{ transactionIcon(tx.type) }}</span>
                  {{ tx.type.replace("_", " ") }}
                </span>
              </td>
              <td class="py-3">{{ tx.goal?.title || "-" }}</td>
              <td
                class="py-3 font-medium"
                :class="
                  tx.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
                "
              >
                {{ tx.type === "withdrawal" ? "-" : "+" }}₦{{
                  formatNumber(tx.amount)
                }}
              </td>
              <td class="py-3">
                <span
                  v-if="tx.type === 'withdrawal' && tx.status"
                  class="px-2 py-1 rounded-full text-xs"
                  :class="statusClass(tx.status)"
                >
                  {{ tx.status }}
                </span>
                <span v-else class="text-gray-400">–</span>
              </td>
              <td class="py-3 text-gray-400">{{ formatDate(tx.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-12 text-gray-400">
        No transactions found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTransactionsStore } from "@/stores/transactions";
import { exportToCSV } from "@/utils/export";
import debounce from "lodash/debounce";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const transactionsStore = useTransactionsStore();
const { transactions, loading } = storeToRefs(transactionsStore);

const search = ref("");
const typeFilter = ref("all");
const statusFilter = ref("all");
const pdfLoading = ref(false);

const fetchData = () => {
  transactionsStore.fetchAllTransactions(); // we'll add this method
};

onMounted(fetchData);

const filteredTransactions = computed(() => {
  return transactions.value.filter((tx) => {
    // Search filter
    const matchesSearch =
      !search.value ||
      tx.goal?.title?.toLowerCase().includes(search.value.toLowerCase()) ||
      tx.description?.toLowerCase().includes(search.value.toLowerCase());
    // Type filter
    const matchesType =
      typeFilter.value === "all" || tx.type === typeFilter.value;
    // Status filter
    const matchesStatus =
      statusFilter.value === "all" || tx.status === statusFilter.value;
    return matchesSearch && matchesType && matchesStatus;
  });
});

// Summary stats
const totalDeposits = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.type !== "withdrawal")
    .reduce((sum, tx) => sum + tx.amount, 0),
);
const totalWithdrawals = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.type === "withdrawal" && tx.status === "approved")
    .reduce((sum, tx) => sum + tx.amount, 0),
);
const netChange = computed(() => totalDeposits.value - totalWithdrawals.value);

const debouncedSearch = debounce(() => {
  // no API call needed because we filter client‑side
}, 300);

// CSV export
const handleCSVExport = () => {
  const exportData = filteredTransactions.value.map((tx) => ({
    Date: formatDate(tx.createdAt),
    Type: tx.type.replace("_", " "),
    Goal: tx.goal?.title || "",
    Amount: tx.type === "withdrawal" ? -tx.amount : tx.amount,
    Status: tx.status || "completed",
  }));
  const filename = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  exportToCSV(exportData, filename);
};

// PDF export
const exportToPDF = async () => {
  if (!filteredTransactions.value.length) return;
  pdfLoading.value = true;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.text("Transaction Report", pageWidth / 2, 20, { align: "center" });

  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  // Summary
  doc.setFontSize(12);
  doc.text(`Total Deposits: ₦${totalDeposits.value.toLocaleString()}`, 14, 40);
  doc.text(
    `Total Withdrawals: ₦${totalWithdrawals.value.toLocaleString()}`,
    14,
    48,
  );
  doc.text(`Net Change: ₦${netChange.value.toLocaleString()}`, 14, 56);

  // Table
  const tableData = filteredTransactions.value.map((tx) => [
    formatDate(tx.createdAt),
    tx.type.replace("_", " "),
    tx.goal?.title || "-",
    (tx.type === "withdrawal" ? "-" : "+") +
      "₦" +
      Math.abs(tx.amount).toLocaleString(),
    tx.status || "-",
  ]);

  autoTable(doc, {
    startY: 70,
    head: [["Date", "Type", "Goal", "Amount", "Status"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save(`transactions-${new Date().toISOString().slice(0, 10)}.pdf`);
  pdfLoading.value = false;
};

// Helper functions
const formatNumber = (num: number) =>
  new Intl.NumberFormat().format(Math.abs(num));
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const transactionIcon = (type: string) => {
  const icons: Record<string, string> = {
    deposit: "💰",
    withdrawal: "💸",
    goal_completed: "🎉",
    auto_save: "⚡",
  };
  return icons[type] || "📝";
};
const statusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    approved: "bg-green-500/20 text-green-400",
    rejected: "bg-red-500/20 text-red-400",
    completed: "bg-gray-500/20 text-gray-400",
  };
  return classes[status] || "bg-gray-500/20";
};
</script>
