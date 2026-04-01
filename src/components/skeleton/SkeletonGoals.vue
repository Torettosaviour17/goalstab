<template>
  <div class="max-w-7xl mx-auto px-4 py-8 animate-pulse">
    <!-- Header with title and create button -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div class="h-8 bg-white/10 rounded w-32"></div>
      <div class="h-10 bg-white/10 rounded w-28"></div>
    </div>

    <!-- Goals grid skeleton (6 cards) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="glass-card p-6">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-white/10"></div>
            <div>
              <div class="h-5 bg-white/10 rounded w-28 mb-2"></div>
              <div class="h-4 bg-white/10 rounded w-20"></div>
            </div>
          </div>
          <div class="h-6 w-16 bg-white/10 rounded-full"></div>
        </div>
        <div class="mb-4">
          <div class="flex justify-between mb-2">
            <div class="h-4 bg-white/10 rounded w-16"></div>
            <div class="h-4 bg-white/10 rounded w-8"></div>
          </div>
          <div class="h-2 bg-white/10 rounded-full"></div>
        </div>
        <div class="flex justify-between items-center">
          <div>
            <div class="h-6 bg-white/10 rounded w-20 mb-1"></div>
            <div class="h-4 bg-white/10 rounded w-24"></div>
          </div>
          <div class="h-4 bg-white/10 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
</template>
