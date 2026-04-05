# Hướng dẫn cấu hình PHP CLI để sử dụng PHP 8.2.26

## Vấn đề hiện tại
- PHP CLI mặc định: PHP 7.4.33 (không đủ cho Laravel 12)
- PHP Apache (Wampserver): PHP 8.2.26 ✅
- PHP 8.2.26 có sẵn tại: `C:\wamp64\bin\php\php8.2.26\php.exe`

## Giải pháp tạm thời (Sử dụng script)

### Cách 1: Sử dụng script có sẵn
Chạy migration:
```bash
migrate.bat
```

Hoặc chạy bất kỳ artisan command:
```bash
artisan.bat migrate
artisan.bat migrate:status
artisan.bat serve
```

## Giải pháp vĩnh viễn (Cập nhật PATH)

### Bước 1: Mở Environment Variables
1. Nhấn `Win + R`, gõ `sysdm.cpl`, nhấn Enter
2. Tab "Advanced" → "Environment Variables"

### Bước 2: Cập nhật PATH
1. Tìm biến `Path` trong "System variables"
2. Click "Edit"
3. Tìm và xóa hoặc di chuyển xuống dưới:
   - `C:\wamp64\bin\php\php7.4.33`
4. Thêm hoặc đảm bảo có (ở đầu danh sách):
   - `C:\wamp64\bin\php\php8.2.26`
5. Click OK để lưu

### Bước 3: Khởi động lại Terminal
- Đóng và mở lại CMD/PowerShell/VS Code Terminal
- Chạy `php -v` để kiểm tra:
```bash
php -v
```
Kết quả mong đợi: `PHP 8.2.26`

### Bước 4: Chạy migration
```bash
php artisan migrate
```

## Kiểm tra migration đã chạy

```bash
php artisan migrate:status
```

Hoặc kiểm tra trong database:
```sql
DESCRIBE users;
```

Bạn sẽ thấy 2 cột mới:
- `verification_code` VARCHAR(255) NULL
- `verification_code_expires_at` TIMESTAMP NULL

## Lưu ý

- Sau khi cập nhật PATH, cần khởi động lại terminal/IDE
- Nếu vẫn không hoạt động, thử restart máy tính
- Có thể sử dụng script `.bat` như giải pháp tạm thời

