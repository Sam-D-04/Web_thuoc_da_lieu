<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

async function handleLogin() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const { data } = await axios.post("/api/login", {
      email: email.value,
      password: password.value
    });

    if (!data.token) {
      errorMessage.value = "Server không trả về token.";
      return;
    }

    if (data.user && data.user.role !== "admin") {
      errorMessage.value = "Tài khoản này không có quyền quản trị.";
      return;
    }
    localStorage.setItem("token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    router.push({ name: "admin.dashboard" });
  } catch (e) {
    console.error(e);
    if (e.response?.status === 401) {
      errorMessage.value = "Email hoặc mật khẩu không đúng.";
    } else if (e.response?.data?.message) {
      errorMessage.value = e.response.data.message;
    } else {
      errorMessage.value = "Đăng nhập thất bại. Vui lòng thử lại.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
      <div class="mb-6 text-center">
        <div
          class="mx-auto h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl"
        >
          A
        </div>
        <h1 class="mt-3 text-lg font-semibold text-slate-800">Đăng nhập Admin</h1>
        <p class="mt-1 text-xs text-slate-500">
          Dùng tài khoản quản trị để vào trang admin.
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="admin@example.com"
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
          />
        </div>

        <div
          v-if="errorMessage"
          class="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2"
        >
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
          />
          <span>Đăng nhập</span>
        </button>
      </form>
    </div>
  </div>
</template>
