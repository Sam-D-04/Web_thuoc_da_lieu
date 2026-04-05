import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000
})

const USE_MOCK = String(import.meta.env.VITE_WAREHOUSE_USE_MOCK ?? 'true') === 'true'

const categorySeed = [
  { id: 1, name: 'Trị mụn' },
  { id: 2, name: 'Phục hồi da' },
  { id: 3, name: 'Chống nắng' },
  { id: 4, name: 'Viêm da' }
]

const brandSeed = [
  { id: 1, name: 'La Roche-Posay' },
  { id: 2, name: 'SVR' },
  { id: 3, name: 'Avene' },
  { id: 4, name: 'Bioderma' }
]

const productSeed = [
  {
    id: 1,
    name: 'Effaclar Duo+M',
    sku: 'LRP-EFF-DUO',
    category_id: 1,
    brand_id: 1,
    unit: 'Tuyp',
    price: 365000,
    stock_quantity: 42,
    reorder_level: 15,
    is_active: true,
    created_at: '2026-01-10T08:10:00Z'
  },
  {
    id: 2,
    name: 'Cicavit+ Creme',
    sku: 'SVR-CICA-50',
    category_id: 2,
    brand_id: 2,
    unit: 'Tuyp',
    price: 320000,
    stock_quantity: 10,
    reorder_level: 20,
    is_active: true,
    created_at: '2026-01-12T08:10:00Z'
  },
  {
    id: 3,
    name: 'Cleanance SPF50+',
    sku: 'AVE-SPF-50',
    category_id: 3,
    brand_id: 3,
    unit: 'Tuyp',
    price: 410000,
    stock_quantity: 28,
    reorder_level: 12,
    is_active: true,
    created_at: '2026-02-02T08:10:00Z'
  },
  {
    id: 4,
    name: 'Atoderm Intensive Baume',
    sku: 'BIO-ATO-BAUME',
    category_id: 4,
    brand_id: 4,
    unit: 'Chai',
    price: 515000,
    stock_quantity: 8,
    reorder_level: 10,
    is_active: true,
    created_at: '2026-02-22T08:10:00Z'
  }
]

const batchSeed = [
  {
    id: 1,
    product_id: 1,
    batch_no: 'LREF-2409-A',
    quantity: 60,
    remaining_quantity: 25,
    import_price: 290000,
    manufacture_date: '2025-09-01',
    expiry_date: '2026-05-20',
    received_date: '2026-01-03'
  },
  {
    id: 2,
    product_id: 1,
    batch_no: 'LREF-2501-B',
    quantity: 50,
    remaining_quantity: 17,
    import_price: 300000,
    manufacture_date: '2025-12-01',
    expiry_date: '2026-12-15',
    received_date: '2026-02-07'
  },
  {
    id: 3,
    product_id: 2,
    batch_no: 'SVRC-2411-A',
    quantity: 40,
    remaining_quantity: 10,
    import_price: 250000,
    manufacture_date: '2025-11-10',
    expiry_date: '2026-04-21',
    received_date: '2026-01-16'
  },
  {
    id: 4,
    product_id: 4,
    batch_no: 'BIOA-2407-A',
    quantity: 30,
    remaining_quantity: 8,
    import_price: 420000,
    manufacture_date: '2025-07-10',
    expiry_date: '2026-04-05',
    received_date: '2026-01-22'
  }
]

const transactionSeed = [
  {
    id: 1,
    product_id: 1,
    batch_id: 1,
    transaction_type: 'in',
    quantity: 60,
    reference_code: 'IMP-1001',
    note: 'Nhap kho dau ky',
    created_at: '2026-01-03T08:15:00Z'
  },
  {
    id: 2,
    product_id: 1,
    batch_id: 1,
    transaction_type: 'out',
    quantity: 20,
    reference_code: 'SO-2001',
    note: 'Xuat ban le',
    created_at: '2026-03-05T10:02:00Z'
  },
  {
    id: 3,
    product_id: 2,
    batch_id: 3,
    transaction_type: 'out',
    quantity: 30,
    reference_code: 'SO-2030',
    note: 'Xuat nha thuoc',
    created_at: '2026-03-28T09:22:00Z'
  },
  {
    id: 4,
    product_id: 4,
    batch_id: 4,
    transaction_type: 'adjust',
    quantity: -2,
    reference_code: 'ADJ-301',
    note: 'Vo bao bi',
    created_at: '2026-04-01T14:00:00Z'
  }
]

