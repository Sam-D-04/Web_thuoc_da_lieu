import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBatchStore = defineStore('batch', () => {
  const batches = ref([
    {
      id: 'B001',
      productId: 1,
      product_id: 1,
      productName: 'Gel rửa mặt trị mụn BHA 2%',
      product_name: 'Gel rửa mặt trị mụn BHA 2%',
      batch_code: 'DER-BHA-2601',
      batchNo: 'DER-BHA-2601',
      quantity: 120,
      remaining_quantity: 120,
      expiryDate: '2027-01-15',
      expiry_date: '2027-01-15',
      manufactureDate: '2025-01-15',
      manufacture_date: '2025-01-15',
      supplier: 'DermaLab Việt Nam',
      cost: 98000,
      status: 'Còn hàng'
    },
    {
      id: 'B002',
      productId: 3,
      product_id: 3,
      productName: 'Serum giảm thâm mụn Niacinamide 10%',
      product_name: 'Serum giảm thâm mụn Niacinamide 10%',
      batch_code: 'DER-NIA-2504',
      batchNo: 'DER-NIA-2504',
      quantity: 40,
      remaining_quantity: 40,
      expiryDate: '2026-04-20',
      expiry_date: '2026-04-20',
      manufactureDate: '2024-04-20',
      manufacture_date: '2024-04-20',
      supplier: 'Skin Active Pharma',
      cost: 178000,
      status: 'Sắp hết hạn'
    },
    {
      id: 'B003',
      productId: 2,
      product_id: 2,
      productName: 'Kem phục hồi hàng rào da Ceramide',
      product_name: 'Kem phục hồi hàng rào da Ceramide',
      batch_code: 'DER-CER-2512',
      batchNo: 'DER-CER-2512',
      quantity: 80,
      remaining_quantity: 80,
      expiryDate: '2026-12-10',
      expiry_date: '2026-12-10',
      manufactureDate: '2024-12-10',
      manufacture_date: '2024-12-10',
      supplier: 'MediSkin Biotech',
      cost: 145000,
      status: 'Còn hàng'
    },
    {
      id: 'B004',
      productId: 5,
      product_id: 5,
      productName: 'Kem chấm mụn Benzoyl Peroxide 2.5%',
      product_name: 'Kem chấm mụn Benzoyl Peroxide 2.5%',
      batch_code: 'DER-BPO-2403',
      batchNo: 'DER-BPO-2403',
      quantity: 25,
      remaining_quantity: 25,
      expiryDate: '2026-03-28',
      expiry_date: '2026-03-28',
      manufactureDate: '2024-03-28',
      manufacture_date: '2024-03-28',
      supplier: 'Acnicare Labs',
      cost: 68000,
      status: 'Hết hạn'
    },
    {
      id: 'B005',
      productId: 4,
      product_id: 4,
      productName: 'Kem chống nắng da nhạy cảm SPF50+ PA++++',
      product_name: 'Kem chống nắng da nhạy cảm SPF50+ PA++++',
      batch_code: 'DER-UV-2609',
      batchNo: 'DER-UV-2609',
      quantity: 60,
      remaining_quantity: 60,
      expiryDate: '2026-09-30',
      expiry_date: '2026-09-30',
      manufactureDate: '2024-09-30',
      manufacture_date: '2024-09-30',
      supplier: 'Derma Protect Co.',
      cost: 172000,
      status: 'Còn hàng'
    }
  ])

  // Tính số ngày còn lại đến ngày hết hạn
  const getDaysToExpiry = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diff = expiry - today
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  // Xác định trạng thái dựa trên ngày hết hạn
  const getExpiryStatus = (expiryDate) => {
    const days = getDaysToExpiry(expiryDate)
    if (days < 0) return 'Hết hạn'
    if (days <= 30) return 'Sắp hết hạn'
    return 'Còn hàng'
  }

  // FEFO: Lô hàng có ngày hết hạn gần nhất được ưu tiên sử dụng
  const batchesSortedByFefo = computed(() => {
    return batches.value
      .map(batch => ({
        ...batch,
        daysToExpiry: getDaysToExpiry(batch.expiry_date || batch.expiryDate),
        status: getExpiryStatus(batch.expiry_date || batch.expiryDate)
      }))
      .sort((a, b) => a.daysToExpiry - b.daysToExpiry)
  })

  const expiredBatches = computed(() => {
    return batches.value.filter(b => getDaysToExpiry(b.expiry_date || b.expiryDate) < 0).length
  })

  const expiringBatches = computed(() => {
    return batches.value.filter(b => {
      const days = getDaysToExpiry(b.expiry_date || b.expiryDate)
      return days >= 0 && days <= 30
    }).length
  })

  const totalBatches = computed(() => batches.value.length)

  const addBatch = (batch) => {
    const newId = 'B' + String(parseInt(batches.value[batches.value.length - 1]?.id.substring(1) || '0') + 1).padStart(3, '0')
    const created = {
      id: newId,
      ...batch,
      productId: batch.product_id ?? batch.productId,
      product_id: batch.product_id ?? batch.productId,
      productName: batch.product_name ?? batch.productName,
      product_name: batch.product_name ?? batch.productName,
      batchNo: batch.batch_code ?? batch.batchNo,
      batch_code: batch.batch_code ?? batch.batchNo,
      quantity: Number(batch.quantity || 0),
      remaining_quantity: Number(batch.remaining_quantity ?? batch.quantity ?? 0),
      expiryDate: batch.expiry_date || batch.expiryDate,
      expiry_date: batch.expiry_date || batch.expiryDate,
      manufactureDate: batch.manufacture_date || batch.manufactureDate,
      manufacture_date: batch.manufacture_date || batch.manufactureDate,
      status: getExpiryStatus(batch.expiry_date || batch.expiryDate)
    }
    batches.value.push(created)
    return created
  }

  const updateBatch = (id, updates) => {
    const index = batches.value.findIndex(b => b.id === id)
    if (index > -1) {
      batches.value[index] = {
        ...batches.value[index],
        ...updates,
        productId: updates.product_id ?? updates.productId ?? batches.value[index].productId,
        product_id: updates.product_id ?? updates.productId ?? batches.value[index].product_id,
        productName: updates.product_name ?? updates.productName ?? batches.value[index].productName,
        product_name: updates.product_name ?? updates.productName ?? batches.value[index].product_name,
        batchNo: updates.batch_code ?? updates.batchNo ?? batches.value[index].batchNo,
        batch_code: updates.batch_code ?? updates.batchNo ?? batches.value[index].batch_code,
        quantity: Number(updates.quantity ?? batches.value[index].quantity ?? 0),
        remaining_quantity: Number(updates.remaining_quantity ?? updates.quantity ?? batches.value[index].remaining_quantity ?? batches.value[index].quantity ?? 0),
        expiryDate: updates.expiry_date || updates.expiryDate || batches.value[index].expiry_date || batches.value[index].expiryDate,
        expiry_date: updates.expiry_date || updates.expiryDate || batches.value[index].expiry_date || batches.value[index].expiryDate,
        manufactureDate: updates.manufacture_date || updates.manufactureDate || batches.value[index].manufactureDate,
        manufacture_date: updates.manufacture_date || updates.manufactureDate || batches.value[index].manufacture_date || batches.value[index].manufactureDate,
        status: getExpiryStatus(updates.expiry_date || updates.expiryDate || batches.value[index].expiry_date || batches.value[index].expiryDate)
      }
      return batches.value[index]
    }
    return null
  }

  const restoreBatchQuantity = (batchId, quantity) => {
    const index = batches.value.findIndex((batch) => batch.id === batchId)
    if (index === -1) return null

    const currentRemaining = Number(batches.value[index].remaining_quantity ?? batches.value[index].quantity ?? 0)
    batches.value[index] = {
      ...batches.value[index],
      remaining_quantity: currentRemaining + Number(quantity || 0)
    }
    return batches.value[index]
  }

  const deleteBatch = (id) => {
    const index = batches.value.findIndex(b => b.id === id)
    if (index > -1) {
      batches.value.splice(index, 1)
      return true
    }
    return false
  }

  // Lấy lô hàng ưu tiên (FEFO) cho một sản phẩm
  const getPriorityBatchForProduct = (productId) => {
    return batchesSortedByFefo.value.find(b => (b.product_id ?? b.productId) === productId && Number(b.remaining_quantity ?? b.quantity ?? 0) > 0)
  }

  return {
    batches,
    batchesSortedByFefo,
    expiredBatches,
    expiringBatches,
    totalBatches,
    addBatch,
    updateBatch,
    restoreBatchQuantity,
    deleteBatch,
    getDaysToExpiry,
    getExpiryStatus,
    getPriorityBatchForProduct
  }
})
