export type Language = 'id' | 'jv' | 'en';

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
  regional: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩', regional: 'Nasional' },
  { code: 'jv', label: 'Basa Jawa', flag: 'ꦗ', regional: 'Jawa & Sekitarnya' },
  { code: 'en', label: 'English', flag: '🇬🇧', regional: 'International' },
];

export const translations = {
  id: {
    // Header & Meta
    appTitle: 'TitenFin',
    appSlogan: 'Cermat Mengelola Kredit & Kas Titipan',
    sensorActive: 'Sensor Aktif',
    hideNumbers: 'Sembunyikan',
    syncEmail: 'Sinkron Email',
    newCreditBtn: '+ Kredit Barang',
    newDepositBtn: '+ Titip Uang',

    // 3 Kotak Kas
    box1Title: '1. Kas Bersih Sendiri',
    box1Badge: 'Aman Dibelanjakan',
    box1Desc: 'Modal berjalan + akumulasi keuntungan bersih yang sudah cair.',
    box2Title: '2. Total Piutang di Luar',
    box2Desc: 'Sisa tagihan barang (pokok + margin) yang masih diangsur nasabah.',
    box2BadgeSuffix: 'Akad Aktif',
    box3Title: '3. Dana Titipan (Amanah)',
    box3BadgeSuffix: 'Orang Penitip',
    box3Warning: 'Uang orang lain. Siap ditarik kapan saja, jangan dipakai belanja!',
    reconciliationLabel: 'Total uang tunai fisik yang harus ada di brankas/rekening Anda saat ini:',

    // Tabs
    tabCredits: 'Kredit Barang',
    tabDeposits: 'Kas Titipan Uang',
    tabCustomers: 'Daftar Nasabah',
    tabCapital: 'Rekap Modal & Profit',

    // Search & Filter
    searchCreditPlaceholder: 'Cari nama nasabah atau jenis barang...',
    searchDepositPlaceholder: 'Cari nama penitip, keperluan mutasi (panen, pupuk, belanja)...',
    searchCustomerPlaceholder: 'Cari nama nasabah, no WhatsApp, alamat dusun...',
    searchPaymentPlaceholder: 'Filter nama / barang / tanggal...',
    filterActive: 'Aktif',
    filterCompleted: 'Lunas',
    filterAll: 'Semua',
    foundItemsSuffix: 'Ditemukan',

    // Card Badges & Actions
    paidPercentSuffix: 'Terbayar',
    statusCompleted: 'LUNAS',
    statusActive: 'AKTIF',
    payInstallmentBtn: 'Bayar Cicilan',
    earlySettlementBtn: 'Lunas Awal (Diskon)',
    sendReceiptWa: 'Kirim Bukti Lunas WA',
    sendSummaryWa: 'Kirim Rekap WA',
    viewDetailHint: 'Detail →',
    passbookHint: 'Buku Rekening →',
    profileHint: 'Profil →',
    
    // Bottom Nav & Quick Menu
    quickMenuTitle: 'Transaksi Cepat',
    quickNewCredit: 'Akad Kredit Baru',
    quickNewCreditDesc: 'Kredit barang fleksibel',
    quickDeposit: 'Kas Titipan Uang',
    quickDepositDesc: 'Setor atau tarik tabungan',
    quickNewCustomer: 'Tambah Nasabah',
    quickNewCustomerDesc: 'Buku kontak & riwayat',
    navCredit: 'Kredit',
    navDeposit: 'Titipan',
    navCustomer: 'Nasabah',
    navCapital: 'Kas & Modal',
    fabAdd: 'Tambah',
    fabClose: 'Tutup',

    // Modals
    confirmDeleteCredit: 'Apakah Anda yakin ingin menghapus catatan akad kredit barang ini?',
    confirmDeleteCustomer: 'Hapus kontak nasabah ini?',
    cannotDeleteCustomerWithDebt: 'Nasabah tidak dapat dihapus karena masih memiliki tagihan kredit aktif atau saldo titipan uang!',
  },

  jv: {
    // Header & Meta
    appTitle: 'TitenFin',
    appSlogan: 'Titen Ngopeni Kredit & Dhuwit Titipan',
    sensorActive: 'Sensor Murup',
    hideNumbers: 'Umpetake',
    syncEmail: 'Sinkron Email',
    newCreditBtn: '+ Nyicil Barang',
    newDepositBtn: '+ Titip Dhuwit',

    // 3 Kotak Kas
    box1Title: '1. Dhuwit Kas Pribadi',
    box1Badge: 'Keno Dibelanjakne',
    box1Desc: 'Modal muter + kumpulane bathi resik sing wis cair.',
    box2Title: '2. Total Piutang neng Jaba',
    box2Desc: 'Sisa tagihan barang (pokok + bathi) sing isih dicicil nasabah.',
    box2BadgeSuffix: 'Akad Muter',
    box3Title: '3. Dhuwit Titipan (Amanah)',
    box3BadgeSuffix: 'Wong Titip',
    box3Warning: 'Dhuwite liyan. Keno dijupuk kapan wae, ojo dibelanjakne pribadi!',
    reconciliationLabel: 'Total dhuwit cash sing wajib ana neng dompet/rekening saiki:',

    // Tabs
    tabCredits: 'Kredit Barang',
    tabDeposits: 'Dhuwit Titipan',
    tabCustomers: 'Daftar Nasabah',
    tabCapital: 'Rekap Modal & Bathi',

    // Search & Filter
    searchCreditPlaceholder: 'Goleki jeneng nasabah utawa barang...',
    searchDepositPlaceholder: 'Goleki jeneng penitip, kaperluan (rabuk, panen, blanja)...',
    searchCustomerPlaceholder: 'Goleki jeneng nasabah, no WA, utawa dusun...',
    searchPaymentPlaceholder: 'Goleki jeneng / barang / tanggal cicilan...',
    filterActive: 'Isih Nyicil',
    filterCompleted: 'Wis Lunas',
    filterAll: 'Kabeh',
    foundItemsSuffix: 'Ketemu',

    // Card Badges & Actions
    paidPercentSuffix: 'Kecicil',
    statusCompleted: 'LUNAS',
    statusActive: 'ISIH NYICIL',
    payInstallmentBtn: 'Bayar Cicilan',
    earlySettlementBtn: 'Lunas Gasik (Diskon)',
    sendReceiptWa: 'Kirim Kuitansi Lunas WA',
    sendSummaryWa: 'Kirim Rekap WA',
    viewDetailHint: 'Rincian →',
    passbookHint: 'Buku Tabungan →',
    profileHint: 'Profil →',

    // Bottom Nav & Quick Menu
    quickMenuTitle: 'Transaksi Cepet',
    quickNewCredit: 'Akad Kredit Anyar',
    quickNewCreditDesc: 'Kredit barang luwes',
    quickDeposit: 'Dhuwit Titipan',
    quickDepositDesc: 'Setor utawa jupuk tabungan',
    quickNewCustomer: 'Tambah Nasabah',
    quickNewCustomerDesc: 'Buku kontak & riwayat',
    navCredit: 'Kredit',
    navDeposit: 'Titipan',
    navCustomer: 'Nasabah',
    navCapital: 'Modal & Bathi',
    fabAdd: 'Tambah',
    fabClose: 'Tutup',

    // Modals
    confirmDeleteCredit: 'Opo sampeyan yakin arep mbusak catetan akad kredit barang iki?',
    confirmDeleteCustomer: 'Busek kontak nasabah iki?',
    cannotDeleteCustomerWithDebt: 'Nasabah ora keno dibusek amarga isih duwe utang kredit utawa saldo dhuwit titipan!',
  },

  en: {
    // Header & Meta
    appTitle: 'TitenFin',
    appSlogan: 'Precise Merchandise Credit & Custody Fund Ledger',
    sensorActive: 'Privacy Blur On',
    hideNumbers: 'Hide Balances',
    syncEmail: 'Email Sync',
    newCreditBtn: '+ Item Financing',
    newDepositBtn: '+ Deposit Fund',

    // 3 Kotak Kas
    box1Title: '1. Net Own Cash',
    box1Badge: 'Safe to Spend',
    box1Desc: 'Working capital + realized accumulated net profit.',
    box2Title: '2. Total Receivables',
    box2Desc: 'Remaining outstanding payments currently under installment.',
    box2BadgeSuffix: 'Active Deals',
    box3Title: '3. Custody Funds (Sacred Trust)',
    box3BadgeSuffix: 'Depositors',
    box3Warning: 'Third-party funds. Retrievable anytime, do not spend for personal use!',
    reconciliationLabel: 'Total physical cash that must be held in vault/wallet right now:',

    // Tabs
    tabCredits: 'Item Financing',
    tabDeposits: 'Custody Funds',
    tabCustomers: 'Customer Directory',
    tabCapital: 'Capital & Arrears',

    // Search & Filter
    searchCreditPlaceholder: 'Search customer name or item model...',
    searchDepositPlaceholder: 'Search depositor name, mutation note (harvest, supplies)...',
    searchCustomerPlaceholder: 'Search customer, phone number, address...',
    searchPaymentPlaceholder: 'Filter by name / item / payment date...',
    filterActive: 'Active',
    filterCompleted: 'Settled',
    filterAll: 'All',
    foundItemsSuffix: 'Found',

    // Card Badges & Actions
    paidPercentSuffix: 'Paid',
    statusCompleted: 'SETTLED',
    statusActive: 'ACTIVE',
    payInstallmentBtn: 'Record Payment',
    earlySettlementBtn: 'Early Settle (Discount)',
    sendReceiptWa: 'Send WA Receipt',
    sendSummaryWa: 'Send WA Summary',
    viewDetailHint: 'Details →',
    passbookHint: 'Passbook →',
    profileHint: 'Profile →',

    // Bottom Nav & Quick Menu
    quickMenuTitle: 'Quick Actions',
    quickNewCredit: 'New Credit Agreement',
    quickNewCreditDesc: 'Flexible item financing',
    quickDeposit: 'Custody Fund Mutation',
    quickDepositDesc: 'Deposit or withdraw funds',
    quickNewCustomer: 'Add New Client',
    quickNewCustomerDesc: 'Directory & history',
    navCredit: 'Credits',
    navDeposit: 'Custody',
    navCustomer: 'Clients',
    navCapital: 'Capital',
    fabAdd: 'Add',
    fabClose: 'Close',

    // Modals
    confirmDeleteCredit: 'Are you sure you want to delete this credit agreement record?',
    confirmDeleteCustomer: 'Delete this customer record?',
    cannotDeleteCustomerWithDebt: 'Customer cannot be deleted while they have active debt or custody fund balance!',
  },
};

