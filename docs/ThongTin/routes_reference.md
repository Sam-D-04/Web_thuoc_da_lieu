# 📍 ROUTES REFERENCE — DERMACITY

> Tài liệu này liệt kê toàn bộ các routes của hệ thống, bao gồm cả Frontend (Vue Router) và Backend (Laravel API).
> Cập nhật lần cuối: 2026-04-05

---

## 1. BACKEND — Laravel (`project/`)

Base URL: `http://localhost:8000/api`

> **Lưu ý:** Backend hiện tại có 2 port:
> - `PORT 8001` → Trả về view `admin/admin.blade.php` (Admin SPA)
> - `PORT 8000` → Trả về view `user/user.blade.php` (User SPA)

---

### 1.1. Web Routes (`routes/web.php`)

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/` | Tự động phân biệt Admin/User theo port |
| GET | `/admin/{any?}` | Trả về Admin SPA (`admin.admin.blade.php`) |
| GET | `/auth/facebook` | Redirect OAuth Facebook |
| GET | `/auth/facebook/callback` | Callback OAuth Facebook |
| GET | `/{any?}` | Catch-all → Trả về User SPA (`user.user.blade.php`) |

---

### 1.2. API Routes (`routes/api.php`) — Prefix: `/api`

#### 🔓 Public (không cần đăng nhập)

| Method | Endpoint | Controller | Mô tả |
|--------|----------|-----------|-------|
| POST | `/api/register` | AuthController@register | Đăng ký tài khoản mới |
| POST | `/api/login` | AuthController@login | Đăng nhập (trả về Sanctum token) |
| POST | `/api/login/facebook` | AuthController@facebookLogin | Đăng nhập qua Facebook OAuth |
| POST | `/api/verify-email` | AuthController@verifyEmail | Xác thực email bằng mã OTP |
| POST | `/api/resend-verification-code` | AuthController@resendVerificationCode | Gửi lại mã OTP |
| GET | `/api/products` | ProductController@index | Danh sách sản phẩm (hỗ trợ filter/search) |
| GET | `/api/products/{product}` | ProductController@show | Chi tiết một sản phẩm |
| GET | `/api/categories` | CategoryController@index | Danh sách danh mục |
| GET | `/api/categories/{category}` | CategoryController@show | Chi tiết một danh mục |

#### 🔒 Authenticated (cần Bearer Token — `auth:sanctum`)

| Method | Endpoint | Controller | Mô tả |
|--------|----------|-----------|-------|
| GET | `/api/me` | AuthController@me | Thông tin user hiện tại |
| POST | `/api/logout` | AuthController@logout | Đăng xuất (thu hồi token) |
| GET | `/api/orders` | OrderController@index | Lịch sử đơn hàng của user |
| GET | `/api/orders/{order}` | OrderController@show | Chi tiết một đơn hàng |
| POST | `/api/orders` | OrderController@store | Tạo đơn hàng mới |
| POST | `/api/paypal/create-order` | PayPalController@createOrder | Tạo PayPal Order |
| POST | `/api/paypal/capture-order` | PayPalController@captureOrder | Capture thanh toán PayPal |

#### 🛡️ Admin Only (cần token + middleware `admin`)

| Method | Endpoint | Controller | Mô tả |
|--------|----------|-----------|-------|
| GET | `/api/admin/users` | AuthController@adminUsers | Danh sách tất cả user |
| GET | `/api/admin/orders` | OrderController@adminIndex | Tất cả đơn hàng (toàn hệ thống) |
| POST | `/api/products` | ProductController@store | Tạo sản phẩm mới |
| PUT | `/api/products/{product}` | ProductController@update | Cập nhật sản phẩm |
| DELETE | `/api/products/{product}` | ProductController@destroy | Xóa sản phẩm |
| POST | `/api/categories` | CategoryController@store | Tạo danh mục mới |
| PUT | `/api/categories/{category}` | CategoryController@update | Cập nhật danh mục |
| DELETE | `/api/categories/{category}` | CategoryController@destroy | Xóa danh mục |
| PUT | `/api/orders/{order}/status` | OrderController@updateStatus | Cập nhật trạng thái đơn hàng |

---

## 2. FRONTEND — Vue Router (`frontend/src/router/`)

Base URL: `http://localhost:5173`

> Route guard: Các route có `requiresAuth: true` sẽ redirect về `/login` nếu chưa đăng nhập.
> Route guard: Các route có `requiresAdmin: true` sẽ redirect về `/shop` nếu không phải admin.

