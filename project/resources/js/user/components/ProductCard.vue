<script setup>
const props = defineProps({
  product: Object,
  user: Object
});

const emit = defineEmits(['view', 'add-to-cart']);
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
       @click="emit('view', product.id)">
    <div class="relative w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <img 
        v-if="product.image_url" 
        :src="product.image_url" 
        alt="" 
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="text-6xl opacity-30">📦</div>
      </div>

      <div 
        v-if="product.discount_percent > 0" 
        class="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
        <span>🔥</span>
        <span>-{{ product.discount_percent }}%</span>
      </div>

      <div 
        v-if="product.stock === 0"
        class="absolute inset-0 bg-black/50 flex items-center justify-center">
        <span class="bg-white px-4 py-2 rounded-lg font-bold text-gray-800">
          Hết hàng
        </span>
      </div>

      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute bottom-3 left-3 right-3 flex gap-2">
          <button 
            @click.stop="emit('view', product.id)"
            class="flex-1 bg-white text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-sm">
            👁️ Xem
          </button>
        </div>
      </div>
    </div>

    <div class="p-5">
      <h3 class="font-bold text-base text-gray-800 line-clamp-2 mb-3 min-h-[3rem] group-hover:text-red-600 transition">
        {{ product.name }}
      </h3>

      <div class="flex items-center gap-2 mb-3 text-xs text-gray-500">
        <div class="flex text-yellow-400">
          ⭐⭐⭐⭐⭐
        </div>
        <span>|</span>
        <span>Đã bán {{ Math.floor(Math.random() * 500) + 100 }}</span>
      </div>

      <div class="mb-4">
        <div v-if="product.discount_percent > 0" class="space-y-1">
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold text-red-600">
              {{ product.price_after_discount.toLocaleString() }}₫
            </span>
          </div>
          <div class="text-sm text-gray-400 line-through">
            {{ product.price.toLocaleString() }}₫
          </div>
        </div>
        <div v-else>
          <span class="text-2xl font-bold text-red-600">
            {{ product.price.toLocaleString() }}₫
          </span>
        </div>
      </div>

      <div class="mb-4 flex items-center gap-2">
        <div 
          :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
          class="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
          <span v-if="product.stock > 0">✓</span>
          <span v-else>✕</span>
          <span>{{ product.stock > 0 ? `Còn ${product.stock} sp` : 'Hết hàng' }}</span>
        </div>
      </div>

      <button
        @click.stop="emit('add-to-cart', product)"
        :disabled="product.stock === 0"
        class="w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="product.stock > 0 
          ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-xl hover:scale-105' 
          : 'bg-gray-300 text-gray-500'">
        <span class="text-lg">🛒</span>
        <span>{{ product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng' }}</span>
      </button>

      <div v-if="product.stock > 0" class="mt-3 flex items-center justify-center gap-1 text-xs text-gray-600">
        <span>🚚</span>
        <span>Giao hàng nhanh 2h</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>