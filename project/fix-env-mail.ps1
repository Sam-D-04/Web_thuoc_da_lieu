# Script PowerShell để sửa cấu hình mail trong .env
$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: File .env không tồn tại!" -ForegroundColor Red
    exit 1
}

Write-Host "Đang sửa file .env..." -ForegroundColor Yellow

# Đọc file
$content = Get-Content $envFile -Raw

# Backup
Copy-Item $envFile "$envFile.backup" -Force
Write-Host "Đã backup file .env thành .env.backup" -ForegroundColor Green

# Sửa các dòng
$content = $content -replace 'MAIL_MAILER=log', 'MAIL_MAILER=smtp'
$content = $content -replace 'MAIL_HOST=127\.0\.0\.1', 'MAIL_HOST=smtp.gmail.com'
$content = $content -replace 'MAIL_PORT=2525', 'MAIL_PORT=587'

# Thêm MAIL_ENCRYPTION nếu chưa có
if ($content -notmatch 'MAIL_ENCRYPTION=') {
    $content = $content -replace '(MAIL_PORT=587)', "`$1`r`nMAIL_ENCRYPTION=tls"
}

# Ghi lại file
Set-Content $envFile -Value $content -NoNewline

Write-Host "`n✅ Đã sửa xong!" -ForegroundColor Green
Write-Host "`nCấu hình mới:" -ForegroundColor Cyan
Get-Content $envFile | Select-String "MAIL_"

Write-Host "`nBước tiếp theo:" -ForegroundColor Yellow
Write-Host "1. Chạy: php artisan config:clear"
Write-Host "2. Test mail tại: http://localhost:8000/test-mail.html"

