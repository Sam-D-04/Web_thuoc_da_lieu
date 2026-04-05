import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Mock user database (in real app, this calls Laravel API)
const mockUsers = [
  { id: 1, name: 'Admin', email: 'admin@test.com', password: 'password', phone: '0123456789', role: 'admin', status: 'active' },
  { id: 2, name: 'Warehouse', email: 'warehouse@test.com', password: 'password', phone: '0987654321', role: 'warehouse', status: 'active' },
  { id: 3, name: 'Nguyễn Thị Cẩm Tú', email: 'customer@test.com', password: 'password', phone: '0909123456', role: 'customer', status: 'active' }
]

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const token = ref(localStorage.getItem('auth_token') || null)

  const isLoggedIn = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isWarehouse = computed(() => user.value?.role === 'warehouse')
  const isCustomer = computed(() => user.value?.role === 'customer')
  const userName = computed(() => user.value?.name || '')

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600))

    const found = mockUsers.find(u => u.email === email && u.password === password)
    if (!found) {
      return { success: false, message: 'Email hoặc mật khẩu không đúng' }
    }
    if (found.status !== 'active') {
      return { success: false, message: 'Tài khoản đã bị vô hiệu hóa' }
    }

    const { password: _, ...safeUser } = found
    const mockToken = `mock-token-${found.id}-${Date.now()}`

    user.value = safeUser
    token.value = mockToken

    localStorage.setItem('auth_user', JSON.stringify(safeUser))
    localStorage.setItem('auth_token', mockToken)

    return { success: true, user: safeUser }
  }

  const register = async (formData) => {
    await new Promise(r => setTimeout(r, 800))

    const exists = mockUsers.find(u => u.email === formData.email)
    if (exists) {
      return { success: false, message: 'Email này đã được đăng ký' }
    }

    const newUser = {
      id: mockUsers.length + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: 'customer',
      status: 'active'
    }

    mockUsers.push({ ...newUser, password: formData.password })

    const mockToken = `mock-token-${newUser.id}-${Date.now()}`
    user.value = newUser
    token.value = mockToken

    localStorage.setItem('auth_user', JSON.stringify(newUser))
    localStorage.setItem('auth_token', mockToken)

    return { success: true, user: newUser }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  return { user, token, isLoggedIn, isAdmin, isWarehouse, isCustomer, userName, login, register, logout }
})
