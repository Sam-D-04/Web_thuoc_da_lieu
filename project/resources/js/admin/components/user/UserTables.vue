<script setup>
const props = defineProps({
  users: { type: Array, default: () => [] },
  loading: Boolean,
  pagination: { type: Object, required: true }
});

const emit = defineEmits(["change-page"]);

function changePage(page) {
  emit("change-page", page);
}

function roleLabel(role) {
  if (role === "admin") return "Admin";
  return "User";
}
</script>

<template>
  <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
    <div class="border-b border-slate-100 px-4 py-2 flex items-center justify-between">
      <span class="text-sm text-slate-600">Danh sách người dùng</span>
      <span v-if="loading" class="text-xs text-slate-400">Đang tải...</span>
    </div>

    <div v-if="!users.length && !loading" class="p-6 text-center text-sm text-slate-400">
      Chưa có người dùng nào ở trang này.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 text-left text-xs font-semibold text-slate-500">
          <tr>
            <th class="px-4 py-2">ID</th>
            <th class="px-4 py-2">Thông tin</th>
            <th class="px-4 py-2">Vai trò</th>
            <th class="px-4 py-2 text-right">Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-t border-slate-100 hover:bg-slate-50/60"
          >
            <td class="px-4 py-3">
              <span class="font-medium text-slate-800">#{{ user.id }}</span>
            </td>

            <td class="px-4 py-3">
              <div class="flex flex-col">
                <span class="text-slate-800">
                  {{ user.name || "—" }}
                </span>
                <span class="text-xs text-slate-500">
                  {{ user.email || "—" }}
                </span>
              </div>
            </td>

            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                  user.role === 'admin'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-slate-50 text-slate-700'
                ]"
              >
                {{ roleLabel(user.role) }}
              </span>
            </td>

            <td class="px-4 py-3 text-right">
              <span class="text-xs text-slate-500">
                {{ user.created_at ? new Date(user.created_at).toLocaleString('vi-VN') : '—' }}
              </span>
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
