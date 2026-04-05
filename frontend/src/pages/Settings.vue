<template>
  <div class="settings-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1>Cài đặt hệ thống</h1>
        <p class="breadcrumb">Nhà thuốc Da liễu / Cài đặt</p>
      </div>
    </div>

    <!-- Settings Layout -->
    <div class="settings-layout">
      <!-- Sidebar Navigation -->
      <nav class="settings-nav">
        <button 
          @click="activeTab = 'profile'"
          :class="{ active: activeTab === 'profile' }"
          class="nav-item"
        >
          <span class="nav-icon" v-html="getSettingsIcon('profile')"></span>
          <span>Hồ sơ cá nhân</span>
        </button>
        <button 
          @click="activeTab = 'security'"
          :class="{ active: activeTab === 'security' }"
          class="nav-item"
        >
          <span class="nav-icon" v-html="getSettingsIcon('lock')"></span>
          <span>Bảo mật</span>
        </button>
        <button 
          @click="activeTab = 'notifications'"
          :class="{ active: activeTab === 'notifications' }"
          class="nav-item"
        >
          <span class="nav-icon" v-html="getSettingsIcon('bell')"></span>
          <span>Thông báo</span>
        </button>
        <button 
          @click="activeTab = 'pharmacy'"
          :class="{ active: activeTab === 'pharmacy' }"
          class="nav-item"
        >
          <span class="nav-icon" v-html="getSettingsIcon('pharmacy')"></span>
          <span>Thông tin nhà thuốc</span>
        </button>
        <button 
          @click="activeTab = 'system'"
          :class="{ active: activeTab === 'system' }"
          class="nav-item"
        >
          <span class="nav-icon" v-html="getSettingsIcon('system')"></span>
          <span>Hệ thống</span>
        </button>
      </nav>

      <!-- Content Area -->
      <div class="settings-content">
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="settings-section">
          <h2>Hồ sơ cá nhân</h2>
          <div class="profile-form">
            <div class="form-group">
              <label>Tên quản trị viên</label>
              <input type="text" value="Nguyễn Văn Admin">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" value="admin@derma-pharmacy.com">
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input type="tel" value="0901234567">
            </div>
            <div class="form-group">
              <label>Chức vụ</label>
              <input type="text" value="Quản trị viên hệ thống">
            </div>
            <button class="btn btn-primary"><span class="btn-icon" v-html="getSettingsIcon('save')"></span>Lưu thay đổi</button>
          </div>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="settings-section">
          <h2>Bảo mật</h2>
          <div class="security-form">
            <div class="form-group">
              <label>Mật khẩu hiện tại</label>
              <input type="password" placeholder="Nhập mật khẩu hiện tại">
            </div>
            <div class="form-group">
              <label>Mật khẩu mới</label>
              <input type="password" placeholder="Nhập mật khẩu mới">
            </div>
            <div class="form-group">
              <label>Xác nhận mật khẩu</label>
              <input type="password" placeholder="Xác nhận mật khẩu mới">
            </div>
            <button class="btn btn-primary"><span class="btn-icon" v-html="getSettingsIcon('lock')"></span>Đổi mật khẩu</button>
          </div>
        </div>

        <!-- Notifications Tab -->
        <div v-if="activeTab === 'notifications'" class="settings-section">
          <h2>Cài đặt thông báo</h2>
          <div class="notification-settings">
            <div class="toggle-item">
              <div>
                <p class="toggle-label">Thông báo hết hạn</p>
                <p class="toggle-description">Nhận thông báo khi sản phẩm sắp hết hạn</p>
              </div>
              <input type="checkbox" class="toggle" checked>
            </div>

            <div class="toggle-item">
              <div>
                <p class="toggle-label">Thông báo hết hàng</p>
                <p class="toggle-description">Nhận thông báo khi sản phẩm hết hàng</p>
              </div>
              <input type="checkbox" class="toggle" checked>
            </div>

            <div class="toggle-item">
              <div>
                <p class="toggle-label">Thông báo đơn hàng mới</p>
                <p class="toggle-description">Nhận thông báo khi có đơn hàng mới</p>
              </div>
              <input type="checkbox" class="toggle" checked>
            </div>

            <div class="toggle-item">
              <div>
                <p class="toggle-label">Báo cáo hàng ngày</p>
                <p class="toggle-description">Nhận báo cáo tóm tắt hàng ngày</p>
              </div>
              <input type="checkbox" class="toggle">
            </div>

            <div class="form-group" style="margin-top: 20px;">
              <label>Giờ gửi thông báo (nếu bật báo cáo hàng ngày)</label>
              <input type="time" value="08:00">
            </div>
          </div>
        </div>

        <!-- Pharmacy Tab -->
        <div v-if="activeTab === 'pharmacy'" class="settings-section">
          <h2>Thông tin nhà thuốc</h2>
          <div class="pharmacy-form">
            <div class="form-group">
              <label>Tên nhà thuốc</label>
              <input type="text" value="Nhà Thuốc Da Liễu Dermacity">
            </div>
            <div class="form-group">
              <label>Địa chỉ</label>
              <input type="text" value="180 Cao Lỗ, Phường 3, Quận 8, TPHCM">
            </div>
            <div class="form-group">
              <label>Điện thoại</label>
              <input type="tel" value="(028) 3829-5123">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" value="info@derma-pharmacy.com">
            </div>
            <div class="form-group">
              <label>Giấy phép hoạt động</label>
              <input type="text" value="SL2024-001234">
            </div>
            <button class="btn btn-primary"><span class="btn-icon" v-html="getSettingsIcon('save')"></span>Lưu thay đổi</button>
          </div>
        </div>

        <!-- System Tab -->
        <div v-if="activeTab === 'system'" class="settings-section">
          <h2>Cài đặt hệ thống</h2>
          <div class="system-settings">
            <div class="setting-item">
              <div>
                <p class="setting-label">Phiên bản ứng dụng</p>
                <p class="setting-value">v2.1.0</p>
              </div>
              <button class="btn btn-sm btn-secondary">Kiểm tra cập nhật</button>
            </div>

            <div class="setting-item">
              <div>
                <p class="setting-label">Dung lượng cơ sở dữ liệu</p>
                <p class="setting-value">245 MB / 1 GB</p>
              </div>
              <button class="btn btn-sm btn-secondary">Xóa bộ đệm</button>
            </div>

            <div class="setting-item">
              <div>
                <p class="setting-label">Sao lưu dữ liệu</p>
                <p class="setting-value">Lần cuối: Hôm nay 02:00</p>
              </div>
              <button class="btn btn-sm btn-secondary">Sao lưu ngay</button>
            </div>

            <h3 style="margin-top: 30px;">Nguy hiểm</h3>
            <button class="btn btn-danger"><span class="btn-icon" v-html="getSettingsIcon('delete')"></span>Xóa toàn bộ dữ liệu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const validTabs = ['profile', 'security', 'notifications', 'pharmacy', 'system']

