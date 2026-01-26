<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-6">
      <button
        @click="$router.back()"
        class="flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        ← Back
      </button>
    </div>

    <div class="glass-card p-8">
      <div class="text-center mb-8">
        <div
          class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center"
        >
          <span class="text-3xl">{{ goal?.icon }}</span>
        </div>
        <h1 class="text-3xl font-bold mb-2">{{ goal?.title }}</h1>
        <p class="text-gray-400">Goal Details</p>
      </div>

      <!-- Add your goal detail content here -->
      <p class="text-center text-gray-400">
        Goal detail page under construction
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useGoalsStore } from "@/stores/useGoals";

const route = useRoute();
const goalsStore = useGoalsStore();

const goal = computed(() => {
  return (
    goalsStore.goals.find((g: any) => g.id === route.params.id) ?? undefined
  );
});
</script>
