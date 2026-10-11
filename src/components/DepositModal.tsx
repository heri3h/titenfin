'use client';

import React, { useState } from 'react';
import { X, Landmark, ArrowDownLeft, ArrowUpRight, Check, AlertCircle } from 'lucide-react';
import { Customer, DepositType } from '../types';
import { formatRupiah } from '../lib/storage';

interface DepositModalProps {
  customers: Customer[];
  isOpen: boolean;
  onClose: () => void;
  getCustomerBalance: (custId: string) => number;
  onSubmit: (customerId: string, type: DepositType, amount: number, date: string, notes: string, sendWa: boolean) => void;
  onAddNewCustomer: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  customers,
  isOpen,
  onClose,
  getCustomerBalance,
  onSubmit,
  onAddNewCustomer,
}) => {
  const [customerId, setCustomerId] = useState<string>(customers[0]?.id || '');
  const [type, setType] = useState<DepositType>('deposit');
  const [amount, setAmount] = useState<number>(500000);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [sendWa, setSendWa] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentBalance = getCustomerBalance(customerId);
  const projectedBalance = type === 'deposit'
    ? currentBalance + (amount || 0)
    : currentBalance - (amount || 0);

  const isExceedingBalance = type === 'withdraw' && (amount || 0) > currentBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !amount || amount <= 0 || isExceedingBalance) return;
    onSubmit(customerId, type, amount, date, notes, sendWa);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-teal-700 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Landmark className="w-5 h-5 text-teal-300" />
              Kelola Kas Titipan Uang
            </h3>
            <p className="text-xs text-teal-100">
              Catat setoran amanah atau penarikan bertahap
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-teal-200 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Pilih Tipe: Setor vs Tarik */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('deposit')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                type === 'deposit'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Setor Titipan (+)</span>
            </button>
            <button
              type="button"
              onClick={() => setType('withdraw')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                type === 'withdraw'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Tarik Uang (-)</span>
            </button>
          </div>

          {/* Pilih Nasabah */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-slate-700">Nama Penitip</label>
              <button
                type="button"
                onClick={onAddNewCustomer}
                className="text-[11px] font-semibold text-teal-600 hover:text-teal-700"
              >
                + Penitip Baru
              </button>
            </div>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Saldo: {formatRupiah(getCustomerBalance(c.id))})
                </option>
              ))}
            </select>
          </div>

          {/* Info Saldo Berjalan Saat Ini */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
            <span className="text-slate-500">Saldo Dititipkan Saat Ini:</span>
            <span className="font-bold text-slate-900 text-sm">
              {formatRupiah(currentBalance)}
            </span>
          </div>

          {/* Nominal */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Nominal {type === 'deposit' ? 'Setoran' : 'Penarikan'} (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                Rp
              </span>
              <input
                type="number"
                min="1000"
                step="5000"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="500000"
                className={`w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl font-bold text-slate-900 text-base focus:outline-none focus:ring-2 ${
                  isExceedingBalance ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-teal-500'
                }`}
                required
              />
            </div>
            {isExceedingBalance && (
              <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Nominal penarikan melebihi saldo yang dititipkan!
              </p>
            )}
          </div>

          {/* Saldo Setelah Transaksi */}
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            type === 'deposit' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <span>Saldo Akhir Setelah Ini:</span>
            <span className="font-bold text-sm">
              {formatRupiah(projectedBalance)}
            </span>
          </div>

          {/* Tanggal & Keperluan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Tanggal Transaksi</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Keperluan / Keterangan</label>
              <input
                type="text"
                placeholder="Misal: untuk beli bibit / persiapan hajatan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Checkbox WhatsApp */}
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={sendWa}
              onChange={(e) => setSendWa(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <span className="text-xs text-slate-700">
              Kirim bukti mutasi saldo titipan via WhatsApp
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
              disabled={isExceedingBalance}
              className={`px-5 py-2 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 ${
                isExceedingBalance
                  ? 'bg-slate-400 cursor-not-allowed'
                  : type === 'deposit'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Simpan Mutasi Titipan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
