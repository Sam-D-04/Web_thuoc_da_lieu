import "./bootstrap";
import "../css/app.css";
import { createApp } from "vue";
import App from "./user/App.vue";
import router from "./user/router";
import "@fortawesome/fontawesome-free/css/all.min.css";

createApp(App).use(router).mount("#app");
