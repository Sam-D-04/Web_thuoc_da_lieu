<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1>Tổng quan</h1>
        <p class="breadcrumb">Nhà thuốc Da liễu / Tổng quan</p>
      </div>
      <button class="btn btn-primary" @click="exportDashboardCSV"><span class="btn-icon" v-html="getDashboardIcon('report')"></span>Xuất báo cáo</button>
    </div>

    <!-- Alert Summary -->
    <div v-if="showAlert && unresolvedAlertsCount > 0" class="alert-banner">
      <div class="alert-content">
        <span class="alert-icon" v-html="getDashboardIcon('warning')"></span>
        <div>
          <strong>Có {{ unresolvedAlertsCount }} cảnh báo kho chưa xử lý!</strong>
          <p v-if="criticalAlerts > 0">
            {{ criticalAlerts }} cảnh báo nguy hiểm - 
            <router-link to="/alerts" class="alert-link">Xem chi tiết</router-link>
          </p>
          <p v-if="warningAlerts > 0">
            {{ warningAlerts }} cảnh báo mức cảnh báo - 
            <router-link to="/alerts" class="alert-link">Xem chi tiết</router-link>
          </p>
        </div>
      </div>
      <button class="alert-close" @click="dismissAlert">✕</button>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-header">
          <h3>Tổng doanh thu</h3>
          <span class="kpi-period">Tháng này</span>
        </div>
        <div class="kpi-value">{{ formatCurrency(overview.month_revenue) }}</div>
        <div v-if="overview.month_revenue_change !== null" :class="['kpi-trend', overview.month_revenue_change >= 0 ? 'positive' : 'negative']">
          <span class="trend-icon" v-html="getDashboardIcon(overview.month_revenue_change >= 0 ? 'trend-up' : 'trend-down')"></span>
          <span>{{ overview.month_revenue_change >= 0 ? '+' : '' }}{{ overview.month_revenue_change }}%</span> so với tháng trước
        </div>
        <div v-else class="kpi-trend">
          <span class="trend-icon" v-html="getDashboardIcon('trend-up')"></span>
          <span>Hôm nay: {{ formatCurrency(overview.today_revenue) }}</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <h3>Đơn hàng</h3>
          <span class="kpi-period">Đang chờ xử lý</span>
        </div>
        <div class="kpi-value">{{ overview.pending_orders }}</div>
        <div class="kpi-trend warning">
          <span class="trend-icon" v-html="getDashboardIcon('hourglass')"></span>
          <span>Cần xử lý ngay</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <h3>Tồn kho</h3>
          <span class="kpi-period">Sản phẩm</span>
        </div>
        <div class="kpi-value">{{ overview.total_products }}</div>
        <div class="kpi-trend" :class="{ warning: overview.inventory.low_stock > 0 }">
          <span v-if="overview.inventory.low_stock > 0"><span class="trend-icon" v-html="getDashboardIcon('warning')"></span>{{ overview.inventory.low_stock }} sản phẩm sắp hết</span>
          <span v-else><span class="trend-icon" v-html="getDashboardIcon('check')"></span>Tất cả trong khoảng an toàn</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <h3>Khách hàng</h3>
          <span class="kpi-period">Hoạt động</span>
        </div>
        <div class="kpi-value">{{ overview.active_customers }}</div>
        <div class="kpi-trend">
          <span class="trend-icon" v-html="getDashboardIcon('users')"></span>
          <span>Tổng {{ overview.total_customers }} khách hàng</span>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <!-- Revenue Chart -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>Doanh thu theo ngày (7 ngày gần đây)</h3>
        </div>
        <div class="chart chart-revenue">
          <canvas id="revenueChart"></canvas>
        </div>
      </div>

      <!-- Top Products -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>Sản phẩm bán chạy</h3>
        </div>
        <div class="product-list">
          <div v-if="!topProducts.length" class="product-item">
            <div class="product-info"><p class="product-name">Chưa có dữ liệu</p></div>
          </div>
          <div v-for="product in topProducts" :key="product.product_id" class="product-item">
            <div class="product-info">
              <p class="product-name">{{ product.name }}</p>
              <p class="product-sales">{{ product.sold }} sản phẩm</p>
            </div>
            <p class="product-revenue">{{ formatCurrency(product.revenue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Batch Status -->
    <div class="batch-status-container">
      <div class="batch-header">
        <h3>Lô thuốc căn cứ FEFO</h3>
        <router-link to="/batches" class="link-more">Xem tất cả →</router-link>
      </div>

      <div class="batch-grid">
        <div class="batch-card expired">
          <div class="batch-count">{{ overview.batch_counts.expired }}</div>
          <p class="batch-label">Hết hạn</p>
        </div>
        <div class="batch-card warning">
          <div class="batch-count">{{ overview.batch_counts.expiring_soon }}</div>
          <p class="batch-label">Sắp hết hạn (30 ngày)</p>
        </div>
        <div class="batch-card safe">
          <div class="batch-count">{{ overview.batch_counts.safe }}</div>
          <p class="batch-label">Còn hạn</p>
        </div>
      </div>
    </div>

    <!-- Recent Alerts -->
    <div class="recent-alerts">
      <div class="section-header">
        <h3>Cảnh báo gần đây</h3>
        <router-link to="/alerts" class="link-more">Xem tất cả →</router-link>
      </div>

      <div v-if="recentAlerts.length > 0" class="alerts-list">
        <div 
          v-for="alert in recentAlerts.slice(0, 5)" 
          :key="alert.id" 
          class="alert-item"
          :class="{ [`alert-${alert.severity}`]: true }"
        >
          <div class="alert-indicator"></div>
          <div class="alert-details">
            <p class="alert-title">{{ alert.title }}</p>
            <p class="alert-message">{{ alert.message }}</p>
            <p class="alert-time">{{ getTimeAgo(alert.createdAt) }}</p>
          </div>
          <button class="alert-action" @click="markAlertAsRead(alert.id)" v-html="getDashboardIcon('check')"></button>
        </div>
      </div>
      <div v-else class="empty-state">
        <p><span class="trend-icon" v-html="getDashboardIcon('check')"></span>Không có cảnh báo nào cần xử lý</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useAlertStore } from '@/stores/alerts'
import axios from 'axios'
import Chart from 'chart.js/auto'

// ── API client ──────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: { Accept: 'application/json' },
})
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const alertStore = useAlertStore()

