<template>
  <div class="space-y-6">
    <!-- Step Progress -->
    <div class="flex items-center justify-between mb-6">
      <div
        v-for="(step, index) in steps"
        :key="step.key"
        class="flex items-center flex-1 last:flex-none"
      >
        <div class="flex items-center">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
            :class="[
              currentStep > index + 1
                ? 'bg-primary-500 text-white'
                : currentStep === index + 1
                  ? 'bg-primary-500 text-white ring-4 ring-primary-500/30'
                  : 'bg-gray-700 text-gray-400',
            ]"
          >
            {{ currentStep > index + 1 ? "✓" : index + 1 }}
          </div>
          <span
            class="ml-2 text-sm hidden sm:block"
            :class="[
              currentStep === index + 1
                ? 'text-white font-medium'
                : 'text-gray-500',
            ]"
          >
            {{ step.label }}
          </span>
        </div>
        <div
          v-if="index < steps.length - 1"
          class="flex-1 h-0.5 mx-4"
          :class="currentStep > index + 1 ? 'bg-primary-500' : 'bg-gray-700'"
        ></div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Step 1: Basic Info -->
      <div v-if="currentStep === 1" class="space-y-4 animate-fade-in">
        <h3 class="text-xl font-bold text-white mb-4">
          Let's start with the basics
        </h3>

        <!-- Goal Type Selection (Product/Service) -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-3"
            >What are you saving for?</label
          >
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.type = 'product'"
              class="p-4 rounded-xl border-2 transition-all duration-200 text-left"
              :class="[
                form.type === 'product'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-700 hover:border-gray-600',
              ]"
            >
              <span class="text-2xl block mb-2">📦</span>
              <span class="font-medium text-white">Product</span>
              <p class="text-xs text-gray-400 mt-1">
                Electronics, gadgets, items
              </p>
            </button>
            <button
              type="button"
              @click="form.type = 'service'"
              class="p-4 rounded-xl border-2 transition-all duration-200 text-left"
              :class="[
                form.type === 'service'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-700 hover:border-gray-600',
              ]"
            >
              <span class="text-2xl block mb-2">🎫</span>
              <span class="font-medium text-white">Service</span>
              <p class="text-xs text-gray-400 mt-1">
                Travel, events, fees, rent
              </p>
            </button>
          </div>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >Goal Title</label
          >
          <input
            v-model="form.title"
            type="text"
            required
            :placeholder="
              form.type === 'product'
                ? 'e.g., MacBook Pro'
                : 'e.g., Bali Vacation'
            "
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Target Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >Target Amount (₦)</label
          >
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              >₦</span
            >
            <input
              v-model.number="form.target"
              type="number"
              required
              min="1000"
              step="1000"
              placeholder="0"
              class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <!-- Step 2: Product/Service Details -->
      <div v-else-if="currentStep === 2" class="space-y-4 animate-fade-in">
        <h3 class="text-xl font-bold text-white mb-4">Additional details</h3>

        <!-- Product-specific fields -->
        <template v-if="form.type === 'product'">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >Product Link (optional)</label
            >
            <input
              v-model="form.productLink"
              type="url"
              placeholder="https://..."
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >Store Name (optional)</label
            >
            <input
              v-model="form.storeName"
              type="text"
              placeholder="e.g., Apple Store"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </template>

        <!-- Service-specific fields -->
        <template v-else-if="form.type === 'service'">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >Service Date (optional)</label
            >
            <input
              v-model="form.serviceDate"
              type="date"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >Location (optional)</label
            >
            <input
              v-model="form.location"
              type="text"
              placeholder="City, venue, etc."
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >Number of People (optional)</label
            >
            <input
              v-model.number="form.peopleCount"
              type="number"
              min="1"
              placeholder="e.g., 2"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >Special Instructions (optional)</label
            >
            <textarea
              v-model="form.instructions"
              rows="3"
              placeholder="Any additional details..."
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>
        </template>

        <!-- Icon & Color (common) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Icon</label
            >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="icon in icons"
                :key="icon"
                type="button"
                @click="form.icon = icon"
                class="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition"
                :class="
                  form.icon === icon
                    ? 'bg-primary-500'
                    : 'bg-gray-700 hover:bg-gray-600'
                "
              >
                {{ icon }}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Color Theme</label
            >
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="color in colors"
                :key="color.value"
                type="button"
                @click="form.color = color.value"
                class="w-10 h-10 rounded-lg transition ring-offset-2 ring-offset-gray-900"
                :style="{ background: color.bg }"
                :class="form.color === color.value ? 'ring-2 ring-white' : ''"
                :title="color.label"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Auto-save Settings -->
      <div v-else-if="currentStep === 3" class="space-y-4 animate-fade-in">
        <h3 class="text-xl font-bold text-white mb-4">Auto-save settings</h3>

        <!-- Auto-save Type -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Auto-save Type</label
          >
          <div class="flex gap-2 flex-wrap">
            <button
              type="button"
              @click="form.autoType = 'percentage'"
              class="flex-1 py-3 rounded-lg transition min-w-[120px]"
              :class="
                form.autoType === 'percentage'
                  ? 'bg-primary-500'
                  : 'bg-gray-700 hover:bg-gray-600'
              "
            >
              Percentage
            </button>
            <button
              type="button"
              @click="form.autoType = 'fixed'"
              class="flex-1 py-3 rounded-lg transition min-w-[120px]"
              :class="
                form.autoType === 'fixed'
                  ? 'bg-primary-500'
                  : 'bg-gray-700 hover:bg-gray-600'
              "
            >
              Fixed Amount
            </button>
          </div>
        </div>

        <!-- Auto-save Value -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            {{
              form.autoType === "percentage"
                ? "Percentage of income (%)"
                : "Amount per period (₦)"
            }}
          </label>
          <div class="relative">
            <span
              v-if="form.autoType === 'fixed'"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              >₦</span
            >
            <input
              v-model.number="form.autoValue"
              type="number"
              required
              :min="form.autoType === 'percentage' ? 1 : 100"
              :max="form.autoType === 'percentage' ? 100 : undefined"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              :class="{ 'pl-10': form.autoType === 'fixed' }"
            />
          </div>
        </div>

        <!-- Frequency -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Frequency</label
          >
          <select
            v-model="form.frequency"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Category (optional) -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >Category</label
          >
          <select
            v-model="form.category"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
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

        <!-- Account Selector (if you have accounts feature) -->
        <AccountSelector
          v-if="accountsStore.accounts.length > 0"
          v-model="form.accountId"
          label="Linked Account"
        />
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between pt-6">
        <BaseButton
          v-if="currentStep > 1"
          type="button"
          variant="secondary"
          @click="prevStep"
        >
          ← Back
        </BaseButton>
        <div v-else></div>
        <BaseButton
          v-if="currentStep < steps.length"
          type="button"
          variant="primary"
          @click="nextStep"
          :disabled="!canProceed"
        >
          Continue →
        </BaseButton>
        <BaseButton v-else type="submit" variant="primary" :loading="loading">
          Create Goal
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import AccountSelector from "@/components/accounts/AccountSelector.vue";
import { useAccountsStore } from "@/stores/accounts";

