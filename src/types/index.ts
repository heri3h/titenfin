export type InstallmentPeriod = 'daily' | 'weekly' | 'monthly' | 'custom';
export type CreditStatus = 'active' | 'completed' | 'overdue';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface CreditItem {
  id: string;
  customerId: string;
  customerName: string;
  itemName: string;
  capitalPrice: number;        // Harga Modal / Beli
  profitNominal: number;       // Nominal Keuntungan / Bunga yang disepakati
  totalCreditPrice: number;    // capitalPrice + profitNominal
  downPayment: number;         // DP (Uang Muka)
  remainingAmount: number;     // Sisa tagihan belum dibayar
  period: InstallmentPeriod;   // Tenor: harian, mingguan, bulanan, custom
  tenorCount: number;          // Jumlah termin cicilan
  scheduledAmount: number;     // Nominal angsuran per termin
  startDate: string;
  dueDate: string;
  status: CreditStatus;
  collateralNotes?: string;    // Catatan jaminan/agunan jika ada
  notes?: string;
  createdAt: string;
}

export interface CreditPayment {
  id: string;
  creditItemId: string;
  customerId: string;
  date: string;
  amount: number;              // Jumlah yang dibayar (bisa parsial/bebas)
  isEarlySettlement: boolean;  // Apakah pelunasan dipercepat?
  discountGranted: number;     // Diskon/potongan profit jika pelunasan awal
  notes?: string;
}

export type DepositType = 'deposit' | 'withdraw' | 'credit_payment';

export interface DepositTransaction {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  type: DepositType;
  amount: number;
  balanceAfter: number;
  notes?: string;
}

export interface CashDashboardSummary {
  ownCash: number;            // Kotak 1: Kas Sendiri (Modal & Keuntungan yang terealisasi)
  totalReceivables: number;   // Kotak 2: Total Piutang (Uang di luar yang belum lunas)
  totalDeposits: number;      // Kotak 3: Dana Titipan (Uang orang lain / AMANAH yang dipegang)
}
