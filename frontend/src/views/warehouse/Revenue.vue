<template>
  <WarehouseSidebar title="Thống kê Doanh thu" subtitle="Phân tích doanh số và xu hướng bán hàng">
    <template #actions>
      <div class="toolbar">
        <!-- Period tabs -->
        <div class="period-tabs">
          <button
            v-for="p in periods"
            :key="p.value"
            :class="['period-tab', { active: selectedPeriod === p.value }]"
            @click="changePeriod(p.value)"
          >{{ p.label }}</button>
        </div>

        <!-- Year picker (monthly mode) -->
        <div v-if="selectedPeriod === 'monthly'" class="year-select-wrap">
          <select v-model="selectedYear" @change="loadStats" class="year-select">
            <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <!-- Days picker (daily mode) -->
        <div v-if="selectedPeriod === 'daily'" class="year-select-wrap">
          <select v-model="selectedDays" @change="loadStats" class="year-select">
            <option :value="7">7 ngày</option>
            <option :value="14">14 ngày</option>
            <option :value="30">30 ngày</option>
            <option :value="90">90 ngày</option>
          </select>
        </div>

        <button class="refresh-btn" @click="loadStats" :disabled="loading">
          <span :class="['refresh-icon', { spinning: loading }]" v-html="iconRefresh"></span>
          {{ loading ? 'Đang tải...' : 'Refresh' }}
        </button>
      </div>
    </template>

    <div class="revenue-page">
      <!-- Error -->
      <div v-if="error" class="error-banner">
        {{ error }}
        <button class="retry-btn" @click="loadStats">Thử lại</button>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading && !hasLoaded" class="skeleton-wrap">
        <div class="skeleton-kpi-row">
          <div v-for="i in 4" :key="i" class="skeleton-card"></div>
        </div>
        <div class="skeleton-chart"></div>
      </div>

      <template v-else>
        <!-- KPI Cards -->
        <section class="kpi-row">
          <article class="kpi-card blue">
            <div class="kpi-icon" v-html="iconMoney"></div>
            <div class="kpi-body">
              <span class="kpi-label">Doanh thu kỳ này</span>
              <strong class="kpi-value">{{ fmt(summary.total_revenue) }}</strong>
            </div>
          </article>
          <article class="kpi-card purple">
            <div class="kpi-icon" v-html="iconCart"></div>
            <div class="kpi-body">
              <span class="kpi-label">Tổng đơn hàng</span>
              <strong class="kpi-value">{{ summary.total_orders }}</strong>
            </div>
          </article>
          <article class="kpi-card green">
            <div class="kpi-icon" v-html="iconAvg"></div>
            <div class="kpi-body">
              <span class="kpi-label">GT đơn trung bình</span>
              <strong class="kpi-value">{{ fmt(summary.avg_order_value) }}</strong>
            </div>
          </article>
          <article class="kpi-card orange">
            <div class="kpi-icon" v-html="iconStar"></div>
            <div class="kpi-body">
              <span class="kpi-label">Kỳ cao nhất</span>
              <strong class="kpi-value">{{ summary.best_period?.display || '—' }}</strong>
              <span class="kpi-sub">{{ fmt(summary.best_period?.revenue) }}</span>
            </div>
          </article>
        </section>

        <!-- Chart -->
        <section class="chart-card">
          <div class="chart-header">
            <h2>Biểu đồ doanh thu</h2>
            <span class="chart-period-badge">{{ periodLabel }}</span>
          </div>

          <div class="chart-wrap" ref="chartWrap">
            <svg
              v-if="chartData.length"
              :viewBox="`0 0 ${svgW} ${svgH}`"
              class="chart-svg"
              preserveAspectRatio="none"
            >
              <!-- Grid lines -->
              <line
                v-for="(tick, i) in yTicks"
                :key="'g' + i"
                :x1="padL"
                :y1="yScale(tick)"
                :x2="svgW - padR"
                :y2="yScale(tick)"
                stroke="#e2e8f0"
                stroke-width="1"
                stroke-dasharray="4 4"
              />

              <!-- Y-axis labels -->
              <text
                v-for="(tick, i) in yTicks"
                :key="'y' + i"
                :x="padL - 8"
                :y="yScale(tick) + 4"
                text-anchor="end"
                class="axis-label"
              >{{ fmtShort(tick) }}</text>

              <!-- Area fill -->
              <path
                :d="areaPath"
                fill="url(#areaGrad)"
                opacity="0.6"
              />

              <!-- Line -->
              <path
                :d="linePath"
                fill="none"
                stroke="#005B96"
                stroke-width="2.5"
                stroke-linejoin="round"
                stroke-linecap="round"
              />

              <!-- Dots -->
              <circle
                v-for="(pt, i) in points"
                :key="'d' + i"
                :cx="pt.x"
                :cy="pt.y"
                r="4"
                fill="#fff"
                stroke="#005B96"
                stroke-width="2.5"
                class="chart-dot"
                @mouseover="showTooltip(pt, $event)"
                @mouseleave="tooltip.visible = false"
              />

              <!-- X-axis labels -->
              <text
                v-for="(pt, i) in xLabelPoints"
                :key="'x' + i"
                :x="pt.x"
                :y="svgH - 6"
                text-anchor="middle"
                class="axis-label"
              >{{ pt.label }}</text>

              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stop-color="#005B96" stop-opacity="0.25"/>
                  <stop offset="100%" stop-color="#005B96" stop-opacity="0"/>
                </linearGradient>
              </defs>
            </svg>

            <!-- Empty state -->
            <div v-else class="chart-empty">
              <span v-html="iconChart"></span>
              <p>Chưa có dữ liệu doanh thu trong kỳ này</p>
            </div>

            <!-- Tooltip -->
            <div
              v-if="tooltip.visible"
              class="chart-tooltip"
              :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
            >
              <strong>{{ tooltip.label }}</strong>
              <span>{{ fmt(tooltip.revenue) }}</span>
              <span class="tt-orders">{{ tooltip.orders }} đơn</span>
            </div>
          </div>
        </section>

        <!-- Bottom grid: Top products + Order count bar -->
        <div class="bottom-grid">
          <!-- Top products -->
          <section class="panel">
            <div class="panel-head">
              <h2>Top 5 sản phẩm bán chạy</h2>
            </div>
            <div class="top-products-list">
              <div
                v-for="(prod, i) in topProducts"
                :key="prod.product_id"
                class="top-prod-row"
              >
                <span class="rank" :class="'rank-' + (i + 1)">{{ i + 1 }}</span>
                <div class="prod-info">
                  <p class="prod-name">{{ prod.name }}</p>
                  <div class="prod-bar-wrap">
                    <div
                      class="prod-bar"
                      :style="{ width: barWidth(prod.sold) + '%' }"
                    ></div>
                  </div>
                </div>
                <div class="prod-stats">
                  <span class="prod-sold">{{ prod.sold }} đã bán</span>
                  <span class="prod-revenue">{{ fmt(prod.revenue) }}</span>
                </div>
              </div>

              <div v-if="!topProducts.length" class="empty-hint">
                Chưa có dữ liệu bán hàng
              </div>
            </div>
          </section>

          <!-- Order count bar chart -->
          <section class="panel">
            <div class="panel-head">
              <h2>Số đơn hàng</h2>
            </div>
            <div class="order-bar-chart">
              <div
                v-for="(d, i) in ordersChartData"
                :key="i"
                class="bar-col"
                :title="`${d.display}: ${d.order_count} đơn`"
              >
                <div class="bar-outer">
                  <div
                    class="bar-inner"
                    :style="{ height: barOrderHeight(d.order_count) + '%' }"
                  ></div>
                </div>
                <span class="bar-label">{{ d.display }}</span>
              </div>
            </div>
          </section>
        </div>
      </template>
    </div>
  </WarehouseSidebar>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import WarehouseSidebar from '@/components/warehouse/Sidebar.vue'
