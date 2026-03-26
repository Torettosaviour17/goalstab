<template>
  <BaseModal v-model="show" title="Book Service">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1"
          >Service Date (optional)</label
        >
        <input
          v-model="form.date"
          type="date"
          class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1"
          >Location</label
        >
        <input
          v-model="form.location"
          type="text"
          placeholder="City, venue, etc."
          class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1"
          >Number of People</label
        >
        <input
          v-model.number="form.peopleCount"
          type="number"
          min="1"
          class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1"
          >Special Instructions</label
        >
        <textarea
          v-model="form.instructions"
          rows="3"
          placeholder="Any additional details..."
          class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl"
        ></textarea>
      </div>
      <div class="flex gap-2 justify-end pt-4">
        <BaseButton variant="secondary" @click="close">Cancel</BaseButton>
        <BaseButton type="submit" :loading="loading">Submit Request</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import BaseButton from "@/components/shared/BaseButton.vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", details: any): void;
}>();

const show = ref(props.modelValue);
const loading = ref(false);

const form = reactive({
  date: "",
  location: "",
  peopleCount: 1,
  instructions: "",
});

watch(show, (val) => {
  emit("update:modelValue", val);
});

watch(
  () => props.modelValue,
  (val) => {
    show.value = val;
    if (!val) {
      form.date = "";
      form.location = "";
      form.peopleCount = 1;
      form.instructions = "";
    }
  },
);

const close = () => {
  show.value = false;
};

const handleSubmit = async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 500));
  emit("submit", { ...form });
  loading.value = false;
  close();
};
</script>
