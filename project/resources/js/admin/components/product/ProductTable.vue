<script setup>
const props = defineProps({
  products: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  pagination: { type: Object, required: true },
  loading: Boolean
});

const emit = defineEmits(["edit", "delete", "change-page"]);

function changePage(page) {
  emit("change-page", page);
}
</script>

<template>
  <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
    <div class="border-b border-slate-100 px-4 py-2 flex items-center justify-between">
      <span class="text-sm text-slate-600">
        Tổng: <span class="font-semibold">{{ pagination.total }}</span> sản phẩm
      </span>
      <span v-if="loading" class="text-xs text-slate-400">Đang tải...</span>
    </div>

    <div v-if="!products.length && !loading" class="p-6 text-center text-sm text-slate-400">
      Chưa có sản phẩm nào khớp điều kiện.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 text-left text-xs font-semibold text-slate-500">
          <tr>
            <th class="px-4 py-2">Sản phẩm</th>
            <th class="px-4 py-2">Danh mục</th>
            <th class="px-4 py-2 text-right">Giá</th>
            <th class="px-4 py-2 text-center">Giảm giá</th>
            <th class="px-4 py-2 text-center">Tồn kho</th>
            <th class="px-4 py-2 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in products"
            :key="product.id"
            class="border-t border-slate-100 hover:bg-slate-50/60"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div
                  class="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    v-if="product.image"
                    :src="`/storage/${product.image}`"
                    alt="img"
                    class="h-full w-full object-cover"
                  />
                  <span v-else class="text-xs text-slate-400">No image</span>
                </div>
                <div>
                  <p class="font-medium text-slate-800 truncate max-w-[220px]">
                    {{ product.name }}
                  </p>
                  <p class="text-xs text-slate-400">
                    ID: {{ product.id }}
                  </p>
                </div>
              </div>
            </td>

            <td class="px-4 py-3">
              <span class="text-sm text-slate-700">
                {{ product.category?.name || "—" }}
              </span>
            </td>

            <td class="px-4 py-3 text-right">
              <span class="font-semibold text-slate-800">
                {{ new Intl.NumberFormat("vi-VN").format(product.price) }} đ
              </span>
            </td>

            <td class="px-4 py-3 text-center">
              <span
                v-if="product.discount_percent"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
              >
                -{{ product.discount_percent }}%
              </span>
              <span v-else class="text-xs text-slate-400">Không</span>
            </td>

            <td class="px-4 py-3 text-center">
              <span
                :class="[
                  'inline-flex items-center justify-center min-w-[54px] rounded-full text-xs px-2 py-0.5 font-medium',
                  product.stock > 0 ? 'bg-sky-50 text-sky-700' : 'bg-rose-50 text-rose-700'
                ]"
              >
                {{ product.stock }}
              </span>
            </td>

            <td class="px-4 py-3 text-right">
              <div class="inline-flex gap-1">
                <button
                  type="button"
                  class="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
                  @click="emit('edit', product)"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 text-xs rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                  @click="emit('delete', product)"
                >
                  Xóa
                </button>
              </div>
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
