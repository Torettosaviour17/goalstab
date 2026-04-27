<template>
  <BaseModal v-model="show" title="Search Product" :max-width="600">
    <div class="space-y-4">

      <!-- Search input -->
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          ref="inputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Search for a product..."
          class="w-full pl-9 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          @input="debouncedSearch"
        />
        <div v-if="searching" class="absolute right-3 top-1/2 -translate-y-1/2">
          <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-primary-500" />
        </div>
        <button
          v-if="searchQuery && !searching"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
          @click="clear"
        >
          ✕
        </button>
      </div>

      <!-- Results list -->
      <div v-if="results.length" class="max-h-96 overflow-y-auto space-y-1 -mx-1 px-1">
        <div
          v-for="product in results"
          :key="product.id"
          class="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/60 cursor-pointer transition group"
          @click="selectProduct(product)"
        >
          <img
            :src="product.image"
            class="w-12 h-12 object-contain rounded-lg bg-gray-700 flex-shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ product.name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ product.store }}</p>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-sm text-primary-400 font-medium">₦{{ formatNumber(product.price) }}</p>
            <p class="text-[10px] text-gray-500 mt-0.5 group-hover:text-primary-400 transition">Tap to select</p>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="searched && !searching"
        class="text-center py-10 text-gray-400"
      >
        <p class="text-2xl mb-2">🔍</p>
        <p class="text-sm">No products found for "{{ searchQuery }}"</p>
        <p class="text-xs text-gray-500 mt-1">Try a different search term</p>
      </div>

      <!-- Initial hint -->
      <div v-else-if="!searchQuery" class="text-center py-8 text-gray-500">
        <p class="text-sm">Type to search the GoalTabs catalogue</p>
      </div>

    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import debounce from 'lodash/debounce'
import BaseModal from '@/components/shared/BaseModal.vue'
import api from '@/services/api'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', product: any): void
}>()

const show        = ref(props.modelValue)
const searchQuery = ref('')
const results     = ref<any[]>([])
const searching   = ref(false)
const searched    = ref(false)
const inputRef    = ref<HTMLInputElement | null>(null)

// Sync v-model
watch(() => props.modelValue, val => { show.value = val })
watch(show, val => {
  emit('update:modelValue', val)
  if (val) {
    nextTick(() => inputRef.value?.focus())
  } else {
    searchQuery.value = ''
    results.value = []
    searched.value = false
  }
})

// Search
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    results.value = []
    searched.value = false
    return
  }
  searching.value = true
  try {
    const token = localStorage.getItem('token')
    const { data } = await api.get('/goals/shopping/search', {
      params: { q: searchQuery.value },
      headers: { Authorization: `Bearer ${token}` },
    })
    results.value = data
    searched.value = true
  } catch {
    results.value = []
    searched.value = true
  } finally {
    searching.value = false
  }
}

const debouncedSearch = debounce(performSearch, 450)

const clear = () => {
  searchQuery.value = ''
  results.value = []
  searched.value = false
  inputRef.value?.focus()
}

const selectProduct = (product: any) => {
  emit('select', product)
  show.value = false
}

const formatNumber = (n: number) => Math.round(n).toLocaleString('en-NG')
</script>