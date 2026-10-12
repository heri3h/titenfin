'use client';

import React from 'react';
import {
  X,
  CreditCard,
  Calendar,
  Sparkles,
  MessageCircle,
  Trash2,
  CheckCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  History,
  Tag
} from 'lucide-react';
import { CreditItem, CreditPayment, Customer } from '../types';
import { formatRupiah } from '../lib/storage';
import { TranslationDictionary } from '../lib/i18n';

interface CreditDetailModalProps {
  credit: CreditItem | null;
  customer?: Customer;
  payments: CreditPayment[];
  isOpen: boolean;
  onClose: () => void;
  onPayInstallment: (credit: CreditItem) => void;
  onEarlySettlement: (credit: CreditItem) => void;
  onDeleteCredit: (creditId: string) => void;
  t: TranslationDictionary;
}

export const CreditDetailModal: React.FC<CreditDetailModalProps> = ({
  credit,
  customer,
  payments,
  isOpen,
  onClose,
  onPayInstallment,
  onEarlySettlement,
  onDeleteCredit,
  t,
}) => {
  if (!isOpen || !credit) return null;

  const isDone = credit.status === 'completed';
  const percentPaid = Math.min(
    100,
    Math.round(((credit.totalCreditPrice - credit.remainingAmount) / credit.totalCreditPrice) * 100)
  );

  // Filter riwayat bayar khusus untuk barang ini
  const itemPayments = payments.filter((p) => p.creditItemId === credit.id);

  const handleOpenWa = () => {
    if (!customer?.phone) {
      alert(t.noPhoneAlert);
      return;
    }
    const cleanPhone = customer.phone.replace(/^0/, '62').replace(/\D/g, '');
    const msg = `Halo ${credit.customerName},\n\nBerikut ringkasan status kredit barang *${credit.itemName}* di TitenFin:\n\n*${t.totalCreditPrice}* ${formatRupiah(credit.totalCreditPrice)}\n*${t.remainingDebt}* ${formatRupiah(credit.remainingAmount)}\n*Status:* ${isDone ? `${t.statusCompleted} 🎉` : t.statusActive}\n*${t.estimatedDue}:* ${credit.dueDate}\n\nTerima kasih atas kerjasamanya yang baik 🙏`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDelete = () => {
    if (confirm(t.confirmDeleteCredit.replace('{item}', credit.itemName))) {
      onDeleteCredit(credit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header Modal */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isDone ? 'bg-slate-700 text-emerald-400' : 'bg-emerald-600 text-white'
              }`}>
                {isDone ? t.statusCompleted : t.statusActive}
              </span>
              <span className="text-[11px] text-slate-400">
                {credit.period.toUpperCase()} • {credit.tenorCount}x
              </span>
            </div>
            <h3 className="font-extrabold text-lg leading-tight text-white">{credit.itemName}</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {t.navCustomer}: <strong className="text-emerald-400">{credit.customerName}</strong>
            </p>
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
          {/* Progress Bar Pelunasan */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
              <span>{t.paidPercentSuffix}</span>
              <span className="text-emerald-700 font-bold">{percentPaid}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  isDone ? 'bg-slate-400' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${percentPaid}%` }}
              />
            </div>
          </div>

          {/* Rincian Finansial & Akad */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/90 text-xs space-y-2">
            <div className="font-bold text-slate-900 border-b border-slate-200/80 pb-1.5 flex items-center justify-between">
              <span>{t.contractDetails}</span>
              <span className="text-slate-500 font-normal">{t.contractStart} {credit.startDate}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">{t.costPrice}</span>
                <span className="font-semibold text-slate-800">{formatRupiah(credit.capitalPrice)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">{t.agreedProfit}</span>
                <span className="font-semibold text-emerald-700">+{formatRupiah(credit.profitNominal)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">{t.totalCreditPrice}</span>
                <span className="font-bold text-slate-900">{formatRupiah(credit.totalCreditPrice)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">{t.downPayment}</span>
                <span className="font-semibold text-slate-800">{formatRupiah(credit.downPayment)}</span>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 flex justify-between items-center mt-2">
              <div>
                <span className="text-[10px] text-slate-500 block">{t.remainingDebt}:</span>
                <span className="font-extrabold text-base text-emerald-800">
                  {formatRupiah(credit.remainingAmount)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">{t.targetInstallment}:</span>
                <span className="font-semibold text-slate-700">
                  {formatRupiah(credit.scheduledAmount)} / {credit.period}
                </span>
              </div>
            </div>
          </div>

          {/* Jaminan / Agunan jika ada */}
          {credit.collateralNotes && (
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">{t.collateralLabel}</strong>
                {credit.collateralNotes}
              </div>
            </div>
          )}

          {/* Buku Riwayat Pembayaran Angsuran */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <History className="w-4 h-4 text-emerald-600" />
                {t.paymentHistory} ({itemPayments.length}x {t.installmentsRecorded})
              </span>
            </div>

            {itemPayments.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                {t.noPaymentsYet}
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-44 overflow-y-auto">
                {itemPayments.map((p, idx) => (
                  <div key={p.id} className="p-2.5 text-xs flex justify-between items-center bg-white hover:bg-slate-50 transition">
                    <div>
                      <span className="font-bold text-slate-800">#{itemPayments.length - idx}</span>
                      <span className="text-slate-500 text-[11px] block">
                        {p.date} • {p.notes || '-'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700">+{formatRupiah(p.amount)}</span>
                      {p.isEarlySettlement && (
                        <span className="block text-[10px] text-amber-600 font-semibold">
                          {formatRupiah(p.discountGranted)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GRUP AKSI (ACTIONS) */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">{t.quickActionsTitle}:</span>

            {!isDone && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onPayInstallment(credit);
                  }}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{t.recordPaymentAction}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onEarlySettlement(credit);
                  }}
                  className="w-full py-2.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{t.earlySettleAction}</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleOpenWa}
                className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.sendSummaryWa}</span>
              </button>

              <button
                onClick={handleDelete}
                className="w-full py-2 px-3 border border-red-200 hover:bg-red-50 text-red-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.deleteCreditAction}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
