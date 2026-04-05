<script setup>
const props = defineProps({
  categories: { type: Array, default: () => [] },
  loading: Boolean
});

const emit = defineEmits(["edit", "delete"]);
</script>

<template>
  <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
    <div class="border-b border-slate-100 px-4 py-2 flex items-center justify-between">
      <span class="text-sm text-slate-600">Danh sách danh mục</span>
      <span v-if="loading" class="text-xs text-slate-400">Đang tải...</span>
    </div>

    <div v-if="!categories.length && !loading" class="p-6 text-center text-sm text-slate-400">
      Chưa có danh mục nào.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 text-left text-xs font-semibold text-slate-500">
          <tr>
            <th class="px-4 py-2">Tên danh mục</th>
            <th class="px-4 py-2">Slug</th>
            <th class="px-4 py-2 text-center">Số sản phẩm</th>
            <th class="px-4 py-2">Mô tả</th>
            <th class="px-4 py-2 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="cat in categories"
            :key="cat.id"
            class="border-t border-slate-100 hover:bg-slate-50/60"
          >
            <td class="px-4 py-3">
              <p class="font-medium text-slate-800">{{ cat.name }}</p>
            </td>
            <td class="px-4 py-3 text-xs text-slate-500">
              {{ cat.slug }}
            </td>
            <td class="px-4 py-3 text-center">
              <span
                class="inline-flex items-center justify-center min-w-10 rounded-full text-xs px-2 py-0.5 font-medium bg-sky-50 text-sky-700"
              >
                {{ cat.products ? cat.products.length : 0 }}Ư
              </span>
            </td>
            <td class="px-4 py-3 text-slate-700 max-w-xs">
              <p class="truncate">{{ cat.description || "—" }}</p>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="inline-flex gap-1">
                <button
                  type="button"
                  class="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
                  @click="emit('edit', cat)"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 text-xs rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                  @click="emit('delete', cat)"
                >
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
