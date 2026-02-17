<template>
  <BaseModal v-model="show" title="Share Goal">
    <div class="space-y-4">
      <!-- Current shared users -->
      <div v-if="sharedUsers.length" class="space-y-2">
        <p class="text-sm font-medium text-gray-300">People with access</p>
        <SharedUserBadge
          v-for="user in sharedUsers"
          :key="user.id"
          :user="user"
          :can-remove="user.role !== 'owner'"
          @remove="removeUser(user.id)"
        />
      </div>

      <!-- Add new user -->
      <div class="space-y-3">
        <p class="text-sm font-medium text-gray-300">Add person</p>
        <div class="flex gap-2">
          <input
            v-model="newUser.email"
            type="email"
            placeholder="Email address"
            class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            v-model="newUser.role"
            class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="contributor">Contributor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <BaseButton @click="addUser" :disabled="!newUser.email">
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
import SharedUserBadge from "./SharedUserBadge.vue";
import type { SharedUser } from "@/types/goal";

const props = defineProps<{
  modelValue: boolean;
  goalId: string;
  sharedUsers: SharedUser[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "share", user: { email: string; role: string }): void;
  (e: "unshare", userId: string): void;
}>();

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const newUser = ref({
  email: "",
  role: "contributor" as const,
});

const shareableLink = computed(() => {
  return `${window.location.origin}/shared-goal/${props.goalId}`;
});

const addUser = () => {
  if (newUser.value.email) {
    emit("share", { ...newUser.value });
    newUser.value.email = "";
  }
};

const removeUser = (userId: string) => {
  emit("unshare", userId);
};

const copyLink = async () => {
  await navigator.clipboard.writeText(shareableLink.value);
  // Show toast (optional)
};
</script>
