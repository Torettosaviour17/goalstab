<template>
  <BaseModal v-model="show" title="Search Product" :max-width="600">
    <div class="space-y-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for a product..."
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          @input="debouncedSearch"
        />
        <div
          v-if="searching"
          class="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <div
            class="animate-spin rounded-full h-5 w-5 border-t-2 border-primary-500"
          ></div>
        </div>
      </div>

      <div v-if="results.length" class="max-h-96 overflow-y-auto space-y-2">
        <div
          v-for="product in results"
          :key="product.id"
          class="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer transition"
          @click="selectProduct(product)"
        >
          <img
            :src="product.image"
            class="w-12 h-12 object-contain rounded-lg"
          />
          <div class="flex-1">
            <p class="font-medium text-white">{{ product.name }}</p>
            <p class="text-sm text-gray-400">
              ₦{{ formatNumber(product.price) }}
            </p>
          </div>
          <BaseButton variant="ghost" size="sm">Select</BaseButton>
        </div>
      </div>
      <div
        v-else-if="searchQuery && !searching && !results.length"
        class="text-center py-8 text-gray-400"
      >
        No products found
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import api from "@/services/api";
import debounce from "lodash/debounce";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "select", product: any): void;
}>();

const show = ref(props.modelValue);
const searchQuery = ref("");
const results = ref<any[]>([]);
const searching = ref(false);

watch(show, (val) => {
  emit("update:modelValue", val);
  if (!val) {
    searchQuery.value = "";
    results.value = [];
  }
});

watch(
  () => props.modelValue,
  (val) => {
    show.value = val;
  },
);

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    results.value = [];
    return;
  }
  searching.value = true;
  try {
    const { data } = await api.get("/products/search", {
      params: { q: searchQuery.value },
    });
    results.value = data;
  } catch (err) {
    console.error("Search failed", err);
  } finally {
    searching.value = false;
  }
};

const debouncedSearch = debounce(performSearch, 500);

const selectProduct = (product: any) => {
  emit("select", product);
  show.value = false;
};

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
</script>
