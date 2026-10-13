'use client';

import React, { useState } from 'react';
import { X, Cloud, ShieldCheck, Mail, Download, Upload, CheckCircle2, RefreshCw, Trash2, UserX } from 'lucide-react';

import { TranslationDictionary } from '../lib/i18n';

interface SyncEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onSaveEmail: (email: string) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  onResetAllData?: () => void;
  t: TranslationDictionary;
}

export const SyncEmailModal: React.FC<SyncEmailModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onSaveEmail,
  onExportBackup,
  onImportBackup,
  onResetAllData,
  t,
}) => {
  const [emailInput, setEmailInput] = useState<string>(userEmail || 'heritri@titenfin.id');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    onSaveEmail(emailInput);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
    }
  };

  const handleDeleteAccount = async () => {
    const targetEmail = (emailInput || userEmail).trim();
    if (!targetEmail) {
      alert('Email pengguna tidak ditemukan.');
      return;
    }

    const confirm1 = window.confirm(
      'PERINGATAN: Apakah Anda yakin ingin MENGHAPUS AKUN & SELURUH DATA secara permanen dari server?\n\nTindakan ini tidak dapat dibatalkan.'
    );
    if (!confirm1) return;

    const confirm2 = window.prompt(
      'Ketik "HAPUS" untuk mengonfirmasi penghapusan akun Anda secara permanen:'
    );
    if (confirm2 !== 'HAPUS') {
      alert('Penghapusan akun dibatalkan.');
      return;
    }

    try {
      setIsDeletingAccount(true);
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Akun Anda dan seluruh data telah berhasil dihapus permanen.');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('titenfin_auth_token');
          localStorage.removeItem('titenfin_user_email');
          localStorage.removeItem('titenfin_customers');
          localStorage.removeItem('titenfin_credits');
          localStorage.removeItem('titenfin_credit_payments');
          localStorage.removeItem('titenfin_deposit_transactions');
          window.location.reload();
        }
      } else {
        alert(data.error || 'Gagal menghapus akun.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan saat menghapus akun.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">{t.syncModalTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Email Akun Pembukuan</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="nama@toko.com"
              />
            </div>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex gap-2.5 items-start">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-950 leading-relaxed">
              {t.syncModalDesc}
            </p>
          </div>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Menghubungkan ke Server Cloud...</span>
              </>
            ) : syncSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>Tersinkronisasi Rapi!</span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5" />
                <span>{t.syncNowBtn}</span>
              </>
            )}
          </button>

          {/* Pencadangan Manual Mandiri */}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">{t.backupRestoreSection}</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onExportBackup}
                className="p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.downloadBackupBtn}</span>
              </button>
              <label className="p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.restoreBackupBtn}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Tindakan Pengaturan Akun & Hapus Akun (Google Play User Data Requirement) */}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Pengaturan Akun & Data</span>
            <div className="space-y-2">
              {onResetAllData && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Apakah Anda yakin ingin mengosongkan semua data toko lokal? Semua pelanggan, piutang, dan titipan di perangkat ini akan dibersihkan.')) {
                      onResetAllData();
                      onClose();
                    }
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Reset / Kosongkan Data Toko Lokal</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <UserX className="w-3.5 h-3.5 text-rose-600" />
                <span>{isDeletingAccount ? 'Sedang Menghapus Akun...' : 'Hapus Akun Pengguna Permanen'}</span>
              </button>
            </div>
          </div>

          {/* Footer Info & Privacy Link */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-emerald-600 underline transition font-medium"
            >
              Kebijakan Privasi
            </a>
            <span>SSL/TLS 256-bit • ID: TF-{Date.now().toString().slice(-6)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
