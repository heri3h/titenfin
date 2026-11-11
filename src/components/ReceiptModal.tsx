'use client';

import React, { useRef, useState } from 'react';
import {
  X,
  Share2,
  Download,
  Printer,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  MessageSquare,
  Landmark,
  ShoppingBag,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { ReceiptData } from '../types';
import { formatRupiah, openWhatsApp } from '../lib/storage';
import { TranslationDictionary } from '../lib/i18n';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReceiptData | null;
  t: TranslationDictionary;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  data,
  t,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !data) return null;

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(data.refNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // 1. Simpan Gambar (.PNG) ke HP / Laptop
  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;
    try {
      setIsProcessing(true);
      const dataUrl = await toPng(receiptRef.current, {
        quality: 0.95,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `Resi-TitenFin-${data.refNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Gagal membuat gambar resi:', err);
      alert('Maaf, gagal menyimpan gambar resi. Anda bisa melakukan screenshot layar.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Langsung Bagikan (Share Sheet HP: WA, Telegram, dll)
  const handleShare = async () => {
    if (!receiptRef.current) return;
    try {
      setIsProcessing(true);
      const blob = await toBlob(receiptRef.current, {
        quality: 0.95,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      if (blob) {
        const file = new File([blob], `Resi-${data.refNumber}.png`, {
          type: 'image/png',
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Bukti Transaksi TitenFin #${data.refNumber}`,
            text: `Bukti ${data.title} sebesar ${formatRupiah(data.amount)} untuk ${data.customerName}.`,
          });
          return;
        }
      }

      // Fallback jika browser desktop tidak mendukung share file langsung
      await handleDownloadImage();
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err);
        // Fallback simpan gambar
        handleDownloadImage();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Kirim via WhatsApp langsung
  const handleSendWhatsApp = () => {
    if (!data.customerPhone) {
      alert(t.noPhoneAlert || 'Nomor WhatsApp belum terdaftar');
      return;
    }

    let detailMsg = '';
    if (data.type === 'installment') {
      detailMsg = `Barang: *${data.itemName || '-'}*\nNominal Cicilan: *${formatRupiah(data.amount)}*\nSisa Tagihan: *${
        data.remainingAmount !== undefined
          ? data.remainingAmount === 0
            ? 'Rp 0 (LUNAS 🎉)'
            : formatRupiah(data.remainingAmount)
          : '-'
      }*`;
    } else if (data.type === 'settlement') {
      detailMsg = `Barang: *${data.itemName || '-'}*\nDiskon Potongan: *${formatRupiah(data.discount || 0)}*\nTotal Pelunasan: *${formatRupiah(data.amount)}*\nStatus: *LUNAS SELESAI 🎉*`;
    } else if (data.type === 'deposit') {
      detailMsg = `Jenis Transaksi: *SETORAN TITIPAN (+)*\nNominal: *${formatRupiah(data.amount)}*\nSisa Saldo Titipan: *${formatRupiah(data.balanceAfter || 0)}*`;
    } else if (data.type === 'withdraw') {
      detailMsg = `Jenis Transaksi: *PENARIKAN TITIPAN (-)*\nNominal: *${formatRupiah(data.amount)}*\nSisa Saldo Titipan: *${formatRupiah(data.balanceAfter || 0)}*`;
    }

    const fullMsg = `Halo ${data.customerName},\n\n*BUKTI RESI TRANSAKSI RESMI TITENFIN*\nNo. Ref: *${data.refNumber}*\nTanggal: ${data.date} ${data.time || ''}\n\n${detailMsg}\n\nCatatan: ${data.notes || '-'}\n\n_Bukti transaksi ini sah dan diterbitkan resmi oleh sistem pembukuan TitenFin._ 🙏`;
    openWhatsApp(data.customerPhone, fullMsg);
  };

  // 4. Cetak (Print)
  const handlePrint = () => {
    window.print();
  };

  const getTypeBadge = () => {
    switch (data.type) {
      case 'installment':
      case 'credit_payment':
        return {
          icon: <ShoppingBag className="w-3.5 h-3.5" />,
          label: 'Angsuran Kredit',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'settlement':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
          label: 'Pelunasan Cepat',
          color: 'bg-teal-50 text-teal-700 border-teal-200',
        };
      case 'deposit':
        return {
          icon: <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Setoran Titipan',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'withdraw':
        return {
          icon: <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />,
          label: 'Penarikan Titipan',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      default:
        return {
          icon: <Landmark className="w-3.5 h-3.5" />,
          label: 'Transaksi',
          color: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  const badge = getTypeBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-sm my-auto space-y-3">
        {/* KARTU RESI UTAMA (ALA M-BANKING) - DI-CAPTURE SEBAGAI GAMBAR */}
        <div
          ref={receiptRef}
          id="titenfin-printable-receipt"
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative"
        >
          {/* Header Brand */}
          <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white px-5 pt-6 pb-5 text-center relative overflow-hidden">
            {/* Background Decorative Rings */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

            <div className="flex items-center justify-center gap-1.5 mb-2">
              <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-xs font-black tracking-tighter text-emerald-300 border border-white/20">
                T
              </div>
              <span className="font-extrabold tracking-wider text-xs text-white uppercase">
                TitenFin
              </span>
              <span className="text-[10px] text-emerald-300 bg-white/10 px-1.5 py-0.5 rounded-full font-medium">
                e-Receipt
              </span>
            </div>

            {/* Success Checkmark Circle */}
            <div className="w-14 h-14 mx-auto my-2 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950/30">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h4 className="font-bold text-sm tracking-wide text-emerald-100">
              {t.receiptSubtitle || 'Transaksi Berhasil'}
            </h4>
            <p className="text-[11px] text-emerald-200/80 mt-0.5">
              {data.date} {data.time ? `• ${data.time}` : ''}
            </p>

            {/* Nominal Besar */}
            <div className="mt-3 pt-3 border-t border-white/15">
              <span className="text-[11px] text-emerald-200 uppercase tracking-wider block font-semibold">
                Total Nominal
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-xs">
                {formatRupiah(data.amount)}
              </span>
            </div>
          </div>

          {/* Ticket Notch Divider (Lekukan Tiket Khas Struk M-Banking) */}
          <div className="relative h-6 bg-white flex items-center justify-between">
            <div className="w-4 h-6 bg-slate-950/75 rounded-r-full -ml-0.5" />
            <div className="flex-1 border-b-2 border-dashed border-slate-200 mx-2" />
            <div className="w-4 h-6 bg-slate-950/75 rounded-l-full -mr-0.5" />
          </div>

          {/* Rincian Transaksi */}
          <div className="px-5 pb-5 pt-1 space-y-3 text-xs bg-white">
            {/* No. Referensi */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-medium text-[11px]">
                {t.receiptRefNo || 'No. Referensi'}
              </span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="flex items-center gap-1 font-mono font-bold text-slate-700 hover:text-emerald-700 text-[11px] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 transition"
                title="Salin No. Referensi"
              >
                <span>{data.refNumber}</span>
                {isCopied ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
              </button>
            </div>

            {/* Jenis Transaksi */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-400 font-medium text-[11px]">Jenis Transaksi</span>
              <span className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full border ${badge.color}`}>
                {badge.icon}
                <span>{badge.label}</span>
              </span>
            </div>

            {/* Nama Nasabah */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-400 font-medium text-[11px]">Nasabah</span>
              <span className="font-bold text-slate-900 text-right">{data.customerName}</span>
            </div>

            {/* Nama Barang / Akad (jika ada) */}
            {data.itemName && (
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-400 font-medium text-[11px]">Barang / Akad</span>
                <span className="font-semibold text-slate-800 text-right max-w-[180px] truncate">
                  {data.itemName}
                </span>
              </div>
            )}

            {/* Angsuran Ke (jika cicilan) */}
            {data.installmentNumber !== undefined && (
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-400 font-medium text-[11px]">Angsuran</span>
                <span className="font-semibold text-slate-800">
                  Cicilan #{data.installmentNumber}
                  {data.tenorCount ? ` dari ${data.tenorCount}x` : ''}
                </span>
              </div>
            )}

            {/* Diskon Pelunasan (jika ada) */}
            {!!data.discount && data.discount > 0 && (
              <div className="flex items-center justify-between py-0.5">
                <span className="text-amber-600 font-medium text-[11px]">Potongan Diskon</span>
                <span className="font-bold text-amber-600">
                  -{formatRupiah(data.discount)}
                </span>
              </div>
            )}

            {/* Sisa Tagihan (jika kredit) */}
            {data.remainingAmount !== undefined && (
              <div className="flex items-center justify-between py-1 bg-slate-50 px-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium text-[11px]">Sisa Tagihan</span>
                <span className={`font-black text-[12px] ${data.remainingAmount === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {data.remainingAmount === 0 ? 'Rp 0 (LUNAS 🎉)' : formatRupiah(data.remainingAmount)}
                </span>
              </div>
            )}

            {/* Sisa Saldo Titipan (jika kas titipan) */}
            {data.balanceAfter !== undefined && (
              <div className="flex items-center justify-between py-1 bg-slate-50 px-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium text-[11px]">Sisa Saldo Titipan</span>
                <span className="font-black text-slate-900 text-[12px]">
                  {formatRupiah(data.balanceAfter)}
                </span>
              </div>
            )}

            {/* Catatan (jika ada) */}
            {data.notes && (
              <div className="pt-1">
                <span className="text-slate-400 font-medium text-[10px] block">Catatan:</span>
                <p className="text-slate-600 text-[11px] italic bg-slate-50/80 p-1.5 rounded-md mt-0.5">
                  &ldquo;{data.notes}&rdquo;
                </p>
              </div>
            )}

            {/* Footer Resmi Keaslian Dokumen */}
            <div className="pt-3 border-t border-slate-100 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium">
                  {t.receiptOfficialNotice || 'Bukti transaksi sah & terverifikasi resmi oleh TitenFin'}
                </span>
              </div>
              <div className="flex justify-center gap-1 opacity-20 pt-1">
                <div className="h-4 w-1 bg-slate-800" />
                <div className="h-4 w-2 bg-slate-800" />
                <div className="h-4 w-0.5 bg-slate-800" />
                <div className="h-4 w-3 bg-slate-800" />
                <div className="h-4 w-1 bg-slate-800" />
                <div className="h-4 w-2 bg-slate-800" />
                <div className="h-4 w-0.5 bg-slate-800" />
                <div className="h-4 w-1.5 bg-slate-800" />
                <div className="h-4 w-2.5 bg-slate-800" />
                <div className="h-4 w-1 bg-slate-800" />
              </div>
            </div>
          </div>
        </div>

        {/* TOMBOL AKSI CEPAT (SHARE, SIMPAN GAMBAR, WA, TUTUP) */}
        <div className="space-y-2 pt-1">
          {/* Tombol Utama: Share & Simpan Gambar */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleShare}
              disabled={isProcessing}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20 transition disabled:opacity-60"
            >
              <Share2 className="w-4 h-4" />
              <span>{isProcessing ? 'Memproses...' : (t.receiptShareBtn || 'Bagikan')}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isProcessing}
              className="py-2.5 px-3 bg-white hover:bg-slate-50 active:scale-98 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 shadow-xs transition disabled:opacity-60"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>{t.receiptDownloadBtn || 'Simpan Gambar'}</span>
            </button>
          </div>

          {/* Tombol Sekunder: Kirim WA & Cetak & Tutup */}
          <div className="grid grid-cols-3 gap-2">
            {data.customerPhone && (
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="py-2 px-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 transition"
                title="Kirim Pesan WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WA</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1 transition"
              title="Cetak Kertas / Thermal"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.receiptPrintBtn || 'Cetak'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`py-2 px-2 bg-slate-700/80 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 transition ${
                !data.customerPhone ? 'col-span-2' : ''
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.receiptCloseBtn || 'Tutup'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
