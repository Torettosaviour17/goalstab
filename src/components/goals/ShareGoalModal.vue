<template>
  <BaseModal v-model="show" title="Share Goal">
    <div class="space-y-4">
      <!-- Current shared users -->
      <div v-if="sharedUsers.length" class="space-y-2">
        <p class="text-sm font-medium text-gray-300">People with access</p>
        <div
          v-for="user in sharedUsers"
          :key="user.id"
          class="flex items-center justify-between p-3 rounded-lg bg-gray-800/50"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center"
            >
              <span class="text-sm">{{ user.name.charAt(0) }}</span>
            </div>
            <div>
              <p class="text-sm font-medium text-white">{{ user.name }}</p>
              <p class="text-xs text-gray-400">{{ user.email }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="roleClass(user.role)"
            >
              {{ user.role }}
            </span>
            <button
              v-if="user.role !== 'owner'"
              @click="removeUser(user.id)"
              class="p-1 hover:bg-gray-700 rounded transition"
            >
              <span class="text-sm text-gray-400 hover:text-danger">✕</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Add new user -->
      <div class="space-y-3">
        <p class="text-sm font-medium text-gray-300">Add person</p>
        <div class="flex flex-col sm:flex-row gap-2">
          <input
            v-model="newEmail"
            type="email"
            placeholder="Email address"
            class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            v-model="newRole"
            class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="contributor">Contributor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <BaseButton @click="addUser" :disabled="!newEmail">
          Add Person
        </BaseButton>
      </div>

      <!-- Shareable link (optional) -->
      <div class="pt-4 border-t border-gray-800">
        <p class="text-sm font-medium text-gray-300 mb-2">Shareable link</p>
        <div class="flex gap-2">
          <input
            :value="shareableLink"
            readonly
            class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-400"
          />
          <BaseButton variant="secondary" @click="copyLink"> Copy </BaseButton>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import type { SharedUser } from "@/types/goal";

const props = defineProps<{
  modelValue: boolean;
  goalId: string;
  sharedUsers: SharedUser[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "share", user: { email: string; role: "contributor" | "viewer" }): void;
  (e: "unshare", userId: string): void;
}>();

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const newEmail = ref("");
const newRole = ref<"contributor" | "viewer">("contributor");

const shareableLink = computed(() => {
  return `${window.location.origin}/shared-goal/${props.goalId}`;
});

const roleClass = (role: string) => {
  const classes = {
    owner: "bg-primary-500/20 text-primary-300",
    contributor: "bg-success/20 text-success",
    viewer: "bg-gray-700 text-gray-300",
  };
  return classes[role as keyof typeof classes] || classes.viewer;
};

const addUser = () => {
  if (!newEmail.value) return;
  emit("share", { email: newEmail.value, role: newRole.value });
  newEmail.value = "";
};

const removeUser = (userId: string) => {
  emit("unshare", userId);
};

const copyLink = async () => {
  await navigator.clipboard.writeText(shareableLink.value);
  // You can trigger a toast here if you want
};
</script>
