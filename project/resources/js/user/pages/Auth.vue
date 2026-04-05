<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

axios.defaults.baseURL = '/api'

const router = useRouter()

const mode = ref('login')
const loading = ref(false)
const errors = ref(null)
const showVerification = ref(false)
const verificationEmail = ref('')
const verificationCode = ref('')
const verificationLoading = ref(false)

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '', password_confirmation: '' })

async function submitLogin() {
  loading.value = true
  errors.value = null
  try {
    const { data } = await axios.post('/login', loginForm.value)
    
    // Nếu cần xác thực email
    if (data.requires_verification) {
      verificationEmail.value = loginForm.value.email
      showVerification.value = true
      errors.value = 'Email chưa được xác thực. Vui lòng nhập mã xác thực.'
      return
    }
    
    localStorage.setItem('token', data.token)
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
    alert('Đăng nhập thành công!')
    await router.push({ name: 'home' })
    window.location.reload()
  } catch (e) {
    if (e.response?.status === 403 && e.response?.data?.requires_verification) {
      verificationEmail.value = loginForm.value.email
      showVerification.value = true
      errors.value = e.response?.data?.message || 'Email chưa được xác thực. Vui lòng nhập mã xác thực.'
    } else {
      const errorMessage = e.response?.data?.message || 'Đăng nhập thất bại'
      errors.value = errorMessage
      console.error('Login error:', e.response?.data || e)
    }
  } finally {
    loading.value = false
  }
}


async function submitRegister() {
  loading.value = true
  errors.value = null
  try {
    const { data } = await axios.post('/register', registerForm.value)
    verificationEmail.value = registerForm.value.email
    showVerification.value = true
    alert('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực.')
  } catch (e) {
    errors.value =
      e.response?.data?.message ||
      (e.response?.data || e).errors ||
      'Đăng ký thất bại'
  } finally {
    loading.value = false
  }
}

async function verifyEmail() {
  if (!verificationCode.value || verificationCode.value.length !== 6) {
    errors.value = 'Vui lòng nhập mã xác thực 6 chữ số'
    return
  }

  verificationLoading.value = true
  errors.value = null
  try {
    const { data } = await axios.post('/verify-email', {
      email: verificationEmail.value,
      code: verificationCode.value
    })
    localStorage.setItem('token', data.token)
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
    alert('Xác thực email thành công!')
    await router.push({ name: 'home' })
    window.location.reload()
  } catch (e) {
    errors.value = e.response?.data?.message || 'Mã xác thực không chính xác'
  } finally {
    verificationLoading.value = false
  }
}

