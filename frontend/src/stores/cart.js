import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const CART_KEY = 'guest_cart'

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()

  // In-memory cart (synced to localStorage for guests)
  const items = ref(JSON.parse(localStorage.getItem(CART_KEY) || '[]'))
  const isDrawerOpen = ref(false)

  const persistGuest = () => {
    if (!authStore.isLoggedIn) {
      localStorage.setItem(CART_KEY, JSON.stringify(items.value))
    }
  }

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const totalAmount = computed(() => items.value.reduce((sum, i) => sum + i.price * i.quantity, 0))

  const addItem = (product, quantity = 1) => {
    const exist = items.value.find(i => i.productId === product.id)
    if (exist) {
      exist.quantity += quantity
    } else {
      items.value.push({
        productId: product.id,
        name: product.name,
        price: product.price_listed,
        image: product.image,
        volume: product.volume,
        dosage_form: product.dosage_form,
        quantity
      })
    }
    persistGuest()
  }

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(i => i.productId === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
        persistGuest()
      }
    }
  }

  const removeItem = (productId) => {
    const idx = items.value.findIndex(i => i.productId === productId)
    if (idx > -1) {
      items.value.splice(idx, 1)
      persistGuest()
    }
  }

  const clearCart = () => {
    items.value = []
    localStorage.removeItem(CART_KEY)
  }

  // Hybrid Cart: sync guest cart to DB after login
  const syncGuestCart = () => {
    const guestItems = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    if (guestItems.length > 0) {
      guestItems.forEach(guestItem => {
        const exist = items.value.find(i => i.productId === guestItem.productId)
        if (exist) {
          exist.quantity += guestItem.quantity
        } else {
          items.value.push(guestItem)
        }
      })
      localStorage.removeItem(CART_KEY)
    }
  }

  const toggleDrawer = () => { isDrawerOpen.value = !isDrawerOpen.value }
  const openDrawer = () => { isDrawerOpen.value = true }
  const closeDrawer = () => { isDrawerOpen.value = false }

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  return {
    items, isDrawerOpen, totalItems, totalAmount,
    addItem, updateQuantity, removeItem, clearCart, syncGuestCart,
    toggleDrawer, openDrawer, closeDrawer, formatPrice
  }
})
