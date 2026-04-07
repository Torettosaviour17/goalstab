<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-4xl">
    <!-- Loading skeleton -->
    <SkeletonSettings v-if="loading" />

    <!-- Settings content -->
    <template v-else>
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">Settings</h1>
      <p class="text-gray-400 mb-8">Manage your account preferences</p>

      <!-- Mobile-friendly tabs -->
      <div class="relative mb-6">
        <div
          class="flex overflow-x-auto scrollbar-hide gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 font-medium whitespace-nowrap rounded-lg transition flex-shrink-0',
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white',
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
        <div
          class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none md:hidden"
        ></div>
        <div
          class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none md:hidden"
        ></div>
      </div>

      <transition name="fade" mode="out-in">
        <!-- Profile -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <div class="glass-card p-6">
            <h2 class="text-xl font-bold text-white mb-4">Avatar</h2>
            <AvatarUploader
              :current-avatar="avatarPreview"
              :user-name="profile.name"
              @update="
                (avatar) => {
                  avatarPreview = avatar;
                  profile.avatar = avatar || '';
                }
              "
            />
          </div>
          <div class="glass-card p-6">
            <h2 class="text-xl font-bold text-white mb-4">
              Profile Information
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1"
                  >Full Name</label
                >
                <input
                  v-model="profile.name"
                  type="text"
                  class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1"
                  >Email Address</label
                >
                <input
                  v-model="profile.email"
                  type="email"
                  class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1"
                  >Phone Number</label
                >
                <input
                  v-model="profile.phone"
                  type="tel"
                  class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <BaseButton @click="saveProfile" :loading="saving"
                >Save Changes</BaseButton
              >
            </div>
          </div>
          <div
            class="mb-8 p-6 rounded-2xl bg-gray-900 text-white light:bg-white light:text-black"
          >
            <p class="text-sm opacity-70">Your Level</p>

            <h2 class="text-2xl font-bold">
              Level {{ levelStore.level }} — {{ levelStore.title }}
            </h2>

            <!-- PROGRESS BAR -->
            <div class="mt-4">
              <div class="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary-500 transition-all duration-500"
                  :style="{ width: `${levelStore.progress}%` }"
                ></div>
              </div>

              <p class="text-xs mt-2 opacity-70">
                {{ levelStore.xpToNextLevel }} XP to next level
              </p>
            </div>

            <!-- LEVEL UP FLASH -->
            <div
              v-if="levelStore.levelUp"
              class="mt-3 text-green-400 font-semibold animate-pulse"
            >
              LEVEL UP! 🔥
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div v-else-if="activeTab === 'notifications'" class="glass-card p-6">
          <h2 class="text-xl font-bold text-white mb-4">
            Notification Preferences
          </h2>
          <div class="space-y-4">
            <div
              v-for="item in notificationItems"
              :key="item.key"
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p class="font-medium text-white">{{ item.label }}</p>
                <p class="text-sm text-gray-400">{{ item.description }}</p>
              </div>
              <label
                class="relative inline-flex items-center cursor-pointer self-start sm:self-auto"
              >
                <input
                  type="checkbox"
                  :checked="
                    notifications[item.key as keyof typeof notifications]
                  "
                  @change="
                    notifications[item.key as keyof typeof notifications] = (
                      $event.target as HTMLInputElement
                    ).checked
                  "
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"
                ></div>
              </label>
            </div>
          </div>
          <div class="mt-6">
            <BaseButton @click="saveNotifications" :loading="saving"
              >Save Preferences</BaseButton
            >
          </div>
        </div>

        <!-- Security -->
        <div v-else-if="activeTab === 'security'" class="space-y-6">
          <div class="glass-card p-6">
            <h2 class="text-xl font-bold text-white mb-4">Change Password</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1"
                  >Current Password</label
                >
                <input
                  type="password"
                  v-model="password.current"
                  class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1"
                  >New Password</label
                >
                <input
                  type="password"
                  v-model="password.new"
                  class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1"
                  >Confirm New Password</label
                >
                <input
                  type="password"
                  v-model="password.confirm"
                  class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl"
                />
              </div>
              <BaseButton @click="changePassword" :loading="saving"
                >Update Password</BaseButton
              >
            </div>
          </div>

          <div class="glass-card p-6 border border-gray-700/50">
            <h2 class="text-xl font-bold text-white mb-4">Session</h2>
            <p class="text-gray-400 mb-4">Sign out of your account</p>
            <BaseButton variant="secondary" @click="handleLogout"
              >Sign Out</BaseButton
            >
          </div>

          <div class="glass-card p-6 border border-danger/20">
            <h2 class="text-xl font-bold text-danger mb-4">Danger Zone</h2>
            <p class="text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <BaseButton variant="danger" @click="openDeleteModal"
              >Delete Account</BaseButton
            >
          </div>
        </div>

        <!-- Preferences -->
        <div v-else-if="activeTab === 'preferences'" class="glass-card p-6">
          <h2 class="text-xl font-bold text-white mb-4">App Preferences</h2>
          <div class="space-y-4">
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p class="font-medium text-white">Currency</p>
                <p class="text-sm text-gray-400">Set your preferred currency</p>
              </div>
              <select
                v-model="preferences.currency"
                class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full sm:w-auto"
              >
                <option value="NGN">NGN (₦)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p class="font-medium text-white">Theme</p>
                <p class="text-sm text-gray-400">Choose light or dark mode</p>
              </div>
              <div class="flex items-center gap-2">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="isDarkMode"
                    class="sr-only peer"
                  />
                  <div
                    class="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:bg-primary-500 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"
                  ></div>
                </label>
                <span class="text-gray-300">{{
                  isDarkMode ? "Dark" : "Light"
                }}</span>
              </div>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p class="font-medium text-white">Auto-save Default</p>
                <p class="text-sm text-gray-400">
                  Enable auto-save by default for new goals
                </p>
              </div>
              <label
                class="relative inline-flex items-center cursor-pointer self-start sm:self-auto"
              >
                <input
                  type="checkbox"
                  v-model="preferences.autoSaveDefault"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                ></div>
              </label>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p class="font-medium text-white">Monthly Income (₦)</p>
                <p class="text-sm text-gray-400">
                  Used to calculate percentage‑based auto‑saves
                </p>
              </div>
              <input
                v-model.number="preferences.monthlyIncome"
                type="number"
                min="0"
                step="1000"
                class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full sm:w-auto"
              />
            </div>
          </div>
          <div class="mt-6">
            <BaseButton @click="savePreferences" :loading="saving"
              >Save Preferences</BaseButton
            >
          </div>
        </div>
      </transition>
    </template>

    <!-- Delete Account Confirmation Modal -->
    <BaseModal
      v-model="showDeleteModal"
      title="Delete Account"
      :max-width="450"
    >
      <div class="space-y-6">
        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-full bg-danger/20 flex items-center justify-center"
          >
            <span class="text-3xl">⚠️</span>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">
            Are you absolutely sure?
          </h3>
          <p class="text-sm text-gray-400">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </p>
        </div>

        <div class="bg-gray-800/50 p-4 rounded-xl">
          <p class="text-sm text-gray-300 mb-2">This will:</p>
          <ul class="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Delete all your goals and savings data</li>
            <li>Remove all your connected accounts</li>
            <li>Delete your transaction history</li>
            <li>Permanently close your account</li>
          </ul>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <BaseButton
            variant="secondary"
            class="flex-1"
            @click="showDeleteModal = false"
            >Cancel</BaseButton
          >
          <BaseButton
            variant="danger"
            class="flex-1"
            :loading="deleting"
            @click="confirmDelete"
            >Yes, Delete Account</BaseButton
          >
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "@/components/shared/BaseButton.vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import AvatarUploader from "@/components/ui/AvatarUploader.vue";
import SkeletonSettings from "@/components/skeleton/SkeletonSettings.vue";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
import { useThemeStore } from "@/stores/theme";

