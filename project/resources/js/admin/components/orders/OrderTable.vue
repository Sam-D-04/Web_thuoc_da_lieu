<script setup>
const props = defineProps({
  orders: { type: Array, default: () => [] },
  loading: Boolean,
  pagination: { type: Object, required: true },
  getPaymentType: { type: Function, required: true }
});

const emit = defineEmits(["view", "change-page", "update-status"]);

function changePage(page) {
  emit("change-page", page);
}

function handleStatusChange(order, status) {
  emit("update-status", { order, status });
}
</script>

<template>
  <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
    <div class="border-b border-slate-100 px-4 py-2 flex items-center justify-between">
      <span class="text-sm text-slate-600">Danh sách đơn hàng</span>
      <span v-if="loading" class="text-xs text-slate-400">Đang tải...</span>
    </div>

    <div v-if="!orders.length && !loading" class="p-6 text-center text-sm text-slate-400">
      Chưa có đơn hàng nào.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 text-left text-xs font-semibold text-slate-500">
          <tr>
            <th class="px-4 py-2">Mã đơn</th>
            <th class="px-4 py-2">Khách hàng</th>
            <th class="px-4 py-2 text-right">Tổng tiền</th>
            <th class="px-4 py-2 text-center">Thanh toán</th>
            <th class="px-4 py-2 text-center">Trạng thái</th>
            <th class="px-4 py-2 text-right">Ngày tạo</th>
            <th class="px-4 py-2 text-right">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="border-t border-slate-100 hover:bg-slate-50/60"
          >
            <td class="px-4 py-3">
              <span class="font-medium text-slate-800">#{{ order.id }}</span>
            </td>

            <td class="px-4 py-3">
              <div class="flex flex-col">
                <span class="text-slate-800">
                  {{ order.user?.name || "Khách" }}
                </span>
                <span class="text-xs text-slate-500">
                  {{ order.user?.email }}
                </span>
              </div>
            </td>

            <td class="px-4 py-3 text-right">
              <span class="font-semibold text-slate-800">
                {{ new Intl.NumberFormat("vi-VN").format(order.total) }} đ
              </span>
            </td>

            <td class="px-4 py-3 text-center">
              <span
                v-if="getPaymentType(order) === 'paypal'"
                class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
              >
                PayPal
              </span>
              <span
                v-else
                class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-700"
              >
                COD
              </span>
            </td>

            <td class="px-4 py-3 text-center">
              <select
                class="text-xs px-2 py-1 rounded-full border border-slate-200 bg-white"
                :value="order.status"
                @change="handleStatusChange(order, $event.target.value)"
              >
                <option value="pending">pending</option>
                <option value="processing">processing</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </td>

            <td class="px-4 py-3 text-right">
              <span class="text-xs text-slate-500">
                {{ new Date(order.created_at).toLocaleString("vi-VN") }}
              </span>
            </td>

            <td class="px-4 py-3 text-right">
              <button
                type="button"
                class="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
                @click="emit('view', order)"
              >
                Xem
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="pagination.last_page > 1"
      class="border-t border-slate-100 px-4 py-3 flex items-center justify-between text-xs text-slate-500"
    >
      <div>
        Trang
        <span class="font-semibold">{{ pagination.current_page }}</span> /
        <span class="font-semibold">{{ pagination.last_page }}</span>
      </div>
      <div class="inline-flex gap-1">
        <button
          type="button"
          class="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100"
          @click="changePage(pagination.current_page - 1)"
        >
          ‹
        </button>
        <button
          type="button"
          class="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100"
          @click="changePage(pagination.current_page + 1)"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>