const getTabFromQuery = (tab) => {
  return validTabs.includes(tab) ? tab : 'profile'
}

const activeTab = ref(getTabFromQuery(route.query.tab))

watch(
  () => route.query.tab,
  (tab) => {
    activeTab.value = getTabFromQuery(tab)
  }
)

const getSettingsIcon = (name) => {
  const iconMap = {
    profile: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="3" />
        <path d="M5.5 19c1.3-3.1 4-5 6.5-5s5.2 1.9 6.5 5" />
      </svg>
    `,
    lock: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="5.5" y="10.5" width="13" height="9" rx="2" />
        <path d="M8.5 10.5V8.2a3.5 3.5 0 0 1 7 0v2.3" />
      </svg>
    `,
    bell: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M6.5 16.5h11l-1-1.4V11a4.5 4.5 0 0 0-9 0v4.1l-1 1.4Z" />
        <path d="M10 18.5a2 2 0 0 0 4 0" />
      </svg>
    `,
    pharmacy: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 4.5v15" />
        <path d="M4.5 12h15" />
        <path d="M6 5h12v14H6z" opacity="0.35" />
      </svg>
    `,
    system: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3.2" />
        <path d="M19 12a7 7 0 0 0-.1-1l1.8-1.3-1.8-3.1-2.1.7a7 7 0 0 0-1.8-1L14.6 3h-5.2l-.4 2.3a7 7 0 0 0-1.8 1l-2.1-.7-1.8 3.1L5.1 11a7 7 0 0 0 0 2l-1.8 1.3 1.8 3.1 2.1-.7a7 7 0 0 0 1.8 1l.4 2.3h5.2l.4-2.3a7 7 0 0 0 1.8-1l2.1.7 1.8-3.1L18.9 13a7 7 0 0 0 .1-1Z" opacity="0.55" />
      </svg>
    `,
    save: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 5.5h10l3.5 3.5V19H5z" />
        <path d="M8 5.5v5h7v-5" />
        <path d="M8 19v-5h8v5" />
      </svg>
    `,
    delete: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 7h14" />
        <path d="M9 7V5.6c0-.9.7-1.6 1.6-1.6h2.8c.9 0 1.6.7 1.6 1.6V7" />
        <path d="M8 7l.6 11.2c0 .9.7 1.6 1.6 1.6h3.6c.9 0 1.6-.7 1.6-1.6L16 7" />
        <path d="M10 11v4" />
        <path d="M14 11v4" />
      </svg>
    `
  }

  return iconMap[name] || iconMap.system
}
</script>

<style scoped>
.settings-page {
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

/* Settings Layout */
.settings-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

/* Settings Navigation */
.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: fit-content;
}

.nav-item {
  padding: 12px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  text-align: left;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-icon,
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon,
.btn-icon {
  color: currentColor;
}

.nav-icon :deep(svg),
.btn-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.nav-item:hover {
  border-color: #1e3a8a;
  background: #f0f4f8;
  color: #1e3a8a;
}

.nav-item.active {
  background: #1e3a8a;
  color: white;
  border-color: #1e3a8a;
}

/* Settings Content */
.settings-content {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.settings-section h2 {
  font-size: 18px;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0 0 24px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.settings-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0 0 12px 0;
}

/* Forms */
.profile-form,
.security-form,
.pharmacy-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1e3a8a;
  box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
}

/* Notifications */
.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.toggle-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 4px 0;
}

.toggle-description {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.toggle {
  width: 48px;
  height: 24px;
  cursor: pointer;
  appearance: none;
  background: #e2e8f0;
  border-radius: 12px;
  position: relative;
  transition: background 0.3s ease;
}

.toggle:checked {
  background: #1e3a8a;
}

.toggle:checked::before {
  left: 24px;
}

/* System Settings */
.system-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.setting-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 4px 0;
}

.setting-value {
  font-size: 14px;
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
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-primary {
  background: #1e3a8a;
  color: white;
}

.btn-primary:hover {
  background: #1e40af;
  box-shadow: 0 2px 8px rgba(30, 58, 138, 0.3);
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.btn-danger {
  background: #ef4444;
  color: white;
  padding: 8px 16px;
}

.btn-danger:hover {
  background: #dc2626;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-layout {
    grid-template-columns: 1fr;
  }

  .settings-nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .nav-item {
    text-align: center;
  }

  .profile-form,
  .security-form,
  .pharmacy-form {
    max-width: 100%;
  }

  .toggle-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .toggle {
    align-self: flex-end;
  }
}
</style>