import axios from 'axios'

// ── API client ──────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: { Accept: 'application/json' }
})
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('auth_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// ── State ───────────────────────────────────────────────────────────────────
const loading    = ref(false)
const hasLoaded  = ref(false)
const error      = ref('')

const selectedPeriod = ref('daily')
const selectedYear   = ref(new Date().getFullYear())
const selectedDays   = ref(30)

const chartData  = ref([])
const summary    = ref({ total_revenue: 0, total_orders: 0, avg_order_value: 0, best_period: null })
const topProducts = ref([])

const tooltip = reactive({ visible: false, x: 0, y: 0, label: '', revenue: 0, orders: 0 })

// ── Constants ───────────────────────────────────────────────────────────────
const periods = [
  { value: 'daily',   label: 'Theo ngày' },
  { value: 'monthly', label: 'Theo tháng' },
  { value: 'yearly',  label: 'Theo năm' },
]
const availableYears = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i)

// ── SVG chart config ─────────────────────────────────────────────────────────
const svgW = 900
const svgH = 260
const padL = 70
const padR = 20
const padT = 20
const padB = 30

const maxRevenue = computed(() => Math.max(...chartData.value.map(d => d.revenue), 1))
const yTicks = computed(() => {
  const max = maxRevenue.value
  const step = Math.ceil(max / 4 / 1_000_000) * 1_000_000 || 1_000_000
  return [0, step, step * 2, step * 3, step * 4].filter(t => t <= max * 1.1 + step)
})

const yScale = (val) => svgH - padB - ((val / (yTicks.value.at(-1) || 1)) * (svgH - padT - padB))

