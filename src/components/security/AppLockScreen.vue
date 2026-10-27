<template>
  <Teleport to="body">
    <Transition name="app-lock">
      <div v-if="visible" class="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-[#080D1A]/95 px-4 py-8 backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="app-lock-title" @keydown.esc.prevent>
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"></div>
        <section class="relative w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/90 p-6 text-center shadow-2xl shadow-black/40 sm:p-8">
          <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v3" /></svg>
          </div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">GoalTabs Security</p>
          <h1 id="app-lock-title" class="text-2xl font-bold text-white">{{ settingsAction === 'disable' ? 'Turn off app PIN?' : setupInvitation && !setupMode ? 'Add extra security?' : configured ? 'Welcome back' : 'Create your app PIN' }}</h1>
          <p class="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-400">{{ setupInvitation && !setupMode ? 'You can add a 6-digit app PIN for this device now, or skip and set it up later in Settings.' : configured ? 'Unlock your savings space to continue.' : 'Set a 6-digit PIN for quick, private access to this app on this device.' }}</p>
          <div v-if="setupInvitation && !setupMode" class="mt-7 space-y-3">
            <button type="button" @click="beginSetup" class="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:brightness-110">Set up app PIN</button>
            <button type="button" @click="skipSetup" class="w-full rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5">Not now</button>
          </div>
          <form v-else class="mt-7 space-y-4" @submit.prevent="submitPin">
            <label for="app-pin" class="block text-left text-sm font-medium text-slate-300">{{ configured ? 'Enter your 6-digit PIN' : 'Choose a 6-digit PIN' }}</label>
            <input id="app-pin" v-model="pin" inputmode="numeric" autocomplete="one-time-code" type="password" pattern="[0-9]{6}" minlength="6" maxlength="6" required :disabled="busy || cooldownSeconds > 0" class="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-center text-2xl tracking-[0.55em] text-white outline-none transition placeholder:tracking-normal placeholder:text-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60" placeholder="••••••" aria-describedby="app-lock-message" />
            <p id="app-lock-message" class="min-h-5 text-sm" :class="messageIsError ? 'text-red-300' : 'text-slate-400'">{{ cooldownSeconds > 0 ? 'Too many attempts. Try again in ' + cooldownSeconds + 's.' : message }}</p>
            <button type="submit" :disabled="busy || cooldownSeconds > 0 || pin.length !== 6" class="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
              <span v-if="busy" class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
              {{ busy ? 'Please wait…' : settingsAction === 'disable' ? 'Confirm and turn off PIN' : configured ? 'Unlock GoalTabs' : 'Set PIN and continue' }}
            </button>
          </form>
          <button v-if="settingsAction === 'disable'" type="button" @click="cancelSettingsAction" class="mt-3 w-full rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5">Cancel</button>
          <div v-if="configured && biometricSupported && biometricConfigured" class="mt-4">
            <button type="button" :disabled="busy || biometricBusy || cooldownSeconds > 0" @click="unlockWithBiometric" class="flex w-full items-center justify-center gap-3 rounded-2xl border border-blue-400/25 bg-blue-400/5 px-4 py-3.5 font-semibold text-blue-200 transition hover:bg-blue-400/10 disabled:opacity-50">
              <span v-if="biometricBusy" class="h-4 w-4 animate-spin rounded-full border-2 border-blue-200/40 border-t-blue-200"></span>
              {{ biometricBusy ? 'Verifying device…' : 'Unlock with fingerprint / device security' }}
            </button>
          </div>
          <div v-if="!configured" class="mt-5 rounded-xl border border-slate-700/70 bg-slate-950/50 p-3 text-left text-xs leading-5 text-slate-400">This is a convenience lock on this device. It does not replace your GoalTabs account password or server-side account security.</div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  getBiometricStatus,
  isDeviceAuthenticationSupported,
  removeBiometricDevice,
  verifyBiometricDevice,
} from "@/services/deviceAuthentication";

const props = defineProps<{ userId: string }>();
const visible = ref(false);
const configured = ref(false);
const setupInvitation = ref(false);
const setupMode = ref(false);
const settingsAction = ref<"disable" | null>(null);
const pin = ref("");
const busy = ref(false);
const message = ref("");
const messageIsError = ref(false);
const biometricConfigured = ref(false);
const biometricSupported = ref(false);
const biometricBusy = ref(false);
const cooldownSeconds = ref(0);
let cooldownTimer: number | undefined;
let hiddenAt = 0;

