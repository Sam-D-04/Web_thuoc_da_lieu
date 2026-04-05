<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="cartStore.isDrawerOpen"
      class="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
      @click="cartStore.closeDrawer()"
    ></div>
  </Transition>

  <!-- Drawer -->
  <Transition name="slide-right">
    <div
      v-if="cartStore.isDrawerOpen"
      class="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h2 class="text-base font-bold text-gray-800">Giỏ hàng</h2>
          <span class="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{{ cartStore.totalItems }}</span>
        </div>
        <button
          @click="cartStore.closeDrawer()"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Items -->
      <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <!-- Empty state -->
        <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-full text-center py-12">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <p class="text-gray-500 font-medium mb-1">Giỏ hàng trống</p>
          <p class="text-sm text-gray-400 mb-4">Hãy thêm sản phẩm vào giỏ hàng</p>
          <button
            @click="cartStore.closeDrawer()"
            class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>

        <!-- Cart Items -->
        <div
          v-for="item in cartStore.items"
          :key="item.productId"
          class="flex gap-3 py-3 border-b border-gray-50 last:border-0"
        >
          <!-- Product image placeholder -->
          <div class="w-16 h-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
            <svg v-else class="w-8 h-8 text-blue-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">{{ item.name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ item.dosage_form }} · {{ item.volume }}</p>
            <p class="text-sm font-bold text-primary mt-1">{{ cartStore.formatPrice(item.price) }}</p>

            <!-- Quantity -->
            <div class="flex items-center gap-2 mt-2">
              <button
                @click="cartStore.updateQuantity(item.productId, item.quantity - 1)"
                class="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-gray-500"
              >
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <span class="text-sm font-semibold text-gray-700 w-6 text-center">{{ item.quantity }}</span>
              <button
                @click="cartStore.updateQuantity(item.productId, item.quantity + 1)"
                class="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-gray-500"
              >
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>

              <button
                @click="cartStore.removeItem(item.productId)"
                class="ml-auto w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/>
                  <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="cartStore.items.length > 0" class="px-5 py-4 border-t border-gray-100 bg-gray-50/50 space-y-3">
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span>Tạm tính ({{ cartStore.totalItems }} sản phẩm)</span>
          <span class="font-semibold text-gray-800">{{ cartStore.formatPrice(cartStore.totalAmount) }}</span>
        </div>
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span>Phí vận chuyển</span>
          <span class="text-green-600 font-medium">Tính khi checkout</span>
        </div>
        <div class="border-t border-gray-200 pt-3 flex items-center justify-between">
          <span class="font-semibold text-gray-800">Tổng cộng</span>
          <span class="text-lg font-bold text-primary">{{ cartStore.formatPrice(cartStore.totalAmount) }}</span>
        </div>

        <!-- Checkout button -->
        <button
          @click="goCheckout"
          class="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          Tiến hành thanh toán
        </button>
        <button
          @click="cartStore.closeDrawer()"
          class="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors text-center"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const goCheckout = () => {
  cartStore.closeDrawer()
  if (!authStore.isLoggedIn) {
    router.push('/login')
  } else {
    router.push('/checkout')
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
</style>
