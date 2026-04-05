<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã xác thực email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Mã xác thực email</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p>Xin chào <strong>{{ $name }}</strong>,</p>
        
        <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã xác thực sau để hoàn tất đăng ký:</p>
        
        <div style="background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px;">
                {{ $code }}
            </div>
        </div>
        
        <p style="color: #666; font-size: 14px;">
            <strong>Lưu ý:</strong> Mã xác thực này có hiệu lực trong vòng 15 phút. 
            Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
        </p>
        
        <p style="margin-top: 30px; color: #666;">
            Trân trọng,<br>
            <strong>Đội ngũ hỗ trợ</strong>
        </p>
    </div>
</body>
</html>