---

### 2.1. Auth Routes

| Path | Component | Guard | Mô tả |
|------|-----------|-------|-------|
| `/login` | `views/auth/LoginRegister.vue` | — | Trang đăng nhập / đăng ký |

---

### 2.2. Storefront Routes (Layout: `StorefrontLayout.vue`)

| Path | Component | Guard | Mô tả |
|------|-----------|-------|-------|
| `/shop` | `views/storefront/Home.vue` | — | Trang chủ cửa hàng Dermacity |
| `/shop?category=:slug` | `views/storefront/Home.vue` | — | Lọc sản phẩm theo danh mục |
| `/shop?q=:query` | `views/storefront/Home.vue` | — | Tìm kiếm sản phẩm |
| `/shop/product/:slug` | `views/storefront/ProductDetail.vue` | — | Trang chi tiết sản phẩm |
| `/checkout` | `views/storefront/Checkout.vue` | `requiresAuth` | Trang thanh toán đơn hàng |
| `/account/orders` | `views/storefront/Account.vue` | `requiresAuth` | Tài khoản & lịch sử đơn hàng |

#### Category slugs hiện có:
| Slug | Tên | Màu pill |
|------|-----|---------|
| `tri-mun` | Trị mụn | Green |
| `chong-nang` | Chống nắng | Orange |
| `duong-am` | Dưỡng ẩm | Sky Blue |
| `tri-nam` | Trị nám | Purple |
| `lam-sang-da` | Làm sáng da | Amber |
| `thuc-pham-chuc-nang` | Thực phẩm chức năng | Teal |
| `cham-soc-co-the` | Chăm sóc cơ thể | Pink |

---

### 2.3. Admin Routes (Layout: `AdminLayout.vue`)

| Path | Component | Guard | Mô tả |
|------|-----------|-------|-------|
| `/dashboard` | `pages/Dashboard.vue` | `requiresAdmin` | Tổng quan |
| `/products` | `pages/Products.vue` | `requiresAdmin` | Quản lý sản phẩm |
| `/batches` | `pages/Batches.vue` | `requiresAdmin` | Quản lý lô hàng |
| `/orders` | `pages/Orders.vue` | `requiresAdmin` | Quản lý đơn hàng |
| `/customers` | `pages/Customers.vue` | `requiresAdmin` | Quản lý khách hàng |
| `/alerts` | `pages/Alerts.vue` | `requiresAdmin` | Cảnh báo tồn kho |
| `/reports` | `pages/Reports.vue` | `requiresAdmin` | Báo cáo |
| `/settings` | `pages/Settings.vue` | `requiresAdmin` | Cài đặt |

---

### 2.4. Warehouse Routes (flat, không layout)

| Path | Component | Mô tả |
|------|-----------|-------|
| `/warehouse` | Redirect → `/warehouse/dashboard` | |
| `/warehouse/dashboard` | `views/warehouse/Dashboard.vue` | Tổng quan kho |
| `/warehouse/products` | `views/warehouse/Products.vue` | Sản phẩm trong kho |
| `/warehouse/batches` | `views/warehouse/Batches.vue` | Quản lý lô hàng |
| `/warehouse/inventory` | `views/warehouse/Inventory.vue` | Tồn kho |
| `/warehouse/alerts` | `views/warehouse/Alerts.vue` | Cảnh báo hết hạn/cạn kho |

---

## 3. KẾT NỐI FRONTEND ↔ BACKEND

> ⚠️ **Hiện tại:** Frontend đang dùng **Mock Data** (Pinia stores). Khi tích hợp thật, cần thay thế theo bảng này:

| Frontend (Mock) | →  | Backend API thực tế |
|----------------|----|---------------------|
| `useAuthStore.login()` | → | `POST /api/login` |
| `useAuthStore.register()` | → | `POST /api/register` |
| `useProductStore` (mock array) | → | `GET /api/products` |
| `useProductStore.getProductBySlug()` | → | `GET /api/products/{product}` |
| `useCartStore` + Checkout submit | → | `POST /api/orders` |
| `Account.vue` orders list | → | `GET /api/orders` |

---

## 4. ĐĂNG NHẬP DEMO (Frontend Mock)

| Email | Password | Role | Redirect sau login |
|-------|----------|------|------------------|
| `admin@test.com` | `password` | Admin | `/dashboard` |
| `warehouse@test.com` | `password` | Warehouse | `/warehouse` |
| `customer@test.com` | `password` | Customer | `/shop` |
