import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Trash2, Phone, Database, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - TitenFin',
  description: 'Kebijakan Privasi dan Perlindungan Data Pengguna Aplikasi TitenFin.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">TitenFin Privacy</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Title Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Kebijakan Privasi & Perlindungan Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kebijakan Privasi TitenFin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Terakhir diperbarui: 14 Oktober 2026 • Berlaku efektif untuk seluruh pengguna aplikasi web & Android TitenFin.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
            TitenFin berkomitmen penuh untuk menghormati dan melindungi privasi serta keamanan data pribadi Anda sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022) dan standar kepatuhan Google Play Developer Policy.
          </p>
        </div>

        {/* Section 1: Data yang Dikumpulkan */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
            <Database className="w-5 h-5 text-emerald-600" />
            <h2>1. Data yang Kami Kumpulkan</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Untuk menyediakan layanan pembukuan kredit dan kas titipan, aplikasi TitenFin mengumpulkan dan memproses informasi berikut:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600">
            <li>
              <strong>Informasi Akun:</strong> Alamat email dan kata sandi/PIN terenkripsi (*salted hash*) saat Anda mendaftar atau menyinkronkan data.
            </li>
            <li>
              <strong>Data Transaksi Usaha & Pembukuan:</strong> Nama pelanggan/nasabah, nomor telepon nasabah (untuk keperluan konfirmasi tanda terima WhatsApp), riwayat kredit, jadwal angsuran, serta mutasi kas titipan.
            </li>
            <li>
              <strong>Informasi Perangkat:</strong> Jenis browser dan status konektivitas untuk mendukung sinkronisasi offline-first.
            </li>
          </ul>
        </div>

        {/* Section 2: Akses Izin Kontak */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
            <Phone className="w-5 h-5 text-emerald-600" />
            <h2>2. Kebijakan Izin Buku Kontak (Contact Picker)</h2>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900 leading-relaxed">
            <strong>Penting:</strong> TitenFin <u>TIDAK PERNAH</u> mengunggah, mencuri, membaca di latar belakang (*background*), atau menjual seluruh isi buku telepon kontak HP Anda.
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Fitur pembaca kontak hanya aktif jika Anda <strong>secara sadar menekan ikon buku kontak</strong> pada formulir Tambah Nasabah. Akses ini dikelola langsung secara aman oleh sistem operasi Android melalui dialog pemilih kontak native (*Contact Picker API*). Hanya satu nomor dan nama yang Anda pilih yang akan disalin ke formulir demi kenyamanan input.
          </p>
        </div>

        {/* Section 3: Penyimpanan & Keamanan Data */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
            <Lock className="w-5 h-5 text-emerald-600" />
            <h2>3. Penyimpanan & Keamanan Data</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Data pembukuan Anda disimpan secara lokal di perangkat Anda (*Offline-First LocalStorage*) dan dicadangkan ke server cloud TitenFin yang diamankan dengan enkripsi transportasi TLS/HTTPS 256-bit dan database terproteksi. Kami menerapkan pembatasan akses ketat sehingga hanya akun terotentikasi yang dapat mengakses data tokonya masing-masing.
          </p>
        </div>

        {/* Section 4: Penghapusan Akun & Data (Account Deletion) */}
        <div id="delete-account" className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4 scroll-mt-20">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
            <Trash2 className="w-5 h-5 text-rose-600" />
            <h2>4. Hak Penghapusan Akun & Data Pengguna (Account Deletion)</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Sesuai dengan kebijakan Google Play User Data Policy, Anda memiliki hak penuh untuk menghapus akun dan seluruh data transaksi usaha Anda kapan saja tanpa syarat berbelit-belit.
          </p>
          <div className="space-y-3">
            <h3 className="font-bold text-xs sm:text-sm text-slate-800">Cara Menghapus Akun:</h3>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>Buka aplikasi TitenFin dan pastikan Anda dalam kondisi login.</li>
              <li>Buka menu <strong>Sinkronisasi Cloud / Akun</strong>.</li>
              <li>Gulir ke bagian bawah dan klik tombol merah <strong>"Hapus Akun Pengguna Permanen"</strong>.</li>
              <li>Konfirmasi tindakan Anda. Sistem akan seketika menghapus profil email, kredensial login, dan seluruh riwayat transaksi cloud Anda dari server secara permanen.</li>
            </ol>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Atau jika Anda mengalami kesulitan mengakses aplikasi, Anda dapat mengajukan permohonan penghapusan akun secara manual dengan mengirimkan email dari alamat terdaftar Anda ke <strong>support@mbelik.com</strong> dengan subjek <em>"Permohonan Hapus Akun TitenFin"</em>. Permohonan akan diproses dalam waktu maksimal 2 x 24 jam kerja.
          </p>
        </div>

        {/* Section 5: Kontak & Pengembang */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
            <Mail className="w-5 h-5 text-emerald-600" />
            <h2>5. Kontak Layanan Pengembang</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Jika Anda memiliki pertanyaan, keluhan, atau masukan terkait kebijakan privasi ini, silakan hubungi tim pengembang kami:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1">
            <p><strong>Pengembang:</strong> Mbelik Dev Team</p>
            <p><strong>Layanan Resmi:</strong> TitenFin (titenfin.mbelik.com)</p>
            <p><strong>Email Kontak:</strong> support@mbelik.com</p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center pt-4 text-xs text-slate-500">
          <p>&copy; 2026 TitenFin by Mbelik Dev. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </main>
    </div>
  );
}
