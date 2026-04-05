<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = '/api';

const user = ref(null);
const loading = ref(true);
const error = ref(null);
const activeTab = ref('info');

const emit = defineEmits(['navigate']);

onMounted(async () => {
  try {
    const { data } = await axios.get('/me');
    user.value = data;
  } catch (e) {
    error.value = 'Không thể lấy thông tin người dùng';
  } finally { loading.value = false; }
});

async function handleLogout() {
  try {
    await axios.post('/logout');
  } catch (_) {}
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  window.location.reload();
}

const orders = ref([]);
const ordersLoading = ref(false);
const ordersError = ref('');

function formatCurrency(value) {
  if (!value && value !== 0) return '';
  return Number(value).toLocaleString('vi-VN') + '₫';
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('vi-VN');
}

function getStatusMeta(status) {
  const s = (status || '').toString().toLowerCase();
  if (s === 'pending') {
    return { label: 'Chờ xác nhận', cls: 'bg-yellow-100 text-yellow-700', icon: 'fa-clock' };
  }
  if (s === 'processing') {
    return { label: 'Đang xử lý', cls: 'bg-blue-100 text-blue-700', icon: 'fa-gear' };
  }
  if (s === 'shipping') {
    return { label: 'Đang giao', cls: 'bg-indigo-100 text-indigo-700', icon: 'fa-truck-fast' };
  }
  if (s === 'completed' || s === 'success') {
    return { label: 'Hoàn thành', cls: 'bg-green-100 text-green-700', icon: 'fa-circle-check' };
  }
  if (s === 'cancelled' || s === 'canceled') {
    return { label: 'Đã hủy', cls: 'bg-red-100 text-red-700', icon: 'fa-circle-xmark' };
  }
  return { label: status || 'Không rõ', cls: 'bg-gray-100 text-gray-700', icon: 'fa-circle-question' };
}

async function fetchOrders() {
  ordersLoading.value = true;
  ordersError.value = '';
  try {
    const { data } = await axios.get('/orders');
    orders.value = data?.data || data || [];
  } catch (e) {
    ordersError.value = e?.response?.data?.message || 'Không thể tải danh sách đơn hàng';
  } finally {
    ordersLoading.value = false;
  }
}