interface SmartGoalFormData {
  type: "product" | "service";
  title: string;
  target: number;
  icon: string;
  color: string;
  autoType: "percentage" | "fixed";
  autoValue: number;
  frequency: "daily" | "weekly" | "monthly";
  deadline?: string;
  category?: string;
  accountId: string;
  // Product fields
  productLink?: string;
  storeName?: string;
  // Service fields
  serviceDate?: string;
  location?: string;
  peopleCount?: number;
  instructions?: string;
}

const props = withDefaults(
  defineProps<{
    initialData?: Partial<SmartGoalFormData>;
    submitLabel?: string;
  }>(),
  {
    initialData: () => ({}),
    submitLabel: "Create Goal",
  },
);

const emit = defineEmits<{
  (e: "submit", data: SmartGoalFormData): void;
}>();

const accountsStore = useAccountsStore();

const steps = [
  { key: "type", label: "Goal Type" },
  { key: "details", label: "Details" },
  { key: "auto", label: "Auto-save" },
];

const currentStep = ref(1);
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

const form = reactive<SmartGoalFormData>({
  type: props.initialData.type || "product",
  title: props.initialData.title || "",
  target: props.initialData.target || 0,
  icon: props.initialData.icon || "💻",
  color: props.initialData.color || "from-blue-500 to-cyan-400",
  autoType: props.initialData.autoType || "percentage",
  autoValue: props.initialData.autoValue || 10,
  frequency: props.initialData.frequency || "weekly",
  deadline: props.initialData.deadline || "",
  category: props.initialData.category || "",
  accountId: props.initialData.accountId || "",
  productLink: props.initialData.productLink || "",
  storeName: props.initialData.storeName || "",
  serviceDate: props.initialData.serviceDate || "",
  location: props.initialData.location || "",
  peopleCount: props.initialData.peopleCount || 1,
  instructions: props.initialData.instructions || "",
});

// Validation for each step
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return form.type && form.title && form.target > 0;
  }
  if (currentStep.value === 2) {
    // Always true (all fields optional)
    return true;
  }
  if (currentStep.value === 3) {
    return (
      form.autoValue > 0 &&
      (form.autoType !== "percentage" || form.autoValue <= 100)
    );
  }
  return false;
});

const nextStep = () => {
  if (canProceed.value) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleSubmit = async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  emit("submit", { ...form });
  loading.value = false;
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
