import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductStore = defineStore('product', () => {
  const products = ref([
    {
      id: 1,
      name: 'Gel rửa mặt trị mụn BHA 2%',
      type: 'Sữa rửa mặt',
      category: 'Mụn',
      price: 189000,
      stock: 52,
      stock_quantity: 52,
      stock_warning: 10,
      ingredients: 'Salicylic Acid 2%, Zinc PCA, Panthenol',
      usage: 'Làm ướt da mặt, massage 30 giây và rửa lại với nước',
      image: '/images/product-1.jpg',
      tags: ['Da dầu', 'Mụn'],
      status: 'Hoạt động'
    },
    {
      id: 2,
      name: 'Kem phục hồi hàng rào da Ceramide',
      type: 'Kem dưỡng',
      category: 'Phục hồi da',
      price: 265000,
      stock: 34,
      stock_quantity: 34,
      stock_warning: 10,
      ingredients: 'Ceramide NP, Cholesterol, Madecassoside',
      usage: 'Thoa lớp mỏng sau serum, dùng sáng và tối',
      image: '/images/product-2.jpg',
      tags: ['Da nhạy cảm', 'Phục hồi'],
      status: 'Hoạt động'
    },
    {
      id: 3,
      name: 'Serum giảm thâm mụn Niacinamide 10%',
      type: 'Serum',
      category: 'Thâm mụn',
      price: 320000,
      stock: 18,
      stock_quantity: 18,
      stock_warning: 10,
      ingredients: 'Niacinamide 10%, Tranexamic Acid 3%, NAG',
      usage: 'Thoa 2-3 giọt lên vùng da thâm sau bước làm sạch',
      image: '/images/product-3.jpg',
      tags: ['Mụn', 'Tăng sắc tố'],
      status: 'Hoạt động'
    },
    {
      id: 4,
      name: 'Kem chống nắng da nhạy cảm SPF50+ PA++++',
      type: 'Chống nắng',
      category: 'Chống nắng',
      price: 298000,
      stock: 0,
      stock_quantity: 0,
      stock_warning: 10,
      ingredients: 'Uvinul A Plus, Tinosorb S, Panthenol',
      usage: 'Thoa đủ lượng trước nắng 15 phút, lặp lại mỗi 2-3 giờ',
      image: '/images/product-4.jpg',
      tags: ['Da nhạy cảm', 'Bảo vệ da'],
      status: 'Ngừng'
    },
    {
      id: 5,
      name: 'Kem chấm mụn Benzoyl Peroxide 2.5%',
      type: 'Điều trị chấm điểm',
      category: 'Điều trị mụn',
      price: 145000,
      stock: 6,
      stock_quantity: 6,
      stock_warning: 10,
      ingredients: 'Benzoyl Peroxide 2.5%, Allantoin, Glycerin',
      usage: 'Chấm trực tiếp lên nốt mụn 1-2 lần/ngày',
      image: '/images/product-5.jpg',
      tags: ['Mụn viêm', 'Da dầu'],
      status: 'Ngừng'
    }
  ])

  const totalProducts = computed(() => products.value.length)
  const lowStockProducts = computed(() => products.value.filter(p => p.stock <= 10).length)

  const addProduct = (product) => {
    product.id = Math.max(...products.value.map(p => p.id)) + 1
    product.stock_quantity = product.stock_quantity ?? product.stock ?? 0
    product.stock_warning = product.stock_warning ?? 10
    products.value.push(product)
  }

  const updateProduct = (id, updates) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index > -1) {
      products.value[index] = {
        ...products.value[index],
        ...updates,
        stock_quantity: updates.stock_quantity ?? updates.stock ?? products.value[index].stock_quantity ?? products.value[index].stock ?? 0,
        stock_warning: updates.stock_warning ?? products.value[index].stock_warning ?? 10
      }
    }
  }

  const deleteProduct = (id) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index > -1) {
      products.value.splice(index, 1)
    }
  }

  return {
    products,
    totalProducts,
    lowStockProducts,
    addProduct,
    updateProduct,
    deleteProduct
  }
})
