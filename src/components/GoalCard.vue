<template>
  <div
    class="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800"
  >
    <!-- Title -->
    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
      {{ goal.title }}
    </h3>

    <!-- Amounts -->
    <div
      class="mt-3 flex justify-between text-sm text-slate-600 dark:text-slate-400"
    >
      <span>₦{{ goal.saved }} saved</span>
      <span>₦{{ goal.target }}</span>
    </div>

    <!-- Progress bar -->
    <div class="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
      <div
        class="h-2 rounded-full bg-slate-900 dark:bg-white transition-all"
        :style="{ width: progress + '%' }"
      />
    </div>

    <!-- Percentage -->
    <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
      {{ progress }}% completed
    </p>

    <!-- Actions -->
    <div class="mt-5 flex gap-3">
      <button
        class="flex-1 py-2 text-sm font-medium rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
      >
        Add Money
      </button>

      <button
        class="px-3 py-2 text-sm rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        ⚙️
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoalCard",
  props: {
    goal: {
      type: Object,
      required: true,
    },
  },
  computed: {
    progress() {
      return Math.min(
        Math.round((this.goal.saved / this.goal.target) * 100),
        100,
      );
    },
  },
};
</script>
