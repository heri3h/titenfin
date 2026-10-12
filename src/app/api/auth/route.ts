import { NextRequest, NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { hashPin, createSessionToken, verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, pin, name, currency = 'IDR', initialCapital = 0, googleToken, googleUser } = body;

    const pool = getDbPool();

    // ==========================================
    // 1. ACTION: GOOGLE 1-CLICK SIGN IN / SIGN UP
    // ==========================================
    if (action === 'google') {
      let userEmail = '';
      let userName = '';
      let userAvatar = '';

      if (googleUser && googleUser.email) {
        userEmail = googleUser.email.toLowerCase().trim();
        userName = googleUser.name || userEmail.split('@')[0];
        userAvatar = googleUser.picture || '';
      } else if (googleToken) {
        // Dekode JWT payload dari Google Identity Services
        try {
          const parts = googleToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            userEmail = (payload.email || '').toLowerCase().trim();
            userName = payload.name || payload.given_name || userEmail.split('@')[0];
            userAvatar = payload.picture || '';
          }
        } catch (e) {
          console.warn('Gagal decode google token payload', e);
        }
      }

      if (!userEmail) {
        return NextResponse.json(
          { success: false, error: 'Data akun Google tidak valid' },
          { status: 400 }
        );
      }

      // Cek apakah user sudah ada di database
      const [existingUsers]: any = await pool.query(
        'SELECT id, email, name, currency, initial_capital, avatar_url FROM users WHERE email = ?',
        [userEmail]
      );

      let userId = '';
      let userCurr = currency;
      let userCap = initialCapital;

      if (existingUsers && existingUsers.length > 0) {
        userId = existingUsers[0].id;
        userCurr = existingUsers[0].currency || 'IDR';
        userCap = Number(existingUsers[0].initial_capital) || 0;

        // Update info profil terbaru jika ada
        await pool.query(
          'UPDATE users SET name = COALESCE(?, name), avatar_url = COALESCE(?, avatar_url), auth_provider = "google" WHERE id = ?',
          [userName, userAvatar, userId]
        );
      } else {
        // Buat user baru otomatis
        userId = `usr-${Date.now()}`;
        await pool.query(
          'INSERT INTO users (id, email, name, avatar_url, auth_provider, currency, initial_capital) VALUES (?, ?, ?, ?, "google", ?, ?)',
          [userId, userEmail, userName, userAvatar, userCurr, userCap]
        );
      }

      const token = createSessionToken(userId, userEmail);

      return NextResponse.json({
        success: true,
        message: 'Berhasil masuk dengan Google',
        user: {
          id: userId,
          email: userEmail,
          name: userName,
          avatar: userAvatar,
          currency: userCurr,
          initialCapital: userCap,
          authProvider: 'google',
        },
        token,
      });
    }

    // ==========================================
    // 2. ACTION: EMAIL + PIN LOGIN
    // ==========================================
    if (action === 'login') {
      const cleanEmail = (email || '').toLowerCase().trim();
      const cleanPin = (pin || '').trim();

      if (!cleanEmail || !cleanPin) {
        return NextResponse.json(
          { success: false, error: 'Email dan PIN wajib diisi' },
          { status: 400 }
        );
      }

      const [users]: any = await pool.query(
        'SELECT id, email, name, password_hash, currency, initial_capital, avatar_url FROM users WHERE email = ?',
        [cleanEmail]
      );

      if (!users || users.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Akun dengan email ini belum terdaftar. Silakan pilih "Daftar Akun Baru".' },
          { status: 404 }
        );
      }

      const user = users[0];
      const hashedInput = hashPin(cleanPin);

      // Jika user belum punya PIN (misal akun lama dari sync)
      if (!user.password_hash) {
        // Set PIN baru sekarang
        await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedInput, user.id]);
      } else if (user.password_hash !== hashedInput) {
        return NextResponse.json(
          { success: false, error: 'PIN Keamanan salah! Periksa kembali 6 digit PIN Anda.' },
          { status: 401 }
        );
      }

      const token = createSessionToken(user.id, user.email);

      return NextResponse.json({
        success: true,
        message: 'Berhasil masuk ke toko',
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

    // ==========================================
    // 3. ACTION: EMAIL + PIN REGISTER
    // ==========================================
    if (action === 'register') {
      const cleanEmail = (email || '').toLowerCase().trim();
      const cleanPin = (pin || '').trim();
      const cleanName = (name || '').trim() || cleanEmail.split('@')[0];

      if (!cleanEmail || !cleanPin) {
        return NextResponse.json(
          { success: false, error: 'Email dan PIN wajib diisi' },
          { status: 400 }
        );
      }

      if (cleanPin.length < 6) {
        return NextResponse.json(
          { success: false, error: 'PIN harus minimal 6 angka/karakter' },
          { status: 400 }
        );
      }

      // Cek apakah email sudah terdaftar
      const [existingUsers]: any = await pool.query(
        'SELECT id, password_hash FROM users WHERE email = ?',
        [cleanEmail]
      );

      const hashedPin = hashPin(cleanPin);

      let userId = '';
      if (existingUsers && existingUsers.length > 0) {
        // Jika akun sudah ada dan sudah ada password_hash
        if (existingUsers[0].password_hash) {
          return NextResponse.json(
            { success: false, error: 'Email ini sudah terdaftar. Silakan pilih menu "Masuk / Sign In".' },
            { status: 409 }
          );
        }
        // Jika akun dibuat via sync tapi belum punya password
        userId = existingUsers[0].id;
        await pool.query(
          'UPDATE users SET name = ?, password_hash = ?, currency = ?, initial_capital = ? WHERE id = ?',
          [cleanName, hashedPin, currency, initialCapital, userId]
        );
      } else {
        userId = `usr-${Date.now()}`;
        await pool.query(
          'INSERT INTO users (id, email, name, password_hash, auth_provider, currency, initial_capital) VALUES (?, ?, ?, ?, "email", ?, ?)',
          [userId, cleanEmail, cleanName, hashedPin, currency, initialCapital]
        );
      }

      const token = createSessionToken(userId, cleanEmail);

      return NextResponse.json({
        success: true,
        message: 'Akun toko berhasil dibuat',
        user: {
          id: userId,
          email: cleanEmail,
          name: cleanName,
          currency,
          initialCapital,
          authProvider: 'email',
        },
        token,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Action auth tidak dikenal' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan pada server autentikasi' },
      { status: 500 }
    );
  }
}
