<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Title -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1"
        >Goal Title</label
      >
      <input
        v-model="form.title"
        type="text"
        required
        placeholder="e.g., New MacBook"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>

    <!-- Target Amount -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1"
        >Target Amount (₦)</label
      >
      <input
        v-model.number="form.target"
        type="number"
        required
        min="1000"
        step="1000"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>

    <!-- Icon Selection -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">Icon</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="icon in icons"
          :key="icon"
          type="button"
          @click="form.icon = icon"
          :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center text-xl transition',
            form.icon === icon
              ? 'bg-primary-500'
              : 'bg-gray-700 hover:bg-gray-600',
          ]"
        >
          {{ icon }}
        </button>
      </div>
    </div>

    <!-- Color Selection -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2"
        >Color Theme</label
      >
      <div class="flex gap-2">
        <button
          v-for="color in colors"
          :key="color.value"
          type="button"
          @click="form.color = color.value"
          :class="[
            'flex-1 py-2 rounded-lg font-medium transition',
            form.color === color.value
              ? 'ring-2 ring-white'
              : 'opacity-70 hover:opacity-100',
          ]"
          :style="{ background: color.bg }"
        >
          {{ color.label }}
        </button>
      </div>
    </div>

    <!-- Auto-save Type -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2"
        >Auto-save Type</label
      >
      <div class="flex gap-2">
        <button
          type="button"
          @click="form.type = 'percentage'"
          :class="[
            'flex-1 py-2 rounded-lg transition',
            form.type === 'percentage'
              ? 'bg-primary-500'
              : 'bg-gray-700 hover:bg-gray-600',
          ]"
        >
          Percentage
        </button>
        <button
          type="button"
          @click="form.type = 'fixed'"
          :class="[
            'flex-1 py-2 rounded-lg transition',
            form.type === 'fixed'
              ? 'bg-primary-500'
              : 'bg-gray-700 hover:bg-gray-600',
          ]"
        >
          Fixed Amount
        </button>
      </div>
    </div>

    <!-- Auto-save Value -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1">
        {{ form.type === "percentage" ? "Percentage (%)" : "Amount (₦)" }}
      </label>
      <input
        v-model.number="form.autoSave"
        type="number"
        required
        :min="form.type === 'percentage' ? 1 : 1000"
        :max="form.type === 'percentage' ? 100 : undefined"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>

    <!-- Frequency -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2"
        >Frequency</label
      >
      <select
        v-model="form.frequency"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
    </div>

    <!-- Deadline (optional) -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1"
        >Deadline (optional)</label
      >
      <input
        v-model="form.deadline"
        type="date"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>

    <!-- Category (optional) -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1"
        >Category</label
      >
      <select
        v-model="form.category"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">Select category</option>
        <option value="Electronics">Electronics</option>
        <option value="Travel">Travel</option>
        <option value="Savings">Savings</option>
        <option value="Education">Education</option>
        <option value="Health">Health</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <!-- Submit Button -->
    <div class="pt-4">
      <BaseButton type="submit" fullWidth :loading="loading">
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import type { GoalFormData } from "@/types/goat";

interface Props {
  initialData?: Partial<GoalFormData>;
  submitLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
  submitLabel: "Create Goal",
});

const emit = defineEmits<{
  (e: "submit", data: GoalFormData): void;
}>();

const loading = ref(false);

const icons = ["💻", "🏝️", "🚗", "🏠", "🎓", "🛡️", "🎮", "📱", "👕", "🍔"];

const colors = [
  {
    label: "Blue",
    value: "from-blue-500 to-cyan-400",
    bg: "linear-gradient(to right, #3b82f6, #22d3ee)",
  },
  {
    label: "Green",
    value: "from-emerald-500 to-teal-400",
    bg: "linear-gradient(to right, #10b981, #2dd4bf)",
  },
  {
    label: "Orange",
    value: "from-amber-500 to-orange-400",
    bg: "linear-gradient(to right, #f59e0b, #fb923c)",
  },
  {
    label: "Purple",
    value: "from-purple-500 to-pink-500",
    bg: "linear-gradient(to right, #a855f7, #ec4899)",
  },
];

const form = reactive<GoalFormData>({
  title: props.initialData.title || "",
  target: props.initialData.target || 0,
  icon: props.initialData.icon || "💻",
  color: props.initialData.color || "from-blue-500 to-cyan-400",
  type: props.initialData.type || "percentage",
  autoSave: props.initialData.autoSave || 10,
  frequency: props.initialData.frequency || "weekly",
  deadline: props.initialData.deadline || "",
  category: props.initialData.category || "",
});

const handleSubmit = async () => {
  loading.value = true;
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  emit("submit", { ...form });
  loading.value = false;
};
</script>
