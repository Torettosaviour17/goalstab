import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { MotionPlugin } from "@vueuse/motion";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import { useUIStore } from "./stores/ui";
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
const uiStore = useUIStore(pinia);
const themeStore = useThemeStore(pinia);

// ✅ APPLY THEME IMMEDIATELY (VERY IMPORTANT)
themeStore.setTheme(themeStore.theme);

// ===============================
// AUTH CHECK + PRELOADER CONTROL
// ===============================
console.log("[App] Starting auth check...");
uiStore.setAuthChecking(true);

// Failsafe timeout
const timeout = setTimeout(() => {
  console.log("[App] Auth timeout → hiding loader");
  uiStore.setAuthChecking(false);
}, 5000);

authStore
  .checkAuth()
  .then(() => {
    console.log("[App] Auth success");
  })
  .catch((error) => {
    console.error("[App] Auth failed:", error);
  })
  .finally(() => {
    clearTimeout(timeout);
    uiStore.setAuthChecking(false);
    console.log("[App] Loader removed");
  });

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
