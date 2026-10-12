import { Language } from './i18n';

export type CurrencyCode =
  | 'IDR' // Rupiah (Indonesia)
  | 'USD' // US Dollar (Global / USA)
  | 'EUR' // Euro (Eropa / Spanyol)
  | 'CNY' // Yuan (Tiongkok)
  | 'INR' // Rupee (India)
  | 'SAR' // Riyal (Arab Saudi)
  | 'BDT' // Taka (Bangladesh)
  | 'BRL' // Real (Brasil)
  | 'RUB' // Ruble (Rusia)
  | 'PKR' // Rupee (Pakistan)
  | 'JPY' // Yen (Jepang)
  | 'GBP'; // Pound Sterling (Inggris)

export interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  flag: string;
  fractionDigits: number;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'IDR', symbol: 'Rp', name: 'Rupiah Indonesia', locale: 'id-ID', flag: '🇮🇩', fractionDigits: 0 },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', flag: '🇺🇸', fractionDigits: 0 },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE', flag: '🇪🇺', fractionDigits: 0 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan (人民币)', locale: 'zh-CN', flag: '🇨🇳', fractionDigits: 0 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (रुपया)', locale: 'en-IN', flag: '🇮🇳', fractionDigits: 0 },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal (ر.س)', locale: 'ar-SA', flag: '🇸🇦', fractionDigits: 0 },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka (টাকা)', locale: 'bn-BD', flag: '🇧🇩', fractionDigits: 0 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR', flag: '🇧🇷', fractionDigits: 0 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble (руб)', locale: 'ru-RU', flag: '🇷🇺', fractionDigits: 0 },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee (روپیہ)', locale: 'ur-PK', flag: '🇵🇰', fractionDigits: 0 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (円)', locale: 'ja-JP', flag: '🇯🇵', fractionDigits: 0 },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB', flag: '🇬🇧', fractionDigits: 0 },
];

export const LANGUAGE_DEFAULT_CURRENCY: Record<Language, CurrencyCode> = {
  id: 'IDR',
  jv: 'IDR',
  en: 'USD',
  zh: 'CNY',
  hi: 'INR',
  es: 'EUR',
  ar: 'SAR',
  bn: 'BDT',
  pt: 'BRL',
  ru: 'RUB',
  ur: 'PKR',
  ja: 'JPY',
};

// Global active currency cache
let currentActiveCurrency: CurrencyCode = 'IDR';

export const getCurrencyOption = (code: CurrencyCode): CurrencyOption => {
  return CURRENCY_OPTIONS.find((c) => c.code === code) || CURRENCY_OPTIONS[0];
};

export const getDefaultCurrencyForLanguage = (lang: Language): CurrencyCode => {
  return LANGUAGE_DEFAULT_CURRENCY[lang] || 'USD';
};

export const getSavedCustomCurrency = (): CurrencyCode | null => {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('titenfin_user_currency') as CurrencyCode | null;
  if (saved && CURRENCY_OPTIONS.some((c) => c.code === saved)) {
    return saved;
  }
  return null;
};

export const saveCustomCurrency = (code: CurrencyCode | null): void => {
  if (typeof window === 'undefined') return;
  if (code) {
    localStorage.setItem('titenfin_user_currency', code);
    currentActiveCurrency = code;
  } else {
    localStorage.removeItem('titenfin_user_currency');
  }
};

export const resolveActiveCurrency = (lang: Language): CurrencyCode => {
  const custom = getSavedCustomCurrency();
  if (custom) {
    currentActiveCurrency = custom;
    return custom;
  }
  const def = getDefaultCurrencyForLanguage(lang);
  currentActiveCurrency = def;
  return def;
};

export const setRuntimeCurrency = (code: CurrencyCode): void => {
  currentActiveCurrency = code;
};

export const getRuntimeCurrency = (): CurrencyCode => {
  return currentActiveCurrency;
};

export const formatCurrency = (
  val: number,
  currencyCode?: CurrencyCode,
  isHidden: boolean = false
): string => {
  const targetCode = currencyCode || currentActiveCurrency || 'IDR';
  const opt = getCurrencyOption(targetCode);

  if (isHidden) {
    return `${opt.symbol} ••••••••`;
  }

  try {
    return new Intl.NumberFormat(opt.locale, {
      style: 'currency',
      currency: opt.code,
      maximumFractionDigits: opt.fractionDigits,
      minimumFractionDigits: opt.fractionDigits,
    }).format(val);
  } catch {
    return `${opt.symbol} ${val.toLocaleString()}`;
  }
};
