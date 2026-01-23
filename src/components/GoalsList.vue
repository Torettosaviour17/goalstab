<template>
  <section class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-slate-900">Goals</h2>

      <button
        class="px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:opacity-90 transition"
      >
        + Add Goal
      </button>
    </div>

    <!-- Goals Grid -->
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <GoalCard />
      <GoalCard />
      <GoalCard />
    </div>
  </section>
</template>

<script>
import GoalCard from "./GoalCard.vue";

export default {
  name: "GoalsList",
  components: {
    GoalCard,
  },
};
</script>
