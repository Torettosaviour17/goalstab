<template>
  <div class="space-y-6">
    <!-- Step Progress -->
    <div class="relative">
      <div
        class="flex overflow-x-auto scrollbar-hide gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0"
      >
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="flex items-center flex-shrink-0"
        >
          <div class="flex items-center">
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              :class="[
                currentStep > i + 1
                  ? 'bg-primary-500 text-white'
                  : currentStep === i + 1
                    ? 'bg-primary-500 text-white ring-4 ring-primary-500/30'
                    : 'bg-gray-700 text-gray-400',
              ]"
            >
              {{ currentStep > i + 1 ? "✓" : i + 1 }}
            </div>
            <span
              class="ml-2 text-xs whitespace-nowrap"
              :class="
                currentStep === i + 1
                  ? 'text-white font-medium'
                  : 'text-gray-500'
              "
            >
              {{ step.label }}
            </span>
          </div>
          <div
            v-if="i < steps.length - 1"
            class="w-10 h-0.5 mx-3"
            :class="currentStep > i + 1 ? 'bg-primary-500' : 'bg-gray-700'"
          />
        </div>
      </div>
      <div
        class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none md:hidden"
      />
      <div
        class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none md:hidden"
      />
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- ───── STEP 1: What do you want? ───── -->
      <div v-if="currentStep === 1" class="space-y-4 animate-fade-in">
        <div>
          <h3 class="text-lg font-bold text-white">What are you saving for?</h3>
          <p class="text-xs text-gray-400 mt-0.5">
            Search for a product and we'll fill in the price for you.
          </p>
        </div>

        <!-- Category pills -->
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="cat in categories"
            :key="cat.value"
            type="button"
            @click="goalCategory = cat.value"
            class="px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all"
            :class="
              goalCategory === cat.value
                ? 'border-primary-500 bg-primary-500/10 text-white'
                : 'border-gray-700 text-gray-400 hover:border-gray-600'
            "
          >
            {{ cat.icon }} {{ cat.label }}
          </button>
        </div>

        <!-- Product search -->
        <div v-if="goalCategory === 'product'">
          <label class="block text-xs font-medium text-gray-300 mb-1">
            Search for a product
            <span
              class="ml-1 text-[10px] text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded-full"
              >autofills price</span
            >
          </label>
          <div class="relative">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              >🔍</span
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="e.g. iPhone 16, MacBook Air..."
              class="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              @input="onSearchInput"
              @focus="showDropdown = true"
            />
            <div
              v-if="searching"
              class="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <div
                class="animate-spin rounded-full h-4 w-4 border-t-2 border-primary-500"
              />
            </div>
          </div>

          <!-- Inline search dropdown -->
          <div
            v-if="
              showDropdown && (searchResults.length || searchQuery.length > 1)
            "
            class="mt-1 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
          >
            <div
              v-for="product in searchResults"
              :key="product.id"
              class="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-700/60 transition"
              @click="applyProduct(product)"
            >
              <img
                :src="product.image"
                class="w-9 h-9 rounded-lg object-contain bg-gray-700 flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm text-white font-medium truncate">
                  {{ product.name }}
                </p>
                <p class="text-xs text-gray-400">{{ product.store }}</p>
              </div>
              <span class="text-sm text-primary-400 font-medium flex-shrink-0"
                >₦{{ format(product.price) }}</span
              >
            </div>
            <div
              v-if="
                !searchResults.length && searchQuery.length > 1 && !searching
              "
              class="px-3 py-3 text-sm text-gray-400 text-center"
            >
              No results — enter amount manually below
            </div>
          </div>
        </div>

        <!-- Selected product preview -->
        <div
          v-if="selectedProduct"
          class="bg-gray-800/70 p-3 rounded-xl flex gap-3 items-center"
        >
          <img
            :src="selectedProduct.image"
            class="w-12 h-12 rounded-lg object-contain bg-gray-700 flex-shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-medium truncate">
              {{ selectedProduct.name }}
            </p>
            <p class="text-primary-400 text-xs">
              ₦{{ format(selectedProduct.price) }} · {{ selectedProduct.store }}
            </p>
          </div>
          <button
            type="button"
            @click="clearProduct"
            class="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        <!-- Goal title -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-1"
            >Goal title</label
          >
          <input
            v-model="title"
            type="text"
            required
            :placeholder="
              goalCategory === 'product' ? 'e.g. MacBook Pro' : 'e.g. Bali Trip'
            "
            class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Target amount -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-1"
            >Target amount (₦)</label
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
              step="500"
              placeholder="0"
              class="w-full pl-8 pr-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <!-- Fulfillment -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-2"
            >How should GoalTabs handle it?</label
          >
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="setFulfillment(true)"
              class="p-3 rounded-xl border-2 text-left transition-all"
              :class="
                usePlatformFulfillment
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              "
            >
              <span class="text-lg block mb-1">🚀</span>
              <span class="text-xs font-medium text-white block"
                >GoalTabs handles it</span
              >
              <p class="text-[11px] text-gray-400 mt-0.5">
                We purchase automatically when you're done
              </p>
            </button>
            <button
              type="button"
              @click="setFulfillment(false)"
              class="p-3 rounded-xl border-2 text-left transition-all"
              :class="
                !usePlatformFulfillment
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              "
            >
              <span class="text-lg block mb-1">🧠</span>
              <span class="text-xs font-medium text-white block"
                >I'll handle it</span
              >
              <p class="text-[11px] text-gray-400 mt-0.5">
                Just save the money, I'll buy it myself
              </p>
            </button>
          </div>
        </div>
      </div>

      <!-- ───── STEP 2: When do you want it? ───── -->
      <div v-else-if="currentStep === 2" class="space-y-5 animate-fade-in">
        <div>
          <h3 class="text-lg font-bold text-white">When do you want it?</h3>
          <p class="text-xs text-gray-400 mt-0.5">
            Move the slider — we'll work out how much to save.
          </p>
        </div>

        <!-- Frequency toggle -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-2"
            >Save every</label
          >
          <div class="flex gap-2">
            <button
              v-for="f in frequencies"
              :key="f.value"
              type="button"
              @click="frequency = f.value as 'daily' | 'weekly' | 'monthly'"
              class="flex-1 py-2 text-xs rounded-lg border transition-all"
              :class="
                frequency === f.value
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              "
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <!-- Time slider -->
        <div>
          <div class="flex justify-between items-baseline mb-2">
            <div>
              <span class="text-2xl font-bold text-white">{{
                sliderLabel
              }}</span>
              <span class="text-xs text-gray-400 ml-2">{{
                sliderSubLabel
              }}</span>
            </div>
          </div>
          <input
            v-model.number="weeks"
            type="range"
            min="1"
            max="52"
            step="1"
            class="w-full accent-primary-500"
          />
          <div class="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>1 week</span>
            <span>52 weeks</span>
          </div>
        </div>

        <!-- Live calculation card -->
        <div
          class="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 space-y-2"
        >
          <div class="flex justify-between text-xs">
            <span class="text-gray-400">Goal amount</span>
            <span class="text-white font-medium">₦{{ format(target) }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-gray-400">Duration</span>
            <span class="text-white font-medium">{{ sliderLabel }}</span>
          </div>
          <div class="border-t border-primary-500/20 pt-2 flex justify-between">
            <span class="text-sm font-medium text-primary-300"
              >Save per {{ frequencyLabel }}</span
            >
            <span class="text-lg font-bold text-primary-300"
              >₦{{ format(amountPerPeriod) }}</span
            >
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-gray-400">Estimated completion</span>
            <span class="text-white font-medium">{{ completionDate }}</span>
          </div>
        </div>

        <!-- Icon picker -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-2"
            >Goal icon</label
          >
          <div class="flex flex-wrap gap-2">
            <button
              v-for="ic in icons"
              :key="ic"
              type="button"
              @click="icon = ic"
              class="w-9 h-9 rounded-lg flex items-center justify-center text-lg transition"
              :class="
                icon === ic
                  ? 'bg-primary-500 ring-2 ring-primary-500/50'
                  : 'bg-gray-700 hover:bg-gray-600'
              "
            >
              {{ ic }}
            </button>
          </div>
        </div>

        <!-- Color picker -->
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-2"
            >Color theme</label
          >
          <div class="flex flex-wrap gap-2">
            <button
              v-for="c in colors"
              :key="c.value"
              type="button"
              @click="color = c.value"
              class="w-9 h-9 rounded-lg transition ring-offset-2 ring-offset-gray-900"
              :style="{ background: c.bg }"
              :class="color === c.value ? 'ring-2 ring-white' : ''"
            />
          </div>
        </div>

        <!-- Service-specific fields -->
        <template v-if="goalCategory === 'service'">
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1"
              >Service date (optional)</label
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
              placeholder="City, venue..."
              class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </template>

        <!-- Product manual link (self-fulfillment) -->
        <template v-if="goalCategory === 'product' && !usePlatformFulfillment">
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1"
              >Product link (optional)</label
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
              >Store name (optional)</label
            >
            <input
              v-model="storeName"
              type="text"
              placeholder="e.g. Jumia"
              class="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </template>
      </div>

      <!-- ───── STEP 3: Confirm ───── -->
      <div v-else-if="currentStep === 3" class="space-y-4 animate-fade-in">
        <div>
          <h3 class="text-lg font-bold text-white">Looks good — confirm</h3>
          <p class="text-xs text-gray-400 mt-0.5">
            Review your goal before creating it.
          </p>
        </div>

        <!-- Goal preview card -->
        <div
          class="rounded-xl p-4 space-y-3"
          :style="{ background: cardGradient }"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl"
            >
              {{ icon }}
            </div>
            <div>
              <p class="text-white font-semibold">{{ title }}</p>
              <p class="text-white/70 text-xs">₦{{ format(target) }} target</p>
            </div>
          </div>
          <div class="h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div class="h-full w-0 rounded-full bg-white/80" />
          </div>
          <div class="flex justify-between text-xs text-white/70">
            <span>₦0 saved</span>
            <span>Due {{ completionDate }}</span>
          </div>
        </div>

        <!-- Summary table -->
        <div
          class="bg-gray-800/50 rounded-xl overflow-hidden divide-y divide-gray-700/50"
        >
          <div class="flex justify-between px-4 py-3 text-sm">
            <span class="text-gray-400">Auto-save</span>
            <span class="text-white font-medium"
              >₦{{ format(amountPerPeriod) }} / {{ frequencyLabel }}</span
            >
          </div>
          <div class="flex justify-between px-4 py-3 text-sm">
            <span class="text-gray-400">Frequency</span>
            <span class="text-white font-medium capitalize">{{
              frequency
            }}</span>
          </div>
          <div class="flex justify-between px-4 py-3 text-sm">
            <span class="text-gray-400">Duration</span>
            <span class="text-white font-medium">{{ sliderLabel }}</span>
          </div>
          <div class="flex justify-between px-4 py-3 text-sm">
            <span class="text-gray-400">Fulfillment</span>
            <span class="text-white font-medium">{{
              usePlatformFulfillment ? "🚀 GoalTabs" : "🧠 Self"
            }}</span>
          </div>
          <div class="flex justify-between px-4 py-3 text-sm">
            <span class="text-gray-400">Target date</span>
            <span class="text-white font-medium">{{ completionDate }}</span>
          </div>
        </div>

        <!-- Linked account -->
        <AccountSelector
          v-if="accountsStore.accounts.length > 0"
          v-model="accountId"
          label="Linked Account"
        />
      </div>

      <!-- Navigation -->
      <div class="flex gap-3 pt-2">
        <BaseButton
          v-if="currentStep > 1"
          type="button"
          variant="secondary"
          class="text-sm py-2 px-4"
          @click="prevStep"
        >
          ← Back
        </BaseButton>
        <div class="flex-1" />
        <BaseButton
          v-if="currentStep < steps.length"
          type="button"
          variant="primary"
          class="text-sm py-2 px-5"
          :disabled="!canProceed"
          @click="nextStep"
        >
          Continue →
        </BaseButton>
        <BaseButton
          v-else
          type="submit"
          variant="primary"
          class="text-sm py-2 px-5"
          :loading="loading"
        >
          Create goal
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import debounce from "lodash/debounce";
import BaseButton from "@/components/shared/BaseButton.vue";
import AccountSelector from "@/components/accounts/AccountSelector.vue";
import { useAccountsStore } from "@/stores/accounts";
import api from "@/services/api";

const props = withDefaults(
  defineProps<{
    initialData?: Partial<{
      goalCategory: "product" | "service";
      title: string;
      userTarget: number;
      icon: string;
      color: string;
      frequency: "daily" | "weekly" | "monthly";
      deadline?: string;
      accountId?: string;
      usePlatformFulfillment?: boolean;
      productLink?: string;
      storeName?: string;
      serviceDate?: string;
      location?: string;
    }>;
  }>(),
  { initialData: () => ({}) },
);

const emit = defineEmits<{
  (e: "submit", data: any): void;
}>();

const accountsStore = useAccountsStore();

// ── Steps ──────────────────────────────────────────────
const steps = [
  { label: "What you want" },
  { label: "How fast" },
  { label: "Confirm" },
];
const currentStep = ref(1);
const loading = ref(false);

// ── Form state ─────────────────────────────────────────
const goalCategory = ref<"product" | "service">(
  (props.initialData.goalCategory ?? "product") as "product" | "service",
);
const title = ref(props.initialData.title ?? "");
const target = ref(props.initialData.userTarget ?? 0);
const icon = ref(props.initialData.icon ?? "💻");
const color = ref(props.initialData.color ?? "from-blue-500 to-cyan-400");
const frequency = ref<"daily" | "weekly" | "monthly">(
  (props.initialData.frequency ?? "weekly") as "daily" | "weekly" | "monthly",
);
const weeks = ref(12);
const accountId = ref(props.initialData.accountId ?? "");
const usePlatformFulfillment = ref(
  props.initialData.usePlatformFulfillment ?? false,
);
const productLink = ref(props.initialData.productLink ?? "");
const storeName = ref(props.initialData.storeName ?? "");
const serviceDate = ref(props.initialData.serviceDate ?? "");
const location = ref(props.initialData.location ?? "");

// ── Product search ─────────────────────────────────────
const searchQuery = ref("");
const searchResults = ref<any[]>([]);
const searching = ref(false);
const showDropdown = ref(false);
const selectedProduct = ref<any>(null);

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }
  searching.value = true;
  try {
    const token = localStorage.getItem("token");
    const { data } = await api.get("/goals/shopping/search", {
      params: { q: searchQuery.value },
      headers: { Authorization: `Bearer ${token}` },
    });
    searchResults.value = data;
  } catch {
    searchResults.value = [];
  } finally {
    searching.value = false;
  }
};

