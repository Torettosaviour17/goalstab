import { createApp } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import "./utilities.css"; // Add this line
import clickOutside from "./directives/clickOutside";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(MotionPlugin);
app.directive("click-outside", clickOutside);

app.mount("#app");
