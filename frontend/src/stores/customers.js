import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref([
    {
      id: 'CUST-001',
      role: 'customer',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      address: '123 Đường Nguyễn Huệ, Quận 1, TPHCM',
      joinDate: '2024-01-15',
      created_at: '2024-01-15',
      totalOrders: 4,
      totalSpent: 1086000,
      status: 'Đang hoạt động',
      type: 'Thường xuyên',
      user_addresses: [
        {
          id: 'ADDR-001',
          user_id: 'CUST-001',
          recipient_name: 'Nguyễn Văn A',
          phone: '0901234567',
          address_line: '123 Đường Nguyễn Huệ, Quận 1, TPHCM',
          ward: 'Bến Nghé',
          district: 'Quận 1',
          province: 'TPHCM',
          is_default: 1
        }
      ]
    },
    {
      id: 'CUST-002',
      role: 'customer',
      name: 'Trần Thị B',
      email: 'tranthibhh@email.com',
      phone: '0912345678',
      address: '456 Đường Lê Lợi, Quận 1, TPHCM',
      joinDate: '2024-03-20',
      created_at: '2024-03-20',
      totalOrders: 2,
      totalSpent: 423000,
      status: 'Đang hoạt động',
      type: 'Mới',
      user_addresses: [
        {
          id: 'ADDR-002',
          user_id: 'CUST-002',
          recipient_name: 'Trần Thị B',
          phone: '0912345678',
          address_line: '456 Đường Lê Lợi, Quận 1, TPHCM',
          ward: 'Bến Thành',
          district: 'Quận 1',
          province: 'TPHCM',
          is_default: 1
        }
      ]
    },
    {
      id: 'CUST-003',
      role: 'customer',
      name: 'Lê Hoàng C',
      email: 'lehoangc@email.com',
      phone: '0923456789',
      address: '789 Đường Hồ Tùng Mậu, Quận 1, TPHCM',
      joinDate: '2024-05-10',
      created_at: '2024-05-10',
      totalOrders: 3,
      totalSpent: 645000,
      status: 'Đang hoạt động',
      type: 'Thường xuyên',
      user_addresses: [
        {
          id: 'ADDR-003',
          user_id: 'CUST-003',
          recipient_name: 'Lê Hoàng C',
          phone: '0923456789',
          address_line: '789 Đường Hồ Tùng Mậu, Quận 1, TPHCM',
          ward: 'Bến Nghé',
          district: 'Quận 1',
          province: 'TPHCM',
          is_default: 1
        }
      ]
    },
    {
      id: 'CUST-004',
      role: 'customer',
      name: 'Phạm Thanh D',
      email: 'phamthanhd@email.com',
      phone: '0934567890',
      address: '321 Đường Cộng Hòa, Quận Tân Bình, TPHCM',
      joinDate: '2024-07-05',
      created_at: '2024-07-05',
      totalOrders: 1,
      totalSpent: 178000,
      status: 'Đang hoạt động',
      type: 'Mới',
      user_addresses: [
        {
          id: 'ADDR-004',
          user_id: 'CUST-004',
          recipient_name: 'Phạm Thanh D',
          phone: '0934567890',
          address_line: '321 Đường Cộng Hòa, Quận Tân Bình, TPHCM',
          ward: '12',
          district: 'Tân Bình',
          province: 'TPHCM',
          is_default: 1
        }
      ]
    },
    {
      id: 'CUST-005',
      role: 'customer',
      name: 'Vũ Minh E',
      email: 'vuminhe@email.com',
      phone: '0945678901',
      address: '654 Đường Âu Cơ, Quận 5, TPHCM',
      joinDate: '2024-06-12',
      created_at: '2024-06-12',
      totalOrders: 0,
      totalSpent: 0,
      status: 'Không hoạt động',
      type: 'Mới',
      user_addresses: [
        {
          id: 'ADDR-005',
          user_id: 'CUST-005',
          recipient_name: 'Vũ Minh E',
          phone: '0945678901',
          address_line: '654 Đường Âu Cơ, Quận 5, TPHCM',
          ward: '14',
          district: 'Quận 5',
          province: 'TPHCM',
          is_default: 1
        }
      ]
    }
  ])

  const totalCustomers = computed(() => customers.value.length)

  const activeCustomers = computed(() =>
    customers.value.filter(c => c.status === 'Đang hoạt động').length
  )

  const loyalCustomers = computed(() =>
    customers.value.filter(c => c.type === 'Thường xuyên').length
  )

  const totalCustomerSpent = computed(() =>
    customers.value.reduce((sum, customer) => sum + customer.totalSpent, 0)
  )

  const topCustomers = computed(() =>
    [...customers.value].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5)
  )

  const addCustomer = (customer) => {
    const nextId = 'CUST-' + String(customers.value.length + 1).padStart(3, '0')
    const today = new Date().toISOString().split('T')[0]
    customers.value.push({
      id: nextId,
      ...customer,
      role: customer.role || 'customer',
      joinDate: today,
      created_at: today,
      totalOrders: 0,
      totalSpent: 0,
      status: 'Đang hoạt động',
      type: 'Mới',
      user_addresses: customer.user_addresses || []
    })
    return nextId
  }

  const updateCustomer = (id, updates) => {
    const index = customers.value.findIndex(c => c.id === id)
    if (index > -1) {
      customers.value[index] = { ...customers.value[index], ...updates }
    }
  }

  const updateCustomerType = (id, orderCount) => {
    const index = customers.value.findIndex(c => c.id === id)
    if (index > -1) {
      const type = orderCount >= 5 ? 'Thường xuyên' : 'Mới'
      customers.value[index].type = type
    }
  }

  const deleteCustomer = (id) => {
    const index = customers.value.findIndex(c => c.id === id)
    if (index > -1) {
      customers.value.splice(index, 1)
    }
  }

  const getCustomerOrderHistory = (customerId) => {
    const customer = customers.value.find(c => c.id === customerId)
    return customer ? { id: customerId, name: customer.name, totalOrders: customer.totalOrders } : null
  }

  return {
    customers,
    totalCustomers,
    activeCustomers,
    loyalCustomers,
    totalCustomerSpent,
    topCustomers,
    addCustomer,
    updateCustomer,
    updateCustomerType,
    deleteCustomer,
    getCustomerOrderHistory
  }
})
