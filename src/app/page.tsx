'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Landmark,
  Users,
  PieChart,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  Phone,
  MessageCircle,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  History,
  FileSpreadsheet
} from 'lucide-react';
import { Customer, CreditItem, CreditPayment, DepositTransaction, DepositType, CreditStatus } from '../types';
import {
  getStorageData,
  saveStorageData,
  getCustomerDepositBalance,
  calculateCashSummary,
  formatRupiah
} from '../lib/storage';
import { Header } from '../components/Header';
import { DashboardBoxes } from '../components/DashboardBoxes';
import { PaymentModal } from '../components/PaymentModal';
import { EarlySettlementModal } from '../components/EarlySettlementModal';
import { NewCreditModal } from '../components/NewCreditModal';
import { DepositModal } from '../components/DepositModal';
import { SyncEmailModal } from '../components/SyncEmailModal';
import { CustomerModal } from '../components/CustomerModal';
import { BottomNav } from '../components/BottomNav';
import { CreditDetailModal } from '../components/CreditDetailModal';
import { CustomerDetailModal } from '../components/CustomerDetailModal';
import { DepositDetailModal } from '../components/DepositDetailModal';
import { detectUserLanguage, saveUserLanguage, translations, Language } from '../lib/i18n';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [credits, setCredits] = useState<CreditItem[]>([]);
  const [payments, setPayments] = useState<CreditPayment[]>([]);
  const [deposits, setDeposits] = useState<DepositTransaction[]>([]);
  const [initialCapital, setInitialCapital] = useState<number>(10000000);
  const [userEmail, setUserEmail] = useState<string>('heritri@titenfin.id');

  // Multilingual State (Auto-Detect Regional pada pertama kali buka, default internasional: en)
  const [language, setLanguage] = useState<Language>('en');

  // UI States
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'credits' | 'deposits' | 'customers' | 'capital'>('credits');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [creditFilter, setCreditFilter] = useState<'all' | 'active' | 'completed'>('active');

  // Modal States
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isNewCreditModalOpen, setIsNewCreditModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  
  const [selectedCreditForPayment, setSelectedCreditForPayment] = useState<CreditItem | null>(null);
  const [selectedCreditForEarlySettlement, setSelectedCreditForEarlySettlement] = useState<CreditItem | null>(null);

  // Detail & Action Modal States (Saat nama/judul diklik)
  const [selectedCreditForDetail, setSelectedCreditForDetail] = useState<CreditItem | null>(null);
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<Customer | null>(null);
  const [selectedDepositCustomerForDetail, setSelectedDepositCustomerForDetail] = useState<Customer | null>(null);

  // Load initial data & auto-detect language
  useEffect(() => {
    setIsClient(true);
    setLanguage(detectUserLanguage());
    const data = getStorageData();
    setCustomers(data.customers);
    setCredits(data.creditItems);
    setPayments(data.creditPayments);
    setDeposits(data.depositTxns);
    setInitialCapital(data.initialCapital);
    const savedEmail = localStorage.getItem('titenfin_user_email');
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  const handleChangeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    saveUserLanguage(newLang);
  };

  // Save changes to storage
  const syncAndSave = (
    newCust = customers,
    newCred = credits,
    newPay = payments,
    newDep = deposits,
    newCap = initialCapital
  ) => {
    setCustomers(newCust);
    setCredits(newCred);
    setPayments(newPay);
    setDeposits(newDep);
    setInitialCapital(newCap);
    saveStorageData(newCust, newCred, newPay, newDep, newCap);
  };

  // Helper untuk kirim pesan WhatsApp
  const openWhatsApp = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/^0/, '62').replace(/\D/g, '');
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  // HANDLER: Simpan Pembayaran Cicilan (Parsial / Fleksibel)
  const handleRecordPayment = (amount: number, date: string, notes: string, sendWa: boolean) => {
    if (!selectedCreditForPayment) return;
    const cred = selectedCreditForPayment;
    const cust = customers.find(c => c.id === cred.customerId);

    const newPayment: CreditPayment = {
      id: `pay-${Date.now()}`,
      creditItemId: cred.id,
      customerId: cred.customerId,
      date,
      amount,
      isEarlySettlement: false,
      discountGranted: 0,
      notes,
    };

    const newRemaining = Math.max(0, cred.remainingAmount - amount);
    const updatedStatus: CreditStatus = newRemaining === 0 ? 'completed' : 'active';

    const updatedCredits = credits.map(c => 
      c.id === cred.id
        ? { ...c, remainingAmount: newRemaining, status: updatedStatus }
        : c
    );
    const updatedPayments = [newPayment, ...payments];

    syncAndSave(customers, updatedCredits, updatedPayments, deposits);
    setSelectedCreditForPayment(null);

    // Kirim bukti WA jika dipilih
    if (sendWa && cust && cust.phone) {
      const msg = `Halo ${cust.name},\n\nTerima kasih, pembayaran cicilan untuk barang *${cred.itemName}* sebesar *${formatRupiah(amount)}* telah kami terima pada tanggal ${date}.\n\n*Sisa Tagihan:* ${formatRupiah(newRemaining)}\n*Status:* ${updatedStatus === 'completed' ? 'LUNAS SELESAI 🎉' : 'Dalam Angsuran'}\n\nCatatan: ${notes || '-'}\n\n_Salam hangat, TitenFin_`;
      openWhatsApp(cust.phone, msg);
    }
  };

  // HANDLER: Pelunasan Dipercepat dengan Diskon Profit
  const handleEarlySettlement = (
    discount: number,
    finalAmount: number,
    date: string,
    notes: string,
    sendWa: boolean
  ) => {
    if (!selectedCreditForEarlySettlement) return;
    const cred = selectedCreditForEarlySettlement;
    const cust = customers.find(c => c.id === cred.customerId);

    const newPayment: CreditPayment = {
      id: `pay-settle-${Date.now()}`,
      creditItemId: cred.id,
      customerId: cred.customerId,
      date,
      amount: finalAmount,
      isEarlySettlement: true,
      discountGranted: discount,
      notes,
    };

    const updatedCredits = credits.map(c =>
      c.id === cred.id
        ? { ...c, remainingAmount: 0, status: 'completed' as CreditStatus }
        : c
    );
    const updatedPayments = [newPayment, ...payments];

    syncAndSave(customers, updatedCredits, updatedPayments, deposits);
    setSelectedCreditForEarlySettlement(null);

    if (sendWa && cust && cust.phone) {
      const msg = `Halo ${cust.name},\n\nAlhamdulillah, akad kredit barang *${cred.itemName}* telah resmi *LUNAS DIPERCEPAT* pada ${date}.\n\n*Potongan/Diskon Bunga:* ${formatRupiah(discount)}\n*Total Pelunasan:* ${formatRupiah(finalAmount)}\n*Sisa Tagihan:* Rp 0 (LUNAS)\n\nTerima kasih banyak atas kerjasamanya yang baik 🙏\n\n_Salam hangat, TitenFin_`;
      openWhatsApp(cust.phone, msg);
    }
  };

  // HANDLER: Akad Kredit Baru
  const handleCreateCredit = (newCreditData: Omit<CreditItem, 'id' | 'createdAt' | 'status'>) => {
    const newCredit: CreditItem = {
      ...newCreditData,
      id: `cred-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    syncAndSave(customers, [newCredit, ...credits], payments, deposits);
    setIsNewCreditModalOpen(false);
  };

  // HANDLER: Titip Uang (Setor / Tarik)
  const handleDepositMutation = (
    customerId: string,
    type: DepositType,
    amount: number,
    date: string,
    notes: string,
    sendWa: boolean
  ) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    const currentBal = getCustomerDepositBalance(customerId, deposits);
    const newBal = type === 'deposit' ? currentBal + amount : currentBal - amount;

    const newTxn: DepositTransaction = {
      id: `dep-${Date.now()}`,
      customerId,
      customerName: cust.name,
      date,
      type,
      amount,
      balanceAfter: newBal,
      notes,
    };

    const updatedDeposits = [newTxn, ...deposits];
    syncAndSave(customers, credits, payments, updatedDeposits);
    setIsDepositModalOpen(false);

    if (sendWa && cust.phone) {
      const typeLabel = type === 'deposit' ? 'SETORAN TITIPAN (+)' : 'PENARIKAN TITIPAN (-)';
      const msg = `Halo ${cust.name},\n\nTransaksi kas titipan berhasil dicatat pada ${date}:\n\n*Jenis Transaksi:* ${typeLabel}\n*Nominal:* ${formatRupiah(amount)}\n*Sisa Saldo Titipan Anda Saat Ini:* ${formatRupiah(newBal)}\n*Keperluan:* ${notes || '-'}\n\nUang titipan Anda tercatat aman dan terjaga rapi di TitenFin 🙏`;
      openWhatsApp(cust.phone, msg);
    }
  };

  // HANDLER: Tambah Pelanggan Baru
  const handleAddCustomer = (data: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    syncAndSave([newCust, ...customers], credits, payments, deposits);
    setIsCustomerModalOpen(false);
  };

  // Hapus Akad Kredit
  const handleDeleteCredit = (creditId: string) => {
    const updatedCredits = credits.filter(c => c.id !== creditId);
    const updatedPayments = payments.filter(p => p.creditItemId !== creditId);
    syncAndSave(customers, updatedCredits, updatedPayments, deposits);
    setSelectedCreditForDetail(null);
  };

  // Hapus Data Nasabah
  const handleDeleteCustomer = (customerId: string) => {
    const updatedCustomers = customers.filter(c => c.id !== customerId);
    syncAndSave(updatedCustomers, credits, payments, deposits);
    setSelectedCustomerForDetail(null);
  };

  // Export File Cadangan
  const handleExportBackup = () => {
    const payload = {
      app: 'TitenFin',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      userEmail,
      initialCapital,
      customers,
      credits,
      payments,
      deposits,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-titenfin-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Import File Cadangan
  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.customers && parsed.credits) {
          syncAndSave(
            parsed.customers,
            parsed.credits,
            parsed.payments || [],
            parsed.deposits || [],
            parsed.initialCapital || 10000000
          );
          alert('Data berhasil dipulihkan dari file cadangan!');
          setIsSyncModalOpen(false);
        } else {
          alert('Format file cadangan tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file cadangan.');
      }
    };
    reader.readAsText(file);
  };

  if (!isClient) return null;

  // Ringkasan 3 Kotak Kas
  const summary = calculateCashSummary(initialCapital, credits, payments, deposits);
  const activeCredits = credits.filter(c => c.status === 'active');
  const uniqueDepositorsCount = new Set(deposits.map(d => d.customerId)).size;

  const query = searchQuery.trim().toLowerCase();

  // 1. Filter Credits
  const filteredCredits = credits.filter(c => {
    const matchSearch = !query ||
      c.customerName.toLowerCase().includes(query) ||
      c.itemName.toLowerCase().includes(query) ||
      (c.notes && c.notes.toLowerCase().includes(query));
    if (creditFilter === 'all') return matchSearch;
    return matchSearch && c.status === creditFilter;
  });

  // 2. Filter Nasabah Penitip
  const filteredDepositorCustomers = customers.filter(c => {
    const bal = getCustomerDepositBalance(c.id, deposits);
    const hasDeposit = bal > 0 || deposits.some(d => d.customerId === c.id);
    if (!hasDeposit) return false;
    if (!query) return true;
    return c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      (c.notes && c.notes.toLowerCase().includes(query));
  });

  // 3. Filter Riwayat Mutasi Titipan
  const filteredDeposits = deposits.filter(d => {
    if (!query) return true;
    return d.customerName.toLowerCase().includes(query) ||
      (d.notes && d.notes.toLowerCase().includes(query)) ||
      d.date.includes(query);
  });

  // 4. Filter Daftar Nasabah (Semua)
  const filteredCustomers = customers.filter(c => {
    if (!query) return true;
    return c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      (c.address && c.address.toLowerCase().includes(query)) ||
      (c.notes && c.notes.toLowerCase().includes(query));
  });

  // 5. Filter Riwayat Angsuran Masuk
  const filteredPayments = payments.filter(p => {
    if (!query) return true;
    const cust = customers.find(c => c.id === p.customerId);
    const cred = credits.find(c => c.id === p.creditItemId);
    return (cust && cust.name.toLowerCase().includes(query)) ||
      (cred && cred.itemName.toLowerCase().includes(query)) ||
      (p.notes && p.notes.toLowerCase().includes(query)) ||
      p.date.includes(query);
  });

  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 sm:pb-20">
      {/* Header Utama dengan Pemilih Bahasa */}
      <Header
        isPrivacyMode={isPrivacyMode}
        setIsPrivacyMode={setIsPrivacyMode}
        userEmail={userEmail}
        language={language}
        onChangeLanguage={handleChangeLanguage}
        t={t}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenNewCredit={() => setIsNewCreditModalOpen(true)}
        onOpenNewDeposit={() => setIsDepositModalOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* FITUR 4: Dashboard 3 Kotak Kas (Pemisahan Kas Bersih vs Piutang vs Kas Amanah) */}
        <DashboardBoxes
          summary={summary}
          isPrivacyMode={isPrivacyMode}
          activeCreditCount={activeCredits.length}
          activeDepositorCount={uniqueDepositorsCount}
          t={t}
        />

        {/* Tab Navigasi Desktop (di Mobile menggunakan BottomNav yang luwes) */}
        <div className="hidden sm:flex border-b border-slate-200 overflow-x-auto gap-2 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('credits')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'credits'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{t.tabCredits} ({activeCredits.length} {t.filterActive})</span>
          </button>

          <button
            onClick={() => setActiveTab('deposits')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'deposits'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>{t.tabDeposits} ({deposits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'customers'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.tabCustomers} ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('capital')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'capital'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>{t.tabCapital}</span>
          </button>
        </div>

        {/* TAB 1: KREDIT BARANG */}
        {activeTab === 'credits' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.searchCreditPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setCreditFilter('active')}
                    className={`px-3 py-1 rounded-md font-medium transition ${
                      creditFilter === 'active' ? 'bg-white text-emerald-700 font-bold shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    {t.filterActive} ({credits.filter(c => c.status === 'active').length})
                  </button>
                  <button
                    onClick={() => setCreditFilter('completed')}
                    className={`px-3 py-1 rounded-md font-medium transition ${
                      creditFilter === 'completed' ? 'bg-white text-emerald-700 font-bold shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    {t.filterCompleted} ({credits.filter(c => c.status === 'completed').length})
                  </button>
                  <button
                    onClick={() => setCreditFilter('all')}
                    className={`px-3 py-1 rounded-md font-medium transition ${
                      creditFilter === 'all' ? 'bg-white text-emerald-700 font-bold shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    {t.filterAll}
                  </button>
                </div>

                <button
                  onClick={() => setIsNewCreditModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.newCreditBtn}</span>
                </button>
              </div>
            </div>

            {/* List Kartu Kredit Barang */}
            {filteredCredits.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 text-xs">
                {t.noCreditData}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCredits.map((cred) => {
                  const cust = customers.find(c => c.id === cred.customerId);
                  const isDone = cred.status === 'completed';
                  const percentPaid = Math.min(100, Math.round(((cred.totalCreditPrice - cred.remainingAmount) / cred.totalCreditPrice) * 100));

                  return (
                    <div
                      key={cred.id}
                      className={`bg-white rounded-2xl border transition-all hover:shadow-md p-4 sm:p-5 flex flex-col justify-between ${
                        isDone ? 'border-slate-200 opacity-80' : 'border-slate-200/90 shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Header Kartu */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {cred.period.toUpperCase()} • {cred.tenorCount}x Termin
                            </span>
                            <h3
                              onClick={() => setSelectedCreditForDetail(cred)}
                              className="font-bold text-slate-900 text-base leading-snug hover:text-emerald-700 cursor-pointer transition flex items-center gap-1.5 group"
                              title="Klik untuk melihat detail & tindakan lengkap"
                            >
                              <span>{cred.itemName}</span>
                              <span className="text-[10px] text-emerald-600 font-medium opacity-70 group-hover:opacity-100 transition">
                                {t.viewDetailHint}
                              </span>
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-0.5">
                              <span
                                onClick={() => cust && setSelectedCustomerForDetail(cust)}
                                className="cursor-pointer hover:underline hover:text-emerald-800"
                                title="Klik untuk lihat profil nasabah"
                              >
                                {cred.customerName}
                              </span>
                              {cust?.phone && (
                                <button
                                  onClick={() => openWhatsApp(cust.phone, `Halo ${cust.name}, saya dari TitenFin ingin mengonfirmasi jadwal kredit barang ${cred.itemName}...`)}
                                  className="text-slate-400 hover:text-emerald-600 transition"
                                  title="Chat WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                </button>
                              )}
                            </div>
                          </div>

                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isDone ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isDone ? t.statusCompleted : `${percentPaid}% ${t.paidPercentSuffix}`}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-3.5 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              isDone ? 'bg-slate-400' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            }`}
                            style={{ width: `${percentPaid}%` }}
                          />
                        </div>

                        {/* Rincian Angka Keuangan */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100 mb-4">
                          <div>
                            <span className="text-slate-400 block text-[10px]">{t.totalAgreed}</span>
                            <span className="font-bold text-slate-800">{formatRupiah(cred.totalCreditPrice, isPrivacyMode)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">{t.remainingDebt}</span>
                            <span className={`font-black ${isDone ? 'text-slate-500' : 'text-emerald-700'}`}>
                              {formatRupiah(cred.remainingAmount, isPrivacyMode)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">{t.targetInstallment}</span>
                            <span className="font-semibold text-slate-700">
                              {formatRupiah(cred.scheduledAmount, isPrivacyMode)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">{t.estimatedDue}</span>
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {cred.dueDate}
                            </span>
                          </div>
                        </div>

                        {cred.collateralNotes && (
                          <div className="text-[11px] bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md mb-3 border border-amber-200/60">
                            <strong>{t.collateralLabel}</strong> {cred.collateralNotes}
                          </div>
                        )}
                      </div>

                      {/* Tombol Aksi Transaksi (Fitur #2 & #3) */}
                      {!isDone ? (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          {/* FITUR 2: Bayar Cicilan (Parsial / Fleksibel) */}
                          <button
                            onClick={() => setSelectedCreditForPayment(cred)}
                            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{t.payInstallmentBtn}</span>
                          </button>

                          {/* FITUR 3: Pelunasan Dipercepat (Early Settlement) */}
                          <button
                            onClick={() => setSelectedCreditForEarlySettlement(cred)}
                            className="py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>{t.earlySettlementBtn}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle className="w-4 h-4" /> {t.statusCompleted}
                          </span>
                          {cust?.phone && (
                            <button
                              onClick={() => openWhatsApp(cust.phone, `Halo ${cust.name}, konfirmasi kuitansi lunas untuk barang ${cred.itemName} telah tersimpan rapi di sistem TitenFin. Terima kasih!`)}
                              className="text-xs text-slate-500 hover:text-emerald-700 font-medium"
                            >
                              {t.sendReceiptWa}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TITIPAN UANG (TABUNGAN AMANAH) */}
        {activeTab === 'deposits' && (
          <div className="space-y-4">
            {/* Header & Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t.depositLedgerTitle}</h3>
                <p className="text-xs text-slate-500">
                  {t.depositLedgerDesc}
                </p>
              </div>
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>{t.newDepositBtn}</span>
              </button>
            </div>

            {/* Bilah Pencarian Tab Titipan Uang */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.searchDepositPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">
                {filteredDeposits.length} {t.foundItemsSuffix}
              </span>
            </div>

            {/* Rekap Saldo Per Penitip */}
            {filteredDepositorCustomers.length === 0 && searchQuery ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                {t.noDepositData}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredDepositorCustomers.map((c) => {
                  const bal = getCustomerDepositBalance(c.id, deposits);
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedDepositCustomerForDetail(c)}
                      className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-md cursor-pointer transition shadow-2xs group"
                      title="Klik untuk membuka buku rekening & transaksi mutasi"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition flex items-center gap-1.5">
                          <span>{c.name}</span>
                          <span className="text-[10px] text-teal-600 font-medium opacity-70 group-hover:opacity-100 transition">
                            {t.passbookHint}
                          </span>
                        </span>
                        {c.phone && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openWhatsApp(c.phone, `Halo ${c.name}, saldo titipan uang Anda yang tercatat di TitenFin saat ini adalah ${formatRupiah(bal)}.`);
                            }}
                            className="text-slate-400 hover:text-teal-600 p-1"
                            title="Chat WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 text-teal-600" />
                          </button>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block">{t.heldDepositBalance}:</span>
                      <div className="text-xl font-extrabold text-teal-700">
                        {formatRupiah(bal, isPrivacyMode)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Riwayat Mutasi Seluruh Titipan */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-500" />
                  {t.passbookMutationHistory}
                </h4>
                <span className="text-xs text-slate-400 font-medium">{filteredDeposits.length} {t.recordsCountSuffix}</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredDeposits.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    {t.noDepositData}
                  </div>
                ) : (
                  filteredDeposits.map((d) => (
                    <div key={d.id} className="p-3.5 sm:px-5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          d.type === 'deposit' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {d.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{d.customerName}</div>
                          <div className="text-slate-500 text-[11px]">
                            {d.date} • {d.notes || (d.type === 'deposit' ? t.depositMutationLabel : t.withdrawMutationLabel)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-bold ${d.type === 'deposit' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {d.type === 'deposit' ? '+' : '-'}{formatRupiah(d.amount, isPrivacyMode)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {t.balanceRemaining}: {formatRupiah(d.balanceAfter, isPrivacyMode)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DAFTAR NASABAH */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t.customerBookTitle}</h3>
                <p className="text-xs text-slate-500">
                  {t.customerBookDesc}
                </p>
              </div>
              <button
                onClick={() => setIsCustomerModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ {t.customerModalTitle}</span>
              </button>
            </div>

            {/* Bilah Pencarian Tab Nasabah */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.searchCustomerPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">
                {filteredCustomers.length} {t.foundItemsSuffix}
              </span>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                {t.noCustomerData}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCustomers.map((c) => {
                const depositBal = getCustomerDepositBalance(c.id, deposits);
                const activeCustCredits = credits.filter(cr => cr.customerId === c.id && cr.status === 'active');
                const totalCustDebt = activeCustCredits.reduce((s, cr) => s + cr.remainingAmount, 0);

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCustomerForDetail(c)}
                    className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md cursor-pointer transition shadow-2xs space-y-3 group"
                    title="Klik untuk melihat profil lengkap & tindakan nasabah"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition flex items-center gap-1.5">
                          <span>{c.name}</span>
                          <span className="text-[10px] text-emerald-600 font-medium opacity-70 group-hover:opacity-100 transition">
                            {t.profileHint}
                          </span>
                        </h4>
                        <span className="text-xs text-slate-500 block">{c.address || '-'}</span>
                      </div>
                      {c.phone && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openWhatsApp(c.phone, `Halo ${c.name}, salam dari TitenFin...`);
                          }}
                          className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
                          title="Chat WA"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{t.remainingDebt}:</span>
                        <span className={`font-bold ${totalCustDebt > 0 ? 'text-amber-700' : 'text-slate-700'}`}>
                          {formatRupiah(totalCustDebt, isPrivacyMode)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{t.heldDepositBalance}:</span>
                        <span className="font-bold text-teal-700">
                          {formatRupiah(depositBal, isPrivacyMode)}
                        </span>
                      </div>
                    </div>

                    {c.notes && (
                      <p className="text-[11px] text-slate-400 italic">
                        "{c.notes}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            )}
          </div>
        )}

        {/* TAB 4: REKAP MODAL & PERPUTARAN KAS */}
        {activeTab === 'capital' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.capitalReconTitle}</h3>
              <p className="text-xs text-slate-500">
                {t.capitalReconDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 text-sm block">{t.ownCapitalSettings}</span>
                <p className="text-slate-500">
                  {t.ownCapitalPrompt}
                </p>
                <div className="flex gap-2 items-center pt-1">
                  <span className="font-bold text-slate-700">Rp</span>
                  <input
                    type="number"
                    step="1000000"
                    value={initialCapital}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setInitialCapital(val);
                      saveStorageData(customers, credits, payments, deposits, val);
                    }}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-sm text-slate-900 w-full"
                  />
                </div>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2 text-xs">
                <span className="font-bold text-emerald-950 text-sm block">{t.cashLiquidityTitle}</span>
                <p className="text-emerald-900 leading-relaxed">
                  {t.cashLiquidityDesc}
                </p>
              </div>
            </div>

            {/* Riwayat Pembayaran Angsuran Terakhir */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-600" />
                  {t.incomingInstallmentsTitle}
                </h4>
                <div className="relative max-w-xs w-full">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t.searchPaymentPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {filteredPayments.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    {t.noPaymentsData}
                  </div>
                ) : (
                  filteredPayments.map((p) => {
                  const cred = credits.find(c => c.id === p.creditItemId);
                  const cust = customers.find(c => c.id === p.customerId);
                  return (
                    <div key={p.id} className="p-3 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900">{cust?.name || 'Nasabah'}</span>
                        <span className="text-slate-500 text-[11px] block">
                          {p.date} • {cred?.itemName || 'Barang'} • {p.notes || '-'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-emerald-700 text-sm">
                          +{formatRupiah(p.amount, isPrivacyMode)}
                        </span>
                        {p.isEarlySettlement && (
                          <span className="block text-[10px] text-amber-600 font-semibold">
                            {t.earlySettlementBtn} ({formatRupiah(p.discountGranted)})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL-MODAL INTERAKTIF */}
      {selectedCreditForPayment && (
        <PaymentModal
          credit={selectedCreditForPayment}
          isOpen={!!selectedCreditForPayment}
          onClose={() => setSelectedCreditForPayment(null)}
          onSubmit={handleRecordPayment}
          t={t}
        />
      )}

      {selectedCreditForEarlySettlement && (
        <EarlySettlementModal
          credit={selectedCreditForEarlySettlement}
          isOpen={!!selectedCreditForEarlySettlement}
          onClose={() => setSelectedCreditForEarlySettlement(null)}
          onSubmit={handleEarlySettlement}
          t={t}
        />
      )}

      <NewCreditModal
        customers={customers}
        isOpen={isNewCreditModalOpen}
        onClose={() => setIsNewCreditModalOpen(false)}
        onSubmit={handleCreateCredit}
        onAddNewCustomer={() => {
          setIsNewCreditModalOpen(false);
          setIsCustomerModalOpen(true);
        }}
        t={t}
      />

      <DepositModal
        customers={customers}
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        getCustomerBalance={(id) => getCustomerDepositBalance(id, deposits)}
        onSubmit={handleDepositMutation}
        onAddNewCustomer={() => {
          setIsDepositModalOpen(false);
          setIsCustomerModalOpen(true);
        }}
        t={t}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSubmit={handleAddCustomer}
        t={t}
      />

      <SyncEmailModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        userEmail={userEmail}
        onSaveEmail={(email) => {
          setUserEmail(email);
          localStorage.setItem('titenfin_user_email', email);
        }}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        t={t}
      />

      {/* MODAL DETAIL & AKSI CEPAT (SAAT JUDUL / NAMA DIKLIK) */}
      <CreditDetailModal
        credit={selectedCreditForDetail}
        customer={customers.find(c => c.id === selectedCreditForDetail?.customerId)}
        payments={payments}
        isOpen={!!selectedCreditForDetail}
        onClose={() => setSelectedCreditForDetail(null)}
        onPayInstallment={(cred) => setSelectedCreditForPayment(cred)}
        onEarlySettlement={(cred) => setSelectedCreditForEarlySettlement(cred)}
        onDeleteCredit={handleDeleteCredit}
        t={t}
      />

      <CustomerDetailModal
        customer={selectedCustomerForDetail}
        credits={credits}
        deposits={deposits}
        isOpen={!!selectedCustomerForDetail}
        onClose={() => setSelectedCustomerForDetail(null)}
        onNewCreditForCustomer={() => setIsNewCreditModalOpen(true)}
        onNewDepositForCustomer={() => setIsDepositModalOpen(true)}
        onSelectCreditDetail={(cred) => setSelectedCreditForDetail(cred)}
        onDeleteCustomer={handleDeleteCustomer}
        t={t}
      />

      <DepositDetailModal
        customer={selectedDepositCustomerForDetail}
        deposits={deposits}
        isOpen={!!selectedDepositCustomerForDetail}
        onClose={() => setSelectedDepositCustomerForDetail(null)}
        onOpenDepositAction={() => setIsDepositModalOpen(true)}
        t={t}
      />

      {/* Bar Navigasi Bawah & Menu Aksi Cepat (Mobile-Friendly & Luwes) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewCredit={() => setIsNewCreditModalOpen(true)}
        onOpenDeposit={() => setIsDepositModalOpen(true)}
        onOpenNewCustomer={() => setIsCustomerModalOpen(true)}
        activeCreditsCount={activeCredits.length}
        t={t}
      />
    </div>
  );
}