const points = computed(() => {
  const n = chartData.value.length
  if (!n) return []
  const slotW = (svgW - padL - padR) / Math.max(n - 1, 1)
  return chartData.value.map((d, i) => ({
    x: padL + i * slotW,
    y: yScale(d.revenue),
    label: d.display,
    revenue: d.revenue,
    orders: d.order_count,
  }))
})

const linePath = computed(() => {
  if (!points.value.length) return ''
  return points.value
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')
})

const areaPath = computed(() => {
  if (!points.value.length) return ''
  const baseY = svgH - padB
  const right = points.value.at(-1)
  const left  = points.value[0]
  return linePath.value
    + ` L${right.x.toFixed(1)},${baseY} L${left.x.toFixed(1)},${baseY} Z`
})

// X-axis: show only every N-th label to avoid crowding
const xLabelPoints = computed(() => {
  const n = points.value.length
  const step = n > 20 ? 5 : n > 10 ? 3 : 1
  return points.value.filter((_, i) => i % step === 0 || i === n - 1)
})

// Orders bar chart – trim to last 12 for readability
const ordersChartData = computed(() => {
  const data = [...chartData.value]
  return data.slice(-12)
})

const maxOrders = computed(() => Math.max(...ordersChartData.value.map(d => d.order_count), 1))

// ── Helpers ──────────────────────────────────────────────────────────────────
const periodLabel = computed(() => {
  if (selectedPeriod.value === 'daily')   return `${selectedDays.value} ngày gần nhất`
  if (selectedPeriod.value === 'monthly') return `Năm ${selectedYear.value}`
  return '5 năm gần nhất'
})

const fmt = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
    .format(Number(val || 0))

const fmtShort = (val) => {
  if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + 'B'
  if (val >= 1_000_000)     return (val / 1_000_000).toFixed(0) + 'M'
  if (val >= 1_000)         return (val / 1_000).toFixed(0) + 'K'
  return val.toFixed(0)
}

const maxSold = computed(() => Math.max(...topProducts.value.map(p => p.sold), 1))
const barWidth = (sold) => Math.round((sold / maxSold.value) * 100)
const barOrderHeight = (cnt) => Math.round((cnt / maxOrders.value) * 90)

// ── Methods ──────────────────────────────────────────────────────────────────
const loadStats = async () => {
  loading.value = true
  error.value   = ''
  try {
    const params = { period: selectedPeriod.value }
    if (selectedPeriod.value === 'daily')   params.days  = selectedDays.value
    if (selectedPeriod.value === 'monthly') params.year  = selectedYear.value

    const { data } = await api.get('/admin/stats/revenue', { params })
    chartData.value  = data.chart_data   || []
    summary.value    = data.summary      || {}
    topProducts.value = data.top_products || []
    hasLoaded.value  = true
  } catch (err) {
    error.value = err?.response?.data?.message || err?.message || 'Không tải được dữ liệu.'
  } finally {
    loading.value = false
  }
}

const changePeriod = (p) => {
  selectedPeriod.value = p
  loadStats()
}

const showTooltip = (pt, event) => {
  const el = event.target
  const rect = el.closest('.chart-wrap').getBoundingClientRect()
  tooltip.visible = true
  tooltip.x       = event.clientX - rect.left + 12
  tooltip.y       = event.clientY - rect.top  - 40
  tooltip.label   = pt.label
  tooltip.revenue = pt.revenue
  tooltip.orders  = pt.orders
}

onMounted(loadStats)

// ── Icons ────────────────────────────────────────────────────────────────────
const iconRefresh = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 0 1-13.7 5.7"/><path d="M6 12a8 8 0 0 1 13.7-5.7"/><path d="M20 7v5h-5"/><path d="M4 17v-5h5"/></svg>`
const iconMoney   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
const iconCart    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
const iconAvg     = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18.5h16"/><path d="M7 14.5 11 10l3 3 5-6"/><path d="M17 7h2v2"/></svg>`
const iconStar    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
const iconChart   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5h16"/><path d="M7 16v-5"/><path d="M12 16V8.5"/><path d="M17 16V5.5"/></svg>`
</script>

<style scoped>
.revenue-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.period-tabs {
  display: flex;
  background: rgba(255,255,255,0.6);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 3px;
  gap: 2px;
}

