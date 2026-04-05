<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter, RouterLink, RouterView } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const collapsed = ref(false);
const admin = ref(null);
const isChecking = ref(true);

const menuItems = [
  {
    name: "admin.dashboard",
    label: "Dashboard",
    icon: "fa-solid fa-house",
    to: { name: "admin.dashboard" }
  },
  {
    name: "admin.products",
    label: "Sản phẩm",
    icon: "fa-solid fa-box",
    to: { name: "admin.products" }
  },
  {
    name: "admin.categories",
    label: "Danh mục",
    icon: "fa-solid fa-layer-group",
    to: { name: "admin.categories" }
  },
  {
    name: "admin.orders",
    label: "Đơn hàng",
    icon: "fa-solid fa-receipt",
    to: { name: "admin.orders" }
  },
  {
    name: "admin.users",
    label: "Người dùng",
    icon: "fa-solid fa-users",
    to: { name: "admin.users" }
  },
  {
    name: "admin.settings",
    label: "Cài đặt",
    icon: "fa-solid fa-gear",
    to: { name: "admin.settings" }
  }
];

const pageTitle = computed(() => {
  const found = menuItems.find((m) => m.name === route.name);
  return found ? found.label : "";
});

const userInitial = computed(() => {
  if (!admin.value?.name) return "AD";
  return admin.value.name.charAt(0).toUpperCase();
});

function toggleCollapse() {
  collapsed.value = !collapsed.value;
}

async function ensureAuth() {
  if (route.name === "admin.login") {
    admin.value = null;
    isChecking.value = false;
    return;
  }

  isChecking.value = true;
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      isChecking.value = false;
      return router.replace({ name: "admin.login" });
    }

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const { data } = await axios.get("/api/me");

    if (data.role !== "admin") {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common.Authorization;
      isChecking.value = false;
      return router.replace({ name: "admin.login" });
    }

    admin.value = data;
  } catch (e) {
    console.error(e);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
    // axios header  fetch
    router.replace({ name: "admin.login" });
  } finally {
    isChecking.value = false;
  }
}

async function handleLogout() {
  try {
    await axios.post("/api/logout");
  } catch (e) {
  } finally {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
    admin.value = null;
    router.push({ name: "admin.login" });
  }
}

watch(
  () => route.name,
  () => {
    ensureAuth();
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="isChecking" class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="text-sm text-slate-500">
      Loanding...
    </div>
  </div>
  <div
    v-else-if="route.name === 'admin.login'"
    class="min-h-screen flex items-center justify-center bg-slate-100"
  >
    <RouterView />
  </div>

  <div v-else class="min-h-screen flex bg-slate-100">
    <aside
      :class="[
        'flex flex-col bg-slate-900 text-slate-100 transition-all duration-200',
        collapsed ? 'w-20' : 'w-64'
      ]"
    >
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div class="flex items-center gap-2">
          <div
            class="h-8 w-8 flex items-center justify-center rounded-xl bg-indigo-500 text-white"
          >
            <i class="fa-solid fa-user-shield"></i>
          </div>
          <span v-if="!collapsed" class="font-semibold text-lg">Admin</span>
        </div>
        <button
          class="text-slate-300 hover:text-white text-sm"
          type="button"
          @click="toggleCollapse"
        >
          <span v-if="collapsed">»</span>
          <span v-else>«</span>
        </button>
      </div>
      <nav class="flex-1 py-3 space-y-1">
        <RouterLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-2
                 text-slate-200 hover:bg-slate-800 transition"
          :class="{ 'bg-indigo-600 text-white hover:bg-indigo-600': route.name === item.name }"
        >
          <i :class="[item.icon, 'w-5 text-center']"></i>
          <span v-if="!collapsed">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="border-t border-slate-700 p-2">
        <button
          type="button"
          class="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg
                 text-rose-200 hover:bg-rose-600/20 hover:text-rose-100 transition"
          @click="handleLogout"
        >
          <i class="fa-solid fa-right-from-bracket text-lg"></i>
          <span v-if="!collapsed">Đăng xuất</span>
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col">
      <header
        class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6"
      >
        <div class="text-sm text-slate-500">
          <span class="font-medium text-slate-700">Dashboard</span>
          <span v-if="pageTitle"> / {{ pageTitle }}</span>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              class="pl-9 pr-3 py-1.5 rounded-full border border-slate-200 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
            />
            <i
              class="fa-solid fa-magnifying-glass absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
            ></i>
          </div>

          <div class="flex items-center gap-2">
            <div
              class="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold"
            >
              {{ userInitial }}
            </div>
            <div class="hidden md:flex flex-col">
              <span class="text-xs text-slate-500">Quản trị viên</span>
              <span class="text-xs font-medium text-slate-700 truncate max-w-[140px]">
                {{ admin?.name || "Admin" }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
