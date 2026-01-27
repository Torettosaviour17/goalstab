import { createApp } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";
import App from "./App.vue";
import router from "./router";
import "./style.css";

const app = createApp(App);

// Use router BEFORE mounting
app.use(router);
app.use(createPinia());
app.use(MotionPlugin);

app.mount("#app");
