'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Landmark,
  Users,
  PieChart,
  Plus,
  ShoppingBag,
  ArrowDownLeft,
  ArrowUpRight,
  UserPlus,
  X
} from 'lucide-react';

interface BottomNavProps {
  activeTab: 'credits' | 'deposits' | 'customers' | 'capital';
  setActiveTab: (tab: 'credits' | 'deposits' | 'customers' | 'capital') => void;
  onOpenNewCredit: () => void;
  onOpenDeposit: () => void;
  onOpenNewCustomer: () => void;
  activeCreditsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewCredit,
  onOpenDeposit,
  onOpenNewCustomer,
  activeCreditsCount,
}) => {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  return (
    <>
      {/* Backdrop saat Quick Action Dropdown terbuka */}
      {isQuickMenuOpen && (
        <div
          onClick={() => setIsQuickMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        />
      )}

      {/* Menu Dropdown / Action Sheet Melayang di atas tombol FAB */}
      {isQuickMenuOpen && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xs bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 space-y-1.5 animate-in slide-in-from-bottom-5 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100">
            <span>Transaksi Cepat</span>
            <button
              onClick={() => setIsQuickMenuOpen(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              setIsQuickMenuOpen(false);
              onOpenNewCredit();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 transition text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Akad Kredit Baru</div>
              <div className="text-[10px] text-slate-500">Kredit barang fleksibel</div>
            </div>
          </button>

          <button
            onClick={() => {
              setIsQuickMenuOpen(false);
              onOpenDeposit();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-50 text-slate-800 hover:text-teal-800 transition text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Kas Titipan Uang</div>
              <div className="text-[10px] text-slate-500">Setor atau tarik tabungan</div>
            </div>
          </button>

          <button
            onClick={() => {
              setIsQuickMenuOpen(false);
              onOpenNewCustomer();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-800 transition text-left group border-t border-slate-100"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-700 group-hover:text-white transition">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Tambah Nasabah</div>
              <div className="text-[10px] text-slate-500">Buku kontak & riwayat</div>
            </div>
          </button>
        </div>
      )}

      {/* Bar Navigasi Bawah (Bottom Navigation Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 sm:px-6 safe-area-pb">
        <div className="max-w-lg mx-auto flex items-center justify-around py-1.5 relative">
          
          {/* TAB 1: Kredit */}
          <button
            onClick={() => setActiveTab('credits')}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
              activeTab === 'credits'
                ? 'text-emerald-600 font-bold'
                : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <div className="relative">
              <CreditCard className="w-5 h-5" />
              {activeCreditsCount > 0 && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-emerald-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {activeCreditsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1">Kredit</span>
          </button>

          {/* TAB 2: Titipan */}
          <button
            onClick={() => setActiveTab('deposits')}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
              activeTab === 'deposits'
                ? 'text-teal-600 font-bold'
                : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <Landmark className="w-5 h-5" />
            <span className="text-[10px] mt-1">Titipan</span>
          </button>

          {/* TOMBOL TENGAH: FAB Quick Action */}
          <div className="relative -top-4 flex flex-col items-center">
            <button
              onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform transform active:scale-95 ${
                isQuickMenuOpen
                  ? 'bg-slate-800 rotate-45 shadow-slate-900/30'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-600/40 hover:scale-105'
              }`}
              title="Menu Transaksi Cepat"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
            <span className="text-[9px] font-bold text-slate-500 mt-1">
              {isQuickMenuOpen ? 'Tutup' : 'Tambah'}
            </span>
          </div>

          {/* TAB 3: Nasabah */}
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
              activeTab === 'customers'
                ? 'text-emerald-600 font-bold'
                : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-1">Nasabah</span>
          </button>

          {/* TAB 4: Rekap Kas */}
          <button
            onClick={() => setActiveTab('capital')}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
              activeTab === 'capital'
                ? 'text-emerald-600 font-bold'
                : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span className="text-[10px] mt-1">Kas & Modal</span>
          </button>

        </div>
      </nav>
    </>
  );
};
