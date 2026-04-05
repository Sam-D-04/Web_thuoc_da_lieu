<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\VerificationCodeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class TestMailController extends Controller
{
    public function testMail(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->email;
        $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $name = 'Test User';

        try {
            // Kiểm tra mail driver hiện tại
            $mailDriver = config('mail.default');
            
            Mail::to($email)->send(new VerificationCodeMail($code, $name));

            return response()->json([
                'success' => true,
                'message' => 'Email đã được gửi thành công!',
                'mail_driver' => $mailDriver,
                'email' => $email,
                'code' => $code, // Trả về code để test (chỉ trong môi trường test)
                'note' => $mailDriver === 'log' 
                    ? 'Email được lưu vào log file tại: storage/logs/laravel.log' 
                    : 'Email đã được gửi qua ' . $mailDriver
            ]);
        } catch (\Exception $e) {
            Log::error('Mail sending failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Không thể gửi email: ' . $e->getMessage(),
                'mail_driver' => config('mail.default'),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function checkMailConfig()
    {
        return response()->json([
            'mail_driver' => config('mail.default'),
            'mail_host' => config('mail.mailers.smtp.host'),
            'mail_port' => config('mail.mailers.smtp.port'),
            'mail_username' => config('mail.mailers.smtp.username') ? 'Đã cấu hình' : 'Chưa cấu hình',
            'mail_from_address' => config('mail.from.address'),
            'mail_from_name' => config('mail.from.name'),
            'note' => config('mail.default') === 'log' 
                ? 'Hiện đang dùng LOG driver - Email sẽ được lưu vào storage/logs/laravel.log' 
                : 'Đang dùng ' . config('mail.default') . ' driver'
        ]);
    }
}

