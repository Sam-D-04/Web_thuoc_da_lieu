import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../pages/AdminDashboard.vue";
import ProductsPage from "../pages/ProductsPage.vue";
import Categories from "../pages/CategoriesPage.vue";
import AdminLogin from "../pages/AuthLogin.vue";
import OrdersPage from "../pages/OrdersPage.vue";
import Users from "../pages/UserPage.vue";
const Variants = { template: "<div class='p-4'>Trang quản lý biến thể</div>" };
const Settings = { template: "<div class='p-4'>Trang cài đặt</div>" };

const routes = [
    { path: "/login", name: "admin.login", component: AdminLogin },
    { path: "/", name: "admin.dashboard", component: Dashboard },
    { path: "/products", name: "admin.products", component: ProductsPage },
    { path: "/categories", name: "admin.categories", component: Categories },
    { path: "/variants", name: "admin.variants", component: Variants },
    { path: "/orders", name: "admin.orders", component: OrdersPage },
    { path: "/users", name: "admin.users", component: Users },
    { path: "/settings", name: "admin.settings", component: Settings },
    { path: "/:pathMatch(.*)*", redirect: { name: "admin.dashboard" } },
];

const router = createRouter({
    history: createWebHistory("/admin"),
    routes,
});

export default router;
