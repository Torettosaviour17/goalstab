<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-4xl">
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">
      Help & Support
    </h1>
    <p class="text-gray-400 mb-8">
      Find answers to common questions and how to reach us.
    </p>

    <div class="space-y-6">
      <!-- FAQ Section -->
      <div class="glass-card p-6">
        <h2 class="text-xl font-bold text-white mb-4">
          Frequently Asked Questions
        </h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-white mb-2">
              How do I create a goal?
            </h3>
            <p class="text-gray-300">
              Click the "New Goal" button on your dashboard. You'll be guided
              through a step-by-step process to set your goal target, auto-save
              preferences, and choose an icon.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white mb-2">
              What is auto-save?
            </h3>
            <p class="text-gray-300">
              Auto-save automatically adds funds to your goals based on your
              settings (percentage of income or fixed amount) at the frequency
              you choose (daily, weekly, monthly). You can enable/disable it per
              goal.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white mb-2">
              How do withdrawals work?
            </h3>
            <p class="text-gray-300">
              Once a goal is completed (100% progress), you can request a
              withdrawal. Admins will review and approve/reject the request. You
              can only withdraw up to your saved amount (excluding the platform
              fee).
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white mb-2">
              Can I share a goal with others?
            </h3>
            <p class="text-gray-300">
              Yes! After creating a goal, click the "Share" button on the goal
              card. You can invite others by email and assign them a role
              (viewer or contributor).
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white mb-2">
              How is my data secured?
            </h3>
            <p class="text-gray-300">
              We use industry-standard encryption for all data. Passwords are
              hashed, and all communication is over HTTPS. Your personal
              information is never shared without your consent.
            </p>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="glass-card p-6">
        <h2 class="text-xl font-bold text-white mb-4">Still need help?</h2>
        <p class="text-gray-300 mb-4">
          Reach out to our support team and we'll get back to you within 24
          hours.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:support@goaltabs.com"
            class="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition"
          >
            <span>📧</span> support@goaltabs.com
          </a>
          <div class="flex items-center gap-2 text-gray-400">
            <span>📞</span> +234 800 000 0000
          </div>
        </div>
      </div>

      <!-- Report a Bug -->
      <div class="glass-card p-6">
        <h2 class="text-xl font-bold text-white mb-4">Report a Bug</h2>
        <p class="text-gray-300 mb-4">
          If you encounter any issues, please describe them in detail and we'll
          investigate.
        </p>
        <button
          @click="openBugReport"
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition"
        >
          <span>🐛</span> Report Bug
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from "@/stores/ui";

const uiStore = useUIStore();

const openBugReport = () => {
  uiStore.addToast({
    type: "info",
    message: "Please email details to support@goaltabs.com",
  });
};
</script>
