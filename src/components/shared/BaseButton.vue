<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      variantClasses,
      fullWidth ? 'w-full' : '',
    ]"
    :disabled="loading || disabled"
    @click="$emit('click')"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Icon slot -->
    <span v-if="$slots.icon" class="flex items-center">
      <slot name="icon" />
    </span>

    <!-- Default slot -->
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  loading: false,
  disabled: false,
  fullWidth: false,
});

defineEmits<{
  (e: "click"): void;
}>();

const sizeClasses = computed(
  () =>
    ({
      xs: "px-2.5 py-1.5 text-xs",
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-5 py-3 text-base",
      xl: "px-6 py-3.5 text-base",
    })[props.size],
);

const variantClasses = computed(
  () =>
    ({
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 active:scale-95 shadow-lg shadow-primary-500/20",
      secondary:
        "bg-gray-800 text-gray-200 hover:bg-gray-700 active:scale-95 border border-gray-700",
      danger:
        "bg-danger text-white hover:bg-danger/90 active:scale-95 shadow-lg shadow-danger/20",
      ghost:
        "text-gray-400 hover:text-white hover:bg-gray-800/50 active:scale-95",
      outline:
        "text-primary-500 border border-primary-500 hover:bg-primary-500/10 active:scale-95",
    })[props.variant],
);
</script>
