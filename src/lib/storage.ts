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

// Data Awal Bersih
export const DEFAULT_CUSTOMERS: Customer[] = [];
export const DEFAULT_CREDITS: CreditItem[] = [];
export const DEFAULT_PAYMENTS: CreditPayment[] = [];
export const DEFAULT_DEPOSITS: DepositTransaction[] = [];

export const clearStorageData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
  localStorage.removeItem(STORAGE_KEYS.CREDIT_ITEMS);
  localStorage.removeItem(STORAGE_KEYS.CREDIT_PAYMENTS);
  localStorage.removeItem(STORAGE_KEYS.DEPOSIT_TXNS);
  localStorage.removeItem(STORAGE_KEYS.INITIAL_CAPITAL);
};

const DUMMY_IDS = new Set(['cust-1', 'cust-2', 'cust-3', 'cred-1', 'cred-2', 'pay-1', 'pay-2', 'pay-3', 'dep-1', 'dep-2', 'dep-3']);

export const getStorageData = () => {
  if (typeof window === 'undefined') {
    return {
      customers: [],
      creditItems: [],
      creditPayments: [],
      depositTxns: [],
      initialCapital: 10000000,
    };
  }

  const rawCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  const rawCredits = localStorage.getItem(STORAGE_KEYS.CREDIT_ITEMS);
  const rawPayments = localStorage.getItem(STORAGE_KEYS.CREDIT_PAYMENTS);
  const rawDeposits = localStorage.getItem(STORAGE_KEYS.DEPOSIT_TXNS);
  const rawCapital = localStorage.getItem(STORAGE_KEYS.INITIAL_CAPITAL);

  let customers: Customer[] = rawCustomers ? JSON.parse(rawCustomers) : [];
  let creditItems: CreditItem[] = rawCredits ? JSON.parse(rawCredits) : [];
  let creditPayments: CreditPayment[] = rawPayments ? JSON.parse(rawPayments) : [];
  let depositTxns: DepositTransaction[] = rawDeposits ? JSON.parse(rawDeposits) : [];

  const hasDummyData = customers.some(c => DUMMY_IDS.has(c.id)) || creditItems.some(ci => DUMMY_IDS.has(ci.id));
  if (hasDummyData) {
    customers = customers.filter(c => !DUMMY_IDS.has(c.id));
    creditItems = creditItems.filter(ci => !DUMMY_IDS.has(ci.id));
    creditPayments = creditPayments.filter(p => !DUMMY_IDS.has(p.id) && !DUMMY_IDS.has(p.creditItemId));
    depositTxns = depositTxns.filter(d => !DUMMY_IDS.has(d.id));
    saveStorageData(customers, creditItems, creditPayments, depositTxns, rawCapital ? Number(rawCapital) : 10000000);
  }

  return {
    customers,
    creditItems,
    creditPayments,
    depositTxns,
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