// ── State ───────────────────────────────────────────────────────────────────
const showAlert = ref(true)
const revenueChart = ref(null)
let chartRenderToken = 0

const overview = ref({
  today_revenue: 0,
  month_revenue: 0,
  month_revenue_change: null,
  pending_orders: 0,
  total_products: 0,
  total_customers: 0,
  active_customers: 0,
  inventory: { low_stock: 0, high_stock: 0, total_value: 0 },
  batch_counts: { expired: 0, expiring_soon: 0, safe: 0 },
})

const revenueChartRows = ref([])   // chart_data từ revenue API
const topProducts      = ref([])   // top_products từ revenue API

// ── Derived alert state ──────────────────────────────────────────────────────
const unresolvedAlertsCount = computed(() =>
  alertStore.alerts.filter(a => !Number(a.is_resolved ?? a.isResolved)).length
)
const criticalAlerts = computed(() =>
  alertStore.alerts.filter(a => !Number(a.is_resolved ?? a.isResolved) && a.severity === 'danger').length
)
const warningAlerts = computed(() =>
  alertStore.alerts.filter(a => !Number(a.is_resolved ?? a.isResolved) && a.severity === 'warning').length
)
const recentAlerts = computed(() =>
  alertStore.alerts
    .filter(a => !Number(a.is_resolved ?? a.isResolved))
    .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at))
    .slice(0, 5)
)