const alertSeed = [
  {
    id: 1,
    alert_type: 'low_stock',
    product_id: 2,
    batch_id: null,
    message: 'Cicavit+ Creme ton kho thap hon nguong dat lai',
    status: 'open',
    created_at: '2026-04-02T08:00:00Z'
  },
  {
    id: 2,
    alert_type: 'expiring_soon',
    product_id: 4,
    batch_id: 4,
    message: 'Lo BIOA-2407-A sap het han trong 2 ngay',
    status: 'open',
    created_at: '2026-04-02T09:15:00Z'
  },
  {
    id: 3,
    alert_type: 'expired',
    product_id: 2,
    batch_id: 3,
    message: 'Lo SVRC-2411-A da het han',
    status: 'open',
    created_at: '2026-04-01T08:40:00Z'
  }
]

const mockDb = {
  categories: [...categorySeed],
  brands: [...brandSeed],
  products: [...productSeed],
  batches: [...batchSeed],
  inventory_transactions: [...transactionSeed],
  warehouse_alerts: [...alertSeed]
}

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

const nextId = (items) => (items.length ? Math.max(...items.map((item) => Number(item.id) || 0)) + 1 : 1)

const normalizeText = (value) => String(value || '').trim().toLowerCase()

const paginate = (items, page = 1, pageSize = 10) => {
  const currentPage = Number(page) || 1
  const size = Number(pageSize) || 10
  const start = (currentPage - 1) * size
  const end = start + size
  const total = items.length

  return {
    data: items.slice(start, end),
    meta: {
      page: currentPage,
      pageSize: size,
      total,
      totalPages: Math.max(1, Math.ceil(total / size))
    }
  }
}

const daysToExpiry = (expiryDate) => {
  const end = new Date(expiryDate)
  const now = new Date()
  end.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24))
}

const resolveLookup = () => {
  const categoryMap = new Map(mockDb.categories.map((item) => [item.id, item.name]))
  const brandMap = new Map(mockDb.brands.map((item) => [item.id, item.name]))
  const productMap = new Map(mockDb.products.map((item) => [item.id, item]))

  return { categoryMap, brandMap, productMap }
}

const enrichProduct = (product) => {
  const { categoryMap, brandMap } = resolveLookup()
  return {
    ...product,
    category_name: categoryMap.get(product.category_id) || 'N/A',
    brand_name: brandMap.get(product.brand_id) || 'N/A'
  }
}

const enrichBatch = (batch) => {
  const { productMap } = resolveLookup()
  const product = productMap.get(batch.product_id)
  const remaining = Number(batch.remaining_quantity) || 0
  return {
    ...batch,
    product_name: product?.name || 'Unknown',
    days_to_expiry: daysToExpiry(batch.expiry_date),
    batch_value: remaining * Number(batch.import_price || 0)
  }
}

const enrichAlert = (alert) => {
  const { productMap } = resolveLookup()
  const product = productMap.get(alert.product_id)
  return {
    ...alert,
    product_name: product?.name || 'Unknown'
  }
}

const buildDashboard = () => {
  const enrichedBatches = mockDb.batches.map(enrichBatch)
  const expiringSoon = enrichedBatches.filter((item) => item.days_to_expiry >= 0 && item.days_to_expiry <= 30).length
  const lowStock = mockDb.products.filter((item) => Number(item.stock_quantity) <= Number(item.reorder_level)).length

  return {
    total_products: mockDb.products.length,
    total_batches: mockDb.batches.length,
    inventory_value: mockDb.batches.reduce(
      (sum, item) => sum + Number(item.remaining_quantity || 0) * Number(item.import_price || 0),
      0
    ),
    expiring_batches: expiringSoon,
    low_stock_items: lowStock,
    alerts_summary: {
      low_stock: mockDb.warehouse_alerts.filter((item) => item.alert_type === 'low_stock' && item.status === 'open').length,
      expiring_soon: mockDb.warehouse_alerts.filter((item) => item.alert_type === 'expiring_soon' && item.status === 'open').length,
      expired: mockDb.warehouse_alerts.filter((item) => item.alert_type === 'expired' && item.status === 'open').length
    }
  }
}

