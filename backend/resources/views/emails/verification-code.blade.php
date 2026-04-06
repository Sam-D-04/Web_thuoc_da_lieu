<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mã xác thực Dermacity</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#0891b2);padding:32px;text-align:center;">
              <span style="font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                Dược<span style="opacity:0.85;">Mỹ</span>Phẩm
              </span>
              <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">Chăm sóc da liễu chuyên sâu</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <p style="margin:0 0 8px;font-size:16px;color:#1e293b;font-weight:600;">Xin chào {{ $name }},</p>
              <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.6;">
                Cảm ơn bạn đã đăng ký tài khoản tại <strong>Dermacity</strong>.
                Vui lòng sử dụng mã xác thực dưới đây để hoàn tất đăng ký:
              </p>

              <!-- OTP Box -->
              <div style="text-align:center;margin:0 0 28px;">
                <div style="display:inline-block;background:#f0f9ff;border:2px dashed #2563eb;border-radius:12px;padding:20px 48px;">
                  <span style="font-size:42px;font-weight:800;letter-spacing:12px;color:#2563eb;font-family:'Courier New',monospace;">
                    {{ $code }}
                  </span>
                </div>
              </div>

              <p style="margin:0 0 6px;font-size:13px;color:#94a3b8;text-align:center;">
                Mã có hiệu lực trong <strong style="color:#ef4444;">10 phút</strong>.
              </p>
              <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
                Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                &copy; {{ date('Y') }} Dermacity &mdash; Dược Mỹ Phẩm Da Liễu
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
