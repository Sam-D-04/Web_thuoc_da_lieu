@echo off
echo ========================================
echo Fix Mail Configuration
echo ========================================
echo.

REM Kiểm tra file .env có tồn tại không
if not exist .env (
    echo ERROR: File .env không tồn tại!
    echo Vui lòng tạo file .env trước.
    pause
    exit /b 1
)

echo Đang cập nhật cấu hình mail trong file .env...
echo.

REM Backup file .env
copy .env .env.backup.mail 2>nul
echo Đã backup file .env thành .env.backup.mail
echo.

REM Đọc và cập nhật file .env
powershell -Command "$content = Get-Content .env -Raw; $content = $content -replace 'MAIL_MAILER=.*', 'MAIL_MAILER=smtp'; $content = $content -replace 'MAIL_HOST=.*', 'MAIL_HOST=smtp.gmail.com'; $content = $content -replace 'MAIL_PORT=.*', 'MAIL_PORT=587'; $content = $content -replace 'MAIL_ENCRYPTION=.*', 'MAIL_ENCRYPTION=tls'; Set-Content .env -Value $content"

echo ✅ Đã cập nhật:
echo    - MAIL_MAILER=smtp
echo    - MAIL_HOST=smtp.gmail.com
echo    - MAIL_PORT=587
echo    - MAIL_ENCRYPTION=tls
echo.
echo ⚠️  Vui lòng kiểm tra lại:
echo    - MAIL_USERNAME=tvinhthanhsg@gmail.com
echo    - MAIL_PASSWORD=wukcvxpnfuzzmzcy (App Password)
echo    - MAIL_FROM_ADDRESS=tvinhthanhsg@gmail.com
echo.
echo Bước tiếp theo:
echo 1. Kiểm tra file .env
echo 2. Chạy: php artisan config:clear
echo 3. Test mail tại: http://localhost:8000/test-mail.html
echo.
pause

