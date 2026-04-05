# Hướng dẫn chạy Migration

## Vấn đề hiện tại
- PHP version hiện tại: 7.4.33
- PHP version yêu cầu: >= 8.2.0

## Cách 1: Nâng cấp PHP (Khuyến nghị)

1. Cài đặt PHP 8.2 hoặc cao hơn
2. Cập nhật PATH environment variable
3. Chạy lệnh:
```bash
php artisan migrate
```

## Cách 2: Chạy SQL thủ công

Nếu không thể nâng cấp PHP ngay, bạn có thể chạy SQL trực tiếp:

```sql
ALTER TABLE `users` 
ADD COLUMN `verification_code` VARCHAR(255) NULL AFTER `email_verified_at`,
ADD COLUMN `verification_code_expires_at` TIMESTAMP NULL AFTER `verification_code`;
```

### Cách chạy SQL:
1. Mở phpMyAdmin hoặc MySQL client
2. Chọn database của project
3. Chạy SQL query trên

## Kiểm tra migration đã chạy chưa

Sau khi chạy migration, kiểm tra bằng:
```bash
php artisan migrate:status
```

Hoặc kiểm tra trong database:
```sql
DESCRIBE users;
```

Bạn sẽ thấy 2 cột mới:
- `verification_code`
- `verification_code_expires_at`

