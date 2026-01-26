<template>
  <div class="glass-card p-6 mb-8">
    <h3 class="text-lg font-bold mb-4">Quick Actions</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button
        v-for="action in actions"
        :key="action.label"
        @click="action.handler"
        class="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition"
      >
        <span class="text-2xl mb-2">{{ action.icon }}</span>
        <span class="text-sm">{{ action.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const actions = [
  { label: "Add Funds", icon: "💰", handler: () => console.log("Add Funds") },
  { label: "New Goal", icon: "🎯", handler: () => router.push("/goals") },
  { label: "Analytics", icon: "📈", handler: () => router.push("/analytics") },
  { label: "Settings", icon: "⚙️", handler: () => router.push("/settings") },
];
</script>
