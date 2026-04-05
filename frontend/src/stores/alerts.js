import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref([
    {
      id: 'ALERT-001',
      type: 'Hết hạn',
      severity: 'danger',
      title: 'Kem chấm mụn Benzoyl Peroxide đã hết hạn',
      message: 'Lô B004 đã hết hạn ngày 2026-03-28. Cần cách ly và hủy theo quy trình.',
      productId: 5,
      batchId: 'B004',
      daysLeft: -7,
      createdAt: '2026-04-01',
      status: 'Chưa xử lý',
      isResolved: 0,
      isRead: false
    },
    {
      id: 'ALERT-002',
      type: 'Hết hạn',
      severity: 'warning',
      title: 'Serum Niacinamide sắp hết hạn',
      message: 'Lô B002 còn dưới 30 ngày sử dụng. Ưu tiên xuất kho theo FEFO.',
      productId: 3,
      batchId: 'B002',
      daysLeft: 17,
      createdAt: '2026-04-02',
      status: 'Chưa xử lý',
      isResolved: 0,
      isRead: false
    },
    {
      id: 'ALERT-003',
      type: 'Hết hàng',
      severity: 'warning',
      title: 'Kem chống nắng da nhạy cảm đã hết hàng',
      message: 'Sản phẩm SPF50+ PA++++ đang hết tại kho online, cần nhập lô mới.',
      productId: 4,
      batchId: null,
      daysLeft: null,
      createdAt: '2026-04-03',
      status: 'Chưa xử lý',
      isResolved: 0,
      isRead: false
    },
    {
      id: 'ALERT-004',
      type: 'Tồn kho thấp',
      severity: 'info',
      title: 'Tồn kho kem chấm mụn thấp',
      message: 'Kem chấm mụn Benzoyl Peroxide chỉ còn 6 tuýp, cần lên kế hoạch nhập.',
      productId: 5,
      batchId: null,
      daysLeft: null,
      createdAt: '2026-04-03',
      status: 'Không cần xử lý',
      isResolved: 1,
      isRead: true
    },
    {
      id: 'ALERT-005',
      type: 'Hết hạn',
      severity: 'danger',
      title: 'Lô serum treatment cần kiểm kê lại',
      message: 'Phát hiện lô B002 có chênh lệch tồn kho, cần đối soát trước khi xuất.',
      productId: 3,
      batchId: 'B002',
      daysLeft: 17,
      createdAt: '2026-03-30',
      status: 'Đã xử lý',
      isResolved: 1,
      isRead: true
    }
  ])

  const unreadAlerts = computed(() =>
    alerts.value.filter(a => !a.isRead).length
  )

  const criticalAlerts = computed(() =>
    alerts.value.filter(a => a.severity === 'danger').length
  )

  const warningAlerts = computed(() =>
    alerts.value.filter(a => a.severity === 'warning').length
  )

  const expirySoonAlerts = computed(() =>
    alerts.value.filter(a => a.type === 'Hết hạn' && a.status === 'Chưa xử lý')
  )

  const outOfStockAlerts = computed(() =>
    alerts.value.filter(a => a.type === 'Hết hàng')
  )

  const lowStockAlerts = computed(() =>
    alerts.value.filter(a => a.type === 'Tồn kho thấp')
  )

  // Lấy 5 cảnh báo gần đây nhất chưa đọc
  const recentUnreadAlerts = computed(() =>
    alerts.value
      .filter(a => !a.isRead || Number(a.isResolved) === 0)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  )

  const unresolvedRecentAlerts = computed(() =>
    alerts.value
      .filter(a => Number(a.isResolved) === 0)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  )

  const addAlert = (alert) => {
    const nextId = 'ALERT-' + String(alerts.value.length + 1).padStart(3, '0')
    const today = new Date().toISOString().split('T')[0]
    alerts.value.unshift({
      id: nextId,
      ...alert,
      createdAt: today,
      status: 'Chưa xử lý',
      isRead: false
    })
    return nextId
  }

  const markAsRead = (id) => {
    const alert = alerts.value.find(a => a.id === id)
    if (alert) {
      alert.isRead = true
    }
  }

  const markAsUnread = (id) => {
    const alert = alerts.value.find(a => a.id === id)
    if (alert) {
      alert.isRead = false
    }
  }

  const markAllAsRead = () => {
    alerts.value.forEach(a => a.isRead = true)
  }

  const updateAlertStatus = (id, status) => {
    const alert = alerts.value.find(a => a.id === id)
    if (alert) {
      alert.status = status
      alert.isResolved = status === 'Đã xử lý' ? 1 : alert.isResolved
    }
  }

  const deleteAlert = (id) => {
    const index = alerts.value.findIndex(a => a.id === id)
    if (index > -1) {
      alerts.value.splice(index, 1)
    }
  }

  const deleteAllReadAlerts = () => {
    const index = alerts.value.findIndex(a => a.isRead)
    while (index > -1) {
      alerts.value.splice(index, 1)
    }
  }

  // Tư động tạo cảnh báo hết hạn dựa trên lô hàng
  const createExpiryAlert = (batch) => {
    const existingAlert = alerts.value.find(
      a => a.batchId === batch.id && a.type === 'Hết hạn'
    )
    if (!existingAlert) {
      const days = Math.floor(
        (new Date(batch.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
      )
      const severity = days < 0 ? 'danger' : days <= 30 ? 'warning' : 'info'
      addAlert({
        type: 'Hết hạn',
        severity,
        title: `${batch.productName} sắp hết hạn`,
        message: `Lô ${batch.batchNo} sẽ hết hạn vào ngày ${batch.expiryDate}`,
        productId: batch.productId,
        batchId: batch.id,
        daysLeft: days
      })
    }
  }

  return {
    alerts,
    unreadAlerts,
    criticalAlerts,
    warningAlerts,
    expirySoonAlerts,
    outOfStockAlerts,
    lowStockAlerts,
    recentUnreadAlerts,
    addAlert,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    updateAlertStatus,
    deleteAlert,
    deleteAllReadAlerts,
    createExpiryAlert
  }
})
