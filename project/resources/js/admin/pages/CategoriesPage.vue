<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import axios from "axios";
import CategoryTable from "../components/category/CategoryTable.vue";

const loading = ref(false);
const saving = ref(false);

const categories = ref([]);

const filters = reactive({
  search: ""
});

const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = reactive({
  name: "",
  description: ""
});

const errorMessage = ref("");
const successMessage = ref("");

const filteredCategories = computed(() => {
  if (!filters.search) return categories.value;
  const q = filters.search.toLowerCase();
  return categories.value.filter((c) =>
    (c.name || "").toLowerCase().includes(q)
  );
});

function resetForm() {
  form.name = "";
  form.description = "";
  errorMessage.value = "";
  successMessage.value = "";
  isEditing.value = false;
  editingId.value = null;
}

function openCreateModal() {
  resetForm();
  showModal.value = true;
}

function openEditModal(category) {
  resetForm();
  isEditing.value = true;
  editingId.value = category.id;
  form.name = category.name;
  form.description = category.description || "";
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function fetchCategories() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const { data } = await axios.get("/api/categories");
    categories.value = data;
  } catch (e) {
    console.error(e);
    errorMessage.value = "Không tải được danh sách danh mục.";
  } finally {
    loading.value = false;
  }
}

async function saveCategory() {
  saving.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const payload = {
      name: form.name,
      description: form.description || ""
    };

    if (isEditing.value && editingId.value) {
      const { data } = await axios.put(`/api/categories/${editingId.value}`, payload);
      successMessage.value = "Cập nhật danh mục thành công.";
      const idx = categories.value.findIndex((c) => c.id === editingId.value);
      if (idx !== -1) categories.value[idx] = data;
    } else {
      const { data } = await axios.post("/api/categories", payload);
      successMessage.value = "Tạo danh mục mới thành công.";
      categories.value.unshift(data);
    }

    setTimeout(() => {
      closeModal();
    }, 400);
  } catch (e) {
    console.error(e);
    if (e.response?.data?.message) {
      errorMessage.value = e.response.data.message;
    } else if (e.response?.data?.errors) {
      const first = Object.values(e.response.data.errors)[0];
      errorMessage.value = Array.isArray(first) ? first[0] : String(first);
    } else {
      errorMessage.value = "Có lỗi khi lưu danh mục.";
    }
  } finally {
    saving.value = false;
  }
}

async function deleteCategory(category) {
  if (!confirm(`Xóa danh mục "${category.name}"?`)) return;

  try {
    await axios.delete(`/api/categories/${category.id}`);
    categories.value = categories.value.filter((c) => c.id !== category.id);
  } catch (e) {
    console.error(e);
    alert("Xóa danh mục thất bại (có thể đang được dùng bởi sản phẩm).");
  }
}

onMounted(fetchCategories);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold text-slate-800">Quản lý danh mục</h1>
        <p class="text-sm text-slate-500 mt-1">
          Tạo, chỉnh sửa, sắp xếp các danh mục sản phẩm.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium
               bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
        @click="openCreateModal"
      >
        <span class="mr-1 text-lg">＋</span>
        Thêm danh mục
      </button>
    </div>

    <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-3">
      <div class="grid md:grid-cols-3 gap-3">
        <div class="md:col-span-2">
          <label class="text-xs font-medium text-slate-500 mb-1 block">Tìm kiếm</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Tên danh mục..."
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
          />
        </div>
      </div>

      <div class="flex justify-between text-xs text-slate-500">
        <span>Tổng: <span class="font-semibold">{{ categories.length }}</span> danh mục</span>
        <span v-if="loading" class="text-slate-400">Đang tải...</span>
      </div>
    </div>
    <div
      v-if="errorMessage && !showModal"
      class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700"
    >
      {{ errorMessage }}
    </div>

    <CategoryTable
      :categories="filteredCategories"
      :loading="loading"
      @edit="openEditModal"
      @delete="deleteCategory"
    />

    <div
      v-if="showModal"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-800">
            {{ isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục" }}
          </h2>
          <button
            type="button"
            class="text-slate-400 hover:text-slate-600"
            @click="closeModal"
          >
            ✕
          </button>
        </div>

        <div class="px-5 py-4 space-y-3">
          <div
            v-if="errorMessage"
            class="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2"
          >
            {{ errorMessage }}
          </div>
          <div
            v-if="successMessage"
            class="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2"
          >
            {{ successMessage }}
          </div>

          <div>
            <label class="text-xs font-medium text-slate-500 mb-1 block">
              Tên danh mục <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="text-xs font-medium text-slate-500 mb-1 block">Mô tả</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
            />
          </div>
        </div>

        <div class="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            @click="closeModal"
          >
            Hủy
          </button>
          <button
            type="button"
            class="px-4 py-2 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
            :disabled="saving"
            @click="saveCategory"
          >
            <span
              v-if="saving"
              class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"
            />
            <span>{{ isEditing ? "Lưu thay đổi" : "Tạo danh mục" }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
