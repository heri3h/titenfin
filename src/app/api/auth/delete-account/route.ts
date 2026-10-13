import { NextRequest, NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email pengguna harus disertakan.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const pool = getDbPool();

    // 1. Cek keberadaan akun
    const [users]: any = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Akun tidak ditemukan di database.' },
        { status: 404 }
      );
    }

    const userId = users[0].id;

    // 2. Ambil semua customer ID milik user ini
    const [custRows]: any = await pool.query(
      'SELECT id FROM customers WHERE user_id = ?',
      [userId]
    );

    const custIds = (custRows || []).map((c: any) => c.id);

    // 3. Hapus data secara berurutan
    if (custIds.length > 0) {
      await pool.query(
        'DELETE FROM deposit_transactions WHERE customer_id IN (?)',
        [custIds]
      );
      await pool.query(
        'DELETE FROM credit_payments WHERE customer_id IN (?)',
        [custIds]
      );
    }

    await pool.query('DELETE FROM credit_items WHERE user_id = ?', [userId]);
    await pool.query('DELETE FROM customers WHERE user_id = ?', [userId]);
    await pool.query('DELETE FROM password_reset_otps WHERE email = ?', [cleanEmail]);
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    return NextResponse.json({
      success: true,
      message: 'Akun dan semua data terkait berhasil dihapus permanen dari server.',
    });
  } catch (error: any) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menghapus akun.' },
      { status: 500 }
    );
  }
}
