'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { CreditItem } from '../types';
import { formatRupiah } from '../lib/storage';
import { TranslationDictionary } from '../lib/i18n';

interface PaymentModalProps {
  credit: CreditItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, date: string, notes: string, sendWa: boolean) => void;
  t: TranslationDictionary;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  credit,
  isOpen,
  onClose,
  onSubmit,
  t,
}) => {
  const [amount, setAmount] = useState<number>(credit.scheduledAmount);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [sendWa, setSendWa] = useState<boolean>(true);

  if (!isOpen) return null;

  const remainingAfterPayment = Math.max(0, credit.remainingAmount - (amount || 0));
  const isOverpaying = (amount || 0) > credit.remainingAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    onSubmit(amount, date, notes, sendWa);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">{t.paymentModalTitle}</h3>
            <p className="text-xs text-slate-300">
              {credit.customerName} • {credit.itemName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Ringkasan Kredit */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">{t.remainingDebt}:</span>
              <span className="font-bold text-slate-900 text-sm">
                {formatRupiah(credit.remainingAmount)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.targetInstallment}:</span>
              <span className="font-semibold text-emerald-700 text-sm">
                {formatRupiah(credit.scheduledAmount)}
              </span>
            </div>
          </div>

          {/* Input Nominal Pembayaran (Mendukung Parsial) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              {t.amountIncomingLabel}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                Rp
              </span>
              <input
                type="number"
                min="1000"
                step="1000"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="250000"
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            {/* Quick buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setAmount(credit.scheduledAmount)}
                className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                {t.targetInstallment} ({formatRupiah(credit.scheduledAmount)})
              </button>
              <button
                type="button"
                onClick={() => setAmount(credit.remainingAmount)}
                className="text-[11px] px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md font-medium border border-emerald-200"
              >
                {t.statusCompleted} ({formatRupiah(credit.remainingAmount)})
              </button>
            </div>
          </div>

          {/* Sisa Setelah Pembayaran */}
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            isOverpaying ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <span>{t.remainingAfterPayLabel}</span>
            <span className="font-bold text-sm">
              {formatRupiah(remainingAfterPayment)}
            </span>
          </div>

          {/* Tanggal & Catatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">{t.paymentDateLabel}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">{t.paymentNotesLabel}</label>
              <input
                type="text"
                placeholder=""
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
              {t.sendReceiptViaWa}
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.savePaymentBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