const debouncedSearch = debounce(performSearch, 450);
const onSearchInput = () => {
  showDropdown.value = true;
  debouncedSearch();
};

const applyProduct = (p: any) => {
  selectedProduct.value = p;
  title.value = p.name;
  target.value = p.price;
  searchQuery.value = p.name;
  showDropdown.value = false;
  searchResults.value = [];
};

const clearProduct = () => {
  selectedProduct.value = null;
  title.value = "";
  target.value = 0;
  searchQuery.value = "";
};

// ── Fulfillment ────────────────────────────────────────
const setFulfillment = (val: boolean) => {
  usePlatformFulfillment.value = val;
};

watch(goalCategory, () => {
  clearProduct();
});

// ── Calculations ───────────────────────────────────────
const frequencies = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const frequencyLabel = computed(() => frequency.value.replace("ly", ""));

const periodsFromWeeks = computed(() => {
  if (frequency.value === "daily") return weeks.value * 7;
  if (frequency.value === "monthly") return Math.ceil(weeks.value / 4.33);
  return weeks.value;
});

const amountPerPeriod = computed(() =>
  periodsFromWeeks.value > 0
    ? Math.ceil(target.value / periodsFromWeeks.value)
    : 0,
);

const sliderLabel = computed(() => {
  const w = weeks.value;
  if (w < 4) return `${w} week${w > 1 ? "s" : ""}`;
  const m = Math.round(w / 4.33);
  return `${m} month${m > 1 ? "s" : ""}`;
});