.period-tab {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  background: none;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.period-tab.active {
  background: #005B96;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,91,150,0.25);
}
.period-tab:not(.active):hover { background: #f1f5f9; }

.year-select-wrap { display: flex; align-items: center; }
.year-select {
  padding: 7px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  background: #fff;
  color: #1e293b;
  cursor: pointer;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #005B96;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,91,150,0.2);
  transition: all 0.2s ease;
}
.refresh-btn:hover:not(:disabled) { background: #004a7c; transform: translateY(-1px); }
.refresh-btn:disabled { opacity: 0.7; cursor: progress; }
.refresh-icon { width: 16px; height: 16px; display: inline-flex; }
.refresh-icon :deep(svg) { width: 16px; height: 16px; }
.refresh-icon.spinning { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Error */
.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.retry-btn {
  padding: 6px 14px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

/* Skeleton */
.skeleton-wrap { display: flex; flex-direction: column; gap: 14px; }
.skeleton-kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.skeleton-card {
  height: 100px;
  background: linear-gradient(90deg,#f1f5f9 25%,#e9edf2 50%,#f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 18px;
}
.skeleton-chart {
  height: 280px;
  background: linear-gradient(90deg,#f1f5f9 25%,#e9edf2 50%,#f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 18px;
}
@keyframes shimmer { to { background-position: -200% 0; } }

/* KPI cards */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.kpi-card {
  background: #fff;
  border-radius: 18px;
  border: 1px solid #edf2f7;
  box-shadow: 0 8px 20px rgba(15,23,42,0.06);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.kpi-card:hover { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(15,23,42,0.1); }

.kpi-icon {
  width: 50px; height: 50px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.kpi-icon :deep(svg) { width: 24px; height: 24px; }

.kpi-card.blue  .kpi-icon { background: #dbeafe; color: #1d4ed8; }
.kpi-card.purple .kpi-icon { background: #ede9fe; color: #7c3aed; }
.kpi-card.green .kpi-icon { background: #dcfce7; color: #16a34a; }
.kpi-card.orange .kpi-icon { background: #ffedd5; color: #ea580c; }

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.kpi-label { font-size: 12px; color: #64748b; font-weight: 600; }
.kpi-value { font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.03em; line-height: 1.1; }
.kpi-sub { font-size: 11px; color: #94a3b8; margin-top: 2px; }

/* Chart card */
.chart-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(15,23,42,0.06);
  padding: 20px 24px;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.chart-header h2 { margin: 0; font-size: 18px; color: #0f172a; }
.chart-period-badge {
  padding: 4px 12px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.chart-wrap {
  position: relative;
  width: 100%;
  overflow: visible;
}

.chart-svg {
  width: 100%;
  height: 260px;
  overflow: visible;
}

.axis-label {
  font-size: 11px;
  fill: #94a3b8;
  font-family: inherit;
}

.chart-dot { cursor: pointer; transition: r 0.15s; }
.chart-dot:hover { r: 6; }

.chart-empty {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #94a3b8;
}
.chart-empty :deep(svg) { width: 40px; height: 40px; }

.chart-tooltip {
  position: absolute;
  background: #0f172a;
  color: #fff;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 3px;
  z-index: 10;
  white-space: nowrap;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}
.tt-orders { color: #94a3b8; font-weight: 500; }

/* Bottom grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.panel {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(15,23,42,0.06);
  padding: 20px 22px;
}
.panel-head { margin-bottom: 16px; }
.panel-head h2 { margin: 0; font-size: 17px; color: #0f172a; }

/* Top products */
.top-products-list { display: flex; flex-direction: column; gap: 12px; }
.top-prod-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.rank {
  width: 26px; height: 26px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 900;
  flex-shrink: 0;
  background: #f1f5f9;
  color: #475569;
}
.rank-1 { background: #fef3c7; color: #92400e; }
.rank-2 { background: #e2e8f0; color: #374151; }
.rank-3 { background: #fed7aa; color: #9a3412; }

.prod-info { flex: 1; min-width: 0; }
.prod-name {
  margin: 0 0 5px;
  font-size: 13px; font-weight: 700;
  color: #1e293b;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.prod-bar-wrap { height: 6px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
.prod-bar {
  height: 100%;
  background: linear-gradient(90deg, #005B96, #06b6d4);
  border-radius: 999px;
  transition: width 0.6s ease;
}

.prod-stats { text-align: right; flex-shrink: 0; }
.prod-sold { display: block; font-size: 12px; font-weight: 700; color: #1d4ed8; }
.prod-revenue { display: block; font-size: 11px; color: #64748b; margin-top: 2px; }

.empty-hint { color: #94a3b8; font-size: 13px; text-align: center; padding: 20px 0; }

/* Order bar chart */
.order-bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 160px;
  overflow: hidden;
}
.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
  justify-content: flex-end;
}
.bar-outer {
  width: 100%;
  height: 130px;
  background: #f1f5f9;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}
.bar-inner {
  width: 100%;
  background: linear-gradient(180deg, #005B96, #06b6d4);
  border-radius: 6px 6px 0 0;
  transition: height 0.5s ease;
  min-height: 2px;
}
.bar-label {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: center;
}

/* Responsive */
@media (max-width: 900px) {
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .bottom-grid { grid-template-columns: 1fr; }
}
</style>
