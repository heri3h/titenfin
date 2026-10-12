import { Customer, CreditItem, CreditPayment, DepositTransaction, CashDashboardSummary } from '../types';

const STORAGE_KEYS = {
  CUSTOMERS: 'titenfin_customers',
  CREDIT_ITEMS: 'titenfin_credit_items',
  CREDIT_PAYMENTS: 'titenfin_credit_payments',
  DEPOSIT_TXNS: 'titenfin_deposit_txns',
  INITIAL_CAPITAL: 'titenfin_initial_capital',
  PRIVACY_MODE: 'titenfin_privacy_mode',
  USER_PROFILE: 'titenfin_user_profile',
};

// Data Awal Contoh untuk Demo
const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Pak Budi Santoso',
    phone: '081234567890',
    address: 'Dusun Krajan RT 02/01',
    notes: 'Pelanggan lama, kredit TV dan titip uang hasil panen',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cust-2',
    name: 'Ibu Siti Aminah',
    phone: '089876543210',
    address: 'Jl. Melati No. 15',
    notes: 'Kredit Mesin Cuci 2 Tabung',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cust-3',
    name: 'Mas Joko Prasetyo',
    phone: '085712341234',
    address: 'Komplek Griya Indah B3',
    notes: 'Titip uang persiapan biaya sekolah anak',
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_CREDITS: CreditItem[] = [
  {
    id: 'cred-1',
    customerId: 'cust-1',
    customerName: 'Pak Budi Santoso',
    itemName: 'Smart TV Polytron 43 Inch',
    capitalPrice: 3000000,
    profitNominal: 600000,
    totalCreditPrice: 3600000,
    downPayment: 600000,
    remainingAmount: 2400000,
    period: 'monthly',
    tenorCount: 6,
    scheduledAmount: 500000,
    startDate: new Date(Date.now() - 35 * 86400000).toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
    status: 'active',
    notes: 'DP Rp 600.000 sudah masuk di awal',
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: 'cred-2',
    customerId: 'cust-2',
    customerName: 'Ibu Siti Aminah',
    itemName: 'Mesin Cuci Sharp 8 Kg',
    capitalPrice: 2200000,
    profitNominal: 500000,
    totalCreditPrice: 2700000,
    downPayment: 300000,
    remainingAmount: 1600000,
    period: 'monthly',
    tenorCount: 6,
    scheduledAmount: 400000,
    startDate: new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    status: 'active',
    notes: 'Cicilan lancar',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  }
];

const DEFAULT_PAYMENTS: CreditPayment[] = [
  {
    id: 'pay-1',
    creditItemId: 'cred-1',
    customerId: 'cust-1',
    date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    amount: 600000, // Bayar cicilan pertama
    isEarlySettlement: false,
    discountGranted: 0,
    notes: 'Cicilan bulan ke-1',
  },
  {
    id: 'pay-2',
    creditItemId: 'cred-2',
    customerId: 'cust-2',
    date: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
    amount: 400000,
    isEarlySettlement: false,
    discountGranted: 0,
    notes: 'Cicilan bulan ke-1 tepat waktu',
  },
  {
    id: 'pay-3',
    creditItemId: 'cred-2',
    customerId: 'cust-2',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    amount: 400000, // cicilan kedua
    isEarlySettlement: false,
    discountGranted: 0,
    notes: 'Cicilan bulan ke-2',
  }
];

const DEFAULT_DEPOSITS: DepositTransaction[] = [
  {
    id: 'dep-1',
    customerId: 'cust-1',
    customerName: 'Pak Budi Santoso',
    date: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0],
    type: 'deposit',
    amount: 2500000,
    balanceAfter: 2500000,
    notes: 'Titip hasil panen jagung tahap 1',
  },
  {
    id: 'dep-2',
    customerId: 'cust-1',
    customerName: 'Pak Budi Santoso',
    date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    type: 'withdraw',
    amount: 500000,
    balanceAfter: 2000000,
    notes: 'Diambil untuk beli pupuk',
  },
  {
    id: 'dep-3',
    customerId: 'cust-3',
    customerName: 'Mas Joko Prasetyo',
    date: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0],
    type: 'deposit',
    amount: 1500000,
    balanceAfter: 1500000,
    notes: 'Titip uang pendaftaran sekolah',
  }
];

