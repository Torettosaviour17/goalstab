<template>
  <div class="flex justify-center gap-2 mt-6">
    <button
      @click="$emit('page-change', currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      ←
    </button>
    <span class="px-3 py-1 text-white"
      >{{ currentPage }} / {{ totalPages }}</span
    >
    <button
      @click="$emit('page-change', currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      →
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
}>();
defineEmits<{
  (e: "page-change", page: number): void;
}>();
</script>
