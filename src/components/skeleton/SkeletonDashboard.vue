<template>
  <div class="container mx-auto px-4 py-6 md:px-8 md:py-10 animate-pulse">
    <!-- Stats Cards Skeleton -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      <div
        v-for="i in 4"
        :key="i"
        class="glass-card p-6 bg-white/5 backdrop-blur-sm"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-white/10"></div>
          <div class="flex-1">
            <div class="h-4 bg-white/10 rounded w-20 mb-2"></div>
            <div class="h-6 bg-white/10 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Goals Section Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <div class="h-8 bg-white/10 rounded w-32"></div>
          <div class="h-10 bg-white/10 rounded w-28"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div v-for="i in 4" :key="i" class="glass-card p-5">
            <div class="flex items-start justify-between mb-4">
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
            <div class="flex justify-between mb-4">
              <div>
                <div class="h-6 bg-white/10 rounded w-20 mb-1"></div>
                <div class="h-4 bg-white/10 rounded w-24"></div>
              </div>
              <div class="h-4 bg-white/10 rounded w-16"></div>
            </div>
            <div class="flex gap-2">
              <div class="flex-1 h-9 bg-white/10 rounded-lg"></div>
              <div class="flex-1 h-9 bg-white/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Skeleton -->
      <div class="space-y-8">
        <div class="glass-card p-6">
          <div class="h-6 bg-white/10 rounded w-32 mb-4"></div>
          <div class="space-y-3">
            <div v-for="i in 4" :key="i" class="flex gap-3">
              <div class="w-10 h-10 rounded-lg bg-white/10"></div>
              <div class="flex-1">
                <div class="h-4 bg-white/10 rounded w-24 mb-2"></div>
                <div class="h-3 bg-white/10 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="glass-card p-6">
          <div class="h-6 bg-white/10 rounded w-32 mb-4"></div>
          <div class="space-y-3">
            <div v-for="i in 3" :key="i" class="flex justify-between">
              <div class="h-4 bg-white/10 rounded w-24"></div>
              <div class="h-4 bg-white/10 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
