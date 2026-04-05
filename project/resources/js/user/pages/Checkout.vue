<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import QrcodeVue from 'qrcode.vue';

const props = defineProps({
  user: Object
});

const emit = defineEmits(['navigate']);

axios.defaults.baseURL = '/api';

const cart = ref([]);
const loading = ref(false);
const showLogin = ref(false);
const loginForm = ref({ email: '', password: '' });
const loginLoading = ref(false);
const loginErrors = ref(null);

const form = ref({
  shipping_name: props.user?.name || '',
  shipping_phone: '',
  shipping_address: ''
});

const toast = ref({
  show: false,
  message: '',
  type: 'success' // 'success' | 'error' | 'info'
});

// QR Code data - có thể là thông tin đơn hàng hoặc link thanh toán
const qrData = computed(() => {
  if (cart.value.length === 0) return '';
  const orderInfo = {
    items: cart.value.map(item => ({
      id: item.product_id,
      name: item.product?.name,
      qty: item.quantity,
      price: item.product?.price_after_discount || item.product?.price || 0
    })),
    total: total.value,
    timestamp: new Date().toISOString()
  };
  return JSON.stringify(orderInfo);
});

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}

const paypalLoaded = ref(false);

onMounted(() => {
  cart.value = JSON.parse(localStorage.getItem('cart') || '[]');
  if (!props.user) {
    showLogin.value = true;
  }
  loadPayPalScript();
});

const total = computed(() => {
  return cart.value.reduce((sum, item) => {
    const price = item.product?.price_after_discount || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
});

function loadPayPalScript() {
  if (paypalLoaded.value) return;

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  if (!clientId) {
    console.warn('Missing VITE_PAYPAL_CLIENT_ID');
    return;
  }

  const script = document.createElement('script');
  script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
  script.onload = () => {
    paypalLoaded.value = true;
    renderPayPalButtons();
  };
  document.body.appendChild(script);
}

function renderPayPalButtons() {
  if (!paypalLoaded.value || !window.paypal || total.value <= 0) return;

  const container = document.getElementById('paypal-button-container');
  if (!container) return;
  container.innerHTML = '';

  window.paypal.Buttons({
    createOrder: async () => {
      const { data } = await axios.post('/paypal/create-order', {
        amount: (total.value / 23000).toFixed(2) // ví dụ convert VND -> USD tạm
      });
      return data.id;
    },
    onApprove: async (data) => {
      try {
        loading.value = true;
        const payload = {
          order_id: data.orderID,
          items: cart.value.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
          })),
          shipping_name: form.value.shipping_name,
          shipping_phone: form.value.shipping_phone,
          shipping_address: form.value.shipping_address
        };

        const resp = await axios.post('/paypal/capture-order', payload);
        showToast('Thanh toán PayPal thành công! Đơn #' + resp.data.order.id, 'success');
        localStorage.removeItem('cart');
        emit('navigate', 'home');
      } catch (e) {
        console.error(e);
        showToast('Lỗi khi xác nhận PayPal: ' + (e.response?.data?.message || 'Thất bại'), 'error');
      } finally {
        loading.value = false;
      }
    },
    onError: (err) => {
      console.error(err);
      showToast('Lỗi PayPal, vui lòng thử lại', 'error');
    }
  }).render('#paypal-button-container');
}

watch(total, () => {
  if (paypalLoaded.value) renderPayPalButtons();
});

