import { createApp } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import VueApexCharts from "vue3-apexcharts";

// Create app instance
const app = createApp(App);

// Initialize Pinia
const pinia = createPinia();

// Register plugins
app.use(pinia);
app.use(router);
app.use(MotionPlugin);
app.use(VueApexCharts);

/* ================================
   GLOBAL DIRECTIVES
================================ */

// click-outside directive
app.directive("click-outside", {
  beforeMount(el, binding) {
    const handler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value(event);
      }
    };

    (el as any).__clickOutside__ = handler;
    document.addEventListener("click", handler);
  },
  unmounted(el) {
    document.removeEventListener("click", (el as any).__clickOutside__);
  },
});

/* ================================
   GLOBAL ERROR HANDLER
================================ */

app.config.errorHandler = (err, instance, info) => {
  console.error("Vue Error:", err);
  console.error("Component:", instance);
  console.error("Info:", info);
};

// Mount app
app.mount("#app");

// Dev logs
if (import.meta.env.DEV) {
  console.log(`GoalTabs v${import.meta.env.PACKAGE_VERSION || "1.0.0"}`);
  console.log("Environment:", import.meta.env.MODE);
}