const keys = () => {
  const suffix = encodeURIComponent(props.userId || "account");
  return {
    salt: "goaltabs-app-lock-salt:" + suffix,
    hash: "goaltabs-app-lock-hash:" + suffix,
    attempts: "goaltabs-app-lock-attempts:" + suffix,
    blockedUntil: "goaltabs-app-lock-blocked-until:" + suffix,
    promptDismissed: "goaltabs-security-prompt-dismissed:" + suffix,
  };
};

const randomBytes = (length: number) => {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  return bytes;
};

const toBase64Url = (bytes: ArrayBuffer | Uint8Array) => {
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  array.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const fromBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const derivePinHash = async (value: string, salt: Uint8Array) => {
  const material = await window.crypto.subtle.importKey("raw", new TextEncoder().encode(value), "PBKDF2", false, ["deriveBits"]);
  const bits = await window.crypto.subtle.deriveBits({ name: "PBKDF2", salt: salt.slice().buffer as ArrayBuffer, iterations: 210000, hash: "SHA-256" }, material, 256);
  return toBase64Url(bits);
};

const updateCooldown = () => {
  const blockedUntil = Number(localStorage.getItem(keys().blockedUntil) || 0);
  cooldownSeconds.value = Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000));
  if (cooldownTimer) window.clearInterval(cooldownTimer);
  if (cooldownSeconds.value > 0) {
    cooldownTimer = window.setInterval(() => {
      cooldownSeconds.value = Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000));
      if (cooldownSeconds.value <= 0 && cooldownTimer) {
        window.clearInterval(cooldownTimer);
        cooldownTimer = undefined;
      }
    }, 1000);
  }
};

const loadState = () => {
  const current = keys();
  configured.value = Boolean(localStorage.getItem(current.salt) && localStorage.getItem(current.hash));
  // Biometric unlock is shown only after a credential has been verified and
  // saved by the backend. A client-only credential response is never trusted.
  void refreshBiometricStatus();
  pin.value = "";
  setupMode.value = false;
  setupInvitation.value = false;
  message.value = configured.value ? "Your account is still signed in. App unlock is required." : "This PIN is only for this device.";
  messageIsError.value = false;

  const justAuthenticated = sessionStorage.getItem("goaltabs-authenticated-this-session") === "true";
  if (justAuthenticated) sessionStorage.removeItem("goaltabs-authenticated-this-session");

  if (configured.value) {
    // Successful account login is already verification. Lock on later app resumes.
    visible.value = !justAuthenticated;
  } else {
    // No PIN is mandatory. Invite once, allow skip, and never block app entry.
    visible.value = !localStorage.getItem(current.promptDismissed);
    setupInvitation.value = visible.value;
  }
  updateCooldown();
};

const refreshBiometricStatus = async () => {
  biometricSupported.value = isDeviceAuthenticationSupported();
  biometricConfigured.value = false;
  if (!biometricSupported.value) return;
  try {
    biometricConfigured.value = await getBiometricStatus();
  } catch {
    biometricConfigured.value = false;
  }
};

const unlockWithBiometric = async () => {
  if (busy.value || biometricBusy.value || cooldownSeconds.value > 0) return;
  biometricBusy.value = true;
  message.value = "";
  messageIsError.value = false;
  try {
    await verifyBiometricDevice();
    clearFailedAttempts();
    unlock();
  } catch (error) {
    message.value =
      (error instanceof Error ? error.message : "Device verification failed.") +
      " You can always use your app PIN.";
    messageIsError.value = true;
  } finally {
    biometricBusy.value = false;
  }
};

const beginSetup = () => {
  setupInvitation.value = false;
  setupMode.value = true;
  pin.value = "";
  message.value = "Choose a 6-digit PIN for this device.";
};

const skipSetup = () => {
  localStorage.setItem(keys().promptDismissed, "true");
  setupInvitation.value = false;
  setupMode.value = false;
  visible.value = false;
};

