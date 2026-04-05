@echo off
REM Script để tạo file .env với cấu hình mail mẫu
echo ========================================
echo Setup Mail Configuration
echo ========================================
echo.

REM Kiểm tra file .env đã tồn tại chưa
if exist .env (
    echo File .env đã tồn tại!
    echo.
    choice /C YN /M "Bạn có muốn backup file .env cũ và tạo mới không? (Y/N)"
    if errorlevel 2 goto :end
    if errorlevel 1 (
        copy .env .env.backup
        echo Đã backup file .env thành .env.backup
    )
)

echo.
echo Chọn loại mail bạn muốn cấu hình:
echo.
echo 1. Gmail (Khuyến nghị cho test)
echo 2. Outlook/Hotmail
echo 3. Yahoo Mail
echo 4. SendGrid
echo 5. Mailgun
echo 6. Mailtrap (Chỉ test)
echo 7. LOG (Lưu vào file log)
echo.
set /p choice="Nhập lựa chọn (1-7): "

if "%choice%"=="1" goto :gmail
if "%choice%"=="2" goto :outlook
if "%choice%"=="3" goto :yahoo
if "%choice%"=="4" goto :sendgrid
if "%choice%"=="5" goto :mailgun
if "%choice%"=="6" goto :mailtrap
if "%choice%"=="7" goto :log
goto :invalid

:gmail
echo.
echo === Cấu hình Gmail ===
set /p email="Nhập email Gmail của bạn: "
set /p password="Nhập App Password (16 ký tự): "
echo.
echo Đang tạo file .env với cấu hình Gmail...
goto :write_gmail

:outlook
echo.
echo === Cấu hình Outlook ===
set /p email="Nhập email Outlook: "
set /p password="Nhập mật khẩu: "
echo.
echo Đang tạo file .env với cấu hình Outlook...
goto :write_outlook

:yahoo
echo.
echo === Cấu hình Yahoo ===
set /p email="Nhập email Yahoo: "
set /p password="Nhập App Password: "
echo.
echo Đang tạo file .env với cấu hình Yahoo...
goto :write_yahoo

:sendgrid
echo.
echo === Cấu hình SendGrid ===
set /p email="Nhập email đã verify: "
set /p password="Nhập SendGrid API Key: "
echo.
echo Đang tạo file .env với cấu hình SendGrid...
goto :write_sendgrid

:mailgun
echo.
echo === Cấu hình Mailgun ===
set /p email="Nhập email: "
set /p password="Nhập Mailgun password: "
echo.
echo Đang tạo file .env với cấu hình Mailgun...
goto :write_mailgun

:mailtrap
echo.
echo === Cấu hình Mailtrap (Test only) ===
set /p email="Nhập email test: "
set /p password="Nhập Mailtrap password: "
echo.
echo Đang tạo file .env với cấu hình Mailtrap...
goto :write_mailtrap

:log
echo.
echo === Cấu hình LOG Driver ===
echo Đang tạo file .env với LOG driver...
goto :write_log

:invalid
echo Lựa chọn không hợp lệ!
goto :end

:write_gmail
(
echo MAIL_MAILER=smtp
echo MAIL_HOST=smtp.gmail.com
echo MAIL_PORT=587
echo MAIL_USERNAME=%email%
echo MAIL_PASSWORD=%password%
echo MAIL_ENCRYPTION=tls
echo MAIL_FROM_ADDRESS=%email%
echo MAIL_FROM_NAME="${APP_NAME}"
) >> .env
goto :success

:write_outlook
(
echo MAIL_MAILER=smtp
echo MAIL_HOST=smtp-mail.outlook.com
echo MAIL_PORT=587
echo MAIL_USERNAME=%email%
echo MAIL_PASSWORD=%password%
echo MAIL_ENCRYPTION=tls
echo MAIL_FROM_ADDRESS=%email%
echo MAIL_FROM_NAME="${APP_NAME}"
) >> .env
goto :success

:write_yahoo
(
echo MAIL_MAILER=smtp
echo MAIL_HOST=smtp.mail.yahoo.com
echo MAIL_PORT=587
echo MAIL_USERNAME=%email%
echo MAIL_PASSWORD=%password%
echo MAIL_ENCRYPTION=tls
echo MAIL_FROM_ADDRESS=%email%
echo MAIL_FROM_NAME="${APP_NAME}"
) >> .env
goto :success

:write_sendgrid
(
echo MAIL_MAILER=smtp
echo MAIL_HOST=smtp.sendgrid.net
echo MAIL_PORT=587
echo MAIL_USERNAME=apikey
echo MAIL_PASSWORD=%password%
echo MAIL_ENCRYPTION=tls
echo MAIL_FROM_ADDRESS=%email%
echo MAIL_FROM_NAME="${APP_NAME}"
) >> .env
goto :success

:write_mailgun
(
echo MAIL_MAILER=smtp
echo MAIL_HOST=smtp.mailgun.org
echo MAIL_PORT=587
echo MAIL_USERNAME=%email%
echo MAIL_PASSWORD=%password%
echo MAIL_ENCRYPTION=tls
echo MAIL_FROM_ADDRESS=%email%
echo MAIL_FROM_NAME="${APP_NAME}"
) >> .env
goto :success

:write_mailtrap
(
echo MAIL_MAILER=smtp
echo MAIL_HOST=smtp.mailtrap.io
echo MAIL_PORT=2525
echo MAIL_USERNAME=%email%
echo MAIL_PASSWORD=%password%
echo MAIL_ENCRYPTION=tls
echo MAIL_FROM_ADDRESS=test@example.com
echo MAIL_FROM_NAME="${APP_NAME}"
) >> .env
goto :success

:write_log
(
echo MAIL_MAILER=log
) >> .env
goto :success

:success
echo.
echo ========================================
echo ✅ Đã tạo cấu hình mail thành công!
echo ========================================
echo.
echo Bước tiếp theo:
echo 1. Kiểm tra file .env đã được tạo
echo 2. Chạy: php artisan config:clear
echo 3. Test mail tại: http://localhost:8000/test-mail.html
echo.
pause
goto :end

:end

