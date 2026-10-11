'use client';

import React from 'react';
import { Wallet, Users, Landmark, AlertCircle, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { CashDashboardSummary } from '../types';
import { formatRupiah } from '../lib/storage';

interface DashboardBoxesProps {
  summary: CashDashboardSummary;
  isPrivacyMode: boolean;
  activeCreditCount: number;
  activeDepositorCount: number;
}

export const DashboardBoxes: React.FC<DashboardBoxesProps> = ({
  summary,
  isPrivacyMode,
  activeCreditCount,
  activeDepositorCount,
}) => {
  // Total uang fisik yang wajib ada di kantong/rekening Anda saat ini:
  const totalPhysicalCashHeld = summary.ownCash + summary.totalDeposits;

  return (
    <div className="space-y-4">
      {/* 3 Kotak Utama Kas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* KOTAK 1: Kas Sendiri */}
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-5 shadow-lg shadow-emerald-950/10 border border-emerald-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-3 -translate-y-3 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-emerald-300 uppercase flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-400" />
              1. Kas Bersih Sendiri
            </span>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
              Aman Dibelanjakan
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {formatRupiah(summary.ownCash, isPrivacyMode)}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Modal berjalan + akumulasi keuntungan bersih yang sudah cair.
            </p>
          </div>
        </div>

        {/* KOTAK 2: Total Piutang Aktif */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-blue-700 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              2. Total Piutang di Luar
            </span>
            <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {activeCreditCount} Akad Aktif
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {formatRupiah(summary.totalReceivables, isPrivacyMode)}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sisa tagihan barang (pokok + margin) yang masih diangsur nasabah.
            </p>
          </div>
        </div>

        {/* KOTAK 3: Total Titipan Uang (AMANAH) */}
        <div className="bg-amber-50/70 rounded-2xl p-5 border-2 border-amber-300/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold tracking-wider text-amber-900 uppercase flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-amber-700" />
              3. Dana Titipan (Amanah)
            </span>
            <span className="text-[11px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              {activeDepositorCount} Orang Penitip
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-950">
              {formatRupiah(summary.totalDeposits, isPrivacyMode)}
            </h2>
            <div className="flex items-start gap-1 text-xs text-amber-800 font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Uang orang lain. Siap ditarik kapan saja, <strong>jangan dipakai belanja!</strong>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bar Rekonsiliasi Kas Dompet Nyata */}
      <div className="bg-slate-100/90 rounded-xl px-4 py-2.5 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            Total uang tunai fisik yang harus ada di brankas/rekening Anda saat ini (Kas Sendiri + Dana Titipan):
          </span>
        </div>
        <div className="font-bold text-slate-900 text-sm bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
          {formatRupiah(totalPhysicalCashHeld, isPrivacyMode)}
        </div>
      </div>
    </div>
  );
};
