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
import { onMounted, ref } from "vue";
import api from "@/services/api";
type Capability = "fund" | "transfer" | "withdraw" | "saveFromWallet";
type Wallet = { availableBalance: number | null; status: string; capabilities: Record<Capability, boolean> };
const wallet = ref<Wallet | null>(null);
const error = ref("");
const actions: { key: Capability; label: string; icon: string }[] = [
  { key: "fund", label: "Add money", icon: "＋" },
  { key: "transfer", label: "Transfer", icon: "↗" },
  { key: "withdraw", label: "Withdraw", icon: "↓" },
  { key: "saveFromWallet", label: "Save to goal", icon: "◎" },
];
const formatMoney = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
const showUnavailable = (label: string) => { error.value = label + " is not yet available."; };
onMounted(async () => {
  try { const response = await api.get<Wallet>("/wallet"); wallet.value = response.data; }
  catch { error.value = "Wallet status is unavailable. Please try again later."; }
});
</script>
