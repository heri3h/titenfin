'use client';

import React from 'react';
import {
  X,
  Phone,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Landmark,
  Trash2,
  Calendar,
  CreditCard,
  FileText,
  UserCheck
} from 'lucide-react';
import { Customer, CreditItem, DepositTransaction } from '../types';
import { formatRupiah, getCustomerDepositBalance } from '../lib/storage';
import { TranslationDictionary } from '../lib/i18n';

interface CustomerDetailModalProps {
  customer: Customer | null;
  credits: CreditItem[];
  deposits: DepositTransaction[];
  isOpen: boolean;
  onClose: () => void;
  onNewCreditForCustomer: (customerId: string) => void;
  onNewDepositForCustomer: (customerId: string) => void;
  onSelectCreditDetail: (credit: CreditItem) => void;
  onDeleteCustomer: (customerId: string) => void;
  t: TranslationDictionary;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  credits,
  deposits,
  isOpen,
  onClose,
  onNewCreditForCustomer,
  onNewDepositForCustomer,
  onSelectCreditDetail,
  onDeleteCustomer,
  t,
}) => {
  if (!isOpen || !customer) return null;

  const custCredits = credits.filter((c) => c.customerId === customer.id);
  const activeCredits = custCredits.filter((c) => c.status === 'active');
  const totalDebt = activeCredits.reduce((s, c) => s + c.remainingAmount, 0);
  const depositBalance = getCustomerDepositBalance(customer.id, deposits);
  const custDeposits = deposits.filter((d) => d.customerId === customer.id);

  const handleOpenWa = () => {
    if (!customer.phone) {
      alert(t.noPhoneAlert);
      return;
    }
    const cleanPhone = customer.phone.replace(/^0/, '62').replace(/\D/g, '');
    const msg = `Halo ${customer.name},\n\nSalam hangat dari TitenFin. Semoga selalu sehat dan berkah 🙏`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDelete = () => {
    if (totalDebt > 0 || depositBalance > 0) {
      alert(t.cannotDeleteCustomerWithDebt);
      return;
    }
    if (confirm(t.confirmDeleteCustomer.replace('{name}', customer.name))) {
      onDeleteCustomer(customer.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xl">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">{customer.name}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  {customer.phone || 'Tanpa No HP'}
                </span>
              </div>
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
          {/* Alamat & Catatan */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span><strong>{t.addressLabel}:</strong> {customer.address || '-'}</span>
            </div>
            {customer.notes && (
              <div className="flex items-start gap-2 text-slate-500 italic pt-1 border-t border-slate-200/60">
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>"{customer.notes}"</span>
              </div>
            )}
          </div>

          {/* Kotak Ringkasan Finansial Nasabah */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs">
              <span className="text-emerald-800 block text-[11px] font-semibold">{t.totalActiveDebt}:</span>
              <div className="text-base font-black text-emerald-950 mt-0.5">
                {formatRupiah(totalDebt)}
              </div>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                {activeCredits.length} {t.activeCreditsCountSuffix}
              </span>
            </div>

            <div className="bg-teal-50 p-3 rounded-xl border border-teal-200 text-xs">
              <span className="text-teal-800 block text-[11px] font-semibold">{t.heldDepositBalance}:</span>
              <div className="text-base font-black text-teal-950 mt-0.5">
                {formatRupiah(depositBalance)}
              </div>
              <span className="text-[10px] text-teal-700 block mt-0.5">
                {t.custodyFundNote}
              </span>
            </div>
          </div>

          {/* Daftar Riwayat Kredit Barang Nasabah Ini */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                {t.creditListForCust} ({custCredits.length})
              </span>
            </div>

            {custCredits.length === 0 ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                {t.noCreditsForCust}
              </div>
            ) : (
              <div className="space-y-1.5">
                {custCredits.map((cred) => (
                  <div
                    key={cred.id}
                    onClick={() => {
                      onClose();
                      onSelectCreditDetail(cred);
                    }}
                    className="p-2.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-2xs cursor-pointer transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{cred.itemName}</span>
                      <span className="text-[11px] text-slate-400">
                        {formatRupiah(cred.totalCreditPrice)} • {formatRupiah(cred.remainingAmount)}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cred.status === 'completed' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {cred.status === 'completed' ? t.statusCompleted : t.statusActive}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GRUP AKSI CEPAT NASABAH */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">{t.quickActionsTitle}:</span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onNewCreditForCustomer(customer.id);
                }}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.newCreditBtn}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNewDepositForCustomer(customer.id);
                }}
                className="py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Landmark className="w-4 h-4" />
                <span>{t.depositWithdrawAction}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {customer.phone && (
                <button
                  onClick={handleOpenWa}
                  className="py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.sendSummaryWa}</span>
                </button>
              )}

              <button
                onClick={handleDelete}
                className="py-2 px-3 border border-red-200 hover:bg-red-50 text-red-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.deleteCustomerAction}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
