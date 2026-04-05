<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import ProductFilters from "../components/product/ProductFilters.vue";
import ProductTable from "../components/product/ProductTable.vue";

const loading = ref(false);
const saving = ref(false);

const products = ref([]);
const categories = ref([]);

const pagination = reactive({
  current_page: 1,
  last_page: 1,
  total: 0
});

const filters = reactive({
  search: "",
  category_id: "",
  sort: "latest"
});

const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const productForm = reactive({
  category_id: "",
  name: "",
  description: "",
  price: "",
  stock: "",
  discount_percent: "",
  image: null
});

const previewImage = ref(null);
const errorMessage = ref("");
const successMessage = ref("");

const hasProducts = computed(() => products.value.length > 0);

function resetForm() {
  productForm.category_id = "";
  productForm.name = "";
  productForm.description = "";
  productForm.price = "";
  productForm.stock = "";
  productForm.discount_percent = "";
  productForm.image = null;
  previewImage.value = null;
  errorMessage.value = "";
  successMessage.value = "";
  editingId.value = null;
  isEditing.value = false;
}

function openCreateModal() {
  resetForm();
  showModal.value = true;
}

function openEditModal(product) {
  resetForm();
  isEditing.value = true;
  editingId.value = product.id;
  //binding du lieu
  productForm.category_id = product.category_id;
  productForm.name = product.name;
  productForm.description = product.description || "";
  productForm.price = product.price;
  productForm.stock = product.stock;
  productForm.discount_percent = product.discount_percent ?? "";

  if (product.image) {
    previewImage.value = `/storage/${product.image}`;
  }

  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function fetchCategories() {
  try {
    const { data } = await axios.get("/api/categories");
    categories.value = data;
  } catch (e) {
    console.error(e);
  }
}

async function fetchProducts(page = 1) {
  loading.value = true;
  errorMessage.value = "";

  try {
    const { data } = await axios.get("/api/products", {
      params: {
        page,
        search: filters.search || undefined,
        category_id: filters.category_id || undefined,
        sort: filters.sort || "latest"
      }
    });

    products.value = data.data;
    pagination.current_page = data.current_page;
    pagination.last_page = data.last_page;
    pagination.total = data.total;
  } catch (e) {
    console.error(e);
    errorMessage.value = "Không tải được danh sách sản phẩm.";
  } finally {
    loading.value = false;
  }
}

function handleImageChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  productForm.image = file;

  const reader = new FileReader();
  reader.onload = () => {
    previewImage.value = reader.result;
  };
  reader.readAsDataURL(file);
}

async function saveProduct() {
  saving.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const formData = new FormData();
    formData.append("category_id", productForm.category_id);
    formData.append("name", productForm.name);
    formData.append("description", productForm.description || "");
    formData.append("price", productForm.price);
    formData.append("stock", productForm.stock);
    if (productForm.discount_percent !== "") {
      formData.append("discount_percent", productForm.discount_percent);
    }
    if (productForm.image) {
      formData.append("image", productForm.image);
    }

    if (isEditing.value && editingId.value) {
      formData.append("_method", "PUT");
      await axios.post(`/api/products/${editingId.value}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      successMessage.value = "Cập nhật sản phẩm thành công.";
    } else {
      await axios.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      successMessage.value = "Tạo sản phẩm mới thành công.";
    }

    await fetchProducts(pagination.current_page);
    setTimeout(closeModal, 400);
  } catch (e) {
    console.error(e);
    if (e.response?.data?.message) {
      errorMessage.value = e.response.data.message;
    } else if (e.response?.data?.errors) {
      const first = Object.values(e.response.data.errors)[0];
      errorMessage.value = Array.isArray(first) ? first[0] : String(first);
    } else {
      errorMessage.value = "Có lỗi khi lưu sản phẩm.";
    }
  } finally {
    saving.value = false;
  }
}

async function deleteProduct(product) {
  if (!confirm(`Xóa sản phẩm "${product.name}"?`)) return;
  try {
    await axios.delete(`/api/products/${product.id}`);
    await fetchProducts(pagination.current_page);
  } catch (e) {
    console.error(e);
    alert("Xóa sản phẩm thất bại.");
  }
}

function changePage(page) {
  if (page < 1 || page > pagination.last_page || page === pagination.current_page) return;
  fetchProducts(page);
}

function applyFilters() {
  fetchProducts(1);
}

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchProducts()]);
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold text-slate-800">Quản lý sản phẩm</h1>
        <p class="text-sm text-slate-500 mt-1">
          Xem, tìm kiếm, thêm mới và chỉnh sửa sản phẩm trong hệ thống.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium
               bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
        @click="openCreateModal"
      >
        <span class="mr-1 text-lg">＋</span>
        Thêm sản phẩm
      </button>
    </div>

    <ProductFilters
      v-model:search="filters.search"
      v-model:category-id="filters.category_id"
      v-model:sort="filters.sort"
      :categories="categories"
      :loading="loading"
      @apply="applyFilters"
    />

    <div
      v-if="errorMessage"
      class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700"
    >
      {{ errorMessage }}
    </div>

    <ProductTable
      :products="products"
      :categories="categories"
      :pagination="pagination"
      :loading="loading"
      @edit="openEditModal"
      @delete="deleteProduct"
      @change-page="changePage"
    />

    <div
      v-if="showModal"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-800">
            {{ isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm" }}
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

          <div class="grid md:grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-medium text-slate-500 mb-1 block">
                Danh mục <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="productForm.category_id"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                       bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              >
                <option value="">Chọn danh mục</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-xs font-medium text-slate-500 mb-1 block">
                Tên sản phẩm <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="productForm.name"
                type="text"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="text-xs font-medium text-slate-500 mb-1 block">Giá (VNĐ)</label>
              <input
                v-model="productForm.price"
                type="number"
                min="0"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="text-xs font-medium text-slate-500 mb-1 block">Tồn kho</label>
              <input
                v-model="productForm.stock"
                type="number"
                min="0"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="text-xs font-medium text-slate-500 mb-1 block">
                Giảm giá (%)
              </label>
              <input
                v-model="productForm.discount_percent"
                type="number"
                min="0"
                max="100"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="text-xs font-medium text-slate-500 mb-1 block">Ảnh sản phẩm</label>
              <input
                type="file"
                accept="image/*"
                class="block w-full text-xs text-slate-500
                       file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0
                       file:text-xs file:font-medium file:bg-slate-100 file:text-slate-700
                       hover:file:bg-slate-200"
                @change="handleImageChange"
              />
              <div v-if="previewImage" class="mt-2">
                <img
                  :src="previewImage"
                  alt="preview"
                  class="h-24 w-24 object-cover rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>

          <div>
            <label class="text-xs font-medium text-slate-500 mb-1 block">Mô tả</label>
            <textarea
              v-model="productForm.description"
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
            @click="saveProduct"
          >
            <span v-if="saving" class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
            <span>{{ isEditing ? "Lưu thay đổi" : "Tạo sản phẩm" }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