const sliderSubLabel = computed(() => {
  const w = weeks.value;
  if (w < 4) return "";
  return `(${w} weeks)`;
});

const completionDate = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + weeks.value * 7);
  return d.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
});

// ── Visuals ────────────────────────────────────────────
const icons = [
  "💻",
  "📱",
  "🎧",
  "🎮",
  "✈️",
  "🏠",
  "🎓",
  "👟",
  "🚗",
  "💍",
  "📷",
  "🛍️",
];

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

const categories = [
  { value: "product" as const, label: "Product", icon: "📦" },
  { value: "service" as const, label: "Service", icon: "🎫" },
];

const cardGradient = computed(() => {
  const found = colors.find((c) => c.value === color.value);
  return found ? found.bg : "linear-gradient(to right, #3b82f6, #22d3ee)";
});

// ── Navigation ─────────────────────────────────────────
const canProceed = computed(() => {
  if (currentStep.value === 1) return !!(title.value && target.value > 0);
  if (currentStep.value === 2) return amountPerPeriod.value > 0;
  return true;
});

const nextStep = () => {
  if (canProceed.value) currentStep.value++;
};
const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

// ── Submit ─────────────────────────────────────────────
const format = (n: number) => Math.round(n).toLocaleString("en-NG");

const handleSubmit = async () => {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 500));
  emit("submit", {
    goalCategory: goalCategory.value,
    title: title.value,
    userTarget: target.value,
    icon: icon.value,
    color: color.value,
    autoSave: amountPerPeriod.value,
    type: "fixed",
    frequency: frequency.value,
    weeks: weeks.value,
    deadline: completionDate.value,
    accountId: accountId.value || undefined,
    usePlatformFulfillment: usePlatformFulfillment.value,
    selectedProduct: selectedProduct.value || undefined,
    productLink: productLink.value || undefined,
    storeName: storeName.value || undefined,
    serviceDate: serviceDate.value || undefined,
    location: location.value || undefined,
  });
  loading.value = false;
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.25s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
