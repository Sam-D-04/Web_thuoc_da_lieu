<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import FilterSidebar from '../components/FilterSidebar.vue';
import ProductCard from '../components/ProductCard.vue';

const props = defineProps({
  user: Object
});

const emit = defineEmits(['navigate']);
const route = useRoute();

axios.defaults.baseURL = '/api';

const products = ref([]);
const categories = ref([]);
const filters = ref({ 
  category_id: null, 
  min_price: 0, 
  max_price: 999999999,
  search: ''
});
const sort = ref('latest');
const currentPage = ref(1);
const totalPages = ref(1);
const showFilters = ref(false);
const loading = ref(true);

onMounted(() => {
  if (route.query.category) {
    filters.value.category_id = parseInt(route.query.category);
  }
  if (route.query.search) {
    filters.value.search = route.query.search;
  }
  
  fetchCategories();
  fetchProducts();
});

watch(() => route.query, (newQuery) => {
  if (newQuery.category) {
    filters.value.category_id = parseInt(newQuery.category);
    fetchProducts();
  }
  if (newQuery.search) {
    filters.value.search = newQuery.search;
    fetchProducts();
  }
});

async function fetchCategories() {
  try {
    const { data } = await axios.get('/categories');
    categories.value = data;
  } catch (e) {
    console.error(e);
  }
}

async function fetchProducts() {
  loading.value = true;
  try {
    const params = { 
      ...filters.value, 
      sort: sort.value, 
      page: currentPage.value 
    };
    
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '' || 
          (key === 'min_price' && params[key] === 0) ||
          (key === 'max_price' && params[key] === 999999999)) {
        delete params[key];
      }
    });

    const { data } = await axios.get('/products', { params });
    
    products.value = data.data;
    currentPage.value = data.current_page;
    totalPages.value = data.last_page;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function handleFilterChange(newFilters) {
  filters.value = { ...filters.value, ...newFilters };
  currentPage.value = 1;
  fetchProducts();
}

function handleSortChange() {
  fetchProducts();
}

function handlePageChange(page) {
  currentPage.value = page;
  fetchProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addToCart(product) {
  if (!props.user) {
    alert('Vui lòng đăng nhập trước');
    emit('navigate', 'auth');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(item => item.product_id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ product_id: product.id, quantity: 1, product });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  
  const notification = document.createElement('div');
  notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
  notification.textContent = '✓ Đã thêm vào giỏ hàng!';
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}
</script>

<template>
  <div class="bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <button @click="emit('navigate', 'home')" class="hover:text-red-600 flex items-center gap-1">
            <i class="fa-solid fa-house"></i>
            <span>Trang chủ</span>
          </button>
          <span>/</span>
          <span class="text-gray-800 font-medium">Sản phẩm</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:hidden mb-4">
          <button
            @click="showFilters = !showFilters"
            class="w-full px-4 py-3 bg-white rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition">
            <span class="font-semibold flex items-center gap-2">
              <i class="fa-solid fa-filter"></i>
              <span>Bộ lọc</span>
            </span>
            <i :class="showFilters ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
          </button>
        </div>

        <aside :class="['lg:col-span-1', showFilters ? 'block' : 'hidden lg:block']">
          <div class="sticky top-4">
            <FilterSidebar
              :categories="categories"
              :filters="filters"
              @change-filter="handleFilterChange" />
          </div>
        </aside>

        <main class="lg:col-span-3">
          <div class="mb-6 bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-box text-2xl text-gray-600"></i>
              <p class="text-gray-700 font-medium">
                Tìm thấy <span class="text-red-600 font-bold">{{ products.length }}</span> sản phẩm
              </p>
            </div>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <label class="text-sm text-gray-600 whitespace-nowrap">Sắp xếp:</label>
              <select
                v-model="sort"
                @change="handleSortChange"
                class="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition">
                <option value="latest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp → Cao</option>
                <option value="price_desc">Giá: Cao → Thấp</option>
                <option value="popular">Bán chạy</option>
              </select>
            </div>
          </div>

          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="bg-white rounded-2xl shadow-md animate-pulse">
              <div class="w-full h-56 bg-gray-200"></div>
              <div class="p-5 space-y-3">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <div v-else-if="products.length > 0" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
                :user="props.user"
                @view="emit('navigate', 'product', { id: $event })"
                @add-to-cart="addToCart" />
            </div>

            <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
              <button
                @click="handlePageChange(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-4 py-2 bg-white rounded-lg shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                <i class="fa-solid fa-angle-left"></i>
                <span>Trước</span>
              </button>
              
              <div class="flex gap-2">
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="handlePageChange(page)"
                  :class="[
                    'px-4 py-2 rounded-lg font-semibold transition',
                    page === currentPage
                      ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                      : 'bg-white hover:bg-gray-50 shadow'
                  ]">
                  {{ page }}
                </button>
              </div>

              <button
                @click="handlePageChange(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-white rounded-lg shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                <span>Sau</span>
                <i class="fa-solid fa-angle-right"></i>
              </button>
            </div>
          </div>

          <div v-else class="text-center py-20">
            <div class="text-8xl mb-6">
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
            <p class="text-gray-500 mb-6">Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
            <button
              @click="filters = { category_id: null, min_price: 0, max_price: 999999999, search: '' }; fetchProducts()"
              class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg">
              Xóa bộ lọc
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
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