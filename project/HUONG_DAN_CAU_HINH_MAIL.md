# Hướng dẫn cấu hình Mail trong Laravel

## Bước 1: Tạo file .env

Nếu chưa có file `.env`, copy từ `.env.example`:

```bash
copy .env.example .env
```

Hoặc tạo file `.env` mới trong thư mục `project/`

## Bước 2: Cấu hình Mail trong file .env

Mở file `.env` và thêm/cập nhật các dòng sau:

### Cấu hình cơ bản:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

---

## Các cách cấu hình Mail phổ biến:

### 1. Gmail (Khuyến nghị cho test)

#### Bước 1: Bật 2-Step Verification
1. Vào [Google Account](https://myaccount.google.com/)
2. Security → 2-Step Verification → Bật

#### Bước 2: Tạo App Password
1. Vào [App Passwords](https://myaccount.google.com/apppasswords)
2. Chọn "Mail" và "Other (Custom name)"
3. Nhập tên: "Laravel App"
4. Click "Generate"
5. Copy mật khẩu 16 ký tự (không có khoảng trắng)
wukc vxpn fuzz mzcy

#### Bước 3: Cấu hình trong .env
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="My E-Commerce"
```

**Lưu ý:** Dùng App Password, KHÔNG dùng mật khẩu Gmail thường!

---

### 2. Outlook/Hotmail

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USERNAME=your-email@outlook.com
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@outlook.com
MAIL_FROM_NAME="My E-Commerce"
```

---

### 3. Yahoo Mail

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mail.yahoo.com
MAIL_PORT=587
MAIL_USERNAME=your-email@yahoo.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@yahoo.com
MAIL_FROM_NAME="My E-Commerce"
```

**Lưu ý:** Yahoo cũng cần App Password (tương tự Gmail)

---

### 4. SendGrid (Dịch vụ chuyên nghiệp)

1. Đăng ký tại [SendGrid](https://sendgrid.com/)
2. Tạo API Key
3. Cấu hình:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-verified-email@domain.com
MAIL_FROM_NAME="My E-Commerce"
```

---

### 5. Mailgun (Dịch vụ chuyên nghiệp)

1. Đăng ký tại [Mailgun](https://www.mailgun.com/)
2. Lấy thông tin từ Dashboard
3. Cấu hình:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your-mailgun-username
MAIL_PASSWORD=your-mailgun-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME="My E-Commerce"
```

---

### 6. Mailtrap (Chỉ để test - không gửi mail thật)

1. Đăng ký tại [Mailtrap](https://mailtrap.io/)
2. Vào Inboxes → chọn inbox
3. Copy thông tin SMTP
4. Cấu hình:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=test@example.com
MAIL_FROM_NAME="My E-Commerce"
```

**Lưu ý:** Mailtrap chỉ để test, email sẽ không được gửi thật!

---

### 7. LOG Driver (Mặc định - chỉ lưu vào file log)

```env
MAIL_MAILER=log
```

Email sẽ được lưu vào: `storage/logs/laravel.log`

---

## Bước 3: Clear cache sau khi cấu hình

Sau khi cập nhật `.env`, chạy lệnh:

```bash
php artisan config:clear
php artisan cache:clear
```

Hoặc nếu dùng script:
```bash
artisan.bat config:clear
artisan.bat cache:clear
```

---

## Bước 4: Test cấu hình

### Cách 1: Dùng trang test
Mở browser: `http://localhost:8000/test-mail.html`

### Cách 2: Kiểm tra cấu hình
```bash
GET http://localhost:8000/api/test-mail/config
```

### Cách 3: Gửi mail test
```bash
POST http://localhost:8000/api/test-mail/send
{
  "email": "your-email@example.com"
}
```

---

## Troubleshooting

### Lỗi "Connection timeout"
- Kiểm tra firewall
- Kiểm tra SMTP host và port
- Thử port 465 với SSL thay vì TLS

### Lỗi "Authentication failed"
- Kiểm tra username/password
- Với Gmail: phải dùng App Password
- Kiểm tra 2FA đã bật chưa

### Mail không đến inbox
- Kiểm tra spam folder
- Kiểm tra mail driver trong response
- Xem log file: `storage/logs/laravel.log`

### Lỗi "535 Authentication failed" (Gmail)
- Đảm bảo đã bật 2-Step Verification
- Dùng App Password, không dùng mật khẩu thường
- Kiểm tra "Less secure app access" đã tắt (Gmail không còn hỗ trợ)

---

## Ví dụ file .env hoàn chỉnh

```env
APP_NAME="My E-Commerce"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=root
DB_PASSWORD=

# Mail Configuration (Gmail example)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

---

## Bảo mật

⚠️ **QUAN TRỌNG:**
- KHÔNG commit file `.env` lên Git
- File `.env` đã có trong `.gitignore`
- Dùng App Password thay vì mật khẩu thường
- Không chia sẻ file `.env` với ai

---

## Cần giúp đỡ?

1. Kiểm tra log: `storage/logs/laravel.log`
2. Test cấu hình: `http://localhost:8000/test-mail.html`
3. Xem chi tiết: `TEST_MAIL.md`

