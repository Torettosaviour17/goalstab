<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-4xl">
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">Settings</h1>
    <p class="text-gray-400 mb-8">Manage your account preferences</p>

    <!-- Mobile-friendly tabs -->
    <div class="relative mb-6">
      <div class="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
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
    </div>

    <transition name="fade" mode="out-in">
      <!-- Profile -->
      <div v-if="activeTab === 'profile'" class="space-y-6">
        <div class="glass-card p-6">
          <h2 class="text-xl font-bold text-white mb-4">Profile Information</h2>
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

        <div class="glass-card p-6">
          <h2 class="text-xl font-bold text-white mb-4">Avatar</h2>
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <div
              class="w-20 h-20 rounded-full bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-3xl"
            >
              {{ profile.name?.charAt(0) || "U" }}
            </div>
            <BaseButton
              variant="secondary"
              class="w-full sm:w-auto"
              @click="changeAvatar"
              >Change Avatar</BaseButton
            >
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
                :checked="notifications[item.key as keyof typeof notifications]"
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

        <div class="glass-card p-6 border border-danger/20">
          <h2 class="text-xl font-bold text-danger mb-4">Danger Zone</h2>
          <p class="text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <BaseButton variant="danger" @click="confirmDelete"
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
            <select
              v-model="preferences.theme"
              class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full sm:w-auto"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
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
        </div>
        <div class="mt-6">
          <BaseButton @click="savePreferences" :loading="saving"
            >Save Preferences</BaseButton
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "@/components/shared/BaseButton.vue";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

interface NotificationSettings {
  email: boolean;
  push: boolean;
  goalCompleted: boolean;
  depositReceived: boolean;
  weeklyReport: boolean;
}

const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUIStore();

const activeTab = ref("profile");
const saving = ref(false);

const tabs = [
  { id: "profile", name: "Profile" },
  { id: "notifications", name: "Notifications" },
  { id: "security", name: "Security" },
  { id: "preferences", name: "Preferences" },
];

// Profile
const profile = reactive({
  name: "",
  email: "",
  phone: "",
});

// Notifications
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

// Security
const password = reactive({
  current: "",
  new: "",
  confirm: "",
});

// Preferences
const preferences = reactive({
  currency: "NGN",
  theme: "dark",
  autoSaveDefault: true,
});

// Load user data on mount
onMounted(() => {
  if (authStore.user) {
    profile.name = authStore.user.name || "";
    profile.email = authStore.user.email || "";
    profile.phone = (authStore.user as any).phone || "";

    if (authStore.user.preferences) {
      const prefs = authStore.user.preferences;
      if (prefs.notifications) {
        Object.assign(notifications, prefs.notifications);
      }
      preferences.currency = prefs.currency || "NGN";
      preferences.theme = prefs.theme || "dark";
      preferences.autoSaveDefault = prefs.autoSaveDefault ?? true;
    }
  }
});

const saveProfile = async () => {
  saving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API
  authStore.updateUser({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
  });
  uiStore.addToast({
    type: "success",
    message: "Profile updated successfully",
  });
  saving.value = false;
};

const changeAvatar = () => {
  uiStore.addToast({ type: "info", message: "Avatar change coming soon" });
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
  await new Promise((resolve) => setTimeout(resolve, 800));
  // In a real app, call API to change password
  uiStore.addToast({
    type: "success",
    message: "Password changed successfully",
  });
  password.current = "";
  password.new = "";
  password.confirm = "";
  saving.value = false;
};

const savePreferences = async () => {
  saving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  authStore.updatePreferences({
    currency: preferences.currency,
    theme: preferences.theme,
    autoSaveDefault: preferences.autoSaveDefault,
  });
  // Optionally apply theme immediately
  if (preferences.theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
  uiStore.addToast({ type: "success", message: "Preferences saved" });
  saving.value = false;
};

const confirmDelete = () => {
  if (
    confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    )
  ) {
    authStore.logout();
    router.push("/");
    uiStore.addToast({ type: "info", message: "Account deleted" });
  }
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
