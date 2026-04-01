import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { MotionPlugin } from "@vueuse/motion";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import { useUIStore } from "./stores/ui";
import "./style.css";
import VueApexCharts from "vue3-apexcharts";
import clickOutside from "./directives/clickOutside";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.directive("click-outside", clickOutside);
app.use(pinia);
app.use(router);
app.use(MotionPlugin);
app.use(VueApexCharts);

app.config.errorHandler = (err, instance, info) => {
  console.error("Vue Error:", err, instance, info);
};

// ✅ Restore auth state before mounting
const authStore = useAuthStore(pinia);
const uiStore = useUIStore(pinia);

console.log("[App] Starting auth check...");
uiStore.setAuthChecking(true);

// Ensure preloader disappears even if auth check fails
const timeout = setTimeout(() => {
  console.log("[App] Auth check timeout, hiding preloader");
  uiStore.setAuthChecking(false);
}, 5000); // 5 second timeout

authStore
  .checkAuth()
  .then(() => {
    console.log("[App] Auth check completed successfully");
  })
  .catch((error) => {
    console.error("[App] Auth check failed:", error);
  })
  .finally(() => {
    console.log("[App] Hiding preloader");
    clearTimeout(timeout);
    uiStore.setAuthChecking(false);
  });

app.mount("#app");

if (import.meta.env.DEV) {
  console.log(`GoalTabs v${import.meta.env.PACKAGE_VERSION || "1.0.0"}`);
  console.log("Environment:", import.meta.env.MODE);
}
