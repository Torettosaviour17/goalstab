<template>
  <div class="mx-auto w-full max-w-6xl min-w-0 space-y-6 overflow-x-clip px-4 py-6 text-white md:px-8 md:py-10">
    <header>
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">GoalTabs Wallet</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight">Your money, your pace.</h1>
      <p class="mt-2 text-sm text-slate-400">A flexible wallet alongside your locked savings goals.</p>
    </header>
    <section class="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-[#172a63] via-[#111e48] to-[#10172f] p-6 shadow-xl shadow-blue-950/20 md:p-8">
      <div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl"></div>
      <div class="relative flex items-start justify-between gap-3">
        <div><p class="text-sm text-blue-100/70">Available wallet balance</p>
          <p class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{{ wallet?.availableBalance == null ? '—' : formatMoney(wallet.availableBalance) }}</p>
          <p class="mt-3 text-xs text-blue-100/70">{{ wallet?.status === 'active' ? 'Available to use' : 'Wallet activation coming soon' }}</p>
        </div>
        <div class="rounded-2xl bg-white/10 p-3 text-2xl" aria-hidden="true">◈</div>
      </div>
      <p v-if="error" class="relative mt-4 text-xs text-amber-200">{{ error }}</p>
    </section>
    <section class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <button v-for="action in actions" :key="action.key" type="button" :disabled="!wallet?.capabilities?.[action.key]"
        @click="showUnavailable(action.label)"
        class="flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-900/80 px-3 py-5 text-center transition enabled:hover:border-blue-400/50 disabled:cursor-not-allowed disabled:opacity-60">
        <span class="text-2xl">{{ action.icon }}</span><span class="text-sm font-semibold">{{ action.label }}</span>
        <span v-if="!wallet?.capabilities?.[action.key]" class="text-[11px] text-slate-400">Coming soon</span>
      </button>
    </section>
    <section class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div><h2 class="text-lg font-semibold">Smart saving preferences</h2>
          <p class="mt-1 text-sm text-slate-400">Plan gentle saving rules. No automatic deductions will occur yet.</p></div>
        <span class="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200">Planning mode</span>
      </div>
      <form class="mt-5 grid gap-4 sm:grid-cols-2" @submit.prevent="savePreferences">
        <label class="text-sm text-slate-300">Frequency
          <select v-model="preferences.frequency" class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select>
        </label>
        <label class="text-sm text-slate-300">Percentage (1–20%)
          <input v-model.number="preferences.percentage" type="number" min="1" max="20" required class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
        </label>
        <label class="text-sm text-slate-300">Monthly saving cap (₦)
          <input v-model.number="monthlyCapNaira" type="number" min="0" max="1000000" step="1" required class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
        </label>
        <label class="text-sm text-slate-300">Minimum money to leave untouched (₦)
          <input v-model.number="minimumRemainingNaira" type="number" min="0" max="1000000" step="1" required class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
        </label>
        <label class="text-sm text-slate-300">Future funding source
          <select v-model="preferences.fundingSource" class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"><option value="wallet">GoalTabs wallet</option><option value="connected_account">Connected bank account</option></select>
        </label>
        <label class="flex items-center gap-3 text-sm text-slate-300"><input v-model="preferences.smartSaveEnabled" type="checkbox" class="h-4 w-4 accent-blue-500" /> Save my preferences for future activation</label>
        <div class="sm:col-span-2 flex flex-wrap items-center gap-3">
          <button type="submit" :disabled="saving" class="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{{ saving ? 'Saving…' : 'Save preferences' }}</button>
          <p v-if="preferenceMessage" role="status" class="text-sm text-blue-200">{{ preferenceMessage }}</p>
        </div>
      </form>
    </section>
    <div class="grid gap-5 lg:grid-cols-2">
      <section class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 class="text-lg font-semibold">Wallet activity</h2>
        <p class="mt-1 text-sm text-slate-400">Funding, transfers and withdrawals will appear here.</p>
        <div class="mt-6 rounded-xl border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-400">No wallet transactions yet</div>
      </section>
      <section class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 class="text-lg font-semibold">Savings stay separate</h2>
        <p class="mt-2 text-sm leading-6 text-slate-400">Your wallet is for available funds. Your savings goals have their own balances and rules. Automatic saving from a wallet or connected bank account will require your permission and configurable limits.</p>
        <router-link to="/goals" class="mt-5 inline-flex rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-200">View savings goals</router-link>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import api from "@/services/api";
type Capability = "fund" | "transfer" | "withdraw" | "saveFromWallet";
type Wallet = { availableBalance: number | null; status: string; capabilities: Record<Capability, boolean> };
const wallet = ref<Wallet | null>(null);
const error = ref("");
const saving = ref(false);
const preferenceMessage = ref("");
const preferences = ref({ smartSaveEnabled: false, frequency: "monthly", percentage: 5, monthlyCapMinor: 0, minimumRemainingMinor: 0, fundingSource: "wallet" });
const monthlyCapNaira = computed({ get: () => preferences.value.monthlyCapMinor / 100, set: (value: number) => { preferences.value.monthlyCapMinor = Math.round(Number(value) * 100); } });
const minimumRemainingNaira = computed({ get: () => preferences.value.minimumRemainingMinor / 100, set: (value: number) => { preferences.value.minimumRemainingMinor = Math.round(Number(value) * 100); } });
const savePreferences = async () => {
  saving.value = true;
  preferenceMessage.value = "";
  try {
    await api.put("/wallet/preferences", preferences.value);
    preferenceMessage.value = "Preferences saved. No deductions are active.";
  } catch (err: any) {
    preferenceMessage.value = err?.response?.data?.msg || "Could not save preferences.";
  } finally { saving.value = false; }
};
const actions: { key: Capability; label: string; icon: string }[] = [
  { key: "fund", label: "Add money", icon: "＋" },
  { key: "transfer", label: "Transfer", icon: "↗" },
  { key: "withdraw", label: "Withdraw", icon: "↓" },
  { key: "saveFromWallet", label: "Save to goal", icon: "◎" },
];
const formatMoney = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
const showUnavailable = (label: string) => { error.value = label + " is not yet available."; };
onMounted(async () => {
  try { const response = await api.get<Wallet>("/wallet"); wallet.value = response.data; if ((response.data as any).preferences) preferences.value = (response.data as any).preferences; }
  catch { error.value = "Wallet status is unavailable. Please try again later."; }
});
</script>