interface NotificationSettings {
  email: boolean;
  push: boolean;
  goalCompleted: boolean;
  depositReceived: boolean;
  weeklyReport: boolean;
}

import { useLevelStore } from "@/stores/level";
const levelStore = useLevelStore();

const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUIStore();
const themeStore = useThemeStore();

const activeTab = ref("profile");
const saving = ref(false);
const deleting = ref(false);
const showDeleteModal = ref(false);
const isDarkMode = ref(themeStore.theme === "dark");
const loading = ref(true);

const tabs = [
  { id: "profile", name: "Profile" },
  { id: "notifications", name: "Notifications" },
  { id: "security", name: "Security" },
  { id: "preferences", name: "Preferences" },
];

const profile = reactive({
  name: "",
  email: "",
  phone: "",
  avatar: "",
});

const avatarPreview = ref<string | null>(null);

const notificationItems = [
  {
    key: "email",
    label: "Email Notifications",
    description: "Receive updates via email",
  },
  {
    key: "push",
    label: "Push Notifications",
    description: "Get real-time alerts",
  },
  {
    key: "goalCompleted",
    label: "Goal Completed",
    description: "Notify when a goal is reached",
  },
  {
    key: "depositReceived",
    label: "Deposit Received",
    description: "Notify when funds are added",
  },
  {
    key: "weeklyReport",
    label: "Weekly Report",
    description: "Receive weekly summary",
  },
] as const;

