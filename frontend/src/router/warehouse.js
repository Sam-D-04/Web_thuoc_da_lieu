import { defineAsyncComponent } from 'vue'

const WarehouseDashboard = defineAsyncComponent(() => import('@/views/warehouse/Dashboard.vue'))
const WarehouseProducts = defineAsyncComponent(() => import('@/views/warehouse/Products.vue'))
const WarehouseBatches = defineAsyncComponent(() => import('@/views/warehouse/Batches.vue'))
const WarehouseInventory = defineAsyncComponent(() => import('@/views/warehouse/Inventory.vue'))
const WarehouseAlerts = defineAsyncComponent(() => import('@/views/warehouse/Alerts.vue'))

const warehouseRoutes = [
  {
    path: '/warehouse',
    redirect: '/warehouse/dashboard'
  },
  {
    path: '/warehouse/dashboard',
    name: 'WarehouseDashboard',
    component: WarehouseDashboard,
    meta: { title: 'Kho - Tong quan' }
  },
  {
    path: '/warehouse/products',
    name: 'WarehouseProducts',
    component: WarehouseProducts,
    meta: { title: 'Kho - San pham' }
  },
  {
    path: '/warehouse/batches',
    name: 'WarehouseBatches',
    component: WarehouseBatches,
    meta: { title: 'Kho - Lo hang' }
  },
  {
    path: '/warehouse/inventory',
    name: 'WarehouseInventory',
    component: WarehouseInventory,
    meta: { title: 'Kho - Ton kho' }
  },
  {
    path: '/warehouse/alerts',
    name: 'WarehouseAlerts',
    component: WarehouseAlerts,
    meta: { title: 'Kho - Canh bao' }
  }
]

export default warehouseRoutes
