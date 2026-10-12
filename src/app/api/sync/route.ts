import { NextRequest, NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { Customer, CreditItem, CreditPayment, DepositTransaction } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'heritri@titenfin.id';

    const pool = getDbPool();

    // 1. Ambil atau buat data user
    const [users]: any = await pool.query(
      'SELECT id, email, name, currency, initial_capital FROM users WHERE email = ?',
      [email]
    );

    let userId = email;
    let initialCapital = 10000000;
    let currency = 'IDR';

    if (users && users.length > 0) {
      userId = users[0].id;
      initialCapital = Number(users[0].initial_capital) || 10000000;
      currency = users[0].currency || 'IDR';
    } else {
      // Buat user awal jika belum ada
      userId = `usr-${Date.now()}`;
      await pool.query(
        'INSERT INTO users (id, email, name, currency, initial_capital) VALUES (?, ?, ?, ?, ?)',
        [userId, email, email.split('@')[0], 'IDR', 10000000]
      );
    }

    // 2. Ambil customers
    const [custRows]: any = await pool.query(
      'SELECT id, name, phone, address, notes, created_at FROM customers WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    const customers: Customer[] = (custRows || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      phone: r.phone || '',
      address: r.address || '',
      notes: r.notes || '',
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));

    // 3. Ambil credit items
    const [credRows]: any = await pool.query(
      'SELECT * FROM credit_items WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    const creditItems: CreditItem[] = (credRows || []).map((r: any) => ({
      id: r.id,
      customerId: r.customer_id,
      customerName: r.customer_name || '',
      itemName: r.item_name,
      capitalPrice: Number(r.capital_price) || 0,
      profitNominal: Number(r.profit_nominal) || 0,
      totalCreditPrice: Number(r.total_credit_price) || 0,
      downPayment: Number(r.down_payment) || 0,
      remainingAmount: Number(r.remaining_amount) || 0,
      period: r.period || 'monthly',
      tenorCount: Number(r.tenor_count) || 1,
      scheduledAmount: Number(r.scheduled_amount) || 0,
      startDate: r.start_date || '',
      dueDate: r.due_date || '',
      status: r.status || 'active',
      notes: r.notes || '',
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));

    // 4. Ambil credit payments
    let creditPayments: CreditPayment[] = [];
    if (creditItems.length > 0) {
      const creditIds = creditItems.map((c) => c.id);
      const [payRows]: any = await pool.query(
        'SELECT * FROM credit_payments WHERE credit_item_id IN (?) ORDER BY date DESC, created_at DESC',
        [creditIds]
      );
      creditPayments = (payRows || []).map((r: any) => ({
        id: r.id,
        creditItemId: r.credit_item_id,
        customerId: r.customer_id,
        date: r.date,
        amount: Number(r.amount) || 0,
        isEarlySettlement: Boolean(r.is_early_settlement),
        discountGranted: Number(r.discount_granted) || 0,
        notes: r.notes || '',
      }));
    }

    // 5. Ambil deposit transactions
    let depositTxns: DepositTransaction[] = [];
    if (customers.length > 0) {
      const custIds = customers.map((c) => c.id);
      const [depRows]: any = await pool.query(
        'SELECT * FROM deposit_transactions WHERE customer_id IN (?) ORDER BY date DESC, created_at DESC',
        [custIds]
      );
      depositTxns = (depRows || []).map((r: any) => ({
        id: r.id,
        customerId: r.customer_id,
        customerName: r.customer_name || '',
        date: r.date,
        type: r.type,
        amount: Number(r.amount) || 0,
        balanceAfter: Number(r.balance_after) || 0,
        notes: r.notes || '',
      }));
    }

    return NextResponse.json({
      success: true,
      userId,
      email,
      currency,
      initialCapital,
      customers,
      creditItems,
      creditPayments,
      depositTxns,
    });
  } catch (error: any) {
    console.error('Error fetching data from database:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email = 'heritri@titenfin.id',
      currency = 'IDR',
      initialCapital = 10000000,
      customers = [],
      creditItems = [],
      creditPayments = [],
      depositTxns = [],
    } = body;

    const pool = getDbPool();

    // 1. Cek atau buat user
    const [users]: any = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    let userId = '';
    if (users && users.length > 0) {
      userId = users[0].id;
      await pool.query(
        'UPDATE users SET currency = ?, initial_capital = ? WHERE id = ?',
        [currency, initialCapital, userId]
      );
    } else {
      userId = `usr-${Date.now()}`;
      await pool.query(
        'INSERT INTO users (id, email, name, currency, initial_capital) VALUES (?, ?, ?, ?, ?)',
        [userId, email, email.split('@')[0], currency, initialCapital]
      );
    }

    // 2. Upsert Customers
    for (const c of customers as Customer[]) {
      await pool.query(
        `INSERT INTO customers (id, user_id, name, phone, address, notes)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           phone = VALUES(phone),
           address = VALUES(address),
           notes = VALUES(notes)`,
        [c.id, userId, c.name, c.phone || '', c.address || '', c.notes || '']
      );
    }

    // 3. Upsert Credit Items
    for (const ci of creditItems as CreditItem[]) {
      await pool.query(
        `INSERT INTO credit_items (
           id, user_id, customer_id, customer_name, item_name, capital_price,
           profit_nominal, total_credit_price, down_payment, remaining_amount,
           period, tenor_count, scheduled_amount, start_date, due_date, status, notes
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           customer_name = VALUES(customer_name),
           item_name = VALUES(item_name),
           capital_price = VALUES(capital_price),
           profit_nominal = VALUES(profit_nominal),
           total_credit_price = VALUES(total_credit_price),
           down_payment = VALUES(down_payment),
           remaining_amount = VALUES(remaining_amount),
           period = VALUES(period),
           tenor_count = VALUES(tenor_count),
           scheduled_amount = VALUES(scheduled_amount),
           start_date = VALUES(start_date),
           due_date = VALUES(due_date),
           status = VALUES(status),
           notes = VALUES(notes)`,
        [
          ci.id,
          userId,
          ci.customerId,
          ci.customerName,
          ci.itemName,
          ci.capitalPrice,
          ci.profitNominal,
          ci.totalCreditPrice,
          ci.downPayment,
          ci.remainingAmount,
          ci.period,
          ci.tenorCount,
          ci.scheduledAmount,
          ci.startDate,
          ci.dueDate,
          ci.status,
          ci.notes || '',
        ]
      );
    }

    // 4. Upsert Credit Payments
    for (const p of creditPayments as CreditPayment[]) {
      await pool.query(
        `INSERT INTO credit_payments (
           id, credit_item_id, customer_id, date, amount, is_early_settlement, discount_granted, notes
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           amount = VALUES(amount),
           is_early_settlement = VALUES(is_early_settlement),
           discount_granted = VALUES(discount_granted),
           notes = VALUES(notes)`,
        [
          p.id,
          p.creditItemId,
          p.customerId,
          p.date,
          p.amount,
          p.isEarlySettlement ? 1 : 0,
          p.discountGranted || 0,
          p.notes || '',
        ]
      );
    }

    // 5. Upsert Deposit Transactions
    for (const dt of depositTxns as DepositTransaction[]) {
      await pool.query(
        `INSERT INTO deposit_transactions (
           id, customer_id, customer_name, date, type, amount, balance_after, notes
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           customer_name = VALUES(customer_name),
           type = VALUES(type),
           amount = VALUES(amount),
           balance_after = VALUES(balance_after),
           notes = VALUES(notes)`,
        [
          dt.id,
          dt.customerId,
          dt.customerName,
          dt.date,
          dt.type,
          dt.amount,
          dt.balanceAfter,
          dt.notes || '',
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Data successfully synchronized to MariaDB on VPS',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error syncing to database:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database sync error' },
      { status: 500 }
    );
  }
}
