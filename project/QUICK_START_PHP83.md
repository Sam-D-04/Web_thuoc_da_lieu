# Quick Start: Setup PHP 8.3 từ Wampserver

## ✅ PHP 8.3.14 đã có sẵn!

PHP 8.3.14 đã được cài đặt trong Wampserver tại: `C:\wamp64\bin\php\php8.3.14\`

## 🚀 Cách nhanh nhất (3 bước)

### Bước 1: Chọn PHP 8.3 trong Wampserver
1. Click **icon Wampserver** trên taskbar
2. **PHP** → **Version** → **8.3.14**
3. Đợi Apache restart

### Bước 2: Cập nhật PATH (Chọn 1 trong 2 cách)

**Cách A: Tự động (Khuyến nghị)**
1. Right-click `setup_php83_path.bat` → **Run as administrator**
2. Đợi script chạy xong
3. **Khởi động lại terminal/IDE**

**Cách B: Thủ công**
1. `Win + R` → `sysdm.cpl` → Enter
2. Tab **Advanced** → **Environment Variables**
3. Tìm **Path** trong **System variables** → **Edit**
4. Xóa: `C:\wamp64\bin\php\php7.4.33`
5. Thêm lên đầu: `C:\wamp64\bin\php\php8.3.14`
6. **OK** → **OK**
7. **Khởi động lại terminal/IDE**

### Bước 3: Kiểm tra và chạy migration

```bash
# Kiểm tra PHP version
php -v
# Kết quả: PHP 8.3.14

# Chạy migration
php artisan migrate
```

## 📝 Hoặc dùng script (Không cần cập nhật PATH)

Nếu chưa cập nhật PATH, bạn có thể dùng script:

```bash
# Chạy migration
migrate.bat

# Hoặc bất kỳ artisan command
artisan.bat migrate
artisan.bat migrate:status
artisan.bat serve
```

## ✅ Kiểm tra kết quả

```bash
php -v
# Phải hiển thị: PHP 8.3.14

php artisan migrate:status
# Xem các migration đã chạy
```

## 🔧 Troubleshooting

### Nếu `php -v` vẫn là 7.4.33:
1. Đảm bảo đã **khởi động lại terminal/IDE**
2. Hoặc restart máy tính
3. Hoặc dùng script: `artisan.bat migrate`

### Nếu Apache không chạy:
1. Kiểm tra Wampserver đã chọn PHP 8.3 chưa
2. Click icon Wampserver → **Restart All Services**
3. Kiểm tra `http://localhost` → phpinfo()

## 📚 Files hỗ trợ

- `setup_php83_path.bat` - Script tự động cập nhật PATH (chạy as Admin)
- `migrate.bat` - Script chạy migration với PHP 8.3
- `artisan.bat` - Script chạy artisan commands với PHP 8.3
- `SETUP_PHP83.md` - Hướng dẫn chi tiết

