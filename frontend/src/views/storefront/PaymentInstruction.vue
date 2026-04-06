<template>
  <div class="max-w-lg mx-auto px-4 py-10">

    <!-- Đặt hàng thành công -->
    <div class="text-center mb-6">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg class="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-800">Đặt hàng thành công!</h1>
      <p class="text-sm text-gray-500 mt-1">Vui lòng chuyển khoản để hoàn tất đơn hàng</p>
    </div>

    <!-- Card thông tin thanh toán -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <!-- Thông tin đơn hàng -->
      <div class="bg-blue-50 px-5 py-4 border-b border-blue-100">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-xs text-gray-500">Mã đơn hàng</p>
            <p class="font-bold text-gray-800 text-lg tracking-wide">{{ orderCode }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500">Số tiền cần chuyển</p>
            <p class="font-bold text-primary text-xl">{{ formatPrice(amount) }}</p>
          </div>
        </div>
      </div>

      <!-- QR Code -->
      <div class="flex flex-col items-center py-6 px-5 border-b border-gray-100">
        <p class="text-sm font-semibold text-gray-700 mb-3">Quét mã QR để thanh toán</p>
        <div class="p-2 border-2 border-gray-200 rounded-xl bg-white">
          <img
            :src="qrUrl"
            alt="QR thanh toán"
            class="w-52 h-52 object-contain"
          />
        </div>
        <p class="text-xs text-gray-400 mt-2">Hỗ trợ tất cả ứng dụng ngân hàng</p>
      </div>

      <!-- Thông tin tài khoản -->
      <div class="px-5 py-4 space-y-3">
        <p class="text-sm font-semibold text-gray-700">Hoặc chuyển khoản thủ công</p>

        <div class="space-y-2.5">
          <div class="flex justify-between items-center py-2 border-b border-gray-50">
            <span class="text-sm text-gray-500">Ngân hàng</span>
            <span class="text-sm font-semibold text-gray-800">Vietcombank (VCB)</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-50">
            <span class="text-sm text-gray-500">Số tài khoản</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-gray-800 tracking-wider">1021324862</span>
              <button @click="copyText('1021324862')" class="text-primary hover:text-blue-700 transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-50">
            <span class="text-sm text-gray-500">Chủ tài khoản</span>
            <span class="text-sm font-semibold text-gray-800 uppercase">NGUYEN HAI DANG</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-50">
            <span class="text-sm text-gray-500">Số tiền</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-primary">{{ formatPrice(amount) }}</span>
              <button @click="copyText(String(amount))" class="text-primary hover:text-blue-700 transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-sm text-gray-500">Nội dung chuyển khoản</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-gray-800">{{ orderCode }}</span>
              <button @click="copyText(orderCode)" class="text-primary hover:text-blue-700 transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Lưu ý -->
      <div class="mx-5 mb-4 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
        <div class="flex gap-2">
          <svg class="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p class="text-xs text-yellow-700 leading-relaxed">
            Vui lòng ghi đúng <strong>nội dung chuyển khoản</strong> là mã đơn hàng để chúng tôi xác nhận nhanh nhất. Đơn hàng sẽ được xử lý sau khi nhận được thanh toán.
          </p>
        </div>
      </div>

      <!-- Copy toast -->
      <transition name="fade">
        <div v-if="showCopied" class="mx-5 mb-4 bg-green-50 border border-green-100 rounded-lg p-2.5 text-center text-xs text-green-700 font-medium">
          Đã sao chép!
        </div>
      </transition>
    </div>

    <!-- Buttons -->
    <div class="mt-5 space-y-2.5">
      <router-link
        to="/account/orders"
        class="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-200 flex items-center justify-center gap-2 text-sm"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        Xem đơn hàng của tôi
      </router-link>
      <router-link
        to="/shop"
        class="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm border border-gray-200"
      >
        Tiếp tục mua sắm
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const orderCode = computed(() => route.query.code || '')
const amount    = computed(() => Number(route.query.amount) || 0)

const qrUrl = computed(() => {
  const bank    = 'VCB'
  const account = '1021324862'
  const name    = encodeURIComponent('NGUYEN HAI DANG')
  const info    = encodeURIComponent(orderCode.value)
  return `https://img.vietqr.io/image/${bank}-${account}-compact2.png?amount=${amount.value}&addInfo=${info}&accountName=${name}`
})

const formatPrice = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

const showCopied = ref(false)
const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showCopied.value = true
    setTimeout(() => { showCopied.value = false }, 2000)
  } catch {
    // fallback: không làm gì
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
