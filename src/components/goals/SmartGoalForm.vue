<template>
  <div class="space-y-5">
    <!-- Step Progress – scrollable on small screens, more compact -->
    <div class="relative mb-5">
      <div
        class="flex overflow-x-auto scrollbar-hide gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0"
      >
        <div
          v-for="(step, index) in steps"
          :key="step.key"
          class="flex items-center flex-shrink-0"
        >
          <div class="flex items-center">
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
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
              class="ml-2 text-xs whitespace-nowrap"
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
            class="w-10 h-0.5 mx-3"
            :class="currentStep > index + 1 ? 'bg-primary-500' : 'bg-gray-700'"
          ></div>
        </div>
      </div>
      <!-- Gradient edges for scroll hint -->
      <div
        class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none md:hidden"
      ></div>
      <div
        class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none md:hidden"
      ></div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Step 1: Basic Info -->
      <div v-if="currentStep === 1" class="space-y-4 animate-fade-in">
        <h3 class="text-lg font-bold text-white mb-3">
          Let's start with the basics
        </h3>

        <!-- Goal Type Selection -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-2"
            >What are you saving for?</label
          >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              @click="goalCategory = 'product'"
              class="p-3 rounded-xl border-2 transition-all duration-200 text-left"
              :class="[
                goalCategory === 'product'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-700 hover:border-gray-600',
              ]"
            >
              <span class="text-xl block mb-1">📦</span>
              <span class="text-sm font-medium text-white block">Product</span>
              <p class="text-[11px] text-gray-400 mt-0.5">
                Electronics, gadgets, items
              </p>
            </button>
            <button
              type="button"
              @click="goalCategory = 'service'"
              class="p-3 rounded-xl border-2 transition-all duration-200 text-left"
              :class="[
                goalCategory === 'service'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-700 hover:border-gray-600',
              ]"
            >
              <span class="text-xl block mb-1">🎫</span>
              <span class="text-sm font-medium text-white block">Service</span>
              <p class="text-[11px] text-gray-400 mt-0.5">
                Travel, events, fees, rent
              </p>
            </button>
          </div>
        </div>

        <!-- Platform Fulfillment Toggle -->
        <div class="flex items-center gap-2 pt-2">
          <input
            id="usePlatformFulfillment"
            v-model="usePlatformFulfillment"
            type="checkbox"
            class="w-4 h-4 rounded bg-gray-800 border-gray-700 text-primary-500 focus:ring-primary-500"
          />
          <label for="usePlatformFulfillment" class="text-xs text-gray-300">
            I want GoalTabs to handle fulfillment (purchase/booking)
            automatically when the goal is reached
          </label>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-1"
            >Goal Title</label
          >
          <input
            v-model="title"
            type="text"
            required
            :placeholder="
              goalCategory === 'product'
                ? 'e.g., MacBook Pro'
                : 'e.g., Bali Vacation'
            "
            class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Find Product Button (for products only) -->
        <div v-if="goalCategory === 'product'" class="flex justify-end">
          <button
            type="button"
            @click="openProductSearch"
            class="text-sm text-primary-400 hover:text-primary-300 transition"
          >
            🔍 Find a product
          </button>
        </div>

        <!-- Target Amount -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-1"
            >Target Amount (₦)</label
          >
          <div class="relative">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              >₦</span
            >
            <input
              v-model.number="target"
              type="number"
              required
              min="1000"
              step="1000"
              placeholder="0"
              class="w-full pl-8 pr-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <!-- Step 2: Product/Service Details -->
      <div v-else-if="currentStep === 2" class="space-y-4 animate-fade-in">
        <h3 class="text-lg font-bold text-white mb-3">Additional details</h3>

        <!-- Product-specific fields -->
        <template v-if="goalCategory === 'product'">
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1"
              >Product Link (optional)</label
            >
            <input
              v-model="productLink"
              type="url"
              placeholder="https://..."
              class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1"
              >Store Name (optional)</label
            >
            <input
              v-model="storeName"
              type="text"
              placeholder="e.g., Apple Store"
              class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </template>

        <!-- Service-specific fields -->
        <template v-else-if="goalCategory === 'service'">
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1"
              >Service Date (optional)</label
            >
            <input
              v-model="serviceDate"
              type="date"
              class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1"
              >Location (optional)</label
            >
            <input
              v-model="location"
              type="text"
              placeholder="City, venue, etc."
              class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1"
              >Number of People (optional)</label
            >
            <input
              v-model.number="peopleCount"
              type="number"
              min="1"
              placeholder="e.g., 2"
              class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1"
              >Special Instructions (optional)</label
            >
            <textarea
              v-model="instructions"
              rows="2"
              placeholder="Any additional details..."
              class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>
        </template>

        <!-- Icon & Color (common) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-2"
              >Icon</label
            >
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="iconItem in icons"
                :key="iconItem"
                type="button"
                @click="icon = iconItem"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-base transition"
                :class="
                  icon === iconItem
                    ? 'bg-primary-500'
                    : 'bg-gray-700 hover:bg-gray-600'
                "
              >
                {{ iconItem }}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-2"
              >Color Theme</label
            >
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="colorItem in colors"
                :key="colorItem.value"
                type="button"
                @click="color = colorItem.value"
                class="w-8 h-8 rounded-lg transition ring-offset-2 ring-offset-gray-900"
                :style="{ background: colorItem.bg }"
                :class="color === colorItem.value ? 'ring-2 ring-white' : ''"
                :title="colorItem.label"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Auto-save Settings -->
      <div v-else-if="currentStep === 3" class="space-y-4 animate-fade-in">
        <h3 class="text-lg font-bold text-white mb-3">Auto-save settings</h3>

        <!-- Auto-save Type -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-2"
            >Auto-save Type</label
          >
          <div class="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              @click="type = 'percentage'"
              class="flex-1 py-2.5 text-sm rounded-lg transition"
              :class="
                type === 'percentage'
                  ? 'bg-primary-500'
                  : 'bg-gray-700 hover:bg-gray-600'
              "
            >
              Percentage
            </button>
            <button
              type="button"
              @click="type = 'fixed'"
              class="flex-1 py-2.5 text-sm rounded-lg transition"
              :class="
                type === 'fixed'
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
          <label class="block text-xs font-medium text-gray-300 mb-1">
            {{
              type === "percentage"
                ? "Percentage of income (%)"
                : "Amount per period (₦)"
            }}
          </label>
          <div class="relative">
            <span
              v-if="type === 'fixed'"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              >₦</span
            >
            <input
              v-model.number="autoSave"
              type="number"
              required
              :min="type === 'percentage' ? 1 : 100"
              :max="type === 'percentage' ? 100 : undefined"
              class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              :class="{ 'pl-8': type === 'fixed' }"
            />
          </div>
        </div>

        <!-- Frequency -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-2"
            >Frequency</label
          >
          <select
            v-model="frequency"
            class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <!-- Enable Auto-save Checkbox -->
        <div class="flex items-center gap-2 pt-1">
          <input
            id="autoSaveEnabled"
            v-model="autoSaveEnabled"
            type="checkbox"
            class="w-4 h-4 rounded bg-gray-800 border-gray-700 text-primary-500 focus:ring-primary-500"
          />
          <label for="autoSaveEnabled" class="text-xs text-gray-300"
            >Enable auto‑save</label
          >
        </div>

        <!-- Deadline (optional) -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-1"
            >Deadline (optional)</label
          >
          <input
            v-model="deadline"
            type="date"
            class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Category (optional) -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-1"
            >Category</label
          >
          <select
            v-model="category"
            class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
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

        <!-- Account Selector -->
        <AccountSelector
          v-if="accountsStore.accounts.length > 0"
          v-model="accountId"
          label="Linked Account"
        />
      </div>

      <!-- Navigation Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 pt-4">
        <BaseButton
          v-if="currentStep > 1"
          type="button"
          variant="secondary"
          class="w-full sm:w-auto text-sm py-2"
          @click="prevStep"
        >
          ← Back
        </BaseButton>
        <div class="flex-1"></div>
        <BaseButton
          v-if="currentStep < steps.length"
          type="button"
          variant="primary"
          class="w-full sm:w-auto text-sm py-2"
          @click="nextStep"
          :disabled="!canProceed"
        >
          Continue →
        </BaseButton>
        <BaseButton
          v-else
          type="submit"
          variant="primary"
          class="w-full sm:w-auto text-sm py-2"
          :loading="loading"
        >
          Create Goal
        </BaseButton>
      </div>
    </form>
  </div>

  <!-- Product Search Modal -->
  <ProductSearchModal v-model="showProductSearch" @select="onProductSelected" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import AccountSelector from "@/components/accounts/AccountSelector.vue";
