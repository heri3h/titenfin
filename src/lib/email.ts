import nodemailer from 'nodemailer';

export interface SendOtpOptions {
  to: string;
  otpCode: string;
  storeName?: string;
}

/**
 * Mengirim email kode OTP pemulihan PIN ke email pengguna.
 * Mendukung Resend API, Brevo API, atau custom SMTP (Gmail / Hestia / Mailgun).
 */
export async function sendOtpEmail({ to, otpCode, storeName }: SendOtpOptions): Promise<{ success: boolean; error?: string }> {
  const brandName = 'TitenFin';
  const subject = `Kode Pemulihan PIN Keamanan ${brandName}: ${otpCode}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Kode Pemulihan PIN</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .logo { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 20px; }
        .logo span { color: #059669; }
        .otp-box { background: #ecfdf5; border: 2px dashed #059669; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #065f46; font-family: monospace; }
        .warning { font-size: 12px; color: #64748b; line-height: 1.6; }
        .footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">Titen<span>Fin</span></div>
        <h2 style="font-size: 18px; margin: 0 0 12px 0; color: #0f172a;">Pemulihan PIN Keamanan Toko</h2>
        <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0; line-height: 1.5;">
          Kami menerima permintaan untuk menyetel ulang PIN keamanan akun toko Anda <strong>${to}</strong>.
        </p>
        <p style="font-size: 13px; color: #475569; margin: 0;">Gunakan kode OTP berikut untuk membuat PIN baru:</p>
        <div class="otp-box">
          <div class="otp-code">${otpCode}</div>
          <div style="font-size: 11px; color: #059669; margin-top: 6px; font-weight: 600;">Berlaku selama 10 menit</div>
        </div>
        <p class="warning">
          <strong>Perhatian:</strong> Jangan berikan kode ini kepada siapa pun. Tim TitenFin tidak pernah meminta kode OTP Anda. Jika Anda tidak merasa meminta penyetelan ulang PIN, abaikan email ini.
        </p>
        <div class="footer">
          Dikirim otomatis oleh Sistem Keamanan Terenkripsi TitenFin
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Opsi Resend API (Jika RESEND_API_KEY disetel)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'TitenFin Keamanan <onboarding@resend.dev>',
          to: [to],
          subject,
          html: htmlContent,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true };
      }
      console.warn('Resend API error:', data);
    } catch (err: any) {
      console.error('Gagal kirim via Resend:', err);
    }
  }

  // 2. Opsi Brevo API (Jika BREVO_API_KEY disetel)
  if (process.env.BREVO_API_KEY) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: 'TitenFin Keamanan', email: process.env.EMAIL_FROM || 'noreply@titenfin.mbelik.com' },
          to: [{ email: to }],
          subject,
          htmlContent,
        }),
      });
      if (res.ok) {
        return { success: true };
      }
    } catch (err: any) {
      console.error('Gagal kirim via Brevo:', err);
    }
  }

  // 3. Opsi SMTP Standar (Nodemailer - Gmail App Password / Custom SMTP)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${brandName} Keamanan" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to,
        subject,
        html: htmlContent,
      });

      return { success: true };
    } catch (err: any) {
      console.error('Gagal kirim via SMTP:', err);
      return { success: false, error: err.message || 'SMTP delivery failed' };
    }
  }

  // 4. Fallback / Mode Pengujian: Cetak OTP ke server console log
  console.log('====================================================');
  console.log(`[SIMULASI OTP EMAIL] Kepada: ${to} | KODE OTP: ${otpCode}`);
  console.log('====================================================');

  return { success: true };
}
