<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-4xl">
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">Settings</h1>
    <p class="text-gray-400 mb-8">Manage your account preferences</p>

    <!-- Mobile: Horizontal scrollable tabs -->
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
      <!-- Optional gradient fade on edges (decorative) -->
      <div
        class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none"
      ></div>
      <div
        class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"
      ></div>
    </div>

    <!-- Content Sections -->
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
            <BaseButton @click="saveProfile">Save Changes</BaseButton>
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
            <BaseButton variant="secondary" class="w-full sm:w-auto"
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
                v-model="notifications[item.key as keyof typeof notifications]"
                class="sr-only peer"
              />

              <div
                class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"
              ></div>
            </label>
          </div>
        </div>
        <div class="mt-6">
          <BaseButton @click="saveNotifications">Save Preferences</BaseButton>
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
            <BaseButton @click="changePassword">Update Password</BaseButton>
          </div>
        </div>

        <div class="glass-card p-6 border border-danger/20">
          <h2 class="text-xl font-bold text-danger mb-4">Danger Zone</h2>
          <p class="text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <BaseButton variant="danger">Delete Account</BaseButton>
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
          <BaseButton @click="savePreferences">Save Preferences</BaseButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

const authStore = useAuthStore();
const uiStore = useUIStore();

const activeTab = ref("profile");

const tabs = [
  { id: "profile", name: "Profile" },
  { id: "notifications", name: "Notifications" },
  { id: "security", name: "Security" },
  { id: "preferences", name: "Preferences" },
];

// Profile
const profile = reactive({
  name: authStore.user?.name || "Demo User",
  email: authStore.user?.email || "demo@example.com",
  phone: "+234 800 000 0000",
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
];

const notifications = reactive({
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

const saveProfile = () => {
  uiStore.addToast({
    type: "success",
    message: "Profile updated successfully",
  });
};

const saveNotifications = () => {
  uiStore.addToast({
    type: "success",
    message: "Notification preferences saved",
  });
};

const changePassword = () => {
  if (password.new !== password.confirm) {
    uiStore.addToast({ type: "error", message: "Passwords do not match" });
    return;
  }
  uiStore.addToast({
    type: "success",
    message: "Password changed successfully",
  });
  password.current = "";
  password.new = "";
  password.confirm = "";
};

const savePreferences = () => {
  uiStore.addToast({ type: "success", message: "Preferences saved" });
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