async function handleLogin() {
  if (!loginForm.value.email || !loginForm.value.password) {
    loginErrors.value = 'Vui lòng nhập đầy đủ email và mật khẩu';
    showToast(loginErrors.value, 'error');
    return;
  }

  loginLoading.value = true;
  loginErrors.value = null;
  try {
    const { data } = await axios.post('/login', loginForm.value);
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    showToast('Đăng nhập thành công!', 'success');
    showLogin.value = false;
    form.value.shipping_name = data.user.name || '';
    // Reload để cập nhật user state
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (e) {
    const errorMsg = e.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu';
    loginErrors.value = errorMsg;
    showToast(errorMsg, 'error');
  } finally {
    loginLoading.value = false;
  }
}


async function submitOrder() {
  if (!props.user) {
    showToast('Vui lòng đăng nhập để đặt hàng', 'error');
    showLogin.value = true;
    return;
  }

  if (!form.value.shipping_name || !form.value.shipping_phone || !form.value.shipping_address) {
    showToast('Vui lòng điền đầy đủ thông tin giao hàng', 'error');
    return;
  }

  loading.value = true;
  try {
    const payload = {
      items: cart.value.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      })),
      ...form.value
    };

    const { data } = await axios.post('/orders', payload);
    showToast('Đặt hàng (COD) thành công! Mã đơn: ' + data.id, 'success');
    localStorage.removeItem('cart');
    emit('navigate', 'home');
  } catch (e) {
    if (e.response?.status === 401) {
      showToast('Vui lòng đăng nhập để đặt hàng', 'error');
      showLogin.value = true;
    } else {
      showToast('Lỗi: ' + (e.response?.data?.message || 'Đặt hàng thất bại'), 'error');
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 flex items-center gap-3">
      <i class="fa-solid fa-credit-card text-red-600 text-3xl"></i>
      Thanh toán
    </h1>

    <!-- Login Modal/Form -->
    <div
      v-if="showLogin && !user"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="showLogin = false"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Đăng nhập để tiếp tục</h2>
          <button
            @click="showLogin = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <div v-if="loginErrors" class="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
          <p class="text-sm text-red-700">{{ loginErrors }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input
              v-model="loginForm.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Mật khẩu</label>
            <input
              v-model="loginForm.password"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            :disabled="loginLoading"
            class="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold disabled:bg-gray-400"
          >
            {{ loginLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
          </button>
        </form>


        <p class="text-center text-sm text-gray-600 mt-4">
          Chưa có tài khoản?
          <button
            @click="emit('navigate', 'auth')"
            class="text-red-600 hover:underline font-semibold"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-2xl font-bold mb-6">Thông tin giao hàng</h2>
          <form @submit.prevent="submitOrder" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Họ và tên *</label>
              <input
                v-model="form.shipping_name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">Số điện thoại *</label>
              <input
                v-model="form.shipping_phone"
                type="tel"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">Địa chỉ giao hàng *</label>
              <textarea
                v-model="form.shipping_address"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                rows="3"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold disabled:bg-gray-400 transition-colors"
            >
              {{ loading ? 'Đang xử lý...' : 'Đặt Hàng' }}
            </button>
          </form>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 h-fit">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
          <i class="fa-solid fa-cart-shopping text-red-600 text-2xl"></i>
          Đơn hàng
        </h2>
        <div class="space-y-3 mb-4 border-b pb-4 max-h-64 overflow-y-auto">
          <div v-for="item in cart" :key="item.product_id" class="flex justify-between text-sm">
            <span>{{ item.product?.name }} x{{ item.quantity }}</span>
            <span class="font-semibold">
              {{ ((item.product?.price_after_discount || item.product?.price || 0) * item.quantity).toLocaleString() }}đ
            </span>
          </div>
        </div>
        <div class="flex justify-between text-lg font-bold mb-4">
          <span>Tổng:</span>
          <span class="text-red-600">{{ total.toLocaleString() }}đ</span>
        </div>

        <!-- QR Code Section -->
        <div v-if="qrData && cart.length > 0" class="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h3 class="text-sm font-semibold mb-2 text-center text-gray-700">
            <i class="fa-solid fa-qrcode text-red-600"></i>
            Mã QR đơn hàng
          </h3>
          <div class="flex justify-center">
            <QrcodeVue
              :value="qrData"
              :size="200"
              :margin="2"
              level="M"
              background="#ffffff"
              foreground="#dc2626"
            />
          </div>
          <p class="text-xs text-center text-gray-500 mt-2">
            Quét mã QR để xem thông tin đơn hàng
          </p>
        </div>

        <button
          type="button"
          :disabled="loading || !user"
          @click="submitOrder"
          class="w-full mb-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold disabled:bg-gray-400"
        >
          {{ loading ? 'Đang xử lý...' : !user ? 'Đăng nhập để đặt hàng' : 'Đặt hàng (COD)' }}
        </button>

        <div class="text-center text-xs text-gray-400 mb-2">hoặc</div>

        <div id="paypal-button-container"></div>
      </div>
    </div>

    <div
      v-if="toast.show"
      class="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium transition-all"
      :class="{
        'bg-green-600 text-white': toast.type === 'success',
        'bg-red-600 text-white': toast.type === 'error',
        'bg-slate-800 text-white': toast.type === 'info'
      }"
    >
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>
