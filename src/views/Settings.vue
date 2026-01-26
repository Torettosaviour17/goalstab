<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Settings</h1>

    <div class="space-y-6">
      <!-- Profile Settings -->
      <div class="glass-card p-6">
        <h2 class="text-xl font-bold mb-4">Profile</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
            />
          </div>
          <button class="btn-primary px-6">Update Profile</button>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="glass-card p-6">
        <h2 class="text-xl font-bold mb-4">Notifications</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Email Notifications</p>
              <p class="text-sm text-gray-400">Receive updates via email</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" checked />
              <div
                class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
              ></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Push Notifications</p>
              <p class="text-sm text-gray-400">Get real-time alerts</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" checked />
              <div
                class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
              ></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="glass-card p-6">
        <h2 class="text-xl font-bold mb-4">Account</h2>
        <div class="space-y-4">
          <button
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 transition"
          >
            Change Password
          </button>
          <button
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 transition"
          >
            Connected Accounts
          </button>
          <button
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 transition text-red-400"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