import ProductSearchModal from "@/components/goals/ProductSearchModal.vue";
import { useAccountsStore } from "@/stores/accounts";

const props = withDefaults(
  defineProps<{
    initialData?: Partial<{
      goalCategory: "product" | "service";
      title: string;
      userTarget: number;
      fee?: number;
      icon: string;
      color: string;
      type: "percentage" | "fixed";
      autoSave: number;
      frequency: "daily" | "weekly" | "monthly";
      deadline?: string;
      category?: string;
      accountId?: string;
      autoSaveEnabled?: boolean;
      usePlatformFulfillment?: boolean;
      productLink?: string;
      storeName?: string;
      serviceDate?: string;
      location?: string;
      peopleCount?: number;
      instructions?: string;
    }>;
    submitLabel?: string;
  }>(),
  {
    initialData: () => ({}),
    submitLabel: "Create Goal",
  },
);

const emit = defineEmits<{
  (e: "submit", data: any): void;
}>();

const accountsStore = useAccountsStore();

const steps = [
  { key: "type", label: "Goal Type" },
  { key: "details", label: "Details" },
  { key: "auto", label: "Auto-save" },
];

const currentStep = ref(1);
const loading = ref(false);

const goalCategory = ref(props.initialData.goalCategory || "product");
const title = ref(props.initialData.title || "");
const target = ref(props.initialData.userTarget || 0);
const fee = 100; // fixed platform fee
const icon = ref(props.initialData.icon || "💻");
const color = ref(props.initialData.color || "from-blue-500 to-cyan-400");
const type = ref(props.initialData.type || "percentage");
const autoSave = ref(props.initialData.autoSave || 10);
const frequency = ref(props.initialData.frequency || "weekly");
const deadline = ref(props.initialData.deadline || "");
const category = ref(props.initialData.category || "");
const accountId = ref(props.initialData.accountId || "");
const autoSaveEnabled = ref(props.initialData.autoSaveEnabled ?? true);
const usePlatformFulfillment = ref(
  props.initialData.usePlatformFulfillment ?? false,
);
const productLink = ref(props.initialData.productLink || "");
const storeName = ref(props.initialData.storeName || "");
const serviceDate = ref(props.initialData.serviceDate || "");
const location = ref(props.initialData.location || "");
const peopleCount = ref(props.initialData.peopleCount || 1);
const instructions = ref(props.initialData.instructions || "");

