'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Cloud, PlusCircle, Globe, Check } from 'lucide-react';
import { Language, LANGUAGE_OPTIONS, translations } from '../lib/i18n';
import { Logo } from './Logo';

interface HeaderProps {
  isPrivacyMode: boolean;
  setIsPrivacyMode: (val: boolean) => void;
  userEmail: string;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  t: (typeof translations)['id'];
  onOpenSyncModal: () => void;
  onOpenNewCredit: () => void;
  onOpenNewDeposit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isPrivacyMode,
  setIsPrivacyMode,
  userEmail,
  language,
  onChangeLanguage,
  t,
  onOpenSyncModal,
  onOpenNewCredit,
  onOpenNewDeposit,
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:px-6">
        <div className="flex items-center justify-between gap-2.5">
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-2.5">
            <Logo size={36} />
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
                {t.appSlogan}
              </p>
            </div>
          </div>

          {/* Quick Actions & Privacy & Sync & Language */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* PEMILIH BAHASA (LANGUAGE SWITCHER) */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs flex items-center gap-1 transition"
                title={t.selectLanguage}
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-[11px] uppercase tracking-wide">
                  {currentLangObj.code}
                </span>
                <span className="hidden md:inline text-slate-400 text-[10px]">
                  ({currentLangObj.flag})
                </span>
              </button>

              {/* Dropdown Bahasa */}
              {isLangMenuOpen && (
                <>
                  <div
                    onClick={() => setIsLangMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-transparent"
                  />
                  <div className="absolute right-0 top-full mt-1.5 z-50 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1 space-y-0.5 animate-in fade-in duration-150">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {t.selectLanguage}
                    </div>
                    {LANGUAGE_OPTIONS.map((opt) => {
                      const isSelected = opt.code === language;
                      return (
                        <button
                          key={opt.code}
                          onClick={() => {
                            onChangeLanguage(opt.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition text-left ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{opt.flag}</span>
                            <div>
                              <div className="leading-tight text-xs">{opt.label}</div>
                              <div className="text-[9px] text-slate-400 leading-none">{opt.regional}</div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Tombol Sensor Angka (Privacy Blur) */}
            <button
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              title={isPrivacyMode ? t.showNumbers : t.hideNumbers}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
                isPrivacyMode
                  ? 'bg-amber-50 border-amber-300 text-amber-700 font-medium'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {isPrivacyMode ? (
                <>
                  <EyeOff className="w-4 h-4 text-amber-600" />
                  <span className="hidden md:inline">{t.sensorActive}</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-slate-600" />
                  <span className="hidden md:inline">{t.hideNumbers}</span>
                </>
              )}
            </button>

            {/* Tombol Status Sinkronisasi Email */}
            <button
              onClick={onOpenSyncModal}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs flex items-center gap-1.5 transition-colors"
              title={t.syncModalTitle}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Cloud className="w-4 h-4 text-emerald-600 hidden xs:block" />
              <span className="max-w-[100px] sm:max-w-[140px] truncate font-medium">
                {userEmail || t.syncEmail}
              </span>
            </button>

            {/* Quick Action Buttons di Desktop */}
            <div className="hidden sm:flex items-center space-x-1.5 pl-1 border-l border-slate-200">
              <button
                onClick={onOpenNewCredit}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t.newCreditBtn}</span>
              </button>
              <button
                onClick={onOpenNewDeposit}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t.newDepositBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
