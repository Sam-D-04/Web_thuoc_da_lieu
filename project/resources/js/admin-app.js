import "../css/app.css";
import { createApp } from "vue";
import AdminApp from "./admin/admin-app.vue";
import router from "./admin/router";
import "@fortawesome/fontawesome-free/css/all.min.css";

createApp(AdminApp).use(router).mount("#admin-app");
