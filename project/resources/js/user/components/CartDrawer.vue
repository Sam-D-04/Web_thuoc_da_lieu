<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: Array,
  isOpen: Boolean
});

const emit = defineEmits(['close', 'checkout', 'update-quantity', 'remove-item']);

const subtotal = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.product.price_after_discount || item.product.price) * item.quantity, 0);
});

const shipping = computed(() => subtotal.value > 500000 ? 0 : 30000);
const total = computed(() => subtotal.value + shipping.value);
</script>

<template>
  <transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div 
      v-if="props.isOpen" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
      @click="emit('close')">
    </div>
  </transition>
  <transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-300 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full">
    <div 
      v-if="props.isOpen"
      class="fixed right-0 top-0 h-screen w-full sm:w-[450px] bg-white shadow-2xl z-50 flex flex-col" 
      @click.stop>
      <div class="bg-gradient-to-r from-red-600 to-orange-500 text-white p-6 flex-shrink-0">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold flex items-center gap-2">
              <span>🛒</span>
              <span>Giỏ hàng</span>
            </h2>
            <p class="text-sm opacity-90 mt-1">{{ items.length }} sản phẩm</p>
          </div>
          <button 
            @click="emit('close')" 
            class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition text-2xl">
            ✕
          </button>
        </div>
      </div>

      <div v-if="items.length === 0" class="flex-1 flex items-center justify-center p-8">
        <div class="text-center">
          <div class="text-8xl mb-6">🛒</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-3">Giỏ hàng trống</h3>
          <p class="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng</p>
          <button
            @click="emit('close')"
            class="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-semibold">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>

      <div v-else class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        <div
          v-for="item in items"
          :key="item.product.id"
          class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-gray-100">
          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                <img 
                  v-if="item.product.image_url" 
                  :src="item.product.image_url" 
                  alt="" 
                  class="w-full h-full object-cover" 
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                  📦
                </div>
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-gray-800 line-clamp-2 mb-2 text-sm">
                {{ item.product.name }}
              </h4>
              
              <div class="flex items-baseline gap-2 mb-3">
                <span class="text-lg font-bold text-red-600">
                  {{ (item.product.price_after_discount || item.product.price).toLocaleString() }}₫
                </span>
                <span v-if="item.product.discount_percent" class="text-xs text-gray-400 line-through">
                  {{ item.product.price.toLocaleString() }}₫
                </span>
              </div>


              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button 
                    @click="emit('update-quantity', item.product.id, item.quantity - 1)" 
                    class="w-8 h-8 bg-white rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 font-bold shadow-sm flex items-center justify-center">
                    −
                  </button>
                  <span class="px-3 py-1 font-semibold min-w-[2rem] text-center">
                    {{ item.quantity }}
                  </span>
                  <button 
                    @click="emit('update-quantity', item.product.id, item.quantity + 1)" 
                    class="w-8 h-8 bg-white rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 font-bold shadow-sm flex items-center justify-center">
                    +
                  </button>
                </div>
                
                <button 
                  @click="emit('remove-item', item.product.id)" 
                  class="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-all">
                  🗑️
                </button>
              </div>

              <div class="mt-2 text-right">
                <span class="text-xs text-gray-500">Tổng: </span>
                <span class="text-sm font-bold text-gray-800">
                  {{ ((item.product.price_after_discount || item.product.price) * item.quantity).toLocaleString() }}₫
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="items.length > 0" class="flex-shrink-0 bg-white border-t-2 border-gray-200 p-6 space-y-4">
        <div v-if="subtotal < 500000" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <p class="text-sm text-yellow-800 font-medium flex items-center gap-2">
            <span>🚚</span>
            <span>Mua thêm {{ (500000 - subtotal).toLocaleString() }}₫ để được freeship!</span>
          </p>
          <div class="mt-2 bg-yellow-200 h-2 rounded-full overflow-hidden">
            <div 
              class="bg-gradient-to-r from-yellow-500 to-orange-500 h-full transition-all duration-500"
              :style="{ width: `${(subtotal / 500000) * 100}%` }">
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between text-gray-700">
            <span>Tạm tính:</span>
            <span class="font-semibold">{{ subtotal.toLocaleString() }}₫</span>
          </div>
          <div class="flex justify-between text-gray-700">
            <span>Phí vận chuyển:</span>
            <span class="font-semibold">
              <span v-if="shipping === 0" class="text-green-600">Miễn phí</span>
              <span v-else>{{ shipping.toLocaleString() }}₫</span>
            </span>
          </div>
        </div>

        <div class="flex justify-between items-center text-xl font-bold pt-4 border-t-2 border-gray-200">
          <span class="text-gray-800">Tổng cộng:</span>
          <span class="text-red-600 text-2xl">{{ total.toLocaleString() }}₫</span>
        </div>

        <button
          @click="emit('checkout')"
          class="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 group">
          <span>💳 Thanh toán</span>
          <span class="group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <button
          @click="emit('close')"
          class="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold">
          ← Tiếp tục mua sắm
        </button>

        <div class="flex justify-center gap-4 pt-3 text-xs text-gray-500">
          <span class="flex items-center gap-1">✅ Bảo mật</span>
          <span>|</span>
          <span class="flex items-center gap-1">🚚 Giao nhanh</span>
          <span>|</span>
          <span class="flex items-center gap-1">🔄 Đổi trả</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>