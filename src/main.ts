import { createApp, watch } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { MotionPlugin } from "@vueuse/motion";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import { useThemeStore } from "./stores/theme";
import "./style.css";
import VueApexCharts from "vue3-apexcharts";
import clickOutside from "./directives/clickOutside";

const app = createApp(App);
const pinia = createPinia();

// ✅ Persist ALL stores (including level + theme)
pinia.use(piniaPluginPersistedstate);

// Directives
app.directive("click-outside", clickOutside);

// Plugins
app.use(pinia);
app.use(router);
app.use(MotionPlugin);
app.use(VueApexCharts);

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error("Vue Error:", err, instance, info);
};

// ✅ INIT STORES BEFORE MOUNT
const authStore = useAuthStore(pinia);
const themeStore = useThemeStore(pinia);

// ✅ APPLY THEME IMMEDIATELY (VERY IMPORTANT)
themeStore.setTheme(themeStore.theme);

// Mount immediately. Authentication checks must never delay the first paint.
// Protected navigation can validate a persisted session in the router guard.
void router.isReady();

// GoalTabs has two faces on the same origin:
// 1. the public website, which stays a normal responsive website;
// 2. the authenticated app, which enables the PWA shell and offline assets.
// User-specific API data is deliberately NOT cached by the service worker.
let pwaRegistered = false;
const enableAppPWA = () => {
  if (pwaRegistered || typeof window === "undefined") return;

  let manifest = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
  if (!manifest) {
    manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href = "/manifest.webmanifest";
    document.head.appendChild(manifest);
  }

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!themeColor) {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#3b82f6";
    document.head.appendChild(meta);
  }

  if ("serviceWorker" in navigator) {
    void navigator.serviceWorker.register("/sw.js", { scope: "/" });
  }
  pwaRegistered = true;
};

watch(
  () => authStore.isAuthenticated,
  (authenticated) => {
    if (authenticated) enableAppPWA();
  },
  { immediate: true },
);

// ===============================
// MOUNT APP
// ===============================
app.mount("#app");

// ===============================
// DEV LOGS
// ===============================
if (import.meta.env.DEV) {
  console.log(`GoalTabs v${import.meta.env.PACKAGE_VERSION || "1.0.0"}`);
  console.log("Environment:", import.meta.env.MODE);
}