const mockApi = {
  async getDashboard() {
    await wait()
    return { data: buildDashboard() }
  },

  async getLookups() {
    await wait(120)
    return {
      data: {
        categories: mockDb.categories,
        brands: mockDb.brands
      }
    }
  },

  async getProducts(params = {}) {
    await wait()
    const search = normalizeText(params.search)
    const categoryId = Number(params.category_id || 0)
    const page = Number(params.page || 1)
    const pageSize = Number(params.pageSize || 10)

    let rows = mockDb.products.map(enrichProduct)

    if (search) {
      rows = rows.filter(
        (item) =>
          normalizeText(item.name).includes(search) ||
          normalizeText(item.sku).includes(search) ||
          normalizeText(item.brand_name).includes(search)
      )
    }

    if (categoryId) {
      rows = rows.filter((item) => Number(item.category_id) === categoryId)
    }

    rows = rows.sort((a, b) => Number(b.id) - Number(a.id))
    return paginate(rows, page, pageSize)
  },

  async createProduct(payload) {
    await wait()
    const item = {
      id: nextId(mockDb.products),
      name: payload.name,
      sku: payload.sku,
      category_id: Number(payload.category_id),
      brand_id: Number(payload.brand_id),
      unit: payload.unit || 'Tuyp',
      price: Number(payload.price || 0),
      stock_quantity: Number(payload.stock_quantity || 0),
      reorder_level: Number(payload.reorder_level || 0),
      is_active: payload.is_active !== false,
      created_at: new Date().toISOString()
    }

    mockDb.products.push(item)
    return { data: enrichProduct(item) }
  },

  async updateProduct(id, payload) {
    await wait()
    const index = mockDb.products.findIndex((item) => Number(item.id) === Number(id))
    if (index === -1) throw new Error('Khong tim thay san pham')

    mockDb.products[index] = {
      ...mockDb.products[index],
      ...payload,
      category_id: Number(payload.category_id ?? mockDb.products[index].category_id),
      brand_id: Number(payload.brand_id ?? mockDb.products[index].brand_id),
      price: Number(payload.price ?? mockDb.products[index].price),
      stock_quantity: Number(payload.stock_quantity ?? mockDb.products[index].stock_quantity),
      reorder_level: Number(payload.reorder_level ?? mockDb.products[index].reorder_level)
    }

    return { data: enrichProduct(mockDb.products[index]) }
  },

  async deleteProduct(id) {
    await wait()
    mockDb.products = mockDb.products.filter((item) => Number(item.id) !== Number(id))
    return { data: true }
  },

  async getBatches(params = {}) {
    await wait()
    const search = normalizeText(params.search)
    const status = normalizeText(params.status)
    const page = Number(params.page || 1)
    const pageSize = Number(params.pageSize || 10)

    let rows = mockDb.batches.map(enrichBatch)

    if (search) {
      rows = rows.filter(
        (item) => normalizeText(item.batch_no).includes(search) || normalizeText(item.product_name).includes(search)
      )
    }

    if (status && status !== 'all') {
      rows = rows.filter((item) => {
        if (status === 'expired') return item.days_to_expiry < 0
        if (status === 'expiring_soon') return item.days_to_expiry >= 0 && item.days_to_expiry <= 30
        if (status === 'safe') return item.days_to_expiry > 30
        return true
      })
    }

    rows = rows.sort((a, b) => a.days_to_expiry - b.days_to_expiry)
    return paginate(rows, page, pageSize)
  },

  async createBatch(payload) {
    await wait()
    const item = {
      id: nextId(mockDb.batches),
      product_id: Number(payload.product_id),
      batch_no: payload.batch_no,
      quantity: Number(payload.quantity || 0),
      remaining_quantity: Number(payload.remaining_quantity || payload.quantity || 0),
      import_price: Number(payload.import_price || 0),
      manufacture_date: payload.manufacture_date,
      expiry_date: payload.expiry_date,
      received_date: payload.received_date || new Date().toISOString().slice(0, 10)
    }

    mockDb.batches.push(item)

    const productIndex = mockDb.products.findIndex((product) => Number(product.id) === Number(item.product_id))
    if (productIndex !== -1) {
      mockDb.products[productIndex].stock_quantity = Number(mockDb.products[productIndex].stock_quantity) + Number(item.quantity)
    }

    return { data: enrichBatch(item) }
  },

  async updateBatch(id, payload) {
    await wait()
    const index = mockDb.batches.findIndex((item) => Number(item.id) === Number(id))
    if (index === -1) throw new Error('Khong tim thay lo hang')

    mockDb.batches[index] = {
      ...mockDb.batches[index],
      ...payload,
      product_id: Number(payload.product_id ?? mockDb.batches[index].product_id),
      quantity: Number(payload.quantity ?? mockDb.batches[index].quantity),
      remaining_quantity: Number(payload.remaining_quantity ?? mockDb.batches[index].remaining_quantity),
      import_price: Number(payload.import_price ?? mockDb.batches[index].import_price)
    }

    return { data: enrichBatch(mockDb.batches[index]) }
  },

  async deleteBatch(id) {
    await wait()
    mockDb.batches = mockDb.batches.filter((item) => Number(item.id) !== Number(id))
    return { data: true }
  },

  async getInventoryTransactions(params = {}) {
    await wait()
    const page = Number(params.page || 1)
    const pageSize = Number(params.pageSize || 10)
    const search = normalizeText(params.search)
    const type = normalizeText(params.type)
    const { productMap } = resolveLookup()

    let rows = mockDb.inventory_transactions.map((item) => ({
      ...item,
      product_name: productMap.get(item.product_id)?.name || 'Unknown',
      batch_no: mockDb.batches.find((batch) => Number(batch.id) === Number(item.batch_id))?.batch_no || 'N/A'
    }))

    if (search) {
      rows = rows.filter(
        (item) =>
          normalizeText(item.product_name).includes(search) ||
          normalizeText(item.reference_code).includes(search) ||
          normalizeText(item.batch_no).includes(search)
      )
    }

    if (type && type !== 'all') {
      rows = rows.filter((item) => normalizeText(item.transaction_type) === type)
    }

    rows = rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const summary = {
      in_total: rows.filter((item) => item.transaction_type === 'in').reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      out_total: rows.filter((item) => item.transaction_type === 'out').reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      adjust_total: rows.filter((item) => item.transaction_type === 'adjust').reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    }

    return {
      ...paginate(rows, page, pageSize),
      summary
    }
  },

  async getAlerts(params = {}) {
    await wait()
    const page = Number(params.page || 1)
    const pageSize = Number(params.pageSize || 10)
    const type = normalizeText(params.type)
    const status = normalizeText(params.status)

    let rows = mockDb.warehouse_alerts.map(enrichAlert)

    if (type && type !== 'all') {
      rows = rows.filter((item) => normalizeText(item.alert_type) === type)
    }

    if (status && status !== 'all') {
      rows = rows.filter((item) => normalizeText(item.status) === status)
    }

    rows = rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return paginate(rows, page, pageSize)
  },

  async resolveAlert(id) {
    await wait()
    const index = mockDb.warehouse_alerts.findIndex((item) => Number(item.id) === Number(id))
    if (index === -1) throw new Error('Khong tim thay canh bao')

    mockDb.warehouse_alerts[index].status = 'handled'
    mockDb.warehouse_alerts[index].resolved_at = new Date().toISOString()

    return { data: enrichAlert(mockDb.warehouse_alerts[index]) }
  }
}

