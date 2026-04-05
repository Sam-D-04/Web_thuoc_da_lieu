<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const loading = ref(true);
const stats = ref({
  categories: 0,
  customers: 0,
  products: 0,
  orders: 0,
  reviews: 0
});

const latestOrders = ref([]);
const bestSellers = ref([]);

function getTotalFromPaginate(res) {
  const d = res?.data ?? {};
  if (typeof d.total === "number") return d.total;
  if (Array.isArray(d.data)) return d.data.length;
  if (Array.isArray(d)) return d.length;
  return 0;
}

async function fetchStats() {
  try {
    const [catRes, productRes, orderRes, userRes, popularRes] = await Promise.all([
      axios.get("/api/categories"),
      axios.get("/api/products"),
      axios.get("/api/admin/orders"),
      axios.get("/api/admin/users"),
      axios.get("/api/products", { params: { sort: "popular", per_page: 5 } })
    ]);

    stats.value.categories = Array.isArray(catRes.data)
      ? catRes.data.length
      : getTotalFromPaginate(catRes);

    stats.value.products = getTotalFromPaginate(productRes);
    stats.value.orders = getTotalFromPaginate(orderRes);
    stats.value.customers = getTotalFromPaginate(userRes);

    const ordersData = Array.isArray(orderRes.data?.data)
      ? orderRes.data.data
      : [];

    latestOrders.value = ordersData.slice(0, 5);

    const popularData = Array.isArray(popularRes.data?.data)
      ? popularRes.data.data
      : [];

    bestSellers.value = popularData.slice(0, 5);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchStats);
</script>


<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-semibold text-slate-800">Tổng quan hệ thống</h1>
      <p class="text-sm text-slate-500 mt-1">
        Thống kê nhanh danh mục, sản phẩm, đơn hàng và khách hàng.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      <div
        class="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex items-center gap-4"
      >
        <div
          class="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"
        >
          <i class="fa-solid fa-layer-group"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-slate-500">Danh mục</span>
          <span class="text-sm font-semibold text-slate-800">
            {{ loading ? "…" : stats.categories }}
          </span>
        </div>
      </div>

      <div
        class="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex items-center gap-4"
      >
        <div
          class="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"
        >
          <i class="fa-solid fa-users"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-slate-500">Khách hàng</span>
          <span class="text-sm font-semibold text-slate-800">
            {{ loading ? "…" : stats.customers }}
          </span>
        </div>
      </div>

      <div
        class="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex items-center gap-4"
      >
        <div
          class="h-10 w-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center"
        >
          <i class="fa-solid fa-box"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-slate-500">Sản phẩm</span>
          <span class="text-sm font-semibold text-slate-800">
            {{ loading ? "…" : stats.products }}
          </span>
        </div>
      </div>

      <div
        class="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex items-center gap-4"
      >
        <div
          class="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"
        >
          <i class="fa-solid fa-receipt"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-slate-500">Đơn hàng</span>
          <span class="text-sm font-semibold text-slate-800">
            {{ loading ? "…" : stats.orders }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-semibold text-slate-800">Đơn hàng mới</h2>
          <span class="text-xs text-slate-400">
            {{ latestOrders.length ? `${latestOrders.length} đơn gần nhất` : "Chưa có dữ liệu" }}
          </span>
        </div>

        <div v-if="!latestOrders.length" class="h-28 flex items-center justify-center">
          <p class="text-xs text-slate-400">Chưa có dữ liệu</p>
        </div>

        <ul v-else class="divide-y divide-slate-100 text-sm">
          <li
            v-for="order in latestOrders"
            :key="order.id"
            class="py-2 flex items-center justify-between"
          >
            <div>
              <p class="font-medium text-slate-700">Đơn #{{ order.id }}</p>
              <p class="text-xs text-slate-400">
                {{ order.user?.name || "Không rõ khách" }}
              </p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-slate-800">
                {{ new Intl.NumberFormat("vi-VN").format(order.total) }} đ
              </p>
              <p class="text-xs text-slate-400 capitalize">
                {{ order.status }}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-semibold text-slate-800">Sản phẩm bán chạy</h2>
          <span class="text-xs text-slate-400">
            {{ bestSellers.length ? `${bestSellers.length} sản phẩm` : "Chưa có dữ liệu" }}
          </span>
        </div>

        <div v-if="!bestSellers.length" class="h-28 flex items-center justify-center">
          <p class="text-xs text-slate-400">Chưa có dữ liệu</p>
        </div>

        <ul v-else class="divide-y divide-slate-100 text-sm">
          <li
            v-for="p in bestSellers"
            :key="p.id"
            class="py-2 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="p.image"
                  :src="`/storage/${p.image}`"
                  :alt="p.name"
                  class="h-9 w-9 object-cover"
                />
                <i v-else class="fa-solid fa-box text-slate-400 text-sm"></i>
              </div>
              <div class="flex flex-col">
                <span class="font-medium text-slate-700 truncate max-w-[140px]">
                  {{ p.name }}
                </span>
                <span class="text-[11px] text-slate-400">
                  Lượt đặt: {{ p.order_items_count ?? 0 }}
                </span>
              </div>
            </div>

            <div class="text-right">
              <p class="font-semibold text-slate-800">
                {{ new Intl.NumberFormat("vi-VN").format(p.price) }} đ
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