// ── Helpers ─────────────────────────────────────────────────────────────────
const vndFormatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })
const formatCurrency = (value) => `${vndFormatter.format(Number(value || 0))} đ`

const dismissAlert = () => { showAlert.value = false }

const getTimeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60) return 'Vừa xong'
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`
  return new Date(date).toLocaleDateString('vi-VN')
}

const markAlertAsRead = (id) => { alertStore.markAsRead(id) }

// ── Data fetch ───────────────────────────────────────────────────────────────
const fetchOverview = async () => {
  try {
    const { data } = await api.get('/admin/stats/overview')
    overview.value = {
      today_revenue:        data.today_revenue        ?? 0,
      month_revenue:        data.month_revenue        ?? 0,
      month_revenue_change: data.month_revenue_change ?? null,
      pending_orders:       data.pending_orders       ?? 0,
      total_products:       data.total_products       ?? 0,
      total_customers:      data.total_customers      ?? 0,
      active_customers:     data.active_customers     ?? 0,
      inventory:     data.inventory     ?? { low_stock: 0, high_stock: 0, total_value: 0 },
      batch_counts:  data.batch_counts  ?? { expired: 0, expiring_soon: 0, safe: 0 },
    }
  } catch {
    // keep defaults on error
  }
}

const fetchRevenue7Days = async () => {
  try {
    const { data } = await api.get('/admin/stats/revenue', {
      params: { period: 'daily', days: 7 },
    })
    revenueChartRows.value = data.chart_data     || []
    topProducts.value      = (data.top_products  || []).slice(0, 5)
  } catch {
    // keep defaults
  }
}

// ── Export CSV ───────────────────────────────────────────────────────────────
const exportDashboardCSV = () => {
  const fmt = (v) => vndFormatter.format(Number(v || 0))
  const rows = [
    ['Báo cáo tổng quan - Nhà thuốc Da liễu'],
    ['Ngày xuất:', new Date().toLocaleDateString('vi-VN')],
    [],
    ['Chỉ số', 'Giá trị'],
    ['Doanh thu tháng này', fmt(overview.value.month_revenue)],
    ['Doanh thu hôm nay',   fmt(overview.value.today_revenue)],
    ['Đơn chờ xử lý',       overview.value.pending_orders],
    ['Tổng sản phẩm',       overview.value.total_products],
    ['Tổng khách hàng',     overview.value.total_customers],
    ['Khách hàng active',   overview.value.active_customers],
    [],
    ['Lô hàng FEFO'],
    ['Hết hạn',             overview.value.batch_counts.expired],
    ['Sắp hết hạn (30 ngày)', overview.value.batch_counts.expiring_soon],
    ['Còn hạn',             overview.value.batch_counts.safe],
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tong-quan-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Icons ────────────────────────────────────────────────────────────────────
const getDashboardIcon = (name) => {
  const iconMap = {
    report: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4.5h10l2 2v13H5v-15a.5.5 0 0 1 .5-.5Z" /><path d="M9 11h6" /><path d="M9 15h6" /></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4.5 4.7 18h14.6L12 4.5Z" /><path d="M12 9v4" /><circle cx="12" cy="16.4" r="1" fill="currentColor" stroke="none" /></svg>`,
    'trend-up': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 15.5 10 10l3.5 3.5L19 8" /><path d="M15.2 8H19v3.8" /></svg>`,
    'trend-down': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8.5 10 14l3.5-3.5L19 16" /><path d="M15.2 16H19v-3.8" /></svg>`,
    hourglass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4.5h10" /><path d="M7 19.5h10" /><path d="M8.5 6.5c0 3 1.8 4 3.5 5.5-1.7 1.5-3.5 2.5-3.5 5.5" /><path d="M15.5 6.5c0 3-1.8 4-3.5 5.5 1.7 1.5 3.5 2.5 3.5 5.5" /></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="2.8" /><circle cx="16.5" cy="10" r="2.2" opacity="0.7" /><path d="M4.5 18.5c1.1-2.8 3.3-4.4 4.5-4.4s3.4 1.6 4.5 4.4" /><path d="M13.5 18.5c.8-1.8 2.3-2.9 3.4-2.9 1 0 2.2 1 2.9 2.9" /></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5 9.5 17 19 7.5" /></svg>`,
  }
  return iconMap[name] || iconMap.check
}

// ── Revenue chart ────────────────────────────────────────────────────────────
const renderRevenueChart = async () => {
  const token = ++chartRenderToken
  await nextTick()
  if (token !== chartRenderToken) return

  const canvas = document.getElementById('revenueChart')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height || 320)
  gradient.addColorStop(0, 'rgba(31, 79, 150, 0.32)')
  gradient.addColorStop(1, 'rgba(31, 79, 150, 0.02)')

  if (revenueChart.value) {
    revenueChart.value.destroy()
    revenueChart.value = null
  }

  const rows   = revenueChartRows.value
  const labels = rows.map(r => r.display || r.label)
  const values = rows.map(r => Number(r.revenue || 0))

  revenueChart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Doanh thu (VND)',
        data: values,
        borderColor: '#1f4f96',
        backgroundColor: gradient,
        fill: true,
        tension: 0.42,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#1f4f96',
      }],
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          borderColor: 'rgba(59, 130, 246, 0.35)',
          borderWidth: 1,
          displayColors: false,
          padding: 10,
          callbacks: {
            title: (items) => {
              const row = rows[items[0]?.dataIndex]
              return row ? `Ngày ${row.display || row.label}` : ''
            },
            label: (ctx) => `Doanh thu: ${formatCurrency(ctx.parsed?.y || 0)}`,
            afterLabel: (ctx) => {
              const row = rows[ctx.dataIndex]
              return row ? `Đơn hàng: ${row.order_count}` : ''
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(148, 163, 184, 0.13)', borderDash: [5, 5], drawBorder: false },
          ticks: {
            color: '#8094b2',
            callback: function(value) {
              return `${(value / 1000000).toFixed(1)}M`
            }
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#8094b2'
          }
        }
      }
    }
  })
}

onMounted(async () => {
  await Promise.all([
    fetchOverview(),
    fetchRevenue7Days(),
    alertStore.fetchAlerts().catch(() => {}),
  ])
  await renderRevenueChart()
})

onBeforeUnmount(() => {
  if (revenueChart.value) {
    revenueChart.value.destroy()
    revenueChart.value = null
  }
})
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1f4f96;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
}

.breadcrumb {
  color: #8094b2;
  font-size: 12px;
  margin: 0;
}

/* Alert Banner */
.alert-banner {
  background: linear-gradient(135deg, #fef2f2 0%, #fef9f3 100%);
  border: 1px solid #ffd3d3;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.alert-content {
  display: flex;
  gap: 16px;
  flex: 1;
  align-items: flex-start;
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #f59e0b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.alert-icon :deep(svg),
.btn-icon :deep(svg),
.trend-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.alert-banner strong {
  display: block;
  color: #991b1b;
  margin-bottom: 4px;
}

.alert-banner p {
  color: #7c2d12;
  font-size: 13px;
  margin: 0;
  line-height: 1.5;
}

.alert-link {
  color: #dc2626;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.alert-link:hover {
  color: #991b1b;
}

.alert-close {
  background: none;
  border: none;
  color: #991b1b;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-close:hover {
  background: rgba(220, 38, 38, 0.1);
  border-radius: 4px;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 22px;
}

.kpi-card {
  background: white;
  border: 1px solid #e8eff8;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 10px 24px rgba(16, 55, 102, 0.08);
}

.kpi-card:hover {
  border-color: #d7e4f7;
  box-shadow: 0 16px 30px rgba(16, 55, 102, 0.12);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  width: 100%;
}

.kpi-header h3 {
  font-size: 12px;
  font-weight: 600;
  color: #667e9f;
  margin: 0;
}

.kpi-period {
  font-size: 11px;
  color: #7d94b3;
  background: #f2f7ff;
  padding: 4px 8px;
  border-radius: 999px;
}

.kpi-value {
  font-size: 28px;
  font-weight: 800;
  color: #1f4f96;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
  width: 100%;
}

.kpi-trend {
  font-size: 11px;
  color: #7a91b1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.trend-icon,
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.trend-icon {
  margin-right: 2px;
}

.kpi-trend.positive {
  color: #059669;
}

.kpi-trend.negative {
  color: #ef4444;
}

.kpi-trend.warning {
  color: #d97706;
}

/* Charts Row */
.charts-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
  margin-bottom: 28px;
}

.chart-container {
  background: white;
  border: 1px solid #e8eff8;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(16, 55, 102, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1f4f96;
  margin: 0;
}

.chart-filter {
  padding: 5px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 11px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chart-filter:focus {
  outline: none;
  border-color: #1e3a8a;
  box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
}

.chart {
  position: relative;
  width: 100%;
  height: 320px;
}

.chart-revenue {
  padding: 10px 12px 2px;
  border-radius: 14px;
  background: radial-gradient(circle at 8% 12%, rgba(190, 222, 255, 0.36), rgba(255, 255, 255, 0.9) 55%);
}

.chart canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

/* Product List */
.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #f8fbff;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.product-item:hover {
  background: #f1f5f9;
}

.product-info {
  margin: 0;
}

.product-name {
  font-size: 12px;
  font-weight: 500;
  color: #1e3a8a;
  margin: 0 0 4px 0;
}

.product-sales {
  font-size: 11px;
  color: #64748b;
  margin: 0;
}

.product-revenue {
  font-size: 12px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0;
}

/* Batch Status */
.batch-status-container {
  background: white;
  border: 1px solid #e8eff8;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 28px;
  box-shadow: 0 10px 24px rgba(16, 55, 102, 0.08);
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.batch-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0;
}

.link-more {
  color: #1e3a8a;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.link-more:hover {
  color: #1e40af;
}

.batch-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.batch-card {
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 22px;
  text-align: center;
  transition: all 0.3s ease;
}

.batch-card.expired {
  background: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}

.batch-card.warning {
  background: #fffbeb;
  border-color: #fcd34d;
  color: #92400e;
}

.batch-card.safe {
  background: #f0fdf4;
  border-color: #86efac;
  color: #166534;
}

.batch-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.batch-count {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 6px;
}

.batch-label {
  font-size: 11px;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Recent Alerts */
.recent-alerts {
  background: white;
  border: 1px solid #e8eff8;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(16, 55, 102, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 16px;
  border-left: 4px solid #1e3a8a;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.alert-item.alert-danger {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.alert-item.alert-warning {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.alert-item.alert-info {
  border-left-color: #3b82f6;
  background: #eff6ff;
}

.alert-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
  margin-top: 6px;
}

.alert-details {
  flex: 1;
  margin: 0;
}

.alert-title {
  font-size: 12px;
  font-weight: 600;
  color: inherited;
  margin: 0 0 4px 0;
}

.alert-message {
  font-size: 11px;
  color: #64748b;
  margin: 0 0 6px 0;
  line-height: 1.4;
}

.alert-time {
  font-size: 10px;
  color: #94a3b8;
  margin: 0;
}

.alert-action {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.alert-action:hover {
  color: #059669;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #059669;
  font-size: 14px;
}

/* Buttons */
.btn {
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #2d5ca8;
  color: white;
}

.btn-primary:hover {
  background: #1f4f96;
  box-shadow: 0 10px 18px rgba(45, 92, 168, 0.3);
}

/* Responsive */
@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }

  .batch-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .batch-grid {
    grid-template-columns: 1fr;
  }
}
</style>
