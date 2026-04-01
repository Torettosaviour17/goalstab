<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 animate-pulse">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div class="h-8 bg-white/10 rounded w-32"></div>
      <div class="h-10 bg-white/10 rounded w-28"></div>
    </div>

    <!-- Overview cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="i in 4" :key="i" class="glass-card p-5">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-white/10"></div>
          <div class="flex-1">
            <div class="h-4 bg-white/10 rounded w-20 mb-2"></div>
            <div class="h-6 bg-white/10 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts skeleton (2 columns) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="glass-card p-6">
        <div class="h-6 bg-white/10 rounded w-32 mb-4"></div>
        <div class="h-64 bg-white/10 rounded-xl"></div>
      </div>
      <div class="glass-card p-6">
        <div class="h-6 bg-white/10 rounded w-32 mb-4"></div>
        <div class="h-64 bg-white/10 rounded-xl"></div>
      </div>
    </div>

    <!-- Forecast skeleton -->
    <div class="mt-8 glass-card p-6">
      <div class="h-6 bg-white/10 rounded w-48 mb-4"></div>
      <div class="space-y-4">
        <div v-for="i in 3" :key="i" class="flex justify-between">
          <div class="h-5 bg-white/10 rounded w-40"></div>
          <div class="h-5 bg-white/10 rounded w-28"></div>
        </div>
      </div>
    </div>

    <!-- Transactions table skeleton -->
    <div class="mt-8 glass-card p-6">
      <div class="h-6 bg-white/10 rounded w-40 mb-4"></div>
      <div class="space-y-3">
        <div v-for="i in 5" :key="i" class="flex justify-between">
          <div class="h-4 bg-white/10 rounded w-24"></div>
          <div class="h-4 bg-white/10 rounded w-32"></div>
          <div class="h-4 bg-white/10 rounded w-20"></div>
          <div class="h-4 bg-white/10 rounded w-28"></div>
        </div>
      </div>
    </div>
  </div>
</template>
