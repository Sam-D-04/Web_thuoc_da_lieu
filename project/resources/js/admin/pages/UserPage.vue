<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import axios from "axios";
import UsersTable from "../components/user/UserTables.vue";

const loading = ref(false);

const users = ref([]);
const pagination = reactive({
  current_page: 1,
  last_page: 1,
  total: 0
});

const filters = reactive({
  search: "",
  role: "" // '', 'admin', 'user'
});

const errorMessage = ref("");

const filteredUsers = computed(() => {
  let data = users.value;

  if (filters.role) {
    data = data.filter((u) => u.role === filters.role);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    data = data.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      return name.includes(q) || email.includes(q) || String(u.id).includes(q);
    });
  }

  return data;
});

async function fetchUsers(page = 1) {
  loading.value = true;
  errorMessage.value = "";

  try {
    const { data } = await axios.get("/api/admin/users", {
      params: { page }
    });

    users.value = data.data;
    pagination.current_page = data.current_page;
    pagination.last_page = data.last_page;
    pagination.total = data.total;
  } catch (e) {
    console.error(e);
    errorMessage.value = "Không tải được danh sách người dùng.";
  } finally {
    loading.value = false;
  }
}

function changePage(page) {
  if (page < 1 || page > pagination.last_page || page === pagination.current_page) return;
  fetchUsers(page);
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold text-slate-800">Danh sách người dùng</h1>
        <p class="text-sm text-slate-500 mt-1">
          Quản lý tài khoản đã đăng ký trong hệ thống.
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
            placeholder="Tìm theo tên, email, ID..."
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="text-xs font-medium text-slate-500 mb-1 block">Vai trò</label>
          <select
            v-model="filters.role"
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                   bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
          >
            <option value="">Tất cả</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div class="flex justify-between items-center text-xs text-slate-500">
        <span>
          Tổng: <span class="font-semibold">{{ pagination.total }}</span> người dùng
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

    <UsersTable
      :users="filteredUsers"
      :loading="loading"
      :pagination="pagination"
      @change-page="changePage"
    />
  </div>
</template>
