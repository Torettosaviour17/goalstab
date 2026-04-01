<template>
  <div
    class="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-4xl animate-pulse"
  >
    <div class="h-8 bg-white/10 rounded w-40 mb-2"></div>
    <div class="h-4 bg-white/10 rounded w-64 mb-8"></div>

    <!-- Tabs skeleton -->
    <div class="relative mb-6">
      <div class="flex gap-2">
        <div
          v-for="i in 4"
          :key="i"
          class="h-10 bg-white/10 rounded-lg w-20"
        ></div>
      </div>
    </div>

    <!-- Profile tab skeleton (most common) -->
    <div class="space-y-6">
      <div class="glass-card p-6">
        <div class="h-6 bg-white/10 rounded w-36 mb-4"></div>
        <div class="space-y-4">
          <div>
            <div class="h-4 bg-white/10 rounded w-20 mb-2"></div>
            <div class="h-10 bg-white/10 rounded w-full"></div>
          </div>
          <div>
            <div class="h-4 bg-white/10 rounded w-20 mb-2"></div>
            <div class="h-10 bg-white/10 rounded w-full"></div>
          </div>
          <div>
            <div class="h-4 bg-white/10 rounded w-20 mb-2"></div>
            <div class="h-10 bg-white/10 rounded w-full"></div>
          </div>
          <div class="h-10 bg-white/10 rounded w-28"></div>
        </div>
      </div>
      <div class="glass-card p-6">
        <div class="h-6 bg-white/10 rounded w-36 mb-4"></div>
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 rounded-full bg-white/10"></div>
          <div class="h-10 bg-white/10 rounded w-32"></div>
        </div>
      </div>
    </div>
  </div>
</template>