export const getStorageData = () => {
  if (typeof window === 'undefined') {
    return {
      customers: DEFAULT_CUSTOMERS,
      creditItems: DEFAULT_CREDITS,
      creditPayments: DEFAULT_PAYMENTS,
      depositTxns: DEFAULT_DEPOSITS,
      initialCapital: 10000000,
    };
  }

  const rawCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  const rawCredits = localStorage.getItem(STORAGE_KEYS.CREDIT_ITEMS);
  const rawPayments = localStorage.getItem(STORAGE_KEYS.CREDIT_PAYMENTS);
  const rawDeposits = localStorage.getItem(STORAGE_KEYS.DEPOSIT_TXNS);
  const rawCapital = localStorage.getItem(STORAGE_KEYS.INITIAL_CAPITAL);

  return {
    customers: rawCustomers ? JSON.parse(rawCustomers) : DEFAULT_CUSTOMERS,
    creditItems: rawCredits ? JSON.parse(rawCredits) : DEFAULT_CREDITS,
    creditPayments: rawPayments ? JSON.parse(rawPayments) : DEFAULT_PAYMENTS,
    depositTxns: rawDeposits ? JSON.parse(rawDeposits) : DEFAULT_DEPOSITS,
    initialCapital: rawCapital ? Number(rawCapital) : 10000000,
  };
};

export const saveStorageData = (
  customers: Customer[],
  creditItems: CreditItem[],
  creditPayments: CreditPayment[],
  depositTxns: DepositTransaction[],
  initialCapital?: number
) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  localStorage.setItem(STORAGE_KEYS.CREDIT_ITEMS, JSON.stringify(creditItems));
  localStorage.setItem(STORAGE_KEYS.CREDIT_PAYMENTS, JSON.stringify(creditPayments));
  localStorage.setItem(STORAGE_KEYS.DEPOSIT_TXNS, JSON.stringify(depositTxns));
  if (initialCapital !== undefined) {
    localStorage.setItem(STORAGE_KEYS.INITIAL_CAPITAL, String(initialCapital));
  }
};

// Hitung Saldo Titipan per Nasabah
export const getCustomerDepositBalance = (customerId: string, txns: DepositTransaction[]): number => {
  const custTxns = txns.filter(t => t.customerId === customerId);
  return custTxns.reduce((acc, t) => {
    if (t.type === 'deposit') return acc + t.amount;
    if (t.type === 'withdraw' || t.type === 'credit_payment') return acc - t.amount;
    return acc;
  }, 0);
};

// Hitung 3 Kotak Kas
export const calculateCashSummary = (
  initialCapital: number,
  credits: CreditItem[],
  payments: CreditPayment[],
  deposits: DepositTransaction[]
): CashDashboardSummary => {
  // 1. Total Dana Titipan (Amanah) yang dipegang saat ini
  let totalDepositsHeld = 0;
  for (const t of deposits) {
    if (t.type === 'deposit') totalDepositsHeld += t.amount;
    else if (t.type === 'withdraw' || t.type === 'credit_payment') totalDepositsHeld -= t.amount;
  }
  if (totalDepositsHeld < 0) totalDepositsHeld = 0;

  // 2. Total Piutang Aktif (Uang Anda di Luar)
  const totalReceivables = credits
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.remainingAmount, 0);

  // 3. Kas Sendiri = Modal Awal - Modal Barang yang dibeli + DP diterima + Pembayaran Angsuran diterima
  const totalCapitalInvested = credits.reduce((sum, c) => sum + c.capitalPrice, 0);
  const totalDpReceived = credits.reduce((sum, c) => sum + c.downPayment, 0);
  const totalInstallmentsReceived = payments.reduce((sum, p) => sum + p.amount, 0);

  const ownCash = initialCapital - totalCapitalInvested + totalDpReceived + totalInstallmentsReceived;

  return {
    ownCash,
    totalReceivables,
    totalDeposits: totalDepositsHeld,
  };
};

import { formatCurrency, CurrencyCode } from './currency';

// Format Keuangan (Multimata Uang Otomatis & Kustom)
export const formatRupiah = (val: number, isHidden: boolean = false, currencyCode?: CurrencyCode): string => {
  return formatCurrency(val, currencyCode, isHidden);
};

export { formatCurrency };
