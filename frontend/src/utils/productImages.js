const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin
  } catch (error) {
    return 'http://localhost:8000'
  }
})()

export const resolveImageUrl = (value) => {
  if (!value) return ''
  const raw = String(value).trim()
  if (!raw) return ''

  if (/^(data:image\/|blob:)/i.test(raw)) {
    return raw
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw)
      const isLoopbackHost = ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname)
      if (isLoopbackHost && !parsed.port) {
        return `${API_ORIGIN}${parsed.pathname}${parsed.search || ''}`
      }
    } catch (error) {
      return raw
    }
    return raw
  }

  const normalized = raw.replace(/\\/g, '/').replace(/^\/+/, '')
  if (normalized.startsWith('storage/')) {
    return `${API_ORIGIN}/${normalized}`
  }
  if (normalized.startsWith('products/')) {
    return `${API_ORIGIN}/storage/${normalized}`
  }
  return `${API_ORIGIN}/storage/${normalized}`
}

export const getProductPlaceholderImage = (product) => {
  return '/product-placeholder.svg'
}

export const resolveProductImage = (product) => {
  const resolved = resolveImageUrl(product?.image_url || product?.image || '')
  return resolved || getProductPlaceholderImage(product)
}

export const handleProductImageError = (event, product) => {
  const target = event?.target
  if (!target) return

  const fallback = getProductPlaceholderImage(product)
  if (target.src !== fallback) {
    target.src = fallback
  }
}
