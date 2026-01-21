<template>
  <section class="mt-10">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-slate-900 dark:text-white">
        Your Goals
      </h2>

      <button
        class="px-4 py-2 text-sm font-medium rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
      >
        + New Goal
      </button>
    </div>

    <!-- Grid -->
    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <GoalCard v-for="goal in goals" :key="goal.id" :goal="goal" />
    </div>
  </section>
</template>

<script>
import GoalCard from "./GoalCard.vue";

export default {
  name: "GoalsGrid",
  components: { GoalCard },
  data() {
    return {
      goals: [
        {
          id: 1,
          title: "Buy New Laptop",
          saved: 320,
          target: 1200,
        },
        {
          id: 2,
          title: "Emergency Fund",
          saved: 500,
          target: 2000,
        },
        {
          id: 3,
          title: "Travel Fund",
          saved: 150,
          target: 800,
        },
      ],
    };
  },
};
</script>