const showProductSearch = ref(false);
const selectedProduct = ref<any>(null);

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

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return goalCategory.value && title.value && target.value > 0;
  }
  if (currentStep.value === 2) {
    return true;
  }
  if (currentStep.value === 3) {
    return (
      autoSave.value > 0 &&
      (type.value !== "percentage" || autoSave.value <= 100)
    );
  }
  return false;
});

const nextStep = () => {
  if (canProceed.value) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const openProductSearch = () => {
  showProductSearch.value = true;
};

const onProductSelected = (product: any) => {
  title.value = product.name;
  target.value = product.price;
  selectedProduct.value = product;
};

const handleSubmit = async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  emit("submit", {
    goalCategory: goalCategory.value,
    title: title.value,
    userTarget: target.value, // rename: the target input becomes userTarget
    fee: fee,
    icon: icon.value,
    color: color.value,
    type: type.value,
    autoSave: autoSave.value,
    frequency: frequency.value,
    deadline: deadline.value || undefined,
    category: category.value || undefined,
    accountId: accountId.value,
    autoSaveEnabled: autoSaveEnabled.value,
    usePlatformFulfillment: usePlatformFulfillment.value,
    selectedProduct: selectedProduct.value || undefined,
    productLink: productLink.value || undefined,
    storeName: storeName.value || undefined,
    serviceDate: serviceDate.value || undefined,
    location: location.value || undefined,
    peopleCount: peopleCount.value || undefined,
    instructions: instructions.value || undefined,
  });
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
