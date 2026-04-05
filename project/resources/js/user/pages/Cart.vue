<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  user: Object
});

const emit = defineEmits(['navigate']);

const cart = ref([]);
const cartItems = ref([]);

onMounted(() => {
  loadCart();
});

function loadCart() {
  cart.value = JSON.parse(localStorage.getItem('cart') || '[]');
  cartItems.value = cart.value.map(item => ({
    ...item,
    product: item.product || {}
  }));
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeItem(productId);
    return;
  }

  const item = cart.value.find(i => i.product_id === productId);
  if (item) {
    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart.value));
    loadCart();
  }
}

function removeItem(productId) {
  cart.value = cart.value.filter(i => i.product_id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart.value));
  loadCart();
}

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = item.product.price_after_discount || item.product.price || 0;
    return sum + price * item.quantity;
  }, 0);
});

const shipping = computed(() => subtotal.value > 500000 ? 0 : 30000);
const total = computed(() => subtotal.value + shipping.value);
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
    <div class="max-w-7xl mx-auto px-4">

      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          [Cart] Giỏ Hàng Của Bạn
        </h1>
        <p class="text-gray-600">{{ cartItems.length }} sản phẩm trong giỏ hàng</p>
      </div>

      <div v-if="cartItems.length === 0" class="text-center py-20">
        <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
          <div class="text-5xl mb-6 text-gray-400">[Cart]</div>
          <h2 class="text-3xl font-bold text-gray-800 mb-3">Giỏ hàng trống</h2>
          <p class="text-gray-500 mb-8">Hãy thêm sản phẩm vào giỏ để tiếp tục mua sắm</p>
          <button
            @click="emit('navigate', 'home')"
            class="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-lg">
            [Home] Về trang chủ
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartItems"
            :key="item.product_id"
            class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group">

            <div class="flex gap-6">
              <div class="flex-shrink-0">
                <div class="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    v-if="item.product.image_url"
                    :src="item.product.image_url"
                    alt=""
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                    [Product]
                  </div>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-lg text-gray-800 mb-2 truncate">
                  {{ item.product.name }}
                </h3>

                <div class="flex items-baseline gap-3 mb-4">
                  <p class="text-2xl font-bold text-red-600">
                    {{ (item.product.price_after_discount || item.product.price).toLocaleString() }}đ
                  </p>
                  <p v-if="item.product.discount_percent" class="text-sm text-gray-400 line-through">
                    {{ item.product.price.toLocaleString() }}đ
                  </p>
                  <span v-if="item.product.discount_percent" class="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                    -{{ item.product.discount_percent }}%
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button 
                      @click="updateQuantity(item.product_id, item.quantity - 1)"
                      class="w-10 h-10 bg-white rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 font-bold shadow-sm">
                      -
                    </button>

                    <span class="px-4 py-2 font-semibold text-lg min-w-[3rem] text-center">
                      {{ item.quantity }}
                    </span>

                    <button 
                      @click="updateQuantity(item.product_id, item.quantity + 1)"
                      class="w-10 h-10 bg-white rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 font-bold shadow-sm">
                      +
                    </button>
                  </div>

                  <button
                    @click="removeItem(item.product_id)"
                    class="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-all">
                    [Delete] Xóa
                  </button>
                </div>

                <div class="mt-3 text-right">
                  <span class="text-gray-600 text-sm">Tổng: </span>
                  <span class="text-xl font-bold text-gray-800">
                    {{ ((item.product.price_after_discount || item.product.price) * item.quantity).toLocaleString() }}đ
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-6 sticky top-4">

            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              [Summary] Tóm tắt đơn hàng
            </h2>

            <div class="space-y-4 mb-6 pb-6 border-b-2 border-gray-100">
              <div class="flex justify-between text-gray-700">
                <span>Tạm tính:</span>
                <span class="font-semibold">{{ subtotal.toLocaleString() }}đ</span>
              </div>

              <div class="flex justify-between text-gray-700">
                <span>Phí vận chuyển:</span>
                <span class="font-semibold">
                  <span v-if="shipping === 0" class="text-green-600">Miễn phí</span>
                  <span v-else>{{ shipping.toLocaleString() }}đ</span>
                </span>
              </div>

              <div v-if="subtotal < 500000 && subtotal > 0" class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <p class="text-sm text-yellow-800">
                  [Info] Mua thêm {{ (500000 - subtotal).toLocaleString() }}đ để được freeship
                </p>
              </div>
            </div>

            <div class="flex justify-between items-center text-xl font-bold mb-6 bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg">
              <span class="text-gray-800">Tổng cộng:</span>
              <span class="text-red-600 text-2xl">{{ total.toLocaleString() }}đ</span>
            </div>

            <button
              @click="emit('navigate', 'checkout')"
              class="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 group">
              [Checkout] Thanh toán
            </button>

            <button
              @click="emit('navigate', 'home')"
              class="w-full mt-3 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold">
              [Home] Tiếp tục mua sắm
            </button>

            <div class="mt-6 pt-6 border-t space-y-3">
              <div class="flex items-center gap-3 text-sm text-gray-600">
                [Secure] Thanh toán bảo mật
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-600">
                [Shipping] Giao hàng nhanh 2-3 ngày
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-600">
                [Return] Đổi trả trong 7 ngày
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  </div>
</template>