watch(activeTab, (val) => {
  if (val === 'myorders' && !orders.value.length && !ordersLoading.value) {
    fetchOrders();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
    <div class="max-w-5xl mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <i class="fa-solid fa-user text-red-600"></i>
          <span>Tài Khoản Của Tôi</span>
        </h1>
        <p class="text-gray-600">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">Đang tải...</p>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
          <div class="text-6xl mb-4 text-red-600">
            <i class="fa-solid fa-circle-xmark"></i>
          </div>
          <p class="text-red-600 text-xl mb-6">{{ error }}</p>
          <button 
            @click="window.location.reload()" 
            class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Thử lại
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white text-center">
              <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-3 flex items-center justify-center text-4xl font-bold">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <h2 class="font-bold text-xl mb-1">{{ user.name }}</h2>
              <p class="text-sm opacity-90">{{ user.email }}</p>
            </div>

            <div class="p-2">
              <button
                @click="activeTab = 'info'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium',
                  activeTab === 'info' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
                ]">
                <i class="fa-solid fa-id-card"></i>
                <span>Thông tin cá nhân</span>
              </button>

              <button
                @click="activeTab = 'myorders'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium',
                  activeTab === 'myorders' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
                ]">
                <i class="fa-solid fa-box"></i>
                <span>Đơn hàng của tôi</span>
              </button>

              <button
                @click="activeTab = 'security'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium',
                  activeTab === 'security' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
                ]">
                <i class="fa-solid fa-lock"></i>
                <span>Bảo mật</span>
              </button>

              <hr class="my-2">

              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3 font-medium">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3">
          <div v-if="activeTab === 'info'" class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i class="fa-solid fa-id-card text-red-600"></i>
              <span>Thông tin cá nhân</span>
            </h2>

            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 rounded-lg p-5">
                  <label class="block text-sm font-semibold text-gray-600 mb-2">Họ và tên</label>
                  <p class="text-lg font-semibold text-gray-800">{{ user.name }}</p>
                </div>

                <div class="bg-gray-50 rounded-lg p-5">
                  <label class="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                  <p class="text-lg font-semibold text-gray-800">{{ user.email }}</p>
                </div>

                <div class="bg-gray-50 rounded-lg p-5">
                  <label class="block text-sm font-semibold text-gray-600 mb-2">Vai trò</label>
                  <span :class="[
                    'inline-block px-4 py-1 rounded-full text-sm font-semibold',
                    user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  ]">
                    <i v-if="user.role === 'admin'" class="fa-solid fa-crown mr-1"></i>
                    <i v-else class="fa-solid fa-user mr-1"></i>
                    {{ user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng' }}
                  </span>
                </div>

                <div class="bg-gray-50 rounded-lg p-5">
                  <label class="block text-sm font-semibold text-gray-600 mb-2">Thành viên từ</label>
                  <p class="text-lg font-semibold text-gray-800">{{ new Date().getFullYear() }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'myorders'" class="bg-white rounded-xl shadow-lg p-8">
            <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <i class="fa-solid fa-receipt text-red-600"></i>
                  <span>Đơn hàng của tôi</span>
                </h2>
                <p class="text-gray-500 text-sm md:text-base">
                  Xem lịch sử mua hàng và theo dõi trạng thái đơn hàng
                </p>
              </div>
              <div class="flex items-center gap-3">
                <div
                  v-if="orders.length"
                  class="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2 text-sm text-gray-700 border border-gray-100"
                >
                  <i class="fa-solid fa-box-archive text-red-500"></i>
                  <span>
                    Tổng
                    <span class="font-semibold text-red-600">{{ orders.length }}</span>
                    đơn hàng
                  </span>
                </div>
              </div>
            </div>

            <div v-if="ordersLoading" class="space-y-4">
              <div
                v-for="i in 3"
                :key="i"
                class="bg-gray-50 rounded-2xl border border-gray-100 p-5 animate-pulse"
              >
                <div class="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div class="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>

            <div
              v-else-if="ordersError"
              class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3"
            >
              <i class="fa-solid fa-circle-exclamation mt-1"></i>
              <div>
                <p class="font-semibold mb-1">Có lỗi xảy ra</p>
                <p class="text-sm">{{ ordersError }}</p>
              </div>
            </div>

            <div v-else-if="orders.length === 0" class="text-center py-12">
              <div class="text-7xl mb-4 text-gray-300">
                <i class="fa-solid fa-box-open"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-700 mb-2">
                Bạn chưa có đơn hàng nào
              </h3>
              <p class="text-gray-500 mb-6">
                Bắt đầu mua sắm để tận hưởng các ưu đãi và sản phẩm chất lượng
              </p>
              <button
                @click="emit('navigate', 'products')"
                class="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:shadow-lg transition font-semibold text-sm md:text-base flex items-center gap-2 mx-auto"
              >
                <i class="fa-solid fa-bag-shopping"></i>
                <span>Mua sắm ngay</span>
              </button>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="order in orders"
                :key="order.id"
                class="bg-gray-50 rounded-2xl border border-gray-100 p-5 hover:shadow-md transition"
              >
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <div class="flex items-center gap-3 mb-1">
                      <span class="text-xs uppercase tracking-wide text-gray-400">
                        MÃ ĐƠN
                      </span>
                      <span class="font-semibold text-gray-800">
                        #{{ order.code || order.id }}
                      </span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <div class="flex items-center gap-1">
                        <i class="fa-solid fa-calendar-day"></i>
                        <span>Ngày đặt: {{ formatDate(order.created_at || order.createdAt) }}</span>
                      </div>
                      <div
                        v-if="order.shipping_name || order.shipping_phone"
                        class="flex items-center gap-1"
                      >
                        <i class="fa-solid fa-user"></i>
                        <span>
                          {{ order.shipping_name }}{{ order.shipping_phone ? ' • ' + order.shipping_phone : '' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center gap-3 md:justify-end">
                    <div
                      class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                      :class="getStatusMeta(order.status).cls"
                    >
                      <i :class="['fa-solid', getStatusMeta(order.status).icon]"></i>
                      <span>{{ getStatusMeta(order.status).label }}</span>
                    </div>
                    <div class="text-right">
                      <div class="text-xs text-gray-400">Tổng tiền</div>
                      <div class="text-lg font-bold text-red-600">
                        {{ formatCurrency(order.total_amount || order.total || order.amount) }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div class="space-y-1">
                    <div class="font-semibold text-gray-800 flex items-center gap-2">
                      <i class="fa-solid fa-location-dot text-red-500"></i>
                      <span>Địa chỉ giao hàng</span>
                    </div>
                    <p class="text-gray-600 whitespace-pre-line">
                      {{ order.shipping_address || 'Chưa có địa chỉ' }}
                    </p>
                  </div>

                  <div class="space-y-1">
                    <div class="font-semibold text-gray-800 flex items-center gap-2">
                      <i class="fa-solid fa-wallet text-emerald-500"></i>
                      <span>Thanh toán</span>
                    </div>
                    <p class="text-gray-600">
                      {{ order.payment_method || 'Ship code' }}
                    </p>
                    <p v-if="order.paid_at" class="text-xs text-gray-400">
                      Đã thanh toán lúc {{ formatDate(order.paid_at) }}
                    </p>
                  </div>

                  <div class="space-y-1">
                    <div class="font-semibold text-gray-800 flex items-center gap-2">
                      <i class="fa-solid fa-circle-info text-blue-500"></i>
                      <span>Thông tin</span>
                    </div>
                    <p class="text-gray-600">
                      Số lượng sản phẩm:
                      <span class="font-semibold">
                        {{ Array.isArray(order.items) ? order.items.length : (order.items_count || order.quantity || 0) }}
                      </span>
                    </p>
                    <p v-if="order.note" class="text-xs text-gray-500">
                      Ghi chú: {{ order.note }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div v-if="activeTab === 'security'" class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i class="fa-solid fa-shield-halved text-red-600"></i>
              <span>Bảo mật tài khoản</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
