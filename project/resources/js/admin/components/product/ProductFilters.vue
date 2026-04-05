<script setup>
const props = defineProps({
  search: String,
  categoryId: [String, Number],
  sort: String,
  categories: { type: Array, default: () => [] },
  loading: Boolean
});

const emit = defineEmits([
  "update:search",
  "update:category-id",
  "update:sort",
  "apply"
]);

function apply() {
  emit("apply");
}
</script>

<template>
  <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-3">
    <div class="grid md:grid-cols-4 gap-3">
      <div class="md:col-span-2">
        <label class="text-xs font-medium text-slate-500 mb-1 block">Tìm kiếm</label>
        <input
          :value="search"
          type="text"
          placeholder="Tên sản phẩm..."
          class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
          @input="emit('update:search', $event.target.value)"
        />
      </div>

      <div>
        <label class="text-xs font-medium text-slate-500 mb-1 block">Danh mục</label>
        <select
          :value="categoryId"
          class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
          @change="emit('update:category-id', $event.target.value)"
        >
          <option value="">Tất cả</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="text-xs font-medium text-slate-500 mb-1 block">Sắp xếp</label>
        <select
          :value="sort"
          class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
          @change="emit('update:sort', $event.target.value)"
        >
          <option value="latest">Mới nhất</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="popular">Bán chạy</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
               bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-60"
        :disabled="loading"
        @click="apply"
      >
        Áp dụng bộ lọc
      </button>
    </div>
  </div>
</template>
