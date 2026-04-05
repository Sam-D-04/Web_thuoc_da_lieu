<script setup>
import { ref } from 'vue';

const props = defineProps({
  categories: Array,
  filters: Object
});

const emit = defineEmits(['change-filter']);

const showCategories = ref(true);
const showPriceRanges = ref(true);

const priceRanges = [
  { label: 'Dưới 50k', min: 0, max: 50000, icon: '💰' },
  { label: '50k - 100k', min: 50000, max: 100000, icon: '💵' },
  { label: '100k - 300k', min: 100000, max: 300000, icon: '💴' },
  { label: 'Trên 300k', min: 300000, max: 999999999, icon: '💎' }
];

function handlePriceFilter(range) {
  emit('change-filter', { min_price: range.min, max_price: range.max });
}

function handleCategoryFilter(categoryId) {
  emit('change-filter', { category_id: categoryId });
}

function clearFilters() {
  emit('change-filter', { category_id: null, min_price: 0, max_price: 999999999 });
}

const isActivePrice = (range) => {
  return props.filters.min_price === range.min && props.filters.max_price === range.max;
};
</script>

<template>
  <aside class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
    <div class="bg-gradient-to-r from-red-600 to-orange-500 text-white p-5">
      <div class="flex items-center justify-between">
        <h2 class="font-bold text-xl flex items-center gap-2">
          <i class="fa-solid fa-magnifying-glass"></i>
          <span>Bộ Lọc</span>
        </h2>
        <button 
          v-if="props.filters.category_id || props.filters.min_price > 0 || props.filters.max_price < 999999999"
          @click="clearFilters"
          class="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition">
          Xóa bộ lọc
        </button>
      </div>
    </div>

    <div class="p-5">
      <div class="mb-8">
        <button 
          @click="showCategories = !showCategories"
          class="w-full flex items-center justify-between mb-4 hover:text-red-600 transition">
          <h3 class="font-bold text-lg flex items-center gap-2">
            <i class="fa-solid fa-folder-open text-xl"></i>
            <span>Danh Mục</span>
          </h3>
          <i
            class="fa-solid fa-chevron-down text-gray-400 transition-transform"
            :class="{ 'rotate-180': !showCategories }"
          ></i>
        </button>

        <div v-show="showCategories" class="space-y-2 animate-slide-down">
          <button
            @click="handleCategoryFilter(null)"
            class="w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-between group"
            :class="!props.filters.category_id 
              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg' 
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'">
            <span class="flex items-center gap-2">
              <i class="fa-solid fa-store text-lg"></i>
              <span>Tất cả</span>
            </span>
            <span v-if="!props.filters.category_id" class="text-white">✓</span>
          </button>

          <button
            v-for="cat in props.categories"
            :key="cat.id"
            @click="handleCategoryFilter(cat.id)"
            class="w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-between group"
            :class="props.filters.category_id === cat.id 
              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg' 
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'">
            <span class="flex items-center gap-2">
              <i class="fa-solid fa-box text-lg"></i>
              <span>{{ cat.name }}</span>
            </span>
            <span v-if="props.filters.category_id === cat.id" class="text-white">✓</span>
          </button>
        </div>
      </div>

      <div class="mb-8 pb-8 border-b border-gray-200">
        <button 
          @click="showPriceRanges = !showPriceRanges"
          class="w-full flex items-center justify-between mb-4 hover:text-red-600 transition">
          <h3 class="font-bold text-lg flex items-center gap-2">
            <i class="fa-solid fa-money-bill-wave text-xl"></i>
            <span>Khoảng Giá</span>
          </h3>
          <i
            class="fa-solid fa-chevron-down text-gray-400 transition-transform"
            :class="{ 'rotate-180': !showPriceRanges }"
          ></i>
        </button>

        <div v-show="showPriceRanges" class="space-y-2 animate-slide-down">
          <button
            v-for="range in priceRanges"
            :key="range.label"
            @click="handlePriceFilter(range)"
            class="w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-between group"
            :class="isActivePrice(range)
              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'">
            <span class="flex items-center gap-2">
              <i class="fa-solid fa-tag text-lg"></i>
              <span>{{ range.label }}</span>
            </span>
            <span v-if="isActivePrice(range)" class="text-white">✓</span>
          </button>
        </div>
      </div>

      <div>
        <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
          <i class="fa-solid fa-bolt text-xl"></i>
          <span>Tiện Ích</span>
        </h3>
        <div class="space-y-2">
          <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
            <input type="checkbox" class="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500">
            <span class="text-sm font-medium text-gray-700">
              <i class="fa-solid fa-truck-fast mr-2"></i>
              Freeship
            </span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
            <input type="checkbox" class="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500">
            <span class="text-sm font-medium text-gray-700">
              <i class="fa-solid fa-fire mr-2"></i>
              Giảm giá
            </span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
            <input type="checkbox" class="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500">
            <span class="text-sm font-medium text-gray-700">
              <i class="fa-solid fa-star mr-2"></i>
              Bán chạy
            </span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
            <input type="checkbox" class="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500">
            <span class="text-sm font-medium text-gray-700">
              <i class="fa-solid fa-wand-magic-sparkles mr-2"></i>
              Hàng mới
            </span>
          </label>
        </div>
      </div>

      <div class="mt-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
        <div class="text-center">
          <i class="fa-solid fa-comments text-3xl mb-2 text-blue-600"></i>
          <h4 class="font-bold text-gray-800 mb-2">Cần hỗ trợ?</h4>
          <p class="text-sm text-gray-600 mb-3">Liên hệ với chúng tôi</p>
          <button class="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition font-semibold text-sm">
            Chat ngay
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
@keyframes slide-down {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}
</style>