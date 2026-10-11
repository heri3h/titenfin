'use client';

import React, { useState } from 'react';
import { X, Plus, Calculator, Calendar, FileText, Check } from 'lucide-react';
import { Customer, InstallmentPeriod, CreditItem } from '../types';
import { formatRupiah } from '../lib/storage';

interface NewCreditModalProps {
  customers: Customer[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newCredit: Omit<CreditItem, 'id' | 'createdAt' | 'status'>) => void;
  onAddNewCustomer: () => void;
}

export const NewCreditModal: React.FC<NewCreditModalProps> = ({
  customers,
  isOpen,
  onClose,
  onSubmit,
  onAddNewCustomer,
}) => {
  const [customerId, setCustomerId] = useState<string>(customers[0]?.id || '');
  const [itemName, setItemName] = useState<string>('');
  const [capitalPrice, setCapitalPrice] = useState<number>(0);
  const [profitType, setProfitType] = useState<'nominal' | 'percent'>('nominal');
  const [profitValue, setProfitValue] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [period, setPeriod] = useState<InstallmentPeriod>('monthly');
  const [tenorCount, setTenorCount] = useState<number>(5);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [collateralNotes, setCollateralNotes] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  // Hitung Nominal Profit
  const computedProfit = profitType === 'percent'
    ? Math.round((capitalPrice * profitValue) / 100)
    : profitValue;

  const totalCreditPrice = capitalPrice + computedProfit;
  const remainingAmount = Math.max(0, totalCreditPrice - downPayment);
  const scheduledAmount = tenorCount > 0 ? Math.ceil(remainingAmount / tenorCount) : 0;

  // Perkirakan jatuh tempo
  const calculateDueDate = () => {
    const d = new Date(startDate);
    if (period === 'daily') d.setDate(d.getDate() + tenorCount);
    else if (period === 'weekly') d.setDate(d.getDate() + tenorCount * 7);
    else if (period === 'monthly') d.setMonth(d.getMonth() + tenorCount);
    else d.setMonth(d.getMonth() + tenorCount);
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (!selectedCustomer || !itemName || capitalPrice <= 0) return;

    onSubmit({
      customerId,
      customerName: selectedCustomer.name,
      itemName,
      capitalPrice,
      profitNominal: computedProfit,
      totalCreditPrice,
      downPayment,
      remainingAmount,
      period,
      tenorCount,
      scheduledAmount,
      startDate,
      dueDate: calculateDueDate(),
      collateralNotes,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-emerald-700 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-300" />
              Akad Kredit Barang Baru
            </h3>
            <p className="text-xs text-emerald-100">
              Sesuaikan modal, profit, dan tenor kesepakatan
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Pilih Nasabah */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-slate-700">Nama Pelanggan / Nasabah</label>
              <button
                type="button"
                onClick={onAddNewCustomer}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" /> Pelanggan Baru
              </button>
            </div>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Nama Barang */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Nama & Spesifikasi Barang</label>
            <input
              type="text"
              placeholder="Contoh: Kulkas Sharp 2 Pintu / Motor Honda Beat 2021"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Harga Modal & Profit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Harga Beli / Modal (Rp)</label>
              <input
                type="number"
                min="1000"
                step="1000"
                placeholder="2000000"
                value={capitalPrice || ''}
                onChange={(e) => setCapitalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-700">Profit / Margin</label>
                <div className="flex gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setProfitType('nominal')}
                    className={`px-1.5 py-0.5 rounded ${profitType === 'nominal' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200'}`}
                  >
                    Rp
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfitType('percent')}
                    className={`px-1.5 py-0.5 rounded ${profitType === 'percent' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200'}`}
                  >
                    %
                  </button>
                </div>
              </div>
              <input
                type="number"
                min="0"
                step={profitType === 'percent' ? '1' : '1000'}
                value={profitValue || ''}
                onChange={(e) => setProfitValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Uang Muka & Tenor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">DP / Uang Muka (Rp)</label>
              <input
                type="number"
                min="0"
                step="5000"
                value={downPayment || ''}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Skema Angsuran</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as InstallmentPeriod)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="monthly">Bulanan</option>
                <option value="weekly">Mingguan</option>
                <option value="daily">Harian</option>
                <option value="custom">Fleksibel / Tempo</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Jumlah Kali Cicil</label>
              <input
                type="number"
                min="1"
                max="120"
                value={tenorCount || ''}
                onChange={(e) => setTenorCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Kotak Kalkulasi Otomatis */}
          <div className="bg-slate-900 text-white p-3.5 rounded-xl text-xs space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Total Harga Kredit (Modal + Profit):</span>
              <span className="font-semibold text-white">{formatRupiah(totalCreditPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Sisa Tagihan (Setelah DP):</span>
              <span className="font-semibold text-white">{formatRupiah(remainingAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-1 text-sm font-bold text-amber-300">
              <span>Estimasi Angsuran / Periode:</span>
              <span>{formatRupiah(scheduledAmount)} ({tenorCount}x)</span>
            </div>
          </div>

          {/* Tanggal & Jaminan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Tanggal Akad Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Catatan Jaminan (Opsional)</label>
              <input
                type="text"
                placeholder="Misal: KTP asli / BPKB motor"
                value={collateralNotes}
                onChange={(e) => setCollateralNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

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
              <Check className="w-4 h-4" />
              <span>Buat Akad Kredit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
