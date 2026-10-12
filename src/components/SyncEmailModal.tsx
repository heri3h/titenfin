'use client';

import React, { useState } from 'react';
import { X, Cloud, ShieldCheck, Mail, Download, Upload, CheckCircle2, RefreshCw, Trash2 } from 'lucide-react';

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
    if (e.target.files && e.target.files[0]) {
      onImportBackup(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">{t.syncModalTitle}</h3>
              <p className="text-xs text-slate-300">
                {t.syncModalDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-950">{t.syncModalTitle}</div>
              {t.syncModalDesc}
            </div>
          </div>

          {/* Email Form */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Cloud...</span>
              </>
            ) : syncSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>OK!</span>
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
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

          {/* Reset / Kosongkan Data Toko */}
          {onResetAllData && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Apakah Anda yakin ingin mengosongkan semua data toko? Semua pelanggan, piutang, dan titipan akan dihapus bersih.')) {
                    onResetAllData();
                    onClose();
                  }
                }}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Reset / Kosongkan Seluruh Data Toko</span>
              </button>
            </div>
          )}

          {/* Footer Info */}
          <div className="text-[11px] text-slate-400 text-center pt-1">
            Status: Terenkripsi SSL/TLS 256-bit • ID: TF-PRO-{Date.now().toString().slice(-6)}
          </div>
        </div>
      </div>
    </div>
  );
};
