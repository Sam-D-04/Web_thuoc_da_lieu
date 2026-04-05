import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Mock product data aligned with DB schema
const mockProducts = [
  { id: 1, name: 'Gel rửa mặt trị mụn BHA 2%', slug: 'gel-rua-mat-tri-mun-bha-2', category: 'tri-mun', brand: 'Paula\'s Choice', price_listed: 189000, dosage_form: 'Gel', volume: '237ml', image: null, description: 'Gel rửa mặt chứa BHA 2% giúp làm sạch sâu, thông thoáng lỗ chân lông, trị mụn và ngăn mụn tái phát.', stock_quantity: 45, is_active: true, sold_count: 128 },
  { id: 2, name: 'Kem phục hồi hàng rào da Ceramide', slug: 'kem-phuc-hoi-hang-rao-da-ceramide', category: 'duong-am', brand: 'CeraVe', price_listed: 265000, dosage_form: 'Kem', volume: '52g', image: null, description: 'Kem dưỡng ẩm, phục hồi hàng rào bảo vệ da với Ceramide và Hyaluronic Acid.', stock_quantity: 32, is_active: true, sold_count: 95 },
  { id: 3, name: 'Serum giảm thâm mụn Niacinamide 10%', slug: 'serum-giam-tham-mun-niacinamide-10', category: 'lam-sang-da', brand: 'The Ordinary', price_listed: 320000, dosage_form: 'Serum', volume: '30ml', image: null, description: 'Serum Niacinamide 10% + Zinc 1% giúp kiểm soát dầu nhờn, thu nhỏ lỗ chân lông, giảm thâm sau mụn.', stock_quantity: 58, is_active: true, sold_count: 210 },
  { id: 4, name: 'Kem chống nắng da nhạy cảm SPF50+ PA++++', slug: 'kem-chong-nang-da-nhay-cam-spf50', category: 'chong-nang', brand: 'La Roche-Posay', price_listed: 298000, dosage_form: 'Kem', volume: '50ml', image: null, description: 'Kem chống nắng vật lý cho da nhạy cảm, không gây kích ứng, bảo vệ khỏi tia UVA/UVB.', stock_quantity: 25, is_active: true, sold_count: 176 },
  { id: 5, name: 'Kem chấm mụn Benzoyl Peroxide 2.5%', slug: 'kem-cham-mun-benzoyl-peroxide-2.5', category: 'tri-mun', brand: 'Acne Free', price_listed: 145000, dosage_form: 'Kem', volume: '20g', image: null, description: 'Kem chấm mụn hiệu quả với Benzoyl Peroxide 2.5% kết hợp Allantoin giúp se khít mụn nhanh chóng.', stock_quantity: 70, is_active: true, sold_count: 89 },
  { id: 6, name: 'Toner cân bằng độ ẩm Hialuronic Acid', slug: 'toner-can-bang-do-am-hialuronic-acid', category: 'duong-am', brand: 'Cosrx', price_listed: 235000, dosage_form: 'Lỏng', volume: '150ml', image: null, description: 'Toner cấp ẩm chuyên sâu với thành phần Hyaluronic Acid giúp da mềm mịn, căng bóng.', stock_quantity: 40, is_active: true, sold_count: 63 },
  { id: 7, name: 'Kem trị nám Tranexamic Acid 5%', slug: 'kem-tri-nam-tranexamic-acid-5', category: 'tri-nam', brand: 'SkinCeuticals', price_listed: 580000, dosage_form: 'Kem', volume: '30ml', image: null, description: 'Kem dưỡng trắng và giảm nám chứa Tranexamic Acid 5% kết hợp Vitamin C giúp da đều màu.', stock_quantity: 15, is_active: true, sold_count: 44 },
  { id: 8, name: 'Sữa rửa mặt dịu nhẹ không bọt', slug: 'sua-rua-mat-diu-nhe-khong-bot', category: 'duong-am', brand: 'Avène', price_listed: 178000, dosage_form: 'Lỏng', volume: '200ml', image: null, description: 'Sữa rửa mặt không xà phòng dịu nhẹ cho da nhạy cảm, không kéo căng da.', stock_quantity: 55, is_active: true, sold_count: 147 },
]

export const useProductStore = defineStore('products', () => {
  const products = ref(mockProducts)
  const hoveredId = ref(null)

  const activeProducts = computed(() => products.value.filter(p => p.is_active))

  const getProductBySlug = (slug) => products.value.find(p => p.slug === slug)
  const getProductById = (id) => products.value.find(p => String(p.id) === String(id))

  const filteredProducts = (category = '', query = '') => {
    return activeProducts.value.filter(p => {
      const matchCat = category ? p.category === category : true
      const matchQ = query ? (p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase())) : true
      return matchCat && matchQ
    })
  }

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  return { products, hoveredId, activeProducts, getProductBySlug, getProductById, filteredProducts, formatPrice }
})
