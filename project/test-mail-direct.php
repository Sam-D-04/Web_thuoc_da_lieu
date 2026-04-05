<?php
/**
 * Script test gửi mail trực tiếp
 * Chạy: php test-mail-direct.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationCodeMail;

echo "========================================\n";
echo "Test Gửi Mail Trực Tiếp\n";
echo "========================================\n\n";

// Kiểm tra cấu hình
echo "1. Kiểm tra cấu hình mail:\n";
echo "   MAIL_MAILER: " . config('mail.default') . "\n";
echo "   MAIL_HOST: " . config('mail.mailers.smtp.host') . "\n";
echo "   MAIL_PORT: " . config('mail.mailers.smtp.port') . "\n";
echo "   MAIL_USERNAME: " . config('mail.mailers.smtp.username') . "\n";
echo "   MAIL_ENCRYPTION: " . config('mail.mailers.smtp.encryption') . "\n";
echo "   MAIL_FROM: " . config('mail.from.address') . "\n\n";

// Nhập email test
echo "2. Nhập email để test:\n";
$email = readline("   Email: ");

if (empty($email)) {
    echo "   ❌ Email không được để trống!\n";
    exit(1);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "   ❌ Email không hợp lệ!\n";
    exit(1);
}

$code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
$name = "Test User";

echo "\n3. Đang gửi mail...\n";
echo "   To: $email\n";
echo "   Code: $code\n\n";

try {
    Mail::to($email)->send(new VerificationCodeMail($code, $name));
    
    echo "✅ Mail đã được gửi thành công!\n\n";
    
    if (config('mail.default') === 'log') {
        echo "⚠️  Lưu ý: Mail driver là 'log', email được lưu vào:\n";
        echo "   storage/logs/laravel.log\n";
    } else {
        echo "📧 Vui lòng kiểm tra inbox của: $email\n";
        echo "   (Kiểm tra cả spam folder)\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Lỗi khi gửi mail:\n";
    echo "   " . $e->getMessage() . "\n";
    echo "\nChi tiết lỗi:\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}

echo "\n========================================\n";

