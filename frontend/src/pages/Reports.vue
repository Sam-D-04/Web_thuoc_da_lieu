<template>
  <div class="reports-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1>Báo cáo phân tích</h1>
        <p class="breadcrumb">Nhà thuốc Da liễu / Báo cáo</p>
      </div>
      <div class="header-controls">
        <select v-model="selectedPeriod" class="date-select" :disabled="loading">
          <option value="7days">7 ngày gần đây</option>
          <option value="30days">30 ngày</option>
          <option value="90days">90 ngày</option>
          <option value="year">Năm nay</option>
        </select>
        <button class="btn btn-primary" @click="exportCSV" :disabled="loading">📥 Xuất báo cáo</button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="error-banner">{{ error }}</div>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">Đang tải dữ liệu...</div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card">
        <p class="label">Doanh thu toàn kỳ</p>
        <p class="value">{{ formatVnd(summary.total_revenue) }}</p>
        <p v-if="summary.revenue_change !== null" :class="['change', summary.revenue_change >= 0 ? 'positive' : 'negative']">
          {{ summary.revenue_change >= 0 ? '↑' : '↓' }} {{ Math.abs(summary.revenue_change) }}% so với {{ previousPeriodLabel }}
        </p>
        <p v-else class="change neutral">— chưa có dữ liệu kỳ trước</p>
      </div>
      <div class="summary-card">
        <p class="label">Tổng đơn hàng</p>
        <p class="value">{{ summary.total_orders }}</p>
        <p v-if="summary.orders_change !== null" :class="['change', summary.orders_change >= 0 ? 'positive' : 'negative']">
          {{ summary.orders_change >= 0 ? '↑' : '↓' }} {{ Math.abs(summary.orders_change) }}% so với {{ previousPeriodLabel }}
        </p>
        <p v-else class="change neutral">— chưa có dữ liệu kỳ trước</p>
      </div>
      <div class="summary-card">
        <p class="label">Giá trị đơn hàng trung bình</p>
        <p class="value">{{ formatVnd(summary.avg_order_value) }}</p>
        <p v-if="summary.avg_change !== null" :class="['change', summary.avg_change >= 0 ? 'positive' : 'negative']">
          {{ summary.avg_change >= 0 ? '↑' : '↓' }} {{ Math.abs(summary.avg_change) }}% so với {{ previousPeriodLabel }}
        </p>
        <p v-else class="change neutral">— chưa có dữ liệu kỳ trước</p>
      </div>
      <div class="summary-card">
        <p class="label">Kỳ doanh thu cao nhất</p>
        <p class="value best-period">{{ bestPeriodDisplay }}</p>
        <p class="change neutral">{{ formatVnd(summary.best_period?.revenue) }}</p>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- Revenue Chart -->
      <div class="chart-container big">
        <div class="chart-header">
          <h3>Doanh thu theo {{ periodLabel }}</h3>
        </div>
        <div class="chart">
          <Bar :data="revenueChartData" :options="revenueChartOptions" />
        </div>
      </div>

      <!-- Product Categories -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>Doanh thu theo danh mục</h3>
        </div>
        <div class="chart">
          <Doughnut v-if="categoryChartData.labels.length" :data="categoryChartData" :options="categoryChartOptions" />
          <div v-else class="no-data">Chưa có dữ liệu</div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="table-container">
        <div class="chart-header">
          <h3>10 sản phẩm bán chạy nhất</h3>
        </div>
        <table class="simple-table">
          <tbody>
            <tr v-if="!topProducts.length">
              <td colspan="2" class="text-right">Chưa có dữ liệu</td>
            </tr>
            <tr v-for="item in topProducts" :key="item.product_id">
              <td>{{ item.name }}</td>
              <td class="text-right">{{ item.sold }} sp — {{ formatVnd(item.revenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Inventory Reports -->
    <div class="reports-section">
      <h3>Báo cáo hàng tồn kho</h3>
      <div class="mini-report">
        <div class="report-item">
          <p class="label">Sản phẩm tồn kho cao</p>
          <p class="value">{{ inventory.high_stock }} sản phẩm</p>
        </div>
        <div class="report-item">
          <p class="label">Sản phẩm sắp hết hàng</p>
          <p class="value">{{ inventory.low_stock }} sản phẩm</p>
        </div>
        <div class="report-item">
          <p class="label">Lô sắp hết hạn (30 ngày)</p>
          <p class="value">{{ inventory.expiring_soon }} lô</p>
        </div>
        <div class="report-item">
          <p class="label">Giá trị tồn kho</p>
          <p class="value">{{ formatVnd(inventory.total_value) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

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

// ── State ───────────────────────────────────────────────────────────────────
const selectedPeriod = ref('30days')
const loading = ref(false)
const error = ref(null)

const chartData = ref([])
const summary = ref({
  total_revenue: 0,
  total_orders: 0,
  avg_order_value: 0,
  best_period: null,
  revenue_change: null,
  orders_change: null,
  avg_change: null,
})
const topProducts = ref([])
const categoryRevenue = ref([])

const inventory = ref({
  low_stock: 0,
  high_stock: 0,
  expiring_soon: 0,
  total_value: 0,
})

// ── Period mapping ──────────────────────────────────────────────────────────
const periodParams = computed(() => {
  switch (selectedPeriod.value) {
    case '7days':  return { period: 'daily',   days: 7 }
    case '30days': return { period: 'daily',   days: 30 }
    case '90days': return { period: 'daily',   days: 90 }
    case 'year':   return { period: 'monthly', year: new Date().getFullYear() }
    default:       return { period: 'daily',   days: 30 }
  }
})

const previousPeriodLabel = computed(() => ({
  '7days':  '7 ngày liền trước',
  '30days': '30 ngày liền trước',
  '90days': '90 ngày liền trước',
  'year':   'cùng kỳ năm trước',
})[selectedPeriod.value] || 'kỳ trước')

const periodLabel = computed(() => ({
  '7days':  '7 ngày',
  '30days': '30 ngày',
  '90days': '90 ngày',
  'year':   'từng tháng năm nay',
})[selectedPeriod.value] || '')

const bestPeriodDisplay = computed(() => {
  const bp = summary.value.best_period
  if (!bp) return '—'
  return bp.display || bp.label || '—'
})

// ── Fetch revenue ───────────────────────────────────────────────────────────
const fetchRevenue = async () => {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get('/admin/stats/revenue', { params: periodParams.value })
    chartData.value     = data.chart_data     || []
    summary.value       = data.summary        || summary.value
    topProducts.value   = data.top_products   || []
    categoryRevenue.value = data.category_revenue || []
  } catch (err) {
    error.value = err?.response?.data?.message || err.message || 'Lỗi khi tải báo cáo doanh thu'
  } finally {
    loading.value = false
  }
}

// ── Fetch overview (inventory) ──────────────────────────────────────────────
const fetchOverview = async () => {
  try {
    const { data } = await api.get('/admin/stats/overview')
    if (data.inventory) inventory.value = data.inventory
  } catch {
    // non-critical — keep defaults
  }
}

onMounted(() => {
  fetchRevenue()
  fetchOverview()
})

watch(selectedPeriod, fetchRevenue)

// ── Formatting ──────────────────────────────────────────────────────────────
const vndFormatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })
const formatVnd = (value) => `${vndFormatter.format(Number(value || 0))}₫`

// ── Revenue chart ────────────────────────────────────────────────────────────
const revenueChartData = computed(() => ({
  labels: chartData.value.map((r) => r.display || r.label),
  datasets: [{
    label: 'Doanh thu (VND)',
    data: chartData.value.map((r) => r.revenue),
    backgroundColor: '#1890ff',
    borderRadius: 6,
    maxBarThickness: 24,
  }],
}))

const revenueChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (items) => {
          const row = chartData.value[items[0]?.dataIndex]
          return row ? (row.display || row.label) : ''
        },
        label: (ctx) => `Doanh thu: ${vndFormatter.format(Number(ctx.parsed.y || 0))}₫`,
        afterLabel: (ctx) => {
          const row = chartData.value[ctx.dataIndex]
          return row ? `Đơn hàng: ${row.order_count}` : ''
        },
      },
    },
  },
  scales: {
    y: {
      grid: { color: 'rgba(148,163,184,0.14)' },
      ticks: {
        color: '#8094b2',
        callback: (v) => {
          if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
          if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
          return v
        },
      },
    },
    x: {
      grid: { color: 'rgba(148,163,184,0.08)' },
      ticks: {
        color: '#8094b2',
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: selectedPeriod.value === '90days' ? 12 : 20,
      },
    },
  },
}))