const cancelSettingsAction = () => {
  settingsAction.value = null;
  visible.value = false;
  pin.value = "";
  message.value = "";
  messageIsError.value = false;
};

const handleOpenSecuritySetup = (event: Event) => {
  const action = (event as CustomEvent<{ action?: string }>).detail?.action;
  settingsAction.value = action === "disable" ? "disable" : null;
  loadState();
  visible.value = true;
  setupInvitation.value = false;
  if (!configured.value) {
    setupMode.value = true;
    message.value = "Choose a 6-digit PIN for this device.";
  } else if (settingsAction.value === "disable") {
    setupMode.value = false;
    message.value = "Enter your current app PIN to turn off this device lock.";
  }
};

const clearFailedAttempts = () => {
  localStorage.removeItem(keys().attempts);
  localStorage.removeItem(keys().blockedUntil);
  updateCooldown();
};

const noteFailedAttempt = () => {
  const current = keys();
  const attempts = Number(localStorage.getItem(current.attempts) || 0) + 1;
  localStorage.setItem(current.attempts, String(attempts));
  if (attempts >= 5) {
    localStorage.setItem(current.attempts, "0");
    localStorage.setItem(current.blockedUntil, String(Date.now() + 30000));
    updateCooldown();
  }
};

const unlock = () => {
  visible.value = false;
  pin.value = "";
  message.value = "";
  messageIsError.value = false;
  settingsAction.value = null;
  window.dispatchEvent(new Event("goaltabs:app-security-updated"));
};

const submitPin = async () => {
  if (busy.value || pin.value.length !== 6 || cooldownSeconds.value > 0) return;
  busy.value = true;
  message.value = "";
  messageIsError.value = false;
  try {
    const current = keys();
    if (!configured.value) {
      const salt = randomBytes(16);
      const hash = await derivePinHash(pin.value, salt);
      localStorage.setItem(current.salt, toBase64Url(salt));
      localStorage.setItem(current.hash, hash);
      localStorage.setItem(current.promptDismissed, "true");
      clearFailedAttempts();
      configured.value = true;
      setupInvitation.value = false;
      setupMode.value = false;
      unlock();
      return;
    }
    const saltValue = localStorage.getItem(current.salt);
    const expectedHash = localStorage.getItem(current.hash);
    if (!saltValue || !expectedHash) {
      configured.value = false;
      message.value = "Set up your app PIN again to continue.";
      messageIsError.value = true;
      return;
    }
    const actualHash = await derivePinHash(pin.value, fromBase64Url(saltValue));
    if (actualHash !== expectedHash) {
      noteFailedAttempt();
      pin.value = "";
      message.value = "That PIN is not correct. Try again.";
      messageIsError.value = true;
      return;
    }
    clearFailedAttempts();
    if (settingsAction.value === "disable") {
      if (await getBiometricStatus()) await removeBiometricDevice();
      localStorage.removeItem(current.salt);
      localStorage.removeItem(current.hash);
      localStorage.setItem(current.promptDismissed, "true");
      configured.value = false;
      biometricConfigured.value = false;
    }
    unlock();
  } catch (error) {
    message.value = error instanceof Error ? error.message : "The security change could not be completed. Please try again.";
    messageIsError.value = true;
  } finally {
    busy.value = false;
  }
};

const handleVisibilityChange = () => {
  if (document.visibilityState === "hidden") {
    hiddenAt = Date.now();
    return;
  }
  if (document.visibilityState === "visible" && hiddenAt && Date.now() - hiddenAt > 1000) {
    hiddenAt = 0;
    if (props.userId) loadState();
  }
};

watch(() => props.userId, (next, previous) => {
  if (next && next !== previous) loadState();
});

onMounted(() => {
  if (props.userId) loadState();
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("goaltabs:open-security-setup", handleOpenSecuritySetup);
});
onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("goaltabs:open-security-setup", handleOpenSecuritySetup);
  if (cooldownTimer) window.clearInterval(cooldownTimer);
});
</script>

<style scoped>
.app-lock-enter-active, .app-lock-leave-active { transition: opacity 180ms ease; }
.app-lock-enter-from, .app-lock-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .app-lock-enter-active, .app-lock-leave-active { transition: none; }
}
</style>
