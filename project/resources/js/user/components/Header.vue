<script setup>
import { ref } from 'vue';

const props = defineProps({
  user: Object,
  cartCount: Number
});

const emit = defineEmits(['navigate', 'logout']);

const searchQuery = ref('');
const showMobileMenu = ref(false);
const showUserMenu = ref(false);

function handleSearch() {
  if (searchQuery.value.trim()) {
    emit('navigate', 'home', { search: searchQuery.value });
  }
}

function goAdmin() {
  emit('navigate', 'admin.dashboard');
}

</script>

<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="bg-gradient-to-r from-red-600 to-orange-500 text-white">
      <div class="max-w-7xl mx-auto px-4 py-2">
        <div class="flex justify-between items-center text-sm">
          <div class="flex items-center gap-6">
            <span class="flex items-center gap-1">
              <span>📞</span>
              <span class="hidden sm:inline">Hotline: 1900-xxxx</span>
            </span>
            <span class="hidden md:flex items-center gap-1">
              <span>📍</span>
              <span>Hệ thống 100+ nhà thuốc</span>
            </span>
          </div>
          <div class="flex items-center gap-4">
            <a href="#" class="hover:underline hidden sm:inline">Tải ứng dụng</a>
            <a href="#" class="hover:underline">Liên hệ</a>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between gap-4">
        <div 
          class="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform" 
          @click="emit('navigate', 'home')">
          <div class="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            💊
          </div>
          <div class="hidden md:block">
            <div class="text-xl font-bold text-red-600">Long Châu</div>
            <div class="text-xs text-gray-500">Nhà thuốc tin cậy</div>
          </div>
        </div>

        <div class="flex-1 max-w-2xl">
          <form @submit.prevent="handleSearch" class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="🔍 Tìm kiếm thuốc, vitamin, thực phẩm chức năng..."
              class="w-full px-5 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition shadow-sm" />
            <button
              type="submit"
              class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-300">
              <span class="hidden sm:inline">Tìm</span>
              <span class="sm:hidden">🔍</span>
            </button>
          </form>

          <div class="hidden lg:flex gap-3 mt-2 text-xs text-gray-600">
            <a href="#" class="hover:text-red-600 transition">Thuốc bổ</a>
            <span>|</span>
            <a href="#" class="hover:text-red-600 transition">Vitamin & Khoáng chất</a>
            <span>|</span>
            <a href="#" class="hover:text-red-600 transition">Chăm sóc sức khỏe</a>
            <span>|</span>
            <a href="#" class="hover:text-red-600 transition">Làm đẹp</a>
          </div>
        </div>

        <div class="flex items-center gap-2 md:gap-3">
          <button
            @click="emit('navigate', 'cart')"
            class="relative p-3 hover:bg-red-50 rounded-xl transition-all duration-300 group">
            <div class="text-2xl group-hover:scale-110 transition-transform">🛒</div>
            <span 
              v-if="cartCount > 0" 
              class="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-lg animate-bounce">
              {{ cartCount > 99 ? '99+' : cartCount }}
            </span>
          </button>

          <button 
            v-if="props.user?.role === 'admin'" 
            @click="goAdmin" 
            class="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold">
            <span>⚙️</span>
            <span>Admin</span>
          </button>
          <div v-if="props.user" class="relative">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl transition-all duration-300">
              <div class="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                {{ props.user.name.charAt(0).toUpperCase() }}
              </div>
              <span class="hidden md:inline font-medium text-gray-700">{{ props.user.name }}</span>
              <span class="text-gray-400">▼</span>
            </button>

            <div 
              v-if="showUserMenu"
              @click="showUserMenu = false"
              class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-slide-down">
              <button
                @click="emit('navigate', 'profile')"
                class="w-full text-left px-4 py-3 hover:bg-red-50 transition flex items-center gap-3">
                <span class="text-xl">👤</span>
                <span class="font-medium">Tài khoản của tôi</span>
              </button>
              <button
                @click="emit('navigate', 'myorders')"
                class="w-full text-left px-4 py-3 hover:bg-red-50 transition flex items-center gap-3">
                <span class="text-xl">📦</span>
                <span class="font-medium">Đơn hàng</span>
              </button>
              <hr class="my-2">
              <button
                @click="emit('logout')"
                class="w-full text-left px-4 py-3 hover:bg-red-50 transition flex items-center gap-3 text-red-600">
                <span class="text-xl">🚪</span>
                <span class="font-medium">Đăng xuất</span>
              </button>
            </div>
          </div>

          <button
            v-else
            @click="emit('navigate', 'auth')"
            class="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold whitespace-nowrap">
            Đăng nhập
          </button>
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 hover:bg-gray-100 rounded-lg transition">
            <div class="w-6 h-5 flex flex-col justify-between">
              <span class="w-full h-0.5 bg-gray-600 rounded"></span>
              <span class="w-full h-0.5 bg-gray-600 rounded"></span>
              <span class="w-full h-0.5 bg-gray-600 rounded"></span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <div 
      v-if="showMobileMenu"
      class="md:hidden bg-white border-t">
      <div class="px-4 py-3 space-y-2">
        <button
          v-if="props.user?.role === 'admin'"
          @click="goAdmin; showMobileMenu = false"
          class="w-full text-left px-4 py-3 bg-yellow-50 rounded-lg flex items-center gap-3">
          <span>⚙️</span>
          <span class="font-medium">Admin Panel</span>
        </button>
        <a href="#" class="block px-4 py-2 hover:bg-gray-50 rounded-lg">Thuốc bổ</a>
        <a href="#" class="block px-4 py-2 hover:bg-gray-50 rounded-lg">Vitamin & Khoáng chất</a>
        <a href="#" class="block px-4 py-2 hover:bg-gray-50 rounded-lg">Chăm sóc sức khỏe</a>
        <a href="#" class="block px-4 py-2 hover:bg-gray-50 rounded-lg">Làm đẹp</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 0.2s ease-out;
}
</style>