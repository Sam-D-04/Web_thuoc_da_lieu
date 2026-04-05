# Hướng dẫn Setup PHP 8.3 từ Wampserver

## Bước 1: Chọn PHP 8.3 trong Wampserver (Apache Module)

1. Click vào **icon Wampserver** trên taskbar (góc dưới bên phải)
2. Chọn **PHP** → **Version** → **8.3.14**
3. Wampserver sẽ tự động restart Apache
4. Kiểm tra: Mở browser, vào `http://localhost` → Click "phpinfo()" → Xem PHP version phải là **8.3.14**

## Bước 2: Cập nhật PATH để dùng PHP 8.3 cho CLI

### Cách 1: Cập nhật PATH trong Windows (Khuyến nghị)

1. **Mở Environment Variables:**
   - Nhấn `Win + R`
   - Gõ `sysdm.cpl` → Enter
   - Tab **"Advanced"** → Click **"Environment Variables"**

2. **Cập nhật PATH:**
   - Tìm biến **`Path`** trong phần **"System variables"**
   - Click **"Edit"**
   - Tìm và **xóa** hoặc **di chuyển xuống dưới**:
     - `C:\wamp64\bin\php\php7.4.33`
   - **Thêm mới** hoặc **di chuyển lên đầu**:
     - `C:\wamp64\bin\php\php8.3.14`
   - Click **OK** để lưu

3. **Khởi động lại Terminal:**
   - Đóng tất cả CMD/PowerShell/VS Code Terminal
   - Mở lại terminal mới
   - Chạy lệnh kiểm tra:
   ```bash
   php -v
   ```
   Kết quả mong đợi: `PHP 8.3.14`

### Cách 2: Sử dụng Script (Tạm thời)

Nếu chưa cập nhật PATH, bạn có thể dùng script:

**Chạy migration:**
```bash
migrate.bat
```

**Chạy artisan commands:**
```bash
artisan.bat migrate
artisan.bat migrate:status
artisan.bat serve
```

## Bước 3: Chạy Migration

Sau khi setup xong, chạy migration:

```bash
php artisan migrate
```

Hoặc dùng script:
```bash
migrate.bat
```

## Kiểm tra kết quả

### Kiểm tra PHP version:
```bash
php -v
```

### Kiểm tra migration đã chạy:
```bash
php artisan migrate:status
```

### Kiểm tra trong database:
```sql
DESCRIBE users;
```

Bạn sẽ thấy 2 cột mới:
- `verification_code` VARCHAR(255) NULL
- `verification_code_expires_at` TIMESTAMP NULL

## Lưu ý

- ✅ PHP 8.3.14 đã có sẵn trong Wampserver tại: `C:\wamp64\bin\php\php8.3.14\`
- ✅ Sau khi cập nhật PATH, cần **khởi động lại terminal/IDE**
- ✅ Nếu vẫn không hoạt động, thử **restart máy tính**
- ✅ Có thể sử dụng script `.bat` như giải pháp tạm thời

## Troubleshooting

### Nếu `php -v` vẫn hiển thị PHP 7.4.33:

1. Kiểm tra PATH có đúng không:
   ```bash
   echo %PATH%
   ```
   Tìm xem `php8.3.14` có trong PATH không

2. Thử restart máy tính

3. Hoặc dùng đường dẫn đầy đủ:
   ```bash
   C:\wamp64\bin\php\php8.3.14\php.exe artisan migrate
   ```

### Nếu Apache không chạy với PHP 8.3:

1. Kiểm tra Wampserver đã chọn PHP 8.3 chưa
2. Restart Wampserver: Click icon → **Restart All Services**
3. Kiểm tra `phpinfo()` trong browser