const notifications = reactive<NotificationSettings>({
  email: true,
  push: true,
  goalCompleted: true,
  depositReceived: true,
  weeklyReport: false,
});

const password = reactive({
  current: "",
  new: "",
  confirm: "",
});

const preferences = reactive({
  currency: "NGN",
  theme: "dark",
  autoSaveDefault: true,
  monthlyIncome: 500000,
});

onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    loading.value = false;
  }, 300);

  if (authStore.user) {
    profile.name = authStore.user.name || "";
    profile.email = authStore.user.email || "";
    profile.phone = (authStore.user as any).phone || "";
    profile.avatar = authStore.user.avatar || "";
    avatarPreview.value = authStore.user.avatar || null;

    if (authStore.user.preferences) {
      const prefs = authStore.user.preferences;
      if (prefs.notifications)
        Object.assign(notifications, prefs.notifications);
      preferences.currency = prefs.currency || "NGN";
      preferences.theme = prefs.theme || "dark";
      preferences.autoSaveDefault = prefs.autoSaveDefault ?? true;
      preferences.monthlyIncome = (prefs as any).monthlyIncome ?? 500000;
      isDarkMode.value = prefs.theme === "dark";
    }
  }
});

// Watch toggle changes
watch(isDarkMode, (val) => {
  const newTheme = val ? "dark" : "light";
  themeStore.setTheme(newTheme);
  preferences.theme = newTheme;
  // Optional: save preference to backend
  authStore.updatePreferences({ theme: newTheme });
});

const saveProfile = async () => {
  saving.value = true;
  try {
    await authStore.updateUser({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      avatar: profile.avatar,
    });
    uiStore.addToast({
      type: "success",
      message: "Profile updated successfully",
    });
  } catch (err: any) {
    uiStore.addToast({
      type: "error",
      message: err.response?.data?.msg || "Profile update failed",
    });
  } finally {
    saving.value = false;
  }
};

const saveNotifications = async () => {
  saving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  authStore.updatePreferences({ notifications: { ...notifications } });
  uiStore.addToast({
    type: "success",
    message: "Notification preferences saved",
  });
  saving.value = false;
};

const changePassword = async () => {
  if (password.new !== password.confirm) {
    uiStore.addToast({ type: "error", message: "New passwords do not match" });
    return;
  }
  if (password.new.length < 6) {
    uiStore.addToast({
      type: "error",
      message: "Password must be at least 6 characters",
    });
    return;
  }

  saving.value = true;
  try {
    await authStore.changePassword(password.current, password.new);
    password.current = "";
    password.new = "";
    password.confirm = "";
  } catch (err: any) {
    const msg = err.response?.data?.msg || "Failed to change password";
    uiStore.addToast({ type: "error", message: msg });
  } finally {
    saving.value = false;
  }
};

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

const confirmDelete = async () => {
  deleting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
  authStore.logout();
  showDeleteModal.value = false;
  deleting.value = false;
  router.push("/");
  uiStore.addToast({ type: "info", message: "Account deleted" });
};

const savePreferences = async () => {
  saving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  authStore.updatePreferences({
    currency: preferences.currency,
    theme: preferences.theme,
    autoSaveDefault: preferences.autoSaveDefault,
    monthlyIncome: preferences.monthlyIncome,
  });
  uiStore.addToast({ type: "success", message: "Preferences saved" });
  saving.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
