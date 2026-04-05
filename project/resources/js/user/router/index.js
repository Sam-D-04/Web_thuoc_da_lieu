import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";
import ProductDetail from "../pages/ProductDetail.vue";
import Cart from "../pages/Cart.vue";
import Checkout from "../pages/Checkout.vue";
import Profile from "../pages/Profile.vue";
import Auth from "../pages/Auth.vue";
import Product from "../components/Product.vue";
import MyOrders from "../pages/UserOders.vue";

const routes = [
    { path: "/", name: "home", component: Home },
    { path: "/products", name: "products", component: Product },
    {
        path: "/product/:id",
        name: "product.show",
        component: ProductDetail,
        props: true,
    },
    { path: "/cart", name: "cart", component: Cart },
    { path: "/checkout", name: "checkout", component: Checkout },
    { path: "/myorders", name: "myorders", component: MyOrders },
    { path: "/profile", name: "profile", component: Profile },
    { path: "/auth", name: "auth", component: Auth },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
