# Cấu hình Mail ĐÚNG cho Gmail

## Vấn đề hiện tại:
- ❌ Mail driver đang là `log` → chỉ lưu vào log, không gửi mail thật
- ❌ MAIL_HOST sai: `127.0.0.1` → phải là `smtp.gmail.com`
- ❌ MAIL_PORT sai: `2525` → phải là `587`

## Cấu hình ĐÚNG trong file .env:

Mở file `.env` trong thư mục `project/` và đảm bảo có các dòng sau:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tvinhthanhsg@gmail.com
MAIL_PASSWORD=wukcvxpnfuzzmzcy
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tvinhthanhsg@gmail.com
MAIL_FROM_NAME="E-Commerce"
```

## Các bước:

### Bước 1: Sửa file .env
Mở file `.env` và sửa các dòng mail như trên.

### Bước 2: Clear cache
```bash
php artisan config:clear
```

Hoặc dùng script:
```bash
artisan.bat config:clear
```

### Bước 3: Test lại
Mở browser: `http://localhost:8000/test-mail.html`

## Hoặc dùng script tự động:

Chạy:
```bash
fix-mail-config.bat
```

Script sẽ tự động sửa các cấu hình sai.

## Kiểm tra sau khi sửa:

Chạy lệnh để xem cấu hình:
```bash
php artisan config:show mail
```

Kết quả đúng phải là:
- `default`: `smtp` (không phải `log`)
- `mailers ⇁ smtp ⇁ host`: `smtp.gmail.com` (không phải `127.0.0.1`)
- `mailers ⇁ smtp ⇁ port`: `587` (không phải `2525`)

## Lưu ý:

1. ✅ App Password đã đúng: `wukcvxpnfuzzmzcy`
2. ✅ Email đã đúng: `tvinhthanhsg@gmail.com`
3. ⚠️ Chỉ cần sửa MAIL_MAILER, MAIL_HOST, MAIL_PORT, MAIL_ENCRYPTION

