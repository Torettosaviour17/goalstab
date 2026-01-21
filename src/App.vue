<template>
  <div class="min-h-screen bg-slate-100 text-slate-800">
    <!-- App Wrapper -->
    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- Header -->
      <header class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-semibold">Goal Dashboard</h1>
          <p class="text-sm text-slate-500">Track progress. Stay consistent.</p>
        </div>

        <!-- Profile Button (future user profile lives here) -->
        <button
          class="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition"
        >
          Profile
        </button>
      </header>

      <!-- Main Card -->
      <main class="bg-white rounded-2xl shadow-sm p-6">
        <!-- Tabs Section -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex gap-4">
            <button
              class="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
            >
              Today
            </button>
            <button
              class="px-4 py-2 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
            >
              Week
            </button>
            <button
              class="px-4 py-2 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
            >
              Month
            </button>
          </div>

          <!-- Add Goal Button -->
          <button
            class="px-4 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-100"
          >
            + Add Goal
          </button>
        </div>

        <!-- Content Area -->
        <div class="space-y-4">
          <!-- Placeholder Goal Card -->
          <div class="border rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 class="font-medium">Learn Vue 3</h3>
              <p class="text-sm text-slate-500">Progress: 40%</p>
            </div>

            <button
              class="px-3 py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              Update
            </button>
          </div>

          <div class="border rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 class="font-medium">Build Portfolio</h3>
              <p class="text-sm text-slate-500">Progress: 65%</p>
            </div>

            <button
              class="px-3 py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              Update
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
