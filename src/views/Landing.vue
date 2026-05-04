<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden"
  >
    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
      ></div>
    </div>

    <!-- Navigation -->
    <nav
      class="relative z-40 backdrop-blur-xl bg-gray-900/50 border-b border-gray-800/50 sticky top-0"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
      >
        <div class="text-2xl font-bold">
          <span class="text-blue-400">Goal</span
          ><span class="text-white">Tabs</span>
        </div>
        <div class="flex items-center gap-4">
          <router-link
            to="/login"
            class="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
          >
            Sign in
          </router-link>
          <router-link
            to="/register"
            class="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
          >
            Get started
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero section -->
    <section
      class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"
    >
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <div class="space-y-2">
            <p class="text-blue-400 text-sm font-mono">
              // Command Your Wealth
            </p>
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Engineer Your<br /><span
                class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                >Financial Future</span
              >
            </h1>
          </div>
          <p class="text-lg text-gray-400 max-w-lg">
            More than a savings app. A precision instrument for financial
            discipline. Automate your goals, track every naira, and build
            lasting momentum.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <router-link
              to="/register"
              class="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-medium transition text-center"
            >
              Open Your Account
            </router-link>
            <button
              @click="scrollToFeatures"
              class="px-6 py-3 rounded-lg border border-blue-500/30 hover:border-blue-500 text-blue-400 font-medium transition"
            >
              Explore Features →
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 pt-8 text-sm">
            <div>
              <p class="text-2xl font-bold text-blue-400">500k+</p>
              <p class="text-gray-500">Goals created</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-purple-400">₦2B+</p>
              <p class="text-gray-500">Saved by users</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-green-400">98%</p>
              <p class="text-gray-500">Goal completion</p>
            </div>
          </div>
        </div>

        <!-- Hero illustration (terminal mockup) -->
        <div class="relative hidden md:block">
          <div
            class="rounded-xl bg-gray-800/30 border border-gray-700/50 p-4 backdrop-blur-xl overflow-hidden"
          >
            <div class="space-y-4 font-mono text-sm">
              <div class="text-green-400">
                <span class="text-gray-500">~/goaltabs $</span>
                <span class="text-white">status --active</span>
              </div>
              <div class="space-y-2 text-gray-400 text-xs">
                <p>
                  <span class="text-blue-400">›</span> Net Worth:
                  <span class="text-white">₦5.2M</span>
                </p>
                <p>
                  <span class="text-purple-400">›</span> Active Goals:
                  <span class="text-white">7</span>
                </p>
                <p>
                  <span class="text-green-400">›</span> Monthly Velocity:
                  <span class="text-white">₦450k</span>
                </p>
                <p>
                  <span class="text-orange-400">›</span> Completion Rate:
                  <span class="text-white">94%</span>
                </p>
              </div>
              <div class="border-t border-gray-700/30 pt-3 mt-3 text-gray-500">
                <p class="text-[10px]">Last sync: 2 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section
      ref="featuresRef"
      class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
        <p class="text-lg text-gray-400">Three steps to financial clarity</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Step 1 -->
        <div class="space-y-4">
          <div
            class="w-12 h-12 rounded-lg bg-blue-600/20 border border-blue-600/30 flex items-center justify-center font-bold text-lg text-blue-400"
          >
            1
          </div>
          <h3 class="text-xl font-bold">Define Your Goal</h3>
          <p class="text-gray-400">
            Search for products or services you want. Our smart system
            auto-fills prices, timelines, and targets. No guesswork.
          </p>
          <div class="text-sm text-blue-400 font-mono">
            // Terminal: create --goal "MacBook Pro"
          </div>
        </div>

        <!-- Step 2 -->
        <div class="space-y-4">
          <div
            class="w-12 h-12 rounded-lg bg-purple-600/20 border border-purple-600/30 flex items-center justify-center font-bold text-lg text-purple-400"
          >
            2
          </div>
          <h3 class="text-xl font-bold">Automate Savings</h3>
          <p class="text-gray-400">
            Tell us when you want it. We calculate exactly how much to save
            daily, weekly, or monthly. Discipline without willpower.
          </p>
          <div class="text-sm text-purple-400 font-mono">
            // Schedule: auto-save 450k / month
          </div>
        </div>

        <!-- Step 3 -->
        <div class="space-y-4">
          <div
            class="w-12 h-12 rounded-lg bg-green-600/20 border border-green-600/30 flex items-center justify-center font-bold text-lg text-green-400"
          >
            3
          </div>
          <h3 class="text-xl font-bold">Achieve & Withdraw</h3>
          <p class="text-gray-400">
            Hit your target. Withdraw instantly or let us handle fulfillment.
            Watch your net worth compound in real-time.
          </p>
          <div class="text-sm text-green-400 font-mono">
            // Execute: complete --goal
          </div>
        </div>
      </div>
    </section>

    <!-- Features grid -->
    <section class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Built for precision</h2>
        <p class="text-lg text-gray-400">
          Everything you need to command your wealth
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          class="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-blue-500/30 transition space-y-3"
        >
          <p class="text-2xl">🎯</p>
          <h3 class="font-bold text-lg">Smart Goal Creation</h3>
          <p class="text-gray-400 text-sm">
            Search products in-app, auto-fill prices, and get instant saving
            calculations. No more manual math.
          </p>
        </div>

        <div
          class="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-purple-500/30 transition space-y-3"
        >
          <p class="text-2xl">⚙️</p>
          <h3 class="font-bold text-lg">Algorithmic Automation</h3>
          <p class="text-gray-400 text-sm">
            Auto-save on your schedule. Daily, weekly, or monthly. Works even
            while you sleep.
          </p>
        </div>

        <div
          class="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-green-500/30 transition space-y-3"
        >
          <p class="text-2xl">💳</p>
          <h3 class="font-bold text-lg">Instant Payouts</h3>
          <p class="text-gray-400 text-sm">
            Withdraw to any Nigerian bank instantly. No delays, no hidden fees.
            Full transparency.
          </p>
        </div>

        <div
          class="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-orange-500/30 transition space-y-3"
        >
          <p class="text-2xl">📊</p>
          <h3 class="font-bold text-lg">Capital Velocity</h3>
          <p class="text-gray-400 text-sm">
            Watch your money compound. Real-time progress tracking and insights
            on your growth velocity.
          </p>
        </div>

        <div
          class="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-blue-500/30 transition space-y-3"
        >
          <p class="text-2xl">🔗</p>
          <h3 class="font-bold text-lg">Platform Fulfillment</h3>
          <p class="text-gray-400 text-sm">
            Let GoalTabs purchase on your behalf. Seamless integration with
            major e-commerce platforms.
          </p>
        </div>

        <div
          class="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-purple-500/30 transition space-y-3"
        >
          <p class="text-2xl">🛡️</p>
          <h3 class="font-bold text-lg">Bank-Grade Security</h3>
          <p class="text-gray-400 text-sm">
            Your funds are yours alone. Enterprise security with full
            transparency and auditability.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div
        class="rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 p-12 text-center space-y-6"
      >
        <h2 class="text-3xl md:text-4xl font-bold">
          Ready to engineer your future?
        </h2>
        <p class="text-lg text-gray-300 max-w-2xl mx-auto">
          Join 500k+ users commanding their wealth. Start building your goals
          today with GoalTabs.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <router-link
            to="/register"
            class="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium transition"
          >
            Get started free
          </router-link>
          <router-link
            to="/login"
            class="px-8 py-3 rounded-lg border border-blue-500/30 hover:border-blue-500 text-blue-400 font-medium transition"
          >
            Sign in
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-gray-800/50 mt-20 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <p class="font-bold mb-4">
              <span class="text-blue-400">Goal</span
              ><span class="text-white">Tabs</span>
            </p>
            <p class="text-sm text-gray-500">
              Command your wealth. Engineer your future.
            </p>
          </div>
          <div>
            <p class="font-bold text-sm mb-4">Product</p>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" class="hover:text-white transition">Features</a>
              </li>
              <li>
                <a href="#" class="hover:text-white transition">Pricing</a>
              </li>
              <li>
                <a href="#" class="hover:text-white transition">Security</a>
              </li>
            </ul>
          </div>
          <div>
            <p class="font-bold text-sm mb-4">Company</p>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition">About</a></li>
              <li><a href="#" class="hover:text-white transition">Blog</a></li>
              <li>
                <a href="#" class="hover:text-white transition">Careers</a>
              </li>
            </ul>
          </div>
          <div>
            <p class="font-bold text-sm mb-4">Legal</p>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>
                <router-link to="/terms" class="hover:text-white transition"
                  >Terms</router-link
                >
              </li>
              <li>
                <a href="#" class="hover:text-white transition">Privacy</a>
              </li>
              <li>
                <a href="#" class="hover:text-white transition">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div
          class="border-t border-gray-800/50 pt-8 text-sm text-gray-500 text-center"
        >
          <p>&copy; 2026 GoalTabs. All rights reserved. Command your wealth.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const featuresRef = ref<HTMLElement | null>(null);

const scrollToFeatures = () => {
  if (featuresRef.value) {
    featuresRef.value.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<style scoped>
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
