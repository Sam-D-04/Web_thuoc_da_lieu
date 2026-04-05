# 🛒 Hệ Thống E-Commerce

Dự án thương mại điện tử được xây dựng với **Laravel 12** (Backend API) và **Vue.js 3** (Frontend SPA). Hệ thống hỗ trợ quản lý sản phẩm, đơn hàng, thanh toán PayPal và có 2 giao diện riêng biệt cho Admin và User.

## 📋 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Cài Đặt và Chạy Dự Án](#cài-đặt-và-chạy-dự-án)
- [Giải Thích Code](#giải-thích-code)
  - [Vue.js Frontend](#vuejs-frontend)
  - [PHP Controllers](#php-controllers)
  - [Models (Eloquent ORM)](#models-eloquent-orm)
  - [API Routes](#api-routes)

---

## 🎯 Giới Thiệu

Đây là một hệ thống e-commerce hoàn chỉnh với các tính năng:

- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm với hình ảnh
- **Quản lý danh mục**: Phân loại sản phẩm theo danh mục
- **Giỏ hàng**: Thêm sản phẩm vào giỏ, cập nhật số lượng
- **Đặt hàng**: Tạo đơn hàng với thông tin giao hàng
- **Thanh toán PayPal**: Tích hợp thanh toán qua PayPal
- **Phân quyền**: Hệ thống Admin và User riêng biệt
- **Xác thực**: Đăng ký, đăng nhập với Laravel Sanctum

---

## 🛠 Công Nghệ Sử Dụng

### Backend (PHP)
- **Laravel 12** - Framework PHP hiện đại
- **Laravel Sanctum** - API Authentication
- **PHP 8.2+** - Ngôn ngữ lập trình
- **MySQL/PostgreSQL** - Cơ sở dữ liệu

### Frontend (JavaScript)
- **Vue.js 3** - Framework JavaScript reactive
- **Vue Router 4** - Routing cho SPA
- **Axios** - HTTP client cho API calls
- **Tailwind CSS 4** - Framework CSS utility-first
- **Vite** - Build tool và dev server

---

## 📁 Cấu Trúc Dự Án

```
project/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/              # API Controllers
│   │   │       ├── AuthController.php
│   │   │       ├── ProductController.php
│   │   │       ├── CategoryController.php
│   │   │       ├── OrderController.php
│   │   │       └── PayPalController.php
│   │   ├── Middleware/           # Middleware (IsAdmin)
│   │   └── Traits/               # Traits (HasRole)
│   └── Models/                    # Eloquent Models
│       ├── User.php
│       ├── Product.php
│       ├── Category.php
│       ├── Order.php
│       └── OrderItem.php
├── resources/
│   ├── js/
│   │   ├── user/                 # Vue.js cho User
│   │   │   ├── app.vue
│   │   │   ├── pages/
│   │   │   │   ├── Home.vue
│   │   │   │   ├── ProductDetail.vue
│   │   │   │   ├── Cart.vue
│   │   │   │   └── Checkout.vue
│   │   │   └── components/
│   │   │       ├── Header.vue
│   │   │       └── ProductCard.vue
│   │   └── admin/                # Vue.js cho Admin
│   │       ├── admin-app.vue
│   │       ├── pages/
│   │       │   ├── AdminDashboard.vue
│   │       │   ├── ProductsPage.vue
│   │       │   └── OrdersPage.vue
│   │       └── components/
│   └── views/
│       ├── user/user.blade.php   # Entry point cho User SPA
│       └── admin/admin.blade.php # Entry point cho Admin SPA
├── routes/
│   ├── api.php                    # API routes
│   └── web.php                    # Web routes
├── database/
│   ├── migrations/                # Database migrations
│   └── seeders/                   # Database seeders
└── public/                        # Public assets
```

---

## 🚀 Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL/PostgreSQL
- NPM hoặc Yarn

### Bước 1: Clone và Cài Đặt Dependencies

```bash
# Clone dự án
git clone <repository-url>
cd project

# Cài đặt PHP dependencies
composer install

# Cài đặt Node.js dependencies
npm install
```

### Bước 2: Cấu Hình Môi Trường

```bash
# Copy file .env.example thành .env
cp .env.example .env

# Tạo application key
php artisan key:generate

# Cấu hình database trong file .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=your_database
# DB_USERNAME=your_username
# DB_PASSWORD=your_password
```

### Bước 3: Chạy Migrations và Seeders

```bash
# Chạy migrations để tạo bảng trong database
php artisan migrate

# Chạy seeders để tạo dữ liệu mẫu (nếu có)
php artisan db:seed
```

### Bước 4: Tạo Storage Link

```bash
# Tạo symbolic link cho storage
php artisan storage:link
```

### Bước 5: Chạy Dự Án

#### Cách 1: Chạy 3 Terminal Riêng Biệt (Recommended)

Mở **3 terminal riêng biệt** và chạy các lệnh sau:

**Terminal 1 - Laravel Server cho User (Port 8000):**
```bash
php artisan serve --port=8000 --env=user
```

**Terminal 2 - Laravel Server cho Admin (Port 8001):**
```bash
php artisan serve --port=8001 --env=admin
```

**Terminal 3 - Vite Dev Server (Vue.js):**
```bash
# Di chuyển vào thư mục resources (nếu cần)
cd resources

# Cài đặt dependencies (nếu chưa cài)
npm install

# Chạy Vite dev server
npm run dev
```

**Lưu ý:** Nếu `npm install` và `npm run dev` không chạy được từ thư mục `resources`, hãy chạy từ thư mục gốc của project:
```bash
# Từ thư mục gốc project/
npm install
npm run dev
```

#### Cách 2: Chạy cùng lúc (Alternative)

```bash
# Chạy tất cả services cùng lúc
composer run dev
```

Lệnh này sẽ chạy:
- Laravel server (port 8000)
- Vite dev server (port 5173)
- Queue worker
- Laravel Pail (logs)

### Truy Cập Ứng Dụng

- **User Interface**: http://localhost:8000
- **Admin Interface**: http://localhost:8001
- **API Endpoints**: http://localhost:8000/api (hoặc http://localhost:8001/api)

### Build cho Production

```bash
# Build assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📖 Giải Thích Code

### Vue.js Frontend

#### Cấu Trúc Vue.js

Dự án sử dụng **Vue.js 3** với Composition API và được chia thành 2 phần:

1. **User App** (`resources/js/user/`)
   - Giao diện cho khách hàng
   - Xem sản phẩm, thêm vào giỏ hàng, đặt hàng

2. **Admin App** (`resources/js/admin/`)
   - Giao diện quản trị
   - Quản lý sản phẩm, đơn hàng, người dùng

#### Ví Dụ: User App (`resources/js/user/app.vue`)

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Cấu hình axios base URL
axios.defaults.baseURL = '/api'

// State management
const user = ref(null)
const router = useRouter()

// Computed properties
const cartCount = computed(() => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  return cart.reduce((sum, item) => sum + item.quantity, 0)
})

// Lifecycle hook - chạy khi component mount
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    try {
      const { data } = await axios.get('/me')
      user.value = data
    } catch {
      // Xử lý lỗi authentication
    }
  }
})
</script>
```

**Giải thích:**
- `setup` script: Sử dụng Composition API của Vue 3
- `ref()`: Tạo reactive state
- `computed()`: Tạo computed property tự động cập nhật
- `onMounted()`: Lifecycle hook chạy sau khi component được mount
- `axios`: Gửi HTTP requests đến Laravel API
- `localStorage`: Lưu trữ token và cart ở client-side

#### Vue Router

Vue Router được cấu hình trong `resources/js/user/user-app.js` và `resources/js/admin/admin-app.js`:

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/product/:id', name: 'product.show', component: ProductDetail },
  { path: '/cart', name: 'cart', component: Cart }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
```

**Giải thích:**
- `createRouter`: Tạo router instance
- `createWebHistory`: Sử dụng HTML5 history mode
- Routes định nghĩa các đường dẫn và component tương ứng

---

### PHP Controllers

Controllers xử lý logic nghiệp vụ và trả về JSON response cho Vue.js frontend.

#### Ví Dụ: ProductController (`app/Http/Controllers/Api/ProductController.php`)

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Lấy danh sách sản phẩm với filter và pagination
    public function index(Request $request)
    {
        $query = Product::with('category'); // Eager loading

        // Filter theo tên
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter theo danh mục
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Sắp xếp
        $sort = $request->get('sort', 'latest');
        if ($sort === 'price_asc') {
            $query->orderBy('price', 'asc');
        }

        // Pagination
        return response()->json($query->paginate(12));
    }

    // Tạo sản phẩm mới (chỉ Admin)
    public function store(Request $request)
    {
        // Kiểm tra quyền Admin
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate dữ liệu
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048'
        ]);

        // Upload hình ảnh
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = $path;
        }

        // Tạo sản phẩm
        $product = Product::create($validated);
        return response()->json($product, 201);
    }
}
```

**Giải thích:**
- `Controller`: Base controller của Laravel
- `Request $request`: HTTP request object chứa dữ liệu từ client
- `Product::with('category')`: Eager loading để tránh N+1 query
- `$request->validate()`: Validate dữ liệu đầu vào
- `response()->json()`: Trả về JSON response
- `$request->user()`: Lấy user đã authenticated (từ Sanctum token)

#### AuthController - Xử Lý Authentication

```php
public function login(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required|string'
    ]);

    $user = User::where('email', $validated['email'])->first();

    // Kiểm tra password
    if (!$user || !Hash::check($validated['password'], $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    // Tạo Sanctum token
    $token = $user->createToken('api_token')->plainTextToken;

    return response()->json(['user' => $user, 'token' => $token]);
}
```

**Giải thích:**
- `Hash::check()`: So sánh password với hash trong database
- `createToken()`: Tạo Sanctum token cho API authentication
- Token được trả về cho frontend, frontend lưu vào localStorage

---

### Models (Eloquent ORM)

Models đại diện cho các bảng trong database và định nghĩa relationships.

#### Ví Dụ: Product Model (`app/Models/Product.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // Các trường có thể mass assign
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'stock',
        'image',
        'discount_percent'
    ];

    // Type casting
    protected $casts = [
        'price' => 'float',
        'stock' => 'integer'
    ];

    // Accessor - tự động thêm vào JSON response
    protected $appends = ['image_url', 'price_after_discount'];

    // Relationship: Product belongs to Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relationship: Product has many OrderItems
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Accessor: Lấy URL đầy đủ của hình ảnh
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        return Storage::disk('public')->url($this->image);
    }

    // Accessor: Tính giá sau khi giảm
    public function getPriceAfterDiscountAttribute()
    {
        if (!$this->discount_percent) {
            return $this->price;
        }
        return round($this->price * (100 - $this->discount_percent) / 100);
    }
}
```

**Giải thích:**
- `$fillable`: Các trường có thể gán trực tiếp qua `create()` hoặc `update()`
- `$casts`: Tự động convert kiểu dữ liệu (string → float, integer)
- `$appends`: Tự động thêm accessor vào JSON response
- `belongsTo()`: Relationship nhiều-một (Product thuộc về 1 Category)
- `hasMany()`: Relationship một-nhiều (Product có nhiều OrderItem)
- `getXxxAttribute()`: Accessor, tự động gọi khi truy cập `$product->image_url`

#### Ví Dụ: Order Model

```php
class Order extends Model
{
    protected $fillable = [
        'user_id',
        'total',
        'status',
        'shipping_name',
        'shipping_address'
    ];

    // Relationship: Order belongs to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship: Order has many OrderItems
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
```

**Các loại Relationship trong Laravel:**
- `belongsTo()`: Nhiều → Một (Order thuộc về User)
- `hasMany()`: Một → Nhiều (User có nhiều Order)
- `hasOne()`: Một → Một
- `belongsToMany()`: Nhiều → Nhiều (với pivot table)

---

### API Routes

Routes định nghĩa các endpoint API và middleware bảo vệ.

#### File: `routes/api.php`

```php
<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

// Public routes - không cần authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Protected routes - cần authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    // Admin only routes
    Route::middleware('admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    });
});
```

**Giải thích:**
- `Route::get/post/put/delete()`: Định nghĩa HTTP methods
- `{product}`: Route parameter, tự động inject vào controller
- `middleware('auth:sanctum')`: Bảo vệ route, yêu cầu Sanctum token
- `middleware('admin')`: Custom middleware kiểm tra role admin
- `group()`: Nhóm các routes để áp dụng middleware chung

#### Middleware: IsAdmin (`app/Http/Middleware/IsAdmin.php`)

```php
public function handle(Request $request, Closure $next)
{
    if ($request->user() && $request->user()->role === 'admin') {
        return $next($request);
    }
    
    return response()->json(['message' => 'Forbidden'], 403);
}
```

---

## 🔐 Authentication Flow

1. **User đăng nhập** → Gửi email/password đến `/api/login`
2. **Laravel kiểm tra** → Verify credentials
3. **Tạo token** → `$user->createToken('api_token')`
4. **Trả về token** → Frontend lưu vào `localStorage`
5. **Gửi token** → Mỗi request kèm header: `Authorization: Bearer {token}`
6. **Laravel xác thực** → Middleware `auth:sanctum` verify token
7. **Lấy user** → `$request->user()` trả về user đã authenticated

---

## 📝 Tóm Tắt

- **Frontend (Vue.js)**: SPA với Vue Router, gọi API qua Axios
- **Backend (Laravel)**: RESTful API, xử lý logic nghiệp vụ
- **Models**: Eloquent ORM với relationships
- **Controllers**: Xử lý requests, validate, trả về JSON
- **Routes**: Định nghĩa endpoints và middleware
- **Authentication**: Laravel Sanctum với token-based auth

---

## 📚 Tài Liệu Tham Khảo

- [Laravel Documentation](https://laravel.com/docs)
- [Vue.js Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)

---

## 📄 License

MIT License
