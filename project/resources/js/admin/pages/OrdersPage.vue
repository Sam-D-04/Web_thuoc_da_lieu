<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import axios from "axios";
import OrderTable from "../components/orders/OrderTable.vue";

const loading = ref(false);

const orders = ref([]);
const pagination = reactive({
  current_page: 1,
  last_page: 1,
  total: 0
});

const filters = reactive({
  search: "",
  status: "",
  paymentType: ""
});

const selectedOrder = ref(null);
const showOrderModal = ref(false);
const errorMessage = ref("");

const filteredOrders = computed(() => {
  let data = orders.value;

  if (filters.status) {
    data = data.filter((o) => o.status === filters.status);
  }

  if (filters.paymentType) {
    data = data.filter((o) => {
      const type = getPaymentType(o);
      return type === filters.paymentType;
    });
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    data = data.filter((o) => {
      const idStr = String(o.id);
      const userName = o.user?.name?.toLowerCase() || "";
      const userEmail = o.user?.email?.toLowerCase() || "";
      return (
        idStr.includes(q) ||
        userName.includes(q) ||
        userEmail.includes(q)
      );
    });
  }

  return data;
});

function getPaymentType(order) {
  if (order.status === "completed") return "paypal";
  return "cod";
}

function openOrderModal(order) {
  selectedOrder.value = order;
  showOrderModal.value = true;
}

function closeOrderModal() {
  showOrderModal.value = false;
  selectedOrder.value = null;
}

async function fetchOrders(page = 1) {
  loading.value = true;
  errorMessage.value = "";

  try {
    const { data } = await axios.get("/api/admin/orders", {
      params: { page }
    });

    orders.value = data.data;
    pagination.current_page = data.current_page;
    pagination.last_page = data.last_page;
    pagination.total = data.total;
  } catch (e) {
    console.error(e);
    errorMessage.value = "Không tải được danh sách đơn hàng.";
  } finally {
    loading.value = false;
  }
}

function changePage(page) {
  if (page < 1 || page > pagination.last_page || page === pagination.current_page) return;
  fetchOrders(page);
}

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold text-slate-800">Quản lý đơn hàng</h1>
        <p class="text-sm text-slate-500 mt-1">
          Xem danh sách đơn hàng, trạng thái thanh toán và chi tiết sản phẩm.
        </p>
      </div>
    </div>

    <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-3">
      <div class="grid md:grid-cols-4 gap-3">
        <div class="md:col-span-2">
          <label class="text-xs font-medium text-slate-500 mb-1 block">Tìm kiếm</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Tìm theo mã đơn, tên khách, email..."
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="text-xs font-medium text-slate-500 mb-1 block">Trạng thái đơn</label>
          <select
            v-model="filters.status"
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                   bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
          >
            <option value="">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div>
          <label class="text-xs font-medium text-slate-500 mb-1 block">Hình thức thanh toán</label>
          <select
            v-model="filters.paymentType"
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                   bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
          >
            <option value="">Tất cả</option>
            <option value="paypal">PayPal (đã thanh toán)</option>
            <option value="cod">COD / Tiền mặt</option>
          </select>
        </div>
      </div>

      <div class="flex justify-between items-center text-xs text-slate-500">
        <span>
          Tổng: <span class="font-semibold">{{ pagination.total }}</span> đơn hàng
        </span>
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                 bg-slate-100 text-slate-700 hover:bg-slate-200"
          @click="applyFilters"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700"
    >
      {{ errorMessage }}
    </div>

    <OrderTable
      :orders="filteredOrders"
      :loading="loading"
      :pagination="pagination"
      @view="openOrderModal"
      @change-page="changePage"
      :get-payment-type="getPaymentType"
    />

    <div
      v-if="showOrderModal && selectedOrder"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-sm font-semibold text-slate-800">
              Đơn hàng #{{ selectedOrder.id }}
            </h2>
            <p class="text-xs text-slate-500">
              {{ selectedOrder.user?.name }} — {{ selectedOrder.user?.email }}
            </p>
          </div>
          <button
            type="button"
            class="text-slate-400 hover:text-slate-600"
            @click="closeOrderModal"
          >
            ✕
          </button>
        </div>

        <div class="px-5 py-4 space-y-4 text-sm">
          <div class="grid md:grid-cols-2 gap-3">
            <div>
              <h3 class="text-xs font-semibold text-slate-500 mb-1">Thông tin giao hàng</h3>
              <p class="text-slate-800">{{ selectedOrder.shipping_name }}</p>
              <p class="text-slate-600 mt-1">
                {{ selectedOrder.shipping_phone }}
              </p>
              <p class="text-slate-600 text-xs mt-1">
                {{ selectedOrder.shipping_address }}
              </p>
            </div>

            <div>
              <h3 class="text-xs font-semibold text-slate-500 mb-1">Thanh toán</h3>
              <p class="text-slate-800">
                <span class="font-medium">
                  {{ new Intl.NumberFormat("vi-VN").format(selectedOrder.total) }} đ
                </span>
              </p>
              <p class="text-xs text-slate-600 mt-1">
                Trạng thái:
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    selectedOrder.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : selectedOrder.status === 'pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-700'
                  ]"
                >
                  {{ selectedOrder.status }}
                </span>
              </p>
              <p class="text-xs text-slate-600 mt-1">
                Hình thức:
                <span class="font-medium">
                  {{
                    getPaymentType(selectedOrder) === "paypal"
                      ? "PayPal (đã thanh toán)"
                      : "Thanh toán khi nhận hàng (COD)"
                  }}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-semibold text-slate-500 mb-2">Sản phẩm trong đơn</h3>
            <div class="border border-slate-100 rounded-xl overflow-hidden">
              <table class="w-full text-xs">
                <thead class="bg-slate-50 text-slate-500">
                  <tr>
                    <th class="px-3 py-2 text-left">Sản phẩm</th>
                    <th class="px-3 py-2 text-center">SL</th>
                    <th class="px-3 py-2 text-right">Đơn giá</th>
                    <th class="px-3 py-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in selectedOrder.items"
                    :key="item.id"
                    class="border-t border-slate-100"
                  >
                    <td class="px-3 py-2">
                      <div class="flex flex-col">
                        <span class="text-slate-800">
                          {{ item.product?.name || "Sản phẩm" }}
                        </span>
                      </div>
                    </td>
                    <td class="px-3 py-2 text-center">
                      {{ item.quantity }}
                    </td>
                    <td class="px-3 py-2 text-right">
                      {{ new Intl.NumberFormat("vi-VN").format(item.price) }} đ
                    </td>
                    <td class="px-3 py-2 text-right">
                      {{
                        new Intl.NumberFormat("vi-VN").format(
                          item.price * item.quantity
                        )
                      }}
                      đ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div class="px-5 py-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            class="px-4 py-2 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            @click="closeOrderModal"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
