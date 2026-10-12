import { NextRequest, NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { hashPin, createSessionToken } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, otp, newPin } = body;

    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, error: 'Email wajib diisi' },
        { status: 400 }
      );
    }

    const pool = getDbPool();

    // ==========================================
    // 1. ACTION: REQUEST OTP
    // ==========================================
    if (action === 'request_otp') {
      // Cek apakah email terdaftar
      const [users]: any = await pool.query(
        'SELECT id, name FROM users WHERE email = ?',
        [cleanEmail]
      );

      if (!users || users.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Akun dengan email ini belum terdaftar.' },
          { status: 404 }
        );
      }

      // Generate 6-digit random OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Hapus OTP lama untuk email ini dan simpan yang baru (berlaku 10 menit)
      await pool.query('DELETE FROM password_reset_otps WHERE email = ?', [cleanEmail]);
      await pool.query(
        'INSERT INTO password_reset_otps (email, otp_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))',
        [cleanEmail, otpCode]
      );

      // Kirim email
      await sendOtpEmail({
        to: cleanEmail,
        otpCode,
        storeName: users[0].name,
      });

      return NextResponse.json({
        success: true,
        message: 'Kode OTP 6-digit telah dikirimkan ke email Anda. Silakan periksa inbox / spam.',
      });
    }

    // ==========================================
    // 2. ACTION: VERIFY OTP AND RESET PIN
    // ==========================================
    if (action === 'verify_and_reset') {
      const cleanOtp = (otp || '').trim();
      const cleanNewPin = (newPin || '').trim();

      if (!cleanOtp) {
        return NextResponse.json(
          { success: false, error: 'Kode OTP 6-digit wajib diisi' },
          { status: 400 }
        );
      }

      if (!cleanNewPin || cleanNewPin.length < 6) {
        return NextResponse.json(
          { success: false, error: 'PIN Baru harus minimal 6 angka/karakter' },
          { status: 400 }
        );
      }

      // Verifikasi OTP di database
      const [otpRows]: any = await pool.query(
        'SELECT * FROM password_reset_otps WHERE email = ? AND otp_code = ? AND expires_at > NOW()',
        [cleanEmail, cleanOtp]
      );

      if (!otpRows || otpRows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Kode OTP salah atau sudah kedaluwarsa (10 menit). Silakan minta kode baru.' },
          { status: 400 }
        );
      }

      // OTP Valid: Hash PIN baru dan perbarui di tabel users
      const hashedNewPin = hashPin(cleanNewPin);
      await pool.query(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [hashedNewPin, cleanEmail]
      );

      // Hapus OTP yang sudah digunakan
      await pool.query('DELETE FROM password_reset_otps WHERE email = ?', [cleanEmail]);

      // Ambil data user terbaru untuk langsung login
      const [users]: any = await pool.query(
        'SELECT id, email, name, currency, initial_capital, avatar_url FROM users WHERE email = ?',
        [cleanEmail]
      );

      const user = users[0];
      const token = createSessionToken(user.id, user.email);

      return NextResponse.json({
        success: true,
        message: 'PIN Keamanan berhasil diperbarui! Anda otomatis masuk ke toko.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name || user.email.split('@')[0],
          avatar: user.avatar_url || '',
          currency: user.currency || 'IDR',
          initialCapital: Number(user.initial_capital) || 0,
          authProvider: 'email',
        },
        token,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Aksi reset PIN tidak dikenal' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Reset PIN error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan server saat reset PIN' },
      { status: 500 }
    );
  }
}