// ── Category doughnut ────────────────────────────────────────────────────────
const CATEGORY_COLORS = [
  '#1e3a8a','#3b82f6','#60a5fa','#93c5fd','#bfdbfe',
  '#6366f1','#a5b4fc','#818cf8','#4f46e5','#2563eb',
]

const categoryChartData = computed(() => ({
  labels: categoryRevenue.value.map((c) => c.name),
  datasets: [{
    data: categoryRevenue.value.map((c) => c.revenue),
    backgroundColor: categoryRevenue.value.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]),
  }],
}))

const categoryChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#6b7f9f', usePointStyle: true, pointStyle: 'circle', font: { size: 11 } },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${vndFormatter.format(ctx.parsed)}₫`,
      },
    },
  },
}

// ── Export CSV ───────────────────────────────────────────────────────────────
const exportCSV = () => {
  const rows = [
    ['Báo cáo doanh thu - Nhà thuốc Da liễu'],
    ['Kỳ:', selectedPeriod.value],
    ['Tổng doanh thu:', summary.value.total_revenue],
    ['Tổng đơn hàng:', summary.value.total_orders],
    ['Giá trị đơn trung bình:', summary.value.avg_order_value],
    [],
    ['Top sản phẩm bán chạy'],
    ['Tên sản phẩm', 'Số lượng bán', 'Doanh thu (VND)'],
    ...topProducts.value.map((p) => [p.name, p.sold, p.revenue]),
    [],
    ['Doanh thu theo thời gian'],
    ['Kỳ', 'Số đơn', 'Doanh thu (VND)'],
    ...chartData.value.map((r) => [r.display || r.label, r.order_count, r.revenue]),
    [],
    ['Doanh thu theo danh mục'],
    ['Danh mục', 'Doanh thu (VND)'],
    ...categoryRevenue.value.map((c) => [c.name, c.revenue]),
  ]
  const csv = rows.map((r) => r.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bao-cao-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.reports-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0 0 8px 0;
}

.breadcrumb {
  color: #64748b;
  font-size: 13px;
  margin: 0;
}

.header-controls {
  display: flex;
  gap: 12px;
}

.date-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

/* Error / Loading */
.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
}

