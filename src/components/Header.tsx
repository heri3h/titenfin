'use client';

import React from 'react';
import { Eye, EyeOff, Cloud, RefreshCw, PlusCircle, ShieldCheck, UserCheck } from 'lucide-react';

interface HeaderProps {
  isPrivacyMode: boolean;
  setIsPrivacyMode: (val: boolean) => void;
  userEmail: string;
  onOpenSyncModal: () => void;
  onOpenNewCredit: () => void;
  onOpenNewDeposit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isPrivacyMode,
  setIsPrivacyMode,
  userEmail,
  onOpenSyncModal,
  onOpenNewCredit,
  onOpenNewDeposit,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-black text-xl tracking-tight">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Titen<span className="text-emerald-600">Fin</span>
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Cermat Mengelola Kredit & Kas Titipan
              </p>
            </div>
          </div>

          {/* Quick Actions & Privacy & Sync */}
          <div className="flex items-center space-x-2">
            {/* Tombol Sensor Angka (Privacy Blur) */}
            <button
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              title={isPrivacyMode ? "Tampilkan Angka Saldo" : "Sembunyikan Angka (Sensor di Depan Orang)"}
              className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
                isPrivacyMode
                  ? 'bg-amber-50 border-amber-300 text-amber-700 font-medium'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {isPrivacyMode ? (
                <>
                  <EyeOff className="w-4 h-4 text-amber-600" />
                  <span className="hidden md:inline">Sensor Aktif</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-slate-600" />
                  <span className="hidden md:inline">Sembunyikan</span>
                </>
              )}
            </button>

            {/* Tombol Status Sinkronisasi Email */}
            <button
              onClick={onOpenSyncModal}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs flex items-center gap-1.5 transition-colors"
              title="Status Sinkronisasi Email & Cloud Backup"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Cloud className="w-4 h-4 text-emerald-600 hidden xs:block" />
              <span className="max-w-[110px] sm:max-w-[150px] truncate font-medium">
                {userEmail || 'Sinkron Email'}
              </span>
            </button>

            {/* Quick Action Buttons */}
            <div className="hidden sm:flex items-center space-x-1.5 pl-1 border-l border-slate-200">
              <button
                onClick={onOpenNewCredit}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Kredit Barang</span>
              </button>
              <button
                onClick={onOpenNewDeposit}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Titip Uang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
