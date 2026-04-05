import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useBatchStore } from '@/stores/batches'
import { useProductStore } from '@/stores/products'
import { useCustomerStore } from '@/stores/customers'

export const useOrderStore = defineStore('order', () => {
  const batchStore = useBatchStore()
  const productStore = useProductStore()
  const customerStore = useCustomerStore()

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Chuyển khoản' },
    { value: 'vnpay', label: 'VNPay' },
    { value: 'momo', label: 'MoMo' }
  ]

  const orderStatusOptions = ['pending', 'confirmed', 'packing', 'shipping', 'delivered', 'cancelled']

  const orderStatusLabels = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    packing: 'Đang đóng gói',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy'
  }

  const orderStatusColors = {
    pending: 'warning',
    confirmed: 'processing',
    packing: 'geekblue',
    shipping: 'blue',
    delivered: 'success',
    cancelled: 'error'
  }

  const paymentMethodLabels = {
    bank_transfer: 'Chuyển khoản',
    vnpay: 'VNPay',
    momo: 'MoMo'
  }

  const formatCurrencyNumber = (value) => Number(value || 0)

  const normalizeCustomerAddress = (customer) => ({
    id: `ADDR-${customer.id}`,
    customerId: customer.id,
    recipientName: customer.name,
    phone: customer.phone,
    addressLine: customer.address,
    isDefault: true
  })

  const getCustomerAddresses = (customerId) => {
    const customer = customerStore.customers.find((item) => item.id === customerId)
    return customer ? [normalizeCustomerAddress(customer)] : []
  }

  const resolveProduct = (productId) => {
    return productStore.products.find((item) => String(item.id) === String(productId))
  }

  const resolveBatch = (batchId) => {
    return batchStore.batches.find((item) => String(item.id) === String(batchId))
  }

  const getBatchAvailableQuantity = (batch) => Number(batch?.remaining_quantity ?? batch?.quantity ?? 0)

  const getAvailableBatchesForProduct = (productId, excludeCancelledOrderId = null) => {
    const source = batchStore.batchesSortedByFefo.filter((batch) => {
      const matchesProduct = String(batch.product_id ?? batch.productId) === String(productId)
      const availableQuantity = getBatchAvailableQuantity(batch)
      return matchesProduct && availableQuantity > 0 && batchStore.getDaysToExpiry(batch.expiry_date || batch.expiryDate) >= 0
    })

    return source.map((batch) => ({
      id: batch.id,
      label: `${batch.batch_code || batch.batchNo} - còn ${getBatchAvailableQuantity(batch)}`,
      value: batch.id,
      remaining_quantity: getBatchAvailableQuantity(batch),
      expiry_date: batch.expiry_date || batch.expiryDate,
      product_id: batch.product_id ?? batch.productId
    }))
  }

  const orders = ref([
    {
      id: 'ORD-2024-001',
      customerId: 'CUST-001',
      customerName: 'Nguyễn Văn A',
      customerPhone: '0901234567',
      customerEmail: 'nguyenvana@email.com',
      customerAddress: '123 Đường Nguyễn Huệ, Quận 1, TPHCM',
      orderDate: '2024-12-01',
      deliveryDate: '2024-12-05',
      total_amount: 445000,
      shipping_fee: 20000,
      final_amount: 465000,
      payment_status: 'paid',
      payment_method: 'bank_transfer',
      order_status: 'delivered',
      note: 'Giao thành công.',
      status: 'Đã giao hàng',
      items: [
        {
          productId: 1,
          product_id: 1,
          productName: 'Gel rửa mặt trị mụn BHA 2%',
          product_name: 'Gel rửa mặt trị mụn BHA 2%',
          quantity: 1,
          price: 189000,
          unit_price: 189000,
          batchId: 'B001',
          batch_id: 'B001',
          subtotal: 189000
        },
        {
          productId: 2,
          product_id: 2,
          productName: 'Kem phục hồi hàng rào da Ceramide',
          product_name: 'Kem phục hồi hàng rào da Ceramide',
          quantity: 1,
          price: 265000,
          unit_price: 265000,
          batchId: 'B003',
          batch_id: 'B003',
          subtotal: 265000
        }
      ]
    },
    {
      id: 'ORD-2024-002',
      customerId: 'CUST-002',
      customerName: 'Trần Thị B',
      customerPhone: '0912345678',
      customerEmail: 'tranthibhh@email.com',
      customerAddress: '456 Đường Lê Lợi, Quận 1, TPHCM',
      orderDate: '2024-12-02',
      deliveryDate: '2024-12-06',
      total_amount: 938000,
      shipping_fee: 20000,
      final_amount: 958000,
      payment_status: 'paid',
      payment_method: 'vnpay',
      order_status: 'confirmed',
      note: 'Khách xác nhận nhận hàng buổi chiều.',
      status: 'Đang xác nhận',
      items: [
        {
          productId: 3,
          product_id: 3,
          productName: 'Serum giảm thâm mụn Niacinamide 10%',
          product_name: 'Serum giảm thâm mụn Niacinamide 10%',
          quantity: 2,
          price: 320000,
          unit_price: 320000,
          batchId: 'B002',
          batch_id: 'B002',
          subtotal: 640000
        },
        {
          productId: 4,
          product_id: 4,
          productName: 'Kem chống nắng da nhạy cảm SPF50+ PA++++',
          product_name: 'Kem chống nắng da nhạy cảm SPF50+ PA++++',
          quantity: 1,
          price: 298000,
          unit_price: 298000,
          batchId: 'B005',
          batch_id: 'B005',
          subtotal: 298000
        }
      ]
    },
    {
      id: 'ORD-2024-003',
      customerId: 'CUST-003',
      customerName: 'Lê Hoàng C',
      customerPhone: '0923456789',
      customerEmail: 'lehoangc@email.com',
      customerAddress: '789 Đường Hồ Tùng Mậu, Quận 1, TPHCM',
      orderDate: '2024-12-03',
      deliveryDate: null,
      total_amount: 523000,
      shipping_fee: 30000,
      final_amount: 553000,
      payment_status: 'paid',
      payment_method: 'momo',
      order_status: 'processing',
      note: 'Đang đóng gói.',
      status: 'Đang chuẩn bị hàng',
      items: [
        {
          productId: 1,
          product_id: 1,
          productName: 'Gel rửa mặt trị mụn BHA 2%',
          product_name: 'Gel rửa mặt trị mụn BHA 2%',
          quantity: 2,
          price: 189000,
          unit_price: 189000,
          batchId: 'B001',
          batch_id: 'B001',
          subtotal: 378000
        },
        {
          productId: 5,
          product_id: 5,
          productName: 'Kem chấm mụn Benzoyl Peroxide 2.5%',
          product_name: 'Kem chấm mụn Benzoyl Peroxide 2.5%',
          quantity: 1,
          price: 145000,
          unit_price: 145000,
          batchId: 'B004',
          batch_id: 'B004',
          subtotal: 145000
        }
      ]
    },
    {
      id: 'ORD-2024-004',
      customerId: 'CUST-001',
      customerName: 'Nguyễn Văn A',
      customerPhone: '0901234567',
      customerEmail: 'nguyenvana@email.com',
      customerAddress: '123 Đường Nguyễn Huệ, Quận 1, TPHCM',
      orderDate: '2024-12-04',
      deliveryDate: null,
      total_amount: 563000,
      shipping_fee: 20000,
      final_amount: 583000,
      payment_status: 'unpaid',
      payment_method: 'bank_transfer',
      order_status: 'pending',
      note: 'Chờ xử lý thanh toán.',
      status: 'Chờ xử lý',
      items: [
        {
          productId: 2,
          product_id: 2,
          productName: 'Kem phục hồi hàng rào da Ceramide',
          product_name: 'Kem phục hồi hàng rào da Ceramide',
          quantity: 1,
          price: 265000,
          unit_price: 265000,
          batchId: 'B003',
          batch_id: 'B003',
          subtotal: 265000
        },
        {
          productId: 4,
          product_id: 4,
          productName: 'Kem chống nắng da nhạy cảm SPF50+ PA++++',
          product_name: 'Kem chống nắng da nhạy cảm SPF50+ PA++++',
          quantity: 1,
          price: 298000,
          unit_price: 298000,
          batchId: 'B005',
          batch_id: 'B005',
          subtotal: 298000
        }
      ]
    }
  ])

  const totalOrders = computed(() => orders.value.length)
  
  const pendingOrders = computed(() => 
    orders.value.filter(o => o.order_status === 'pending').length
  )
  
  const processingOrders = computed(() =>
    orders.value.filter(o => ['confirmed', 'packing', 'shipping'].includes(o.order_status)).length
  )

  const totalRevenue = computed(() =>
    orders.value.reduce((sum, order) => sum + Number(order.final_amount || 0), 0)
  )

  const createOrderId = () => {
    const lastNumeric = orders.value.reduce((max, order) => {
      const match = String(order.id).match(/(\d+)$/)
      return Math.max(max, match ? Number(match[1]) : 0)
    }, 0)

    return `ORD-${String(lastNumeric + 1).padStart(4, '0')}`
  }

  const normalizeOrderStatus = (status) => {
    if (orderStatusOptions.includes(status)) return status
    if (status === 'Chờ xử lý') return 'pending'
    if (status === 'Đã xác nhận') return 'confirmed'
    if (status === 'Đang đóng gói') return 'packing'
    if (status === 'Đang chuẩn bị hàng') return 'packing'
    if (status === 'Đang giao') return 'shipping'
    if (status === 'Đã giao') return 'delivered'
    if (status === 'Đã hủy') return 'cancelled'
    if (status === 'processing') return 'packing'
    return 'pending'
  }

  const mapStatusLabel = (status) => orderStatusLabels[normalizeOrderStatus(status)]

  const mapOrderForView = (order) => ({
    ...order,
    order_status: normalizeOrderStatus(order.order_status || order.status),
    status_label: mapStatusLabel(order.order_status || order.status),
    status_color: orderStatusColors[normalizeOrderStatus(order.order_status || order.status)],
    payment_method_label: paymentMethodLabels[order.payment_method] || order.payment_method || '-'
  })

  const createOrder = ({ customerId, customer, address, items, paymentMethod, shippingFee = 0, note = '' }) => {
    const selectedCustomer = customer || customerStore.customers.find((item) => String(item.id) === String(customerId))
    if (!selectedCustomer) {
      throw new Error('Không tìm thấy khách hàng')
    }

    if (!items?.length) {
      throw new Error('Đơn hàng phải có ít nhất một sản phẩm')
    }

    const orderId = createOrderId()
    const mappedItems = items.map((item, index) => {
      const product = resolveProduct(item.productId)
      const batch = resolveBatch(item.batchId)

      if (!product) throw new Error(`Không tìm thấy sản phẩm ở dòng ${index + 1}`)
      if (!batch) throw new Error(`Không tìm thấy lô ở dòng ${index + 1}`)

      const quantity = Number(item.quantity || 0)
      const available = getBatchAvailableQuantity(batch)
      if (quantity <= 0 || quantity > available) {
        throw new Error(`Số lượng ở dòng ${index + 1} vượt quá tồn khả dụng`)
      }

      batchStore.updateBatch(batch.id, {
        ...batch,
        remaining_quantity: available - quantity
      })

      const subtotal = Number(item.unit_price ?? product.price ?? 0) * quantity

      return {
        id: `${orderId}-ITEM-${index + 1}`,
        productId: product.id,
        product_id: product.id,
        productName: product.name,
        product_name: product.name,
        batchId: batch.id,
        batch_id: batch.id,
        quantity,
        price: Number(item.unit_price ?? product.price ?? 0),
        unit_price: Number(item.unit_price ?? product.price ?? 0),
        subtotal
      }
    })

    const totalAmount = mappedItems.reduce((sum, item) => sum + item.subtotal, 0)
    const finalAmount = totalAmount + Number(shippingFee || 0)

    const newOrder = {
      id: orderId,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerEmail: selectedCustomer.email,
      customerAddress: address || selectedCustomer.address || '',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: null,
      total_amount: totalAmount,
      shipping_fee: Number(shippingFee || 0),
      final_amount: finalAmount,
      payment_status: 'unpaid',
      payment_method: paymentMethod,
      order_status: 'pending',
      note,
      status: orderStatusLabels.pending,
      items: mappedItems
    }

    orders.value.unshift(newOrder)
    return mapOrderForView(newOrder)
  }

  const addOrder = (order) => {
    return createOrder(order)
  }

  const updateOrder = (id, updates) => {
    const index = orders.value.findIndex(o => o.id === id)
    if (index > -1) {
      orders.value[index] = {
        ...orders.value[index],
        ...updates,
        order_status: normalizeOrderStatus(updates.order_status || updates.status || orders.value[index].order_status),
        status: orderStatusLabels[normalizeOrderStatus(updates.order_status || updates.status || orders.value[index].order_status)],
        payment_method_label: paymentMethodLabels[updates.payment_method] || updates.payment_method || orders.value[index].payment_method_label
      }
      return mapOrderForView(orders.value[index])
    }

    return null
  }

  const updateOrderStatus = (id, status) => {
    const index = orders.value.findIndex(o => o.id === id)
    if (index > -1) {
      const normalized = normalizeOrderStatus(status)
      orders.value[index].order_status = normalized
      orders.value[index].status = orderStatusLabels[normalized]
      if (normalized === 'delivered') {
        orders.value[index].payment_status = 'paid'
        orders.value[index].deliveryDate = new Date().toISOString().split('T')[0]
      }
      if (normalized === 'cancelled') {
        orders.value[index].payment_status = 'unpaid'
      }

      return mapOrderForView(orders.value[index])
    }

    return null
  }

  const cancelOrder = (id, note = '') => {
    const index = orders.value.findIndex(o => o.id === id)
    if (index === -1) return null

    const order = orders.value[index]
    if (!['pending', 'confirmed', 'packing', 'shipping'].includes(order.order_status)) {
      throw new Error('Chỉ có thể hủy đơn ở trạng thái đang xử lý')
    }

    order.items.forEach((item) => {
      const batch = resolveBatch(item.batchId || item.batch_id)
      if (!batch) return

      const currentQuantity = Number(batch.remaining_quantity ?? batch.quantity ?? 0)
      batchStore.updateBatch(batch.id, {
        ...batch,
        remaining_quantity: currentQuantity + Number(item.quantity || 0)
      })
    })

    orders.value[index].order_status = 'cancelled'
    orders.value[index].status = orderStatusLabels.cancelled
    orders.value[index].payment_status = 'unpaid'
    orders.value[index].note = note || orders.value[index].note
    return mapOrderForView(orders.value[index])
  }

  const canDeleteOrder = (order) => ['pending', 'cancelled'].includes(order.order_status)

  const deleteOrder = (id) => {
    const index = orders.value.findIndex(o => o.id === id)
    if (index > -1) {
      orders.value.splice(index, 1)
      return true
    }

    return false
  }

  // FEFO: Kiểm tra và gán lô hàng có thời hạn sớm nhất cho đơn hàng
  const assignBatchesToOrder = (orderId, availableBatches) => {
    const order = orders.value.find(o => o.id === orderId)
    if (!order) return false

    // Sắp xếp lô theo FEFO (First Expire First Out)
    const sortedBatches = [...availableBatches].sort((a, b) => 
      new Date(a.expiryDate) - new Date(b.expiryDate)
    )

    let batchAssigned = true
    order.items.forEach(item => {
      const suitableBatch = sortedBatches.find(b => 
        b.productId === item.productId && b.quantity >= item.quantity
      )
      if (suitableBatch) {
        item.batchId = suitableBatch.id
        suitableBatch.quantity -= item.quantity
      } else {
        batchAssigned = false
      }
    })

    return batchAssigned
  }

  const getOrderById = (id) => {
    const order = orders.value.find((item) => item.id === id)
    return order ? mapOrderForView(order) : null
  }

  return {
    orders,
    totalOrders,
    pendingOrders,
    processingOrders,
    totalRevenue,
    paymentMethods,
    orderStatusOptions,
    orderStatusLabels,
    orderStatusColors,
    paymentMethodLabels,
    getCustomerAddresses,
    getAvailableBatchesForProduct,
    createOrder,
    addOrder,
    updateOrder,
    updateOrderStatus,
    cancelOrder,
    canDeleteOrder,
    deleteOrder,
    getOrderById,
    assignBatchesToOrder
  }
})
