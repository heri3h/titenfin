'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Landmark,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Globe,
  ChevronRight,
  TrendingUp,
  Lock,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Coins
} from 'lucide-react';
import { Logo } from './Logo';
import { Language, LANGUAGE_OPTIONS } from '../lib/i18n';
import { landingTranslations } from '../lib/landing-i18n';
import {
  CurrencyCode,
  CURRENCY_OPTIONS,
  getCurrencyOption,
  formatCurrency
} from '../lib/currency';

interface LandingPageProps {
  onEnterApp: () => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  currency: CurrencyCode;
  onChangeCurrency: (code: CurrencyCode | null) => void;
  isCustomCurrency?: boolean;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  userEmail?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  language,
  onChangeLanguage,
  currency,
  onChangeCurrency,
  isCustomCurrency = false,
  onOpenAuth,
  userEmail = '',
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const t = landingTranslations[language] || landingTranslations.en;
  const currentLang = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];
  const currentCurrencyObj = getCurrencyOption(currency);

  const handlePrimaryAction = () => {
    if (!userEmail && onOpenAuth) {
      onOpenAuth('register');
    } else {
      onEnterApp();
    }
  };

  const getPrimaryButtonLabel = () => {
    if (userEmail) return t.openDashboard;
    return t.navSignUp || 'Daftar Gratis';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-white font-sans antialiased">
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handlePrimaryAction}>
            <Logo size={36} color="#10b981" />
            <span className="font-black text-xl tracking-wider text-white">
              TITEN<span className="text-emerald-400">FIN</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#boxes" className="hover:text-emerald-400 transition">
              {t.navBoxes}
            </a>
            <a href="#comparison" className="hover:text-emerald-400 transition">
              {t.navSecurity}
            </a>
            <a href="#features" className="hover:text-emerald-400 transition">
              {t.navFeatures}
            </a>
          </div>

          {/* Right Action: Language & Currency Selector & Enter App Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800 text-slate-200 text-xs font-medium transition"
                title={language === 'id' ? 'Pilih Bahasa' : language === 'jv' ? 'Pilih Basa' : 'Select Language'}
              >
                <span className="text-sm">{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.label}</span>
                <Globe className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isLangMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-40 py-1.5 max-h-80 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
                      {language === 'id' ? 'Pilih Bahasa (12 Bahasa)' : language === 'jv' ? 'Pilih Basa (12 Basa)' : 'Select Language (12 Languages)'}
                    </div>
                    {LANGUAGE_OPTIONS.map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          onChangeLanguage(item.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs transition ${
                          language === item.code
                            ? 'bg-emerald-950/60 text-emerald-400 font-bold'
                            : 'text-slate-300 hover:bg-slate-700/60'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{item.flag}</span>
                          <span>{item.label}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">{item.regional}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                  isCustomCurrency
                    ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 font-bold'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-800 text-slate-200'
                }`}
                title={language === 'id' ? 'Pilih Mata Uang' : language === 'jv' ? 'Pilih Mata Uang' : 'Select Currency'}
              >
                <Coins className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-[11px] uppercase tracking-wide">
                  {currentCurrencyObj.code}
                </span>
                <span className="hidden sm:inline text-slate-400 text-[10px]">
                  ({currentCurrencyObj.symbol})
                </span>
              </button>

              {isCurrencyMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsCurrencyMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-40 py-1.5 max-h-80 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
                      {language === 'id' ? 'Mata Uang (12 Pilihan)' : language === 'jv' ? 'Mata Uang (12 Pilihan)' : 'Currencies (12 Options)'}
                    </div>

                    {/* Reset Otomatis Option */}
                    <button
                      onClick={() => {
                        onChangeCurrency(null);
                        setIsCurrencyMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition border-b border-slate-700/60 ${
                        !isCustomCurrency
                          ? 'bg-emerald-950/60 text-emerald-400 font-bold'
                          : 'text-slate-300 hover:bg-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>✨</span>
                        <div className="text-left">
                          <div className="leading-tight font-medium">
                            {language === 'id' ? 'Otomatis (Ikuti Bahasa)' : language === 'jv' ? 'Otomatis (Tuntun Basa)' : 'Automatic (Match Language)'}
                          </div>
                          <div className="text-[9px] text-slate-400">
                            {language === 'id' ? 'Default Negara' : language === 'jv' ? 'Bawaan Negara' : 'Country Default'}
                          </div>
                        </div>
                      </div>
                      {!isCustomCurrency && <span className="text-emerald-400 font-bold">✓</span>}
                    </button>

                    {CURRENCY_OPTIONS.map((opt) => {
                      const isSelected = isCustomCurrency && currency === opt.code;
                      return (
                        <button
                          key={opt.code}
                          onClick={() => {
                            onChangeCurrency(opt.code);
                            setIsCurrencyMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs transition ${
                            isSelected
                              ? 'bg-emerald-950/60 text-emerald-400 font-bold'
                              : 'text-slate-300 hover:bg-slate-700/60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{opt.flag}</span>
                            <div className="text-left">
                              <div className="leading-tight font-medium">
                                {opt.code} ({opt.symbol})
                              </div>
                              <div className="text-[9px] text-slate-400">{opt.name}</div>
                            </div>
                          </div>
                          {isSelected && <span className="text-emerald-400 font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Tombol Masuk / Login (Khusus bagi yang sudah memiliki akun) */}
            {!userEmail && onOpenAuth && (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                title={t.navSignIn || 'Masuk'}
              >
                <span>{t.navSignIn || 'Masuk'}</span>
              </button>
            )}

            {/* Primary CTA Button: Jika belum login -> "Daftar Gratis" (tab register). Jika sudah login -> "Buka Dashboard" */}
            <button
              onClick={handlePrimaryAction}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <span>{getPrimaryButtonLabel()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            {t.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
            <button
              onClick={handlePrimaryAction}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <span>{userEmail ? t.openDashboard : (t.heroCtaPrimary || t.navSignUp)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#boxes"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition"
            >
              <span>{t.heroCtaSecondary}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Metrics Pill Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            {[
              { icon: Layers, label: t.metric1 },
              { icon: ShieldCheck, label: t.metric2 },
              { icon: MessageCircle, label: t.metric3 },
              { icon: Globe, label: t.metric4 },
            ].map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center gap-2.5 backdrop-blur-xs"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <m.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200 leading-tight">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Mini Interactive Dashboard Preview Box */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-4 sm:p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/70 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-2">app.titenfin.id</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">
                {t.simLiveSimulation}
              </span>
            </div>

            {/* 3 Cash Boxes Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  {t.simBox1Title}
                </span>
                <div className="text-xl font-black text-white">
                  {formatCurrency(12850000, currency)}
                </div>
                <span className="text-[10px] text-emerald-400/90 font-medium">{t.simBox1Safe}</span>
              </div>

              <div className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  {t.simBox2Title}
                </span>
                <div className="text-xl font-black text-white">
                  {formatCurrency(8400000, currency)}
                </div>
                <span className="text-[10px] text-amber-400/90 font-medium">{t.simBox2Status}</span>
              </div>

              <div className="bg-slate-800/90 rounded-xl p-3.5 border border-teal-500/40 bg-teal-950/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block mb-1">
                  {t.simBox3Title}
                </span>
                <div className="text-xl font-black text-teal-200">
                  {formatCurrency(4500000, currency)}
                </div>
                <span className="text-[10px] text-teal-400 font-medium">{t.simBox3Warning}</span>
              </div>
            </div>

            {/* Total Kas Fisik Rekonsiliasi */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-400">
                {t.simTotalPhysicalCash} <strong>{formatCurrency(17350000, currency)}</strong> {t.simTotalFormula}
              </span>
              <button
                onClick={handlePrimaryAction}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 self-start sm:self-auto"
              >
                <span>{t.simTrySystemBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REVOLUSI 3 KOTAK KAS */}
      <section id="boxes" className="py-20 bg-slate-950/80 border-t border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
              {t.boxesTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {t.boxesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-base mb-4">
                1
              </div>
              <h3 className="text-lg font-black text-white mb-2">{t.box1Title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t.box1Desc}
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-base mb-4">
                2
              </div>
              <h3 className="text-lg font-black text-white mb-2">{t.box2Title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t.box2Desc}
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-6 relative overflow-hidden group hover:border-teal-400 transition-all bg-gradient-to-b from-teal-950/20 to-slate-900">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-black text-base mb-4">
                3
              </div>
              <h3 className="text-lg font-black text-teal-200 mb-2">{t.box3Title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t.box3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPARISON SCENARIO: Tanpa vs Dengan TitenFin */}
      <section id="comparison" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
              {t.comparisonTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {t.comparisonSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Bad Way */}
            <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2.5 text-red-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="text-base sm:text-lg font-black">{t.badWayTitle}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.badWayDesc}
              </p>
            </div>

            {/* The Good Way with TitenFin */}
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl shadow-emerald-500/5">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h3 className="text-base sm:text-lg font-black">{t.goodWayTitle}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {t.goodWayDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 6 FITUR UTAMA */}
      <section id="features" className="py-20 bg-slate-950/80 border-t border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
              {t.featuresTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {t.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: CreditCard, title: t.feat1Title, desc: t.feat1Desc, color: 'text-emerald-400' },
              { icon: Landmark, title: t.feat2Title, desc: t.feat2Desc, color: 'text-teal-400' },
              { icon: Sparkles, title: t.feat3Title, desc: t.feat3Desc, color: 'text-amber-400' },
              { icon: MessageCircle, title: t.feat4Title, desc: t.feat4Desc, color: 'text-emerald-400' },
              { icon: EyeOff, title: t.feat5Title, desc: t.feat5Desc, color: 'text-blue-400' },
              { icon: ShieldCheck, title: t.feat6Title, desc: t.feat6Desc, color: 'text-teal-400' },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all hover:-translate-y-1"
              >
                <div className={`p-3 rounded-xl bg-slate-800/80 w-fit mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. IDENTITAS RESMI: EMBLEM STIKER KENDARAAN */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 shadow-2xl">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.stickerBadge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                {t.stickerTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.stickerDesc}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700">
                  {t.stickerTag1}
                </span>
                <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700">
                  {t.stickerTag2}
                </span>
                <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700">
                  {t.stickerTag3}
                </span>
              </div>
            </div>

            <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
              <img
                src="/titenfin-sticker-car.jpg"
                alt="TitenFin Cutting Sticker Mockup"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION BANNER */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-block p-3 rounded-2xl bg-emerald-500/10 mb-2">
            <Logo size={48} color="#10b981" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {t.ctaTitle}
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            {t.ctaSubtitle}
          </p>

          <div className="pt-4">
            <button
              onClick={handlePrimaryAction}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-base font-black inline-flex items-center gap-2.5 shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105"
            >
              <span>{userEmail ? t.openDashboard : (t.ctaButton || t.navSignUp)}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-8 border-t border-slate-800 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size={24} color="#10b981" />
            <span className="font-bold text-white tracking-wider">
              TITEN<span className="text-emerald-400">FIN</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>{t.footerTagline}</span>
          </div>
          <div>
            © {new Date().getFullYear()} TitenFin. {t.footerRights}
          </div>
        </div>
      </footer>
    </div>
  );
};
