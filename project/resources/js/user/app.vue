<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import axios from 'axios'
import Header from './components/Header.vue'

axios.defaults.baseURL = '/api'

const router = useRouter()
const user = ref(null)

const cartCount = computed(() => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  return cart.reduce((sum, item) => sum + item.quantity, 0)
})

const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
}

onMounted(async () => {
  // Handle Facebook OAuth callback
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  const userParam = urlParams.get('user')
  
  if (token) {
    localStorage.setItem('token', token)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam))
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname)
    router.push({ name: 'home' })
    return
  }

  // Handle error from OAuth
  const error = urlParams.get('error')
  if (error) {
    alert(decodeURIComponent(error))
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  try {
    const { data } = await axios.get('/me')
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common.Authorization
    user.value = null
  }
})

async function handleLogout() {
  try {
    await axios.post('/logout')
  } catch {}

  localStorage.removeItem('token')
  localStorage.removeItem('user')
  delete axios.defaults.headers.common.Authorization
  user.value = null
  router.push({ name: 'home' })
}

function navigateTo(page, params = {}) {
  if (page.startsWith('admin.') && (!user.value || user.value.role !== 'admin')) {
    alert('Bạn không có quyền truy cập')
    return
  }

  const routes = {
    product: () => router.push({ name: 'product.show', params: { id: params.id } }),
    products: () => router.push({ name: 'products', query: params }),
    home: () => router.push({ name: 'home' }),
    cart: () => router.push({ name: 'cart' }),
    checkout: () => router.push({ name: 'checkout' }),
    myorders: () => router.push({ name: 'myorders' }),
    profile: () => router.push({ name: 'profile' }),
    auth: () => router.push({ name: 'auth' })
  }

  if (routes[page]) routes[page]()
  else router.push({ name: page })
}

const isAdmin = computed(() => user.value?.role === 'admin')
const isAdminRoute = computed(() =>
  router.currentRoute.value.path.startsWith('/admin')
)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <Header
      :user="user"
      :cart-count="cartCount"
      @navigate="navigateTo"
      @logout="handleLogout"
    />

    <nav
      v-if="isAdmin && isAdminRoute"
      class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl border-b border-gray-700"
    >
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex flex-wrap gap-2 md:gap-6 items-center">
          <router-link
            :to="{ name: 'admin.dashboard' }"
            class="px-4 py-2 rounded-lg hover:bg-white/10 transition flex items-center gap-2 font-medium"
            active-class="bg-white/20"
          >
            <i class="fa-solid fa-chart-line"></i>
            <span class="hidden sm:inline">Dashboard</span>
          </router-link>

          <router-link
            :to="{ name: 'admin.products' }"
            class="px-4 py-2 rounded-lg hover:bg-white/10 transition flex items-center gap-2 font-medium"
            active-class="bg-white/20"
          >
            <i class="fa-solid fa-box"></i>
            <span class="hidden sm:inline">Sản phẩm</span>
          </router-link>

          <router-link
            :to="{ name: 'admin.categories' }"
            class="px-4 py-2 rounded-lg hover:bg-white/10 transition flex items-center gap-2 font-medium"
            active-class="bg-white/20"
          >
            <i class="fa-solid fa-layer-group"></i>
            <span class="hidden sm:inline">Danh mục</span>
          </router-link>

          <router-link
            :to="{ name: 'admin.orders' }"
            class="px-4 py-2 rounded-lg hover:bg-white/10 transition flex items-center gap-2 font-medium"
            active-class="bg-white/20"
          >
            <i class="fa-solid fa-receipt"></i>
            <span class="hidden sm:inline">Đơn hàng</span>
          </router-link>

          <router-link
            :to="{ name: 'home' }"
            class="ml-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition flex items-center gap-2 font-medium"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span class="hidden sm:inline">Về trang chủ</span>
          </router-link>
        </div>
      </div>
    </nav>

    <main class="min-h-[calc(100vh-64px)]">
      <RouterView
        :user="user"
        @navigate="navigateTo"
        @logout="handleLogout"
      />
    </main>

    <footer class="bg-gray-900 text-gray-300 mt-16">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-white font-bold text-lg mb-4">Về chúng tôi</h3>
            <p class="text-sm">Cửa hàng thương mại điện tử hàng đầu Việt Nam</p>
          </div>
          <div>
            <h3 class="text-white font-bold text-lg mb-4">Chính sách</h3>
            <ul class="space-y-2 text-sm">
              <li><a class="hover:text-white">Đổi trả</a></li>
              <li><a class="hover:text-white">Bảo hành</a></li>
              <li><a class="hover:text-white">Vận chuyển</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold text-lg mb-4">Hỗ trợ</h3>
            <ul class="space-y-2 text-sm">
              <li><a class="hover:text-white">Liên hệ</a></li>
              <li><a class="hover:text-white">FAQ</a></li>
              <li><a class="hover:text-white">Hướng dẫn</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold text-lg mb-4">Theo dõi</h3>
            <div class="flex gap-4">
              <i class="fa-brands fa-facebook-f w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"></i>
              <i class="fa-brands fa-instagram w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"></i>
              <i class="fa-brands fa-linkedin-in w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"></i>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© 2024 E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
