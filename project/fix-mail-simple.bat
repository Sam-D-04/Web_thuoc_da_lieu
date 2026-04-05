@echo off
echo ========================================
echo Fix Mail Configuration
echo ========================================
echo.

if not exist .env (
    echo ERROR: File .env không tồn tại!
    pause
    exit /b 1
)

echo Đang sửa file .env...
echo.

REM Tạo file mới với nội dung đã sửa
powershell -Command "$lines = Get-Content .env; $newLines = @(); foreach($line in $lines) { if($line -match '^MAIL_MAILER=') { $newLines += 'MAIL_MAILER=smtp' } elseif($line -match '^MAIL_HOST=') { $newLines += 'MAIL_HOST=smtp.gmail.com' } elseif($line -match '^MAIL_PORT=') { $newLines += 'MAIL_PORT=587' } elseif($line -match '^MAIL_ENCRYPTION=') { $newLines += 'MAIL_ENCRYPTION=tls' } else { $newLines += $line } }; if(($newLines | Select-String 'MAIL_ENCRYPTION').Count -eq 0) { $portIndex = 0; for($i=0; $i -lt $newLines.Length; $i++) { if($newLines[$i] -match '^MAIL_PORT=') { $portIndex = $i; break } }; $newLines = $newLines[0..$portIndex] + 'MAIL_ENCRYPTION=tls' + $newLines[($portIndex+1)..($newLines.Length-1)] }; $newLines | Set-Content .env"

echo ✅ Đã sửa xong!
echo.
echo Cấu hình mới:
type .env | findstr MAIL
echo.
echo Đang clear cache...
C:\wamp64\bin\php\php8.3.14\php.exe artisan config:clear
echo.
echo ✅ Hoàn tất! Bây giờ bạn có thể test mail tại:
echo    http://localhost:8000/test-mail.html
echo.
pause