.loading-overlay {
  text-align: center;
  padding: 16px;
  color: #64748b;
  font-size: 14px;
  margin-bottom: 16px;
}

/* Summary Grid */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.summary-card:hover {
  border-color: #1e3a8a;
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.1);
}

.summary-card .label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
}

.summary-card .value {
  font-size: 22px;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0 0 8px 0;
}

.summary-card .value.best-period {
  font-size: 26px;
}

.summary-card .change {
  font-size: 12px;
  margin: 0;
  font-weight: 500;
}

.change.positive { color: #059669; }
.change.negative { color: #ef4444; }
.change.neutral  { color: #94a3b8; }

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chart-container.big {
  grid-column: 1;
}

.chart-header {
  margin-bottom: 16px;
}

.chart-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0;
}

.chart {
  position: relative;
  height: 300px;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  font-size: 14px;
}

.table-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  grid-column: 2;
}

.simple-table {
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
}

.simple-table td {
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
}

.simple-table td:first-child {
  color: #1e3a8a;
  font-weight: 500;
}

.text-right {
  text-align: right;
  font-weight: 600;
  color: #1e3a8a;
  white-space: nowrap;
}

/* Reports Section */
.reports-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.reports-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0 0 16px 0;
}

.mini-report {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.report-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.report-item .label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
}

.report-item .value {
  font-size: 22px;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0;
}

/* Buttons */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #1e3a8a;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1e40af;
  box-shadow: 0 2px 8px rgba(30, 58, 138, 0.3);
}

/* Responsive */
@media (max-width: 1024px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-container.big,
  .table-container {
    grid-column: auto;
  }

  .mini-report {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .header-controls {
    flex-wrap: wrap;
  }

  .mini-report {
    grid-template-columns: 1fr;
  }
}
</style>
