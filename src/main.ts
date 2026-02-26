import { createApp } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import "./style.css";
import VueApexCharts from "vue3-apexcharts";
import clickOutside from "./directives/clickOutside";

const app = createApp(App);
const pinia = createPinia();

// Register global directive (ONLY once)
app.directive("click-outside", clickOutside);

// Use plugins
app.use(pinia);
app.use(router);
app.use(MotionPlugin);
app.use(VueApexCharts);

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error("Vue Error:", err);
  console.error("Component:", instance);
  console.error("Info:", info);
};

// Initialize auth BEFORE mounting app
const authStore = useAuthStore(pinia);

authStore.checkAuth().finally(() => {
  app.mount("#app");

  if (import.meta.env.DEV) {
    console.log(`GoalTabs v${import.meta.env.PACKAGE_VERSION || "1.0.0"}`);
    console.log("Environment:", import.meta.env.MODE);
  }
});
