import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import warehouseRoutes from './warehouse'

// ─── Layouts ───────────────────────────────────────────
const AdminLayout = defineAsyncComponent(() => import('@/layouts/AdminLayout.vue'))
const StorefrontLayout = defineAsyncComponent(() => import('@/layouts/StorefrontLayout.vue'))

// ─── Admin Pages ────────────────────────────────────────
const Dashboard = defineAsyncComponent(() => import('@/pages/Dashboard.vue'))
const Products = defineAsyncComponent(() => import('@/pages/Products.vue'))
const Batches = defineAsyncComponent(() => import('@/pages/Batches.vue'))
const Orders = defineAsyncComponent(() => import('@/pages/Orders.vue'))
const Customers = defineAsyncComponent(() => import('@/pages/Customers.vue'))
const Alerts = defineAsyncComponent(() => import('@/pages/Alerts.vue'))
const Reports = defineAsyncComponent(() => import('@/pages/Reports.vue'))
const Settings = defineAsyncComponent(() => import('@/pages/Settings.vue'))

// ─── Storefront Pages ───────────────────────────────────
const LoginRegister = defineAsyncComponent(() => import('@/views/auth/LoginRegister.vue'))
const Home = defineAsyncComponent(() => import('@/views/storefront/Home.vue'))
const ProductDetail = defineAsyncComponent(() => import('@/views/storefront/ProductDetail.vue'))
const Checkout = defineAsyncComponent(() => import('@/views/storefront/Checkout.vue'))
const Account = defineAsyncComponent(() => import('@/views/storefront/Account.vue'))

const routes = [
  // ─── Auth ─────────────────────────────────────────────
  {
    path: '/login',
    name: 'Login',
    component: LoginRegister,
    meta: { title: 'Đăng nhập / Đăng ký' }
  },

  // ─── Storefront ───────────────────────────────────────
  {
    path: '/shop',
    component: StorefrontLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: { title: 'Dược Mỹ Phẩm Da Liễu - Mua sắm online' }
      },
      {
        path: 'product/:slug',
        name: 'ProductDetail',
        component: ProductDetail,
        meta: { title: 'Chi tiết sản phẩm' }
      },
      {
        path: '/checkout',
        name: 'Checkout',
        component: Checkout,
        meta: { title: 'Thanh toán', requiresAuth: true }
      },
      {
        path: '/account/orders',
        name: 'Account',
        component: Account,
        meta: { title: 'Tài khoản của tôi', requiresAuth: true }
      }
    ]
  },

  // ─── Admin ────────────────────────────────────────────
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { title: 'Tổng quan' } },
      { path: '/products', name: 'Products', component: Products, meta: { title: 'Sản phẩm' } },
      { path: '/batches', name: 'Batches', component: Batches, meta: { title: 'Lô thuốc' } },
      { path: '/orders', name: 'Orders', component: Orders, meta: { title: 'Đơn hàng' } },
      { path: '/customers', name: 'Customers', component: Customers, meta: { title: 'Khách hàng' } },
      { path: '/alerts', name: 'Alerts', component: Alerts, meta: { title: 'Cảnh báo' } },
      { path: '/reports', name: 'Reports', component: Reports, meta: { title: 'Báo cáo' } },
      { path: '/settings', name: 'Settings', component: Settings, meta: { title: 'Cài đặt' } },
    ]
  },

  // ─── Warehouse ────────────────────────────────────────
  ...warehouseRoutes,

  // ─── Redirect root ────────────────────────────────────
  { path: '/', redirect: '/shop' },

  // ─── 404 ──────────────────────────────────────────────
  { path: '/:pathMatch(.*)*', redirect: '/shop' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// ─── Navigation Guard ─────────────────────────────────
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('auth_user') || 'null')

  // Update document title
  if (to.meta.title) document.title = to.meta.title + ' | DượcMỹPhẩm'

  // Auth protection
  if (to.meta.requiresAuth && !user) {
    return next('/login')
  }

  // Admin protection
  if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) {
    return next('/shop')
  }

  next()
})

export default router