const STORAGE_LANG_KEY = 'titenfin_user_language';

/**
 * Deteksi otomatis bahasa pengguna saat pertama kali membuka aplikasi.
 * Prioritas 1: Pilihan manual tersimpan di localStorage.
 * Prioritas 2: Deteksi regional / bahasa browser / timezone perangkat.
 */
export const detectUserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'id';

  // 1. Cek apakah pengguna sudah pernah memilih secara manual
  const savedLang = localStorage.getItem(STORAGE_LANG_KEY) as Language | null;
  if (savedLang && (savedLang === 'id' || savedLang === 'jv' || savedLang === 'en')) {
    return savedLang;
  }

  // 2. Deteksi otomatis dari preferensi browser / HP
  try {
    const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

    // Jika bahasa browser diawali 'jv' (Javanese)
    if (browserLang.startsWith('jv')) {
      return 'jv';
    }

    // Jika bahasa browser diawali 'id' atau 'in' (Indonesian), atau timezone WIB/WITA/WIT
    if (
      browserLang.startsWith('id') ||
      browserLang.startsWith('in') ||
      timeZone.includes('Jakarta') ||
      timeZone.includes('Makassar') ||
      timeZone.includes('Jayapura')
    ) {
      return 'id';
    }

    // Default jika pengguna dari luar negeri / bahasa sistem internasional
    if (browserLang.startsWith('en')) {
      return 'en';
    }

    return 'id'; // default fallback ramah
  } catch {
    return 'id';
  }
};

/**
 * Simpan pilihan manual pengguna (mengunci preferensi).
 */
export const saveUserLanguage = (lang: Language) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_LANG_KEY, lang);
};
