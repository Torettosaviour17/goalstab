import { createApp } from "vue";
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