const realApi = {
  getDashboard: () => apiClient.get('/warehouse/dashboard'),
  getLookups: () => apiClient.get('/warehouse/lookups'),
  getProducts: (params) => apiClient.get('/warehouse/products', { params }).then((response) => response.data),
  createProduct: (payload) => apiClient.post('/warehouse/products', payload),
  updateProduct: (id, payload) => apiClient.put(`/warehouse/products/${id}`, payload),
  deleteProduct: (id) => apiClient.delete(`/warehouse/products/${id}`),
  getBatches: (params) => apiClient.get('/warehouse/batches', { params }).then((response) => response.data),
  createBatch: (payload) => apiClient.post('/warehouse/batches', payload),
  updateBatch: (id, payload) => apiClient.put(`/warehouse/batches/${id}`, payload),
  deleteBatch: (id) => apiClient.delete(`/warehouse/batches/${id}`),
  getInventoryTransactions: (params) => apiClient.get('/warehouse/inventory-transactions', { params }).then((response) => response.data),
  getAlerts: (params) => apiClient.get('/warehouse/alerts', { params }).then((response) => response.data),
  resolveAlert: (id) => apiClient.patch(`/warehouse/alerts/${id}/resolve`)
}

const source = USE_MOCK ? mockApi : realApi

export const warehouseApi = {
  async getDashboard() {
    const response = await source.getDashboard()
    return response.data || response
  },

  async getLookups() {
    const response = await source.getLookups()
    return response.data || response
  },

  async getProducts(params) {
    return source.getProducts(params)
  },

  async createProduct(payload) {
    const response = await source.createProduct(payload)
    return response.data || response
  },

  async updateProduct(id, payload) {
    const response = await source.updateProduct(id, payload)
    return response.data || response
  },

  async deleteProduct(id) {
    return source.deleteProduct(id)
  },

  async getBatches(params) {
    return source.getBatches(params)
  },

  async createBatch(payload) {
    const response = await source.createBatch(payload)
    return response.data || response
  },

  async updateBatch(id, payload) {
    const response = await source.updateBatch(id, payload)
    return response.data || response
  },

  async deleteBatch(id) {
    return source.deleteBatch(id)
  },

  async getInventoryTransactions(params) {
    return source.getInventoryTransactions(params)
  },

  async getAlerts(params) {
    return source.getAlerts(params)
  },

  async resolveAlert(id) {
    const response = await source.resolveAlert(id)
    return response.data || response
  }
}
