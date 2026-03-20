<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Avatar preview (clickable) -->
    <div class="relative cursor-pointer group" @click="openPickerModal">
      <div
        class="w-24 h-24 rounded-full bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-3xl overflow-hidden shadow-lg"
      >
        <img
          v-if="avatarPreview"
          :src="avatarPreview"
          class="w-full h-full object-cover"
          :alt="userName"
        />
        <span v-else class="font-bold text-white">{{ userInitials }}</span>
      </div>
      <div
        class="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
      >
        <span class="text-white text-sm">Change</span>
      </div>
    </div>

    <!-- Modal for avatar actions -->
    <BaseModal v-model="showModal" title="Profile Photo" :max-width="400">
      <div class="space-y-4">
        <div class="flex flex-col gap-2">
          <button
            @click="openCamera"
            class="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-white flex items-center justify-center gap-2"
          >
            <span>📷</span> Take Photo
          </button>
          <button
            @click="openGallery"
            class="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-white flex items-center justify-center gap-2"
          >
            <span>🖼️</span> Choose from Gallery
          </button>
          <button
            v-if="currentAvatar"
            @click="removeAvatar"
            class="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 flex items-center justify-center gap-2"
          >
            <span>🗑️</span> Remove Photo
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Hidden file inputs -->
    <input
      ref="cameraInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="handleFileSelect"
    />
    <input
      ref="galleryInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseModal from "@/components/shared/BaseModal.vue";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{
  currentAvatar: string | null;
  userName: string;
}>();

const emit = defineEmits<{
  (e: "update", avatar: string | null): void;
}>();

const authStore = useAuthStore();
const uiStore = useUIStore();

const showModal = ref(false);
const cameraInput = ref<HTMLInputElement | null>(null);
const galleryInput = ref<HTMLInputElement | null>(null);

const avatarPreview = computed(() => props.currentAvatar);
const userInitials = computed(() => {
  const name = props.userName;
  if (!name) return "?";
  return name
    .split(" ")
    .filter((n) => n)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const openPickerModal = () => {
  showModal.value = true;
};

const openCamera = () => {
  showModal.value = false;
  cameraInput.value?.click();
};

const openGallery = () => {
  showModal.value = false;
  galleryInput.value?.click();
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxWidth = 400;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL("image/jpeg", 0.7);
        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    uiStore.addToast({ type: "error", message: "Please select an image file" });
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    uiStore.addToast({ type: "error", message: "Image must be less than 5MB" });
    return;
  }

  showModal.value = false;
  uiStore.setGlobalLoading(true);
  try {
    const base64 = await compressImage(file);
    await authStore.updateAvatar(base64);
    emit("update", base64);
    uiStore.addToast({ type: "success", message: "Avatar updated!" });
  } catch (err) {
    uiStore.addToast({ type: "error", message: "Failed to upload image" });
  } finally {
    uiStore.setGlobalLoading(false);
    input.value = "";
  }
};

const removeAvatar = async () => {
  showModal.value = false;
  uiStore.setGlobalLoading(true);
  try {
    await authStore.updateAvatar(null);
    emit("update", null);
    uiStore.addToast({ type: "success", message: "Avatar removed" });
  } catch (err) {
    uiStore.addToast({ type: "error", message: "Failed to remove avatar" });
  } finally {
    uiStore.setGlobalLoading(false);
  }
};
</script>
