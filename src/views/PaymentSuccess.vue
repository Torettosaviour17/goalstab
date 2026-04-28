<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
    <div class="max-w-md w-full text-center space-y-6">
      <!-- Loading -->
      <div v-if="verifying" class="space-y-4">
        <div
          class="w-16 h-16 mx-auto rounded-full bg-primary-500/20 flex items-center justify-center"
        >
          <div
            class="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"
          />
        </div>
        <p class="text-white font-semibold text-lg">
          Verifying your payment...
        </p>
        <p class="text-gray-400 text-sm">
          Please wait, do not close this page.
        </p>
      </div>

      <!-- Success -->
      <div v-else-if="success" class="space-y-4">
        <div
          class="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center text-3xl"
        >
          🎉
        </div>
        <h1 class="text-2xl font-bold text-white">Payment Successful!</h1>
        <p class="text-gray-400">Your funds have been added to your goal.</p>

        <div
          v-if="updatedGoal"
          class="bg-gray-800 rounded-2xl p-4 text-left space-y-2"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ updatedGoal.icon }}</span>
            <div>
              <p class="text-white font-medium">{{ updatedGoal.title }}</p>
              <p class="text-sm text-gray-400">
                ₦{{ formatNumber(updatedGoal.saved) }} of ₦{{
                  formatNumber(updatedGoal.target)
                }}
              </p>
            </div>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-500 rounded-full transition-all duration-700"
              :style="{ width: updatedGoal.progress + '%' }"
            />
          </div>
          <p class="text-xs text-gray-500 text-right">
            {{ updatedGoal.progress }}% complete
          </p>
        </div>

        <BaseButton variant="primary" class="w-full" @click="goToDashboard">
          Back to Dashboard
        </BaseButton>
      </div>

      <!-- Failed -->
      <div v-else class="space-y-4">
        <div
          class="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center text-3xl"
        >
          ❌
        </div>
        <h1 class="text-2xl font-bold text-white">Payment Failed</h1>
        <p class="text-gray-400">
          {{ errorMsg || "Something went wrong. Please try again." }}
        </p>
        <BaseButton variant="secondary" class="w-full" @click="goToDashboard">
          Back to Dashboard
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseButton from "@/components/shared/BaseButton.vue";
import { useGoalsStore } from "@/stores/goals";
import type { Goal } from "@/stores/goals";

const router = useRouter();
const route = useRoute();
const goalsStore = useGoalsStore();

const verifying = ref(true);
const success = ref(false);
const errorMsg = ref("");
const updatedGoal = ref<Goal | null>(null);

onMounted(async () => {
  const reference = route.query.reference as string;

  if (!reference) {
    verifying.value = false;
    errorMsg.value = "No payment reference found.";
    return;
  }

  try {
    const goal = await goalsStore.verifyPaystackPayment(reference);
    updatedGoal.value = goal;
    success.value = true;
  } catch (err: any) {
    errorMsg.value = err.response?.data?.msg || "Verification failed.";
  } finally {
    verifying.value = false;
  }
});

const goToDashboard = () => router.push("/dashboard");
const formatNumber = (n: number) => new Intl.NumberFormat().format(n);
</script>
