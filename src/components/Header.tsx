import React, { useState } from 'react';
import { Eye, EyeOff, Cloud, PlusCircle, Globe, Check, LogOut, Coins } from 'lucide-react';
import { Language, LANGUAGE_OPTIONS, translations } from '../lib/i18n';
import { CurrencyCode, CURRENCY_OPTIONS, getCurrencyOption } from '../lib/currency';
import { Logo } from './Logo';

interface HeaderProps {
  isPrivacyMode: boolean;
  setIsPrivacyMode: (val: boolean) => void;
  userEmail: string;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  currency: CurrencyCode;
  onChangeCurrency: (code: CurrencyCode | null) => void;
  isCustomCurrency: boolean;
  t: (typeof translations)['id'];
  onOpenSyncModal: () => void;
  onOpenNewCredit: () => void;
  onOpenNewDeposit: () => void;
  onOpenLanding?: () => void;
  onLogout?: () => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({
  isPrivacyMode,
  setIsPrivacyMode,
  userEmail,
  language,
  onChangeLanguage,
  currency,
  onChangeCurrency,
  isCustomCurrency,
  t,
  onOpenSyncModal,
  onOpenNewCredit,
  onOpenNewDeposit,
  onOpenLanding,
  onLogout,
  onOpenAuth,
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];
  const currentCurrencyObj = getCurrencyOption(currency);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:px-6">
        <div className="flex items-center justify-between gap-2.5">
          {/* Logo & Slogan */}
          <div
            className={`flex items-center space-x-2.5 ${onOpenLanding ? 'cursor-pointer hover:opacity-90 transition' : ''}`}
            onClick={onOpenLanding}
            title={onOpenLanding ? 'Lihat Halaman Depan / Landing Page' : undefined}
          >
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

            {/* PEMILIH MATA UANG (CURRENCY SWITCHER) */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                  isCustomCurrency
                    ? 'border-emerald-300 bg-emerald-50/70 text-emerald-800 font-bold'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
                title={language === 'id' ? 'Pilih Mata Uang' : language === 'jv' ? 'Pilih Mata Uang' : 'Select Currency'}
              >
                <Coins className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-[11px] uppercase tracking-wide">
                  {currentCurrencyObj.code}
                </span>
                <span className="hidden md:inline text-slate-400 text-[10px]">
                  ({currentCurrencyObj.symbol})
                </span>
              </button>

              {/* Dropdown Mata Uang */}
              {isCurrencyMenuOpen && (
                <>
                  <div
                    onClick={() => setIsCurrencyMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-transparent"
                  />
                  <div className="absolute right-0 top-full mt-1.5 z-50 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1 space-y-0.5 animate-in fade-in duration-150 max-h-72 overflow-y-auto">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>{language === 'id' ? 'Mata Uang' : language === 'jv' ? 'Mata Uang' : 'Currency'}</span>
                      {isCustomCurrency && (
                        <button
                          onClick={() => {
                            onChangeCurrency(null);
                            setIsCurrencyMenuOpen(false);
                          }}
                          className="text-[10px] text-emerald-600 hover:underline font-bold capitalize"
                        >
                          {language === 'id' ? 'Reset Otomatis' : language === 'jv' ? 'Reset Otomatis' : 'Auto Reset'}
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onChangeCurrency(null);
                        setIsCurrencyMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition text-left border-b border-slate-100 mb-1 ${
                        !isCustomCurrency
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>✨</span>
                        <div>
                          <div className="leading-tight text-xs">
                            {language === 'id' ? 'Otomatis (Ikuti Bahasa)' : language === 'jv' ? 'Otomatis (Tuntun Basa)' : 'Automatic (Match Language)'}
                          </div>
                          <div className="text-[9px] text-slate-400">
                            {language === 'id' ? `Default: ${currency}` : language === 'jv' ? `Bawaan: ${currency}` : `Default: ${currency}`}
                          </div>
                        </div>
                      </div>
                      {!isCustomCurrency && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>

                    {CURRENCY_OPTIONS.map((cOpt) => {
                      const isSelected = isCustomCurrency && cOpt.code === currency;
                      return (
                        <button
                          key={cOpt.code}
                          onClick={() => {
                            onChangeCurrency(cOpt.code);
                            setIsCurrencyMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition text-left ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{cOpt.flag}</span>
                            <div>
                              <div className="leading-tight text-xs">
                                {cOpt.code} • {cOpt.symbol}
                              </div>
                              <div className="text-[9px] text-slate-400 leading-none">{cOpt.name}</div>
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

            {/* Tombol Status Sinkronisasi & Akun */}
            <button
              onClick={() => {
                if (!userEmail) {
                  if (onOpenAuth) onOpenAuth('login');
                } else {
                  onOpenSyncModal();
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                userEmail
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold'
              }`}
              title={userEmail ? t.syncModalTitle : (language === 'id' ? 'Masuk ke Akun Toko' : language === 'jv' ? 'Mlebet Akun Toko' : 'Sign In to Store')}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  userEmail ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <Cloud
                className={`w-4 h-4 hidden xs:block ${
                  userEmail ? 'text-emerald-600' : 'text-emerald-700'
                }`}
              />
              <span className="max-w-[100px] sm:max-w-[140px] truncate font-medium">
                {userEmail || (language === 'id' ? 'Masuk / Daftar' : language === 'jv' ? 'Mlebu / Daftar' : 'Sign In / Register')}
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

            {/* Tombol Keluar / Logout */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50/80 hover:bg-red-100 text-red-700 text-xs flex items-center gap-1.5 font-medium transition"
                title={`${t.logoutBtn} (Ke Halaman Depan)`}
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">{t.logoutBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
