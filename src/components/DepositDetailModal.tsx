'use client';

import React from 'react';
import {
  X,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  MessageCircle,
  History,
  Phone,
  Plus
} from 'lucide-react';
import { Customer, DepositTransaction } from '../types';
import { formatRupiah, getCustomerDepositBalance } from '../lib/storage';

interface DepositDetailModalProps {
  customer: Customer | null;
  deposits: DepositTransaction[];
  isOpen: boolean;
  onClose: () => void;
  onOpenDepositAction: (customerId: string) => void;
}

export const DepositDetailModal: React.FC<DepositDetailModalProps> = ({
  customer,
  deposits,
  isOpen,
  onClose,
  onOpenDepositAction,
}) => {
  if (!isOpen || !customer) return null;

  const currentBalance = getCustomerDepositBalance(customer.id, deposits);
  const custTxns = deposits.filter((d) => d.customerId === customer.id);

  const handleOpenWa = () => {
    if (!customer.phone) {
      alert('Nomor WhatsApp belum terdaftar!');
      return;
    }
    const cleanPhone = customer.phone.replace(/^0/, '62').replace(/\D/g, '');
    const msg = `Halo ${customer.name},\n\nBuku Rekening Kas Titipan di TitenFin:\n\n*Saldo Anda Saat Ini:* ${formatRupiah(currentBalance)}\n*Jumlah Riwayat Mutasi:* ${custTxns.length} kali transaksi.\n\nDana titipan Anda terjaga aman & amanah di TitenFin 🙏`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center font-bold text-xl">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">
                Buku Rekening Titipan
              </div>
              <h3 className="font-extrabold text-lg text-white leading-tight">{customer.name}</h3>
              <p className="text-xs text-slate-300">{customer.phone || 'Tanpa No HP'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Card Saldo Berjalan Saat Ini */}
          <div className="bg-teal-50 border-2 border-teal-200 p-4 rounded-xl text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block">
              Saldo Titipan Berjalan (Amanah)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-teal-950">
              {formatRupiah(currentBalance)}
            </div>
            <p className="text-[11px] text-teal-700">
              Dana dapat disetor bertambah atau ditarik sebagian kapan saja.
            </p>
          </div>

          {/* Riwayat Mutasi Khusus Nasabah Ini */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <History className="w-4 h-4 text-teal-600" />
                Riwayat Mutasi Transaksi ({custTxns.length})
              </span>
            </div>

            {custTxns.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                Belum ada riwayat mutasi untuk nasabah ini.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {custTxns.map((t) => (
                  <div key={t.id} className="p-3 text-xs flex justify-between items-center bg-white hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        t.type === 'deposit' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {t.type === 'deposit' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">
                          {t.type === 'deposit' ? 'Setoran Titipan' : 'Penarikan Titipan'}
                        </span>
                        <span className="text-slate-500 text-[11px] block">
                          {t.date} • {t.notes || '-'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${t.type === 'deposit' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {t.type === 'deposit' ? '+' : '-'}{formatRupiah(t.amount)}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        Sisa: {formatRupiah(t.balanceAfter)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenDepositAction(customer.id);
              }}
              className="py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Setor / Tarik Uang</span>
            </button>

            <button
              onClick={handleOpenWa}
              className="py-2.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kirim Rekap WA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
