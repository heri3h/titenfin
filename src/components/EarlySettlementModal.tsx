'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Percent, Sparkles, AlertCircle } from 'lucide-react';
import { CreditItem } from '../types';
import { formatRupiah } from '../lib/storage';

interface EarlySettlementModalProps {
  credit: CreditItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (discount: number, finalAmount: number, date: string, notes: string, sendWa: boolean) => void;
}

export const EarlySettlementModal: React.FC<EarlySettlementModalProps> = ({
  credit,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [discount, setDiscount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('Pelunasan dipercepat (disepakati diskon bunga)');
  const [sendWa, setSendWa] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentRemaining = credit.remainingAmount;
  const finalAmountToPay = Math.max(0, currentRemaining - (discount || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(discount, finalAmountToPay, date, notes, sendWa);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base">Pelunasan Dipercepat</h3>
              <p className="text-xs text-emerald-200">
                {credit.customerName} • {credit.itemName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
            <div className="font-semibold flex items-center gap-1.5 mb-1 text-emerald-950">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Fitur Penyesuaian Profit Pelunasan Awal
            </div>
            Berikan potongan/diskon margin keuntungan yang adil kepada nasabah karena melunasi seluruh sisa kredit lebih awal dari tenor.
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Kredit Awal:</span>
              <span className="font-semibold text-slate-700">{formatRupiah(credit.totalCreditPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Margin Keuntungan Awal:</span>
              <span className="font-semibold text-emerald-700">+{formatRupiah(credit.profitNominal)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-900">
              <span>Sisa Tagihan Normal:</span>
              <span className="text-sm">{formatRupiah(currentRemaining)}</span>
            </div>
          </div>

          {/* Potongan / Diskon Profit */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Diskon / Potongan Profit yang Diberikan (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                Rp
              </span>
              <input
                type="number"
                min="0"
                max={currentRemaining}
                step="5000"
                value={discount || ''}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0 jika tidak ada potongan"
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-1.5 pt-1">
              {[0, 50000, 100000, 150000].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiscount(d)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium border ${
                    discount === d
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {d === 0 ? 'Tanpa Diskon' : `Diskon ${d / 1000}rb`}
                </button>
              ))}
            </div>
          </div>

          {/* Total Bersih yang Wajib Diterima */}
          <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-inner space-y-1">
            <span className="text-xs text-emerald-300 font-medium block">
              Total Bersih yang Diterima Hari Ini (Langsung Lunas):
            </span>
            <div className="text-2xl font-black text-amber-300">
              {formatRupiah(finalAmountToPay)}
            </div>
          </div>

          {/* Tanggal & Keterangan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Tanggal Pelunasan</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Catatan Kesepakatan</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Checkbox WhatsApp */}
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={sendWa}
              onChange={(e) => setSendWa(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-700">
              Kirim Surat Bukti Lunas ke WhatsApp nasabah
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Selesaikan Pelunasan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
