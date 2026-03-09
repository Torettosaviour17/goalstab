<template>
  <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">Settings</h1>
    <p class="text-gray-400 mb-6 md:mb-8">Manage your account preferences</p>

    <!-- Tabs -->
    <div class="relative mb-6">
      <div class="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap rounded-lg transition flex-shrink-0',
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
      <!-- PROFILE -->
      <div v-if="activeTab === 'profile'" class="space-y-6">
        <div class="glass-card p-4 sm:p-6">
          <h2 class="text-lg md:text-xl font-bold text-white mb-4">
            Profile Information
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                v-model="profile.name"
                type="text"
                class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                v-model="profile.email"
                type="email"
                class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                v-model="profile.phone"
                type="tel"
                class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <BaseButton
              class="w-full sm:w-auto"
              @click="saveProfile"
              :loading="saving"
            >
              Save Changes
            </BaseButton>
          </div>
        </div>

        <div class="glass-card p-4 sm:p-6">
          <h2 class="text-lg md:text-xl font-bold text-white mb-4">Avatar</h2>

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
            >
              Change Avatar
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- NOTIFICATIONS -->
      <div
        v-else-if="activeTab === 'notifications'"
        class="glass-card p-4 sm:p-6"
      >
        <h2 class="text-lg md:text-xl font-bold text-white mb-4">
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
                :checked="notifications[item.key]"
                @change="notifications[item.key] = ($event.target as any).checked"
                class="sr-only peer"
              />

              <div
                class="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
              ></div>
            </label>
          </div>
        </div>

        <div class="mt-6">
          <BaseButton
            class="w-full sm:w-auto"
            @click="saveNotifications"
            :loading="saving"
          >
            Save Preferences
          </BaseButton>
        </div>
      </div>

      <!-- SECURITY -->
      <div v-else-if="activeTab === 'security'" class="space-y-6">
        <div class="glass-card p-4 sm:p-6">
          <h2 class="text-lg md:text-xl font-bold text-white mb-4">
            Change Password
          </h2>

          <div class="space-y-4">
            <input
              type="password"
              v-model="password.current"
              placeholder="Current Password"
              class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl"
            />

            <input
              type="password"
              v-model="password.new"
              placeholder="New Password"
              class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl"
            />

            <input
              type="password"
              v-model="password.confirm"
              placeholder="Confirm New Password"
              class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl"
            />

            <BaseButton
              class="w-full sm:w-auto"
              @click="changePassword"
              :loading="saving"
            >
              Update Password
            </BaseButton>
          </div>
        </div>

        <div class="glass-card p-4 sm:p-6 border border-danger/20">
          <h2 class="text-lg md:text-xl font-bold text-danger mb-4">
            Danger Zone
          </h2>

          <p class="text-gray-400 mb-4">
            Once you delete your account, there is no going back.
          </p>

          <BaseButton
            variant="danger"
            class="w-full sm:w-auto"
            @click="confirmDelete"
          >
            Delete Account
          </BaseButton>
        </div>
      </div>

      <!-- PREFERENCES -->
      <div
        v-else-if="activeTab === 'preferences'"
        class="glass-card p-4 sm:p-6"
      >
        <h2 class="text-lg md:text-xl font-bold text-white mb-4">
          App Preferences
        </h2>

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
        </div>

        <div class="mt-6">
          <BaseButton
            class="w-full sm:w-auto"
            @click="savePreferences"
            :loading="saving"
          >
            Save Preferences
          </BaseButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      activeTab: "profile",
      tabs: [
        { id: "profile", name: "Profile" },
        { id: "notifications", name: "Notifications" },
        { id: "security", name: "Security" },
        { id: "preferences", name: "Preferences" },
      ],
      profile: {
        name: "",
        email: "",
        phone: "",
      },
      notifications: {
        email: true,
        push: false,
        sms: false,
      } as Record<string, boolean>,
      notificationItems: [
        {
          key: "email",
          label: "Email Notifications",
          description: "Receive notifications via email",
        },
        {
          key: "push",
          label: "Push Notifications",
          description: "Receive push notifications on your device",
        },
        {
          key: "sms",
          label: "SMS Notifications",
          description: "Receive notifications via SMS",
        },
      ],
      password: {
        current: "",
        new: "",
        confirm: "",
      },
      preferences: {
        currency: "NGN",
        theme: "dark",
      },
      saving: false,
    };
  },
  methods: {
    saveProfile() {
      // Implement save logic
    },
    changeAvatar() {
      // Implement avatar change logic
    },
    saveNotifications() {
      // Implement save logic
    },
    changePassword() {
      // Implement password change logic
    },
    confirmDelete() {
      // Implement delete confirmation logic
    },
    savePreferences() {
      // Implement save logic
    },
  },
});
</script>

<style>
/* Add any styles if needed */
</style>