async function resendCode() {
  verificationLoading.value = true
  errors.value = null
  try {
    await axios.post('/resend-verification-code', {
      email: verificationEmail.value
    })
    alert('Đã gửi lại mã xác thực. Vui lòng kiểm tra email.')
    verificationCode.value = ''
  } catch (e) {
    errors.value = e.response?.data?.message || 'Không thể gửi lại mã'
  } finally {
    verificationLoading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4"
        >
          <i class="fa-solid fa-user text-white text-3xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-slate-900">Chào mừng trở lại</h1>
        <p class="text-slate-600 mt-2">
          {{ mode === 'login' ? 'Đăng nhập để tiếp tục' : 'Tạo tài khoản mới' }}
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div class="flex border-b border-slate-200">
          <button
            @click="mode = 'login'"
            :class="[
              'flex-1 py-4 text-sm font-semibold transition-all',
              mode === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-slate-600 hover:bg-slate-50'
            ]"
          >
            Đăng nhập
          </button>
          <button
            @click="mode = 'register'"
            :class="[
              'flex-1 py-4 text-sm font-semibold transition-all',
              mode === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-slate-600 hover:bg-slate-50'
            ]"
          >
            Đăng ký
          </button>
        </div>

        <div class="p-8">
          <!-- Form xác thực mã OTP -->
          <div v-if="showVerification" class="space-y-5">
            <div class="text-center mb-6">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <i class="fa-solid fa-envelope text-green-600 text-2xl"></i>
              </div>
              <h2 class="text-2xl font-bold text-slate-900 mb-2">Xác thực email</h2>
              <p class="text-slate-600 text-sm">
                Chúng tôi đã gửi mã xác thực đến email<br>
                <strong class="text-blue-600">{{ verificationEmail }}</strong>
              </p>
            </div>

            <div
              v-if="errors"
              class="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg"
            >
              <p class="text-sm text-red-700">{{ errors }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Mã xác thực (6 chữ số)
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fa-solid fa-key text-slate-400"></i>
                </div>
                <input
                  v-model="verificationCode"
                  type="text"
                  maxlength="6"
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl tracking-widest font-bold"
                  placeholder="000000"
                  @input="verificationCode = verificationCode.replace(/\D/g, '')"
                />
              </div>
            </div>

            <button
              @click="verifyEmail"
              :disabled="verificationLoading || !verificationCode || verificationCode.length !== 6"
              class="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all"
            >
              <span v-if="verificationLoading" class="flex items-center justify-center gap-2">
                <i class="fa-solid fa-spinner animate-spin"></i>
                Đang xác thực...
              </span>
              <span v-else>Xác thực email</span>
            </button>

            <div class="text-center">
              <button
                @click="resendCode"
                :disabled="verificationLoading"
                class="text-sm text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50"
              >
                <i class="fa-solid fa-redo mr-1"></i>
                Gửi lại mã xác thực
              </button>
            </div>

            <div class="text-center pt-4 border-t">
              <button
                @click="showVerification = false; verificationCode = ''"
                class="text-sm text-slate-600 hover:text-slate-800"
              >
                <i class="fa-solid fa-arrow-left mr-1"></i>
                Quay lại đăng nhập
              </button>
            </div>
          </div>

          <!-- Form đăng nhập/đăng ký -->
          <div v-else>
          <div
            v-if="errors"
            class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
          >
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
              <pre
                class="text-sm text-red-700 whitespace-pre-wrap flex-1"
              >{{ errors }}</pre>
            </div>
          </div>

          <form v-if="mode === 'login'" @submit.prevent="submitLogin" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Địa chỉ email
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fa-solid fa-envelope text-slate-400"></i>
                </div>
                <input
                  v-model="loginForm.email"
                  type="email"
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Mật khẩu
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fa-solid fa-lock text-slate-400"></i>
                </div>
                <input
                  v-model="loginForm.password"
                  type="password"
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <i class="fa-solid fa-spinner animate-spin"></i>
                Đang xử lý...
              </span>
              <span v-else>Đăng nhập</span>
            </button>

          </form>

          <form v-else @submit.prevent="submitRegister" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Họ và tên
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fa-solid fa-user text-slate-400"></i>
                </div>
                <input
                  v-model="registerForm.name"
                  type="text"
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Địa chỉ email
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fa-solid fa-envelope text-slate-400"></i>
                </div>
                <input
                  v-model="registerForm.email"
                  type="email"
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Mật khẩu
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fa-solid fa-lock text-slate-400"></i>
                </div>
                <input
                  v-model="registerForm.password"
                  type="password"
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fa-solid fa-check-circle text-slate-400"></i>
                </div>
                <input
                  v-model="registerForm.password_confirmation"
                  type="password"
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <i class="fa-solid fa-spinner animate-spin"></i>
                Đang xử lý...
              </span>
              <span v-else>Đăng ký</span>
            </button>

            <div class="relative my-4">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-slate-500">hoặc</span>
              </div>
            </div>

            <button
              type="button"
              @click="handleFacebookLogin"
              :disabled="loading"
              class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <i class="fa-brands fa-facebook-f"></i>
              Đăng ký với Facebook
            </button>
          </form>
          </div>
        </div>
      </div>

      <p class="text-center text-sm text-slate-600 mt-6">
        Bằng cách tiếp tục, bạn đồng ý với
        <a href="#" class="text-blue-600 hover:underline">Điều khoản dịch vụ</a>
        và
        <a href="#" class="text-blue-600 hover:underline">Chính sách bảo mật</a>
      </p>
    </div>
  </div>
</template>
