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

uiStore.setAuthChecking(true);
app.mount("#app");

authStore.checkAuth().finally(() => {
  uiStore.setAuthChecking(false);
});

if (import.meta.env.DEV) {
  console.log(`GoalTabs v${import.meta.env.PACKAGE_VERSION || "1.0.0"}`);
  console.log("Environment:", import.meta.env.MODE);
}
