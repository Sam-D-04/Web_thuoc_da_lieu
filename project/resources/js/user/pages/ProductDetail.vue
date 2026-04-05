<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const props = defineProps({
  user: Object
});

const emit = defineEmits(['navigate']);
const route = useRoute();

const product = ref(null);
const quantity = ref(1);
const loading = ref(true);
const relatedProducts = ref([]);

onMounted(async () => {
  await fetchProduct();
  await fetchRelatedProducts();
});

async function fetchProduct() {
  loading.value = true;
  try {
    const { data } = await axios.get(`/products/${route.params.id}`);
    product.value = data;
  } catch (e) {
    console.error(e);
    alert('Không tìm thấy sản phẩm');
    emit('navigate', 'products');
  } finally {
    loading.value = false;
  }
}

async function fetchRelatedProducts() {
  if (!product.value) return;
  
  try {
    const { data } = await axios.get('/products', {
      params: {
        category_id: product.value.category_id,
        per_page: 4
      }
    });
    relatedProducts.value = (data.data || data).filter(p => p.id !== product.value.id).slice(0, 4);
  } catch (e) {
    console.error(e);
  }
}

const canAddToCart = computed(() => {
  return product.value && product.value.stock > 0 && quantity.value <= product.value.stock;
});

function increaseQuantity() {
  if (quantity.value < product.value.stock) {
    quantity.value++;
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

function addToCart() {
  if (!props.user) {
    alert('Vui lòng đăng nhập trước');
    emit('navigate', 'auth');
    return;
  }

  if (!canAddToCart.value) {
    alert('Số lượng không hợp lệ');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(item => item.product_id === product.value.id);

  if (existing) {
    existing.quantity += quantity.value;
  } else {
    cart.push({ 
      product_id: product.value.id, 
      quantity: quantity.value, 
      product: product.value 
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  
  const notification = document.createElement('div');
  notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
  notification.textContent = `✓ Đã thêm ${quantity.value} sản phẩm vào giỏ hàng!`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
  
  quantity.value = 1;
}

function buyNow() {
  addToCart();
  setTimeout(() => {
    emit('navigate', 'checkout');
  }, 500);
}
</script>

<template>
  <div class="bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <!-- Breadcrumb -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <button @click="emit('navigate', 'home')" class="hover:text-red-600">🏠 Trang chủ</button>
          <span>/</span>
          <button @click="emit('navigate', 'products')" class="hover:text-red-600">Sản phẩm</button>
          <span>/</span>
          <span class="text-gray-800 font-medium line-clamp-1">{{ product?.name }}</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
        <div class="grid md:grid-cols-2 gap-8">
          <div class="aspect-square bg-gray-200 rounded-xl"></div>
          <div class="space-y-4">
            <div class="h-8 bg-gray-200 rounded"></div>
            <div class="h-6 bg-gray-200 rounded w-3/4"></div>
            <div class="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Product Detail -->
      <div v-else-if="product" class="space-y-8">
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="grid md:grid-cols-2 gap-8 p-8">
            <!-- Product Image -->
            <div class="space-y-4">
              <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  v-if="product.image_url"
                  :src="product.image_url"
                  :alt="product.name"
                  class="w-full h-full object-cover" />
                <div v-else class="text-9xl">📦</div>
              </div>
              
              <!-- Trust Badges -->
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-blue-50 rounded-lg p-3 text-center">
                  <div class="text-2xl mb-1">✅</div>
                  <div class="text-xs font-semibold text-blue-700">Chính hãng</div>
                </div>
                <div class="bg-green-50 rounded-lg p-3 text-center">
                  <div class="text-2xl mb-1">🚚</div>
                  <div class="text-xs font-semibold text-green-700">Giao nhanh</div>
                </div>
                <div class="bg-purple-50 rounded-lg p-3 text-center">
                  <div class="text-2xl mb-1">🔄</div>
                  <div class="text-xs font-semibold text-purple-700">Đổi trả</div>
                </div>
              </div>
            </div>

            <!-- Product Info -->
            <div class="space-y-6">
              <!-- Category Badge -->
              <div>
                <span class="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                  {{ product.category?.name || 'Sản phẩm' }}
                </span>
              </div>

              <!-- Product Name -->
              <h1 class="text-3xl md:text-4xl font-bold text-gray-800">
                {{ product.name }}
              </h1>

              <!-- Rating & Sold -->
              <div class="flex items-center gap-6">
                <div class="flex items-center gap-2">
                  <div class="flex text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
                  <span class="text-gray-600">(4.8)</span>
                </div>
                <div class="text-gray-600">
                  Đã bán: <span class="font-bold text-gray-800">{{ Math.floor(Math.random() * 1000) + 100 }}</span>
                </div>
              </div>

              <!-- Price -->
              <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
                <div class="flex items-baseline gap-3 mb-2">
                  <span class="text-4xl font-bold text-red-600">
                    {{ (product.price_after_discount || product.price).toLocaleString() }}₫
                  </span>
                  <span v-if="product.discount_percent > 0" class="text-xl text-gray-400 line-through">
                    {{ product.price.toLocaleString() }}₫
                  </span>
                </div>
                <div v-if="product.discount_percent > 0" class="flex items-center gap-2">
                  <span class="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
                    🔥 Giảm {{ product.discount_percent }}%
                  </span>
                  <span class="text-sm text-gray-600">
                    Tiết kiệm {{ (product.price - product.price_after_discount).toLocaleString() }}₫
                  </span>
                </div>
              </div>

              <!-- Stock Status -->
              <div class="flex items-center gap-3">
                <span class="text-gray-700 font-medium">Tình trạng:</span>
                <span 
                  :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  class="px-4 py-2 rounded-full font-semibold">
                  {{ product.stock > 0 ? `✓ Còn ${product.stock} sản phẩm` : '✕ Hết hàng' }}
                </span>
              </div>

              <!-- Quantity Selector -->
              <div v-if="product.stock > 0" class="space-y-3">
                <span class="text-gray-700 font-medium">Số lượng:</span>
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2 bg-gray-100 rounded-xl p-2">
                    <button
                      @click="decreaseQuantity"
                      class="w-10 h-10 bg-white rounded-lg hover:bg-red-600 hover:text-white transition-all font-bold shadow-sm">
                      −
                    </button>
                    <input
                      v-model.number="quantity"
                      type="number"
                      min="1"
                      :max="product.stock"
                      class="w-20 text-center font-bold text-lg bg-transparent border-none focus:outline-none" />
                    <button
                      @click="increaseQuantity"
                      class="w-10 h-10 bg-white rounded-lg hover:bg-red-600 hover:text-white transition-all font-bold shadow-sm">
                      +
                    </button>
                  </div>
                  <span class="text-sm text-gray-500">
                    Còn {{ product.stock }} sản phẩm
                  </span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="grid grid-cols-2 gap-4 pt-4">
                <button
                  @click="addToCart"
                  :disabled="!canAddToCart"
                  class="py-4 bg-white border-2 border-red-600 text-red-600 rounded-xl font-bold text-lg hover:bg-red-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <span class="text-2xl">🛒</span>
                  <span>Thêm vào giỏ</span>
                </button>
                <button
                  @click="buyNow"
                  :disabled="!canAddToCart"
                  class="py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <span class="text-2xl">⚡</span>
                  <span>Mua ngay</span>
                </button>
              </div>

              <!-- Promotions -->
              <div class="bg-blue-50 rounded-xl p-4 space-y-2">
                <div class="font-bold text-blue-900 mb-2">🎁 Ưu đãi đặc biệt</div>
                <div class="text-sm text-blue-700 space-y-1">
                  <div>✓ Miễn phí vận chuyển cho đơn hàng trên 500k</div>
                  <div>✓ Tích điểm thành viên: +{{ Math.floor(product.price / 1000) }} điểm</div>
                  <div>✓ Đổi trả trong 7 ngày nếu có lỗi nhà sản xuất</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Description -->
          <div class="border-t border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">📋 Mô tả sản phẩm</h2>
            <div class="prose max-w-none text-gray-700">
              {{ product.description || 'Đang cập nhật thông tin chi tiết...' }}
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div v-if="relatedProducts.length > 0" class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Sản phẩm liên quan</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div
              v-for="related in relatedProducts"
              :key="related.id"
              @click="emit('navigate', 'product', { id: related.id })"
              class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer group">
              <div class="aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                <img
                  v-if="related.image_url"
                  :src="related.image_url"
                  :alt="related.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                <div v-else class="w-full h-full flex items-center justify-center text-5xl">📦</div>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-gray-800 line-clamp-2 mb-2 text-sm">{{ related.name }}</h3>
                <div class="text-lg font-bold text-red-600">
                  {{ (related.price_after_discount || related.price).toLocaleString() }}₫
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>