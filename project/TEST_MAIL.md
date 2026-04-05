# Hướng dẫn kiểm tra gửi mail

## Cách 1: Kiểm tra cấu hình mail hiện tại

### Qua API:
```bash
GET http://localhost:8000/api/test-mail/config
```

Hoặc mở browser:
```
http://localhost:8000/api/test-mail/config
```

### Kết quả sẽ hiển thị:
- Mail driver đang sử dụng
- Mail host, port, username
- Mail from address
- Ghi chú về cách mail được xử lý

## Cách 2: Test gửi mail thực tế

### Qua API (POST):
```bash
POST http://localhost:8000/api/test-mail/send
Content-Type: application/json

{
  "email": "your-email@example.com"
}
```

### Hoặc dùng curl:
```bash
curl -X POST http://localhost:8000/api/test-mail/send \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

### Hoặc dùng JavaScript trong browser console:
```javascript
fetch('/api/test-mail/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'your-email@example.com'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Cách 3: Kiểm tra log file (nếu dùng LOG driver)

Nếu mail driver là `log`, email sẽ được lưu vào:
```
storage/logs/laravel.log
```

Mở file này và tìm phần email đã gửi.

## Cấu hình mail thực tế (SMTP)

Để gửi mail thực tế, cần cấu hình trong file `.env`:

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

### Gmail App Password:
1. Vào Google Account → Security
2. Bật 2-Step Verification
3. Tạo App Password cho "Mail"
4. Dùng App Password thay vì mật khẩu thường

### Các SMTP khác:
- **Outlook/Hotmail**: `smtp-mail.outlook.com`, port 587
- **Yahoo**: `smtp.mail.yahoo.com`, port 587
- **SendGrid**: `smtp.sendgrid.net`, port 587
- **Mailgun**: `smtp.mailgun.org`, port 587

## Kiểm tra mail đã gửi

### Nếu dùng LOG driver:
- Mở `storage/logs/laravel.log`
- Tìm phần email content

### Nếu dùng SMTP:
- Kiểm tra inbox của email đã nhập
- Kiểm tra spam folder nếu không thấy

## Troubleshooting

### Lỗi "Connection timeout":
- Kiểm tra firewall
- Kiểm tra SMTP host và port
- Thử dùng port 465 với SSL

### Lỗi "Authentication failed":
- Kiểm tra username/password
- Với Gmail: dùng App Password, không dùng mật khẩu thường
- Kiểm tra 2FA đã bật chưa

### Mail không đến:
- Kiểm tra spam folder
- Kiểm tra mail driver trong response
- Xem log file để debug

