'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, CheckCircle2, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import { Logo } from './Logo';
import { Language } from '../lib/i18n';

const GOOGLE_CLIENT_ID = '1040892445860-5s7tmth85je0e2aimdo7lfpbvjr31itc.apps.googleusercontent.com';

const AUTH_TRANSLATIONS: Record<Language, {
  subtitleLogin: string;
  subtitleRegister: string;
  tabLogin: string;
  tabRegister: string;
  googleContinue: string;
  orUseEmail: string;
  storeNameLabel: string;
  storeNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  pinLabel: string;
  pinHint: string;
  confirmPinLabel: string;
  submitLogin: string;
  submitRegister: string;
  processing: string;
  noAccountPrompt: string;
  registerLink: string;
  haveAccountPrompt: string;
  loginLink: string;
  pinMismatch: string;
  pinMinLength: string;
  googleSuccess: string;
  forgotPin?: string;
  forgotPinTitle?: string;
  forgotPinDesc?: string;
  sendOtpBtn?: string;
  otpLabel?: string;
  newPinLabel?: string;
  confirmNewPinLabel?: string;
  saveNewPinBtn?: string;
  backToLogin?: string;
  otpSentNotice?: string;
  resendOtp?: string;
}> = {
  id: {
    subtitleLogin: 'Masuk ke brankas kas & tagihan kredit usaha Anda',
    subtitleRegister: 'Daftar akun baru untuk mulai mencatat keuangan amanah',
    tabLogin: 'Masuk (Sign In)',
    tabRegister: 'Daftar Toko Baru',
    googleContinue: 'Lanjutkan dengan Google (1-Click)',
    orUseEmail: 'atau gunakan email',
    storeNameLabel: 'Nama Usaha / Toko / Pemilik',
    storeNamePlaceholder: 'misal: Toko Berkah Mandiri',
    emailLabel: 'Alamat Email Toko',
    emailPlaceholder: 'toko@email.com',
    pinLabel: 'PIN Keamanan Toko (6 Digit)',
    pinHint: 'Minimal 6 angka/karakter',
    confirmPinLabel: 'Ulangi PIN Keamanan',
    submitLogin: 'Masuk ke Toko Saya',
    submitRegister: 'Daftar Akun Toko Baru',
    processing: 'Memproses Brankas...',
    noAccountPrompt: 'Belum punya akun toko?',
    registerLink: 'Daftar di sini',
    haveAccountPrompt: 'Sudah memiliki akun toko?',
    loginLink: 'Masuk di sini',
    pinMismatch: 'Konfirmasi PIN tidak cocok!',
    pinMinLength: 'PIN harus minimal 6 digit!',
    googleSuccess: 'Berhasil masuk dengan Google!',
    forgotPin: 'Lupa PIN?',
    forgotPinTitle: 'Pemulihan PIN Keamanan',
    forgotPinDesc: 'Masukkan email toko untuk menerima kode OTP 6-digit',
    sendOtpBtn: 'Kirim Kode OTP (6 Digit)',
    otpLabel: 'Kode OTP (6 Digit)',
    newPinLabel: 'PIN Baru (Minimal 6 Digit)',
    confirmNewPinLabel: 'Ulangi PIN Baru',
    saveNewPinBtn: 'Simpan PIN & Buka Toko',
    backToLogin: 'Kembali ke Masuk',
    otpSentNotice: 'Kode OTP 6-digit telah dikirim ke',
    resendOtp: 'Kirim Ulang Kode OTP',
  },
  jv: {
    subtitleLogin: 'Mlebet wonten brankas kas & piutang usaha panjenengan',
    subtitleRegister: 'Daftar akun anyar kangge miwiti cathetan keuangan amanah',
    tabLogin: 'Mlebu (Sign In)',
    tabRegister: 'Daftar Toko Anyar',
    googleContinue: 'Lajengaken mawi Google (1-Click)',
    orUseEmail: 'utawi ginakaken email',
    storeNameLabel: 'Asma Usaha / Toko / Juragan',
    storeNamePlaceholder: 'tuladha: Toko Berkah Mandiri',
    emailLabel: 'Alamat Email Toko',
    emailPlaceholder: 'toko@email.com',
    pinLabel: 'PIN Keamanan Toko (6 Digit)',
    pinHint: 'Minimal 6 angka/karakter',
    confirmPinLabel: 'Baleni PIN Keamanan',
    submitLogin: 'Mlebet Toko Kula',
    submitRegister: 'Daftar Akun Toko Anyar',
    processing: 'Ngrampungaken Brankas...',
    noAccountPrompt: 'Dereng gadhah akun toko?',
    registerLink: 'Daftar wonten mriki',
    haveAccountPrompt: 'Sampun gadhah akun toko?',
    loginLink: 'Mlebu wonten mriki',
    pinMismatch: 'Konfirmasi PIN mboten cocog!',
    pinMinLength: 'PIN kedah minimal 6 digit!',
    googleSuccess: 'Kasembadan mlebu mawi Google!',
    forgotPin: 'Kesupen PIN?',
    forgotPinTitle: 'Nata Ulang PIN Keamanan',
    forgotPinDesc: 'Lebokaken email toko kangge nampi kode OTP 6-digit',
    sendOtpBtn: 'Kirim Kode OTP (6 Digit)',
    otpLabel: 'Kode OTP (6 Digit)',
    newPinLabel: 'PIN Anyar (Minimal 6 Digit)',
    confirmNewPinLabel: 'Baleni PIN Anyar',
    saveNewPinBtn: 'Simpen PIN & Mlebu Toko',
    backToLogin: 'Wangsul dhateng Mlebu',
    otpSentNotice: 'Kode OTP 6-digit sampun dikirim wonten',
    resendOtp: 'Kirim Baleni Kode OTP',
  },
  en: {
    subtitleLogin: 'Sign in to your store cash vault and credit accounts',
    subtitleRegister: 'Create an account to start managing trustworthy finances',
    tabLogin: 'Sign In',
    tabRegister: 'Register New Store',
    googleContinue: 'Continue with Google (1-Click)',
    orUseEmail: 'or continue with email',
    storeNameLabel: 'Business / Store / Owner Name',
    storeNamePlaceholder: 'e.g. Acme Trading Store',
    emailLabel: 'Store Email Address',
    emailPlaceholder: 'store@email.com',
    pinLabel: 'Store Security PIN (6 Digits)',
    pinHint: 'At least 6 digits/characters',
    confirmPinLabel: 'Confirm Security PIN',
    submitLogin: 'Sign In to My Store',
    submitRegister: 'Register New Store Account',
    processing: 'Processing Vault...',
    noAccountPrompt: "Don't have a store account yet?",
    registerLink: 'Sign up here',
    haveAccountPrompt: 'Already have a store account?',
    loginLink: 'Sign in here',
    pinMismatch: 'PIN confirmation does not match!',
    pinMinLength: 'PIN must be at least 6 digits!',
    googleSuccess: 'Successfully signed in with Google!',
    forgotPin: 'Forgot PIN?',
    forgotPinTitle: 'Security PIN Recovery',
    forgotPinDesc: 'Enter your store email to receive a 6-digit OTP code',
    sendOtpBtn: 'Send OTP Code (6 Digits)',
    otpLabel: 'OTP Code (6 Digits)',
    newPinLabel: 'New PIN (Min 6 Digits)',
    confirmNewPinLabel: 'Confirm New PIN',
    saveNewPinBtn: 'Save PIN & Sign In',
    backToLogin: 'Back to Sign In',
    otpSentNotice: '6-digit OTP code has been sent to',
    resendOtp: 'Resend OTP Code',
  },
  zh: {
    subtitleLogin: '登录您的商户金库与应收分期账务',
    subtitleRegister: '创建商户账户，开启严谨诚信记账',
    tabLogin: '登录 (Sign In)',
    tabRegister: '注册新商户',
    googleContinue: '一键使用 Google 登录',
    orUseEmail: '或使用邮箱与PIN',
    storeNameLabel: '商户 / 店铺 / 店主名称',
    storeNamePlaceholder: '例：诚信贸易店',
    emailLabel: '店铺邮箱地址',
    emailPlaceholder: 'store@email.com',
    pinLabel: '商户安全 PIN 码 (6位)',
    pinHint: '至少6位数字或字符',
    confirmPinLabel: '确认安全 PIN 码',
    submitLogin: '登录我的店铺',
    submitRegister: '注册新店铺账户',
    processing: '金库处理中...',
    noAccountPrompt: '还没有店铺账户？',
    registerLink: '在此注册',
    haveAccountPrompt: '已有店铺账户？',
    loginLink: '在此登录',
    pinMismatch: '两次输入的PIN不一致！',
    pinMinLength: 'PIN码至少需要6位！',
    googleSuccess: 'Google登录成功！',
  },
  hi: {
    subtitleLogin: 'अपनी तिजोरी और उधारी खातों में साइन इन करें',
    subtitleRegister: 'विश्वसनीय वित्तीय खाता शुरू करने के लिए पंजीकरण करें',
    tabLogin: 'साइन इन',
    tabRegister: 'नया स्टोर बनाएं',
    googleContinue: 'Google से जारी रखें (1-क्लिक)',
    orUseEmail: 'या ईमेल का उपयोग करें',
    storeNameLabel: 'व्यवसाय / स्टोर / स्वामी का नाम',
    storeNamePlaceholder: 'उदा. माँ कृपा ट्रेडर्स',
    emailLabel: 'स्टोर ईमेल पता',
    emailPlaceholder: 'store@email.com',
    pinLabel: 'स्टोर सुरक्षा पिन (6 अंक)',
    pinHint: 'कम से कम 6 अंक',
    confirmPinLabel: 'पिन दोहराएं',
    submitLogin: 'मेरे स्टोर में प्रवेश करें',
    submitRegister: 'नया खाता पंजीकृत करें',
    processing: 'प्रक्रिया जारी है...',
    noAccountPrompt: 'क्या खाता नहीं है?',
    registerLink: 'यहाँ रजिस्टर करें',
    haveAccountPrompt: 'पहले से खाता है?',
    loginLink: 'यहाँ साइन इन करें',
    pinMismatch: 'पिन मिलान नहीं हुआ!',
    pinMinLength: 'पिन कम से कम 6 अंकों का होना चाहिए!',
    googleSuccess: 'Google से सफलतापूर्वक साइन इन हुआ!',
  },
  es: {
    subtitleLogin: 'Inicie sesión en su bóveda de efectivo y cuentas de crédito',
    subtitleRegister: 'Cree una cuenta para gestionar sus finanzas con confianza',
    tabLogin: 'Iniciar Sesión',
    tabRegister: 'Registrar Tienda',
    googleContinue: 'Continuar con Google (1 Clic)',
    orUseEmail: 'o usar correo electrónico',
    storeNameLabel: 'Nombre del Negocio / Tienda / Propietario',
    storeNamePlaceholder: 'ej. Tienda Comercial Ejemplo',
    emailLabel: 'Correo Electrónico de la Tienda',
    emailPlaceholder: 'tienda@email.com',
    pinLabel: 'PIN de Seguridad (6 Dígitos)',
    pinHint: 'Mínimo 6 dígitos/caracteres',
    confirmPinLabel: 'Confirmar PIN de Seguridad',
    submitLogin: 'Entrar a Mi Tienda',
    submitRegister: 'Registrar Nueva Tienda',
    processing: 'Procesando Bóveda...',
    noAccountPrompt: '¿No tiene una cuenta?',
    registerLink: 'Regístrese aquí',
    haveAccountPrompt: '¿Ya tiene una cuenta?',
    loginLink: 'Inicie sesión aquí',
    pinMismatch: '¡La confirmación del PIN no coincide!',
    pinMinLength: '¡El PIN debe tener al menos 6 dígitos!',
    googleSuccess: '¡Inicio de sesión exitoso con Google!',
  },
  ar: {
    subtitleLogin: 'تسجيل الدخول إلى خزينة النقد وحسابات الائتمان',
    subtitleRegister: 'إنشاء حساب جديد لبدء إدارة الأموال بأمانة',
    tabLogin: 'تسجيل الدخول',
    tabRegister: 'تسجيل متجر جديد',
    googleContinue: 'المتابعة مع Google (نقرة واحدة)',
    orUseEmail: 'أو باستخدام البريد الإلكتروني',
    storeNameLabel: 'اسم المتجر / النشاط / المالك',
    storeNamePlaceholder: 'مثال: متجر البركة',
    emailLabel: 'البريد الإلكتروني للمتجر',
    emailPlaceholder: 'store@email.com',
    pinLabel: 'رمز الأمان PIN (6 أرقام)',
    pinHint: 'على الأقل 6 أرقام/أحرف',
    confirmPinLabel: 'تأكيد رمز الأمان PIN',
    submitLogin: 'الدخول إلى متجري',
    submitRegister: 'تسجيل متجر جديد',
    processing: 'جارٍ فتح الخزينة...',
    noAccountPrompt: 'ليس لديك حساب متجر بعد؟',
    registerLink: 'سجل هنا',
    haveAccountPrompt: 'لديك حساب بالفعل؟',
    loginLink: 'سجل الدخول هنا',
    pinMismatch: 'تأكيد الرمز غير متطابق!',
    pinMinLength: 'يجب أن يكون الرمز 6 أرقام على الأقل!',
    googleSuccess: 'تم الدخول بنجاح عبر Google!',
  },
  bn: {
    subtitleLogin: 'আপনার ক্যাশ ভল্ট এবং কিস্তির হিসাবে সাইন ইন করুন',
    subtitleRegister: 'আমানত আর্থিক হিসাব শুরু করতে অ্যাকাউন্ট তৈরি করুন',
    tabLogin: 'সাইন ইন',
    tabRegister: 'নতুন দোকান নিবন্ধন',
    googleContinue: 'Google দিয়ে চালিয়ে যান (১-ক্লিক)',
    orUseEmail: 'অথবা ইমেইল ব্যবহার করুন',
    storeNameLabel: 'ব্যবসা / দোকান / মালিকের নাম',
    storeNamePlaceholder: 'উদাঃ বরকত ট্রেডার্স',
    emailLabel: 'দোকানের ইমেইল ঠিকানা',
    emailPlaceholder: 'store@email.com',
    pinLabel: 'নিরাপত্তা পিন (৬ সংখ্যা)',
    pinHint: 'কমপক্ষে ৬ সংখ্যা',
    confirmPinLabel: 'নিরাপত্তা পিন নিশ্চিত করুন',
    submitLogin: 'আমার দোকানে প্রবেশ করুন',
    submitRegister: 'নতুন দোকান নিবন্ধন করুন',
    processing: 'ভল্ট প্রক্রিয়াকরণ হচ্ছে...',
    noAccountPrompt: 'এখনও অ্যাকাউন্ট নেই?',
    registerLink: 'এখানে নিবন্ধন করুন',
    haveAccountPrompt: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    loginLink: 'এখানে সাইন ইন করুন',
    pinMismatch: 'পিন মিলছে না!',
    pinMinLength: 'পিন কমপক্ষে ৬ সংখ্যার হতে হবে!',
    googleSuccess: 'Google দিয়ে সফলভাবে সাইন ইন হয়েছে!',
  },
  pt: {
    subtitleLogin: 'Acesse seu cofre e controle de parcelas comerciais',
    subtitleRegister: 'Crie uma conta para começar a gerenciar suas finanças',
    tabLogin: 'Entrar',
    tabRegister: 'Registrar Loja',
    googleContinue: 'Continuar com Google (1 Clique)',
    orUseEmail: 'ou use e-mail',
    storeNameLabel: 'Nome do Negócio / Loja / Proprietário',
    storeNamePlaceholder: 'ex: Loja Comercial Modelo',
    emailLabel: 'E-mail da Loja',
    emailPlaceholder: 'loja@email.com',
    pinLabel: 'PIN de Segurança (6 Dígitos)',
    pinHint: 'Mínimo de 6 dígitos',
    confirmPinLabel: 'Confirmar PIN de Segurança',
    submitLogin: 'Entrar na Minha Loja',
    submitRegister: 'Cadastrar Nova Loja',
    processing: 'Processando Cofre...',
    noAccountPrompt: 'Não tem uma conta?',
    registerLink: 'Cadastre-se aqui',
    haveAccountPrompt: 'Já possui uma conta?',
    loginLink: 'Entre aqui',
    pinMismatch: 'A confirmação do PIN não coincide!',
    pinMinLength: 'O PIN deve ter no mínimo 6 dígitos!',
    googleSuccess: 'Conectado com sucesso pelo Google!',
  },
  ru: {
    subtitleLogin: 'Войдите в кассу и журнал рассрочек вашего магазина',
    subtitleRegister: 'Создайте аккаунт для честного учета финансов',
    tabLogin: 'Войти',
    tabRegister: 'Регистрация магазина',
    googleContinue: 'Продолжить с Google (1 клик)',
    orUseEmail: 'или используйте email',
    storeNameLabel: 'Название магазина / владельца',
    storeNamePlaceholder: 'напр.: ИП Иванов Торговля',
    emailLabel: 'Электронная почта',
    emailPlaceholder: 'store@email.com',
    pinLabel: 'PIN-код безопасности (6 цифр)',
    pinHint: 'Минимум 6 цифр',
    confirmPinLabel: 'Повторите PIN-код',
    submitLogin: 'Войти в мой магазин',
    submitRegister: 'Зарегистрировать магазин',
    processing: 'Открытие сейфа...',
    noAccountPrompt: 'Еще нет аккаунта?',
    registerLink: 'Регистрация здесь',
    haveAccountPrompt: 'Уже есть аккаунт?',
    loginLink: 'Войти здесь',
    pinMismatch: 'PIN-коды не совпадают!',
    pinMinLength: 'PIN должен быть не менее 6 цифр!',
    googleSuccess: 'Успешный вход через Google!',
  },
  ur: {
    subtitleLogin: 'اپنے تجوری کیش اور قسطوں کے کھاتوں میں سائن ان کریں',
    subtitleRegister: 'دیانت دارانہ مالیاتی نظام شروع کرنے کے لیے نیا اکاؤنٹ بنائیں',
    tabLogin: 'سائن ان کریں',
    tabRegister: 'نئی دکان رجسٹر کریں',
    googleContinue: 'Google کے ساتھ جاری رکھیں (1-کلک)',
    orUseEmail: 'یا ای میل استعمال کریں',
    storeNameLabel: 'کاروبار / دکان / مالک کا نام',
    storeNamePlaceholder: 'مثال: برکت ٹریڈرز',
    emailLabel: 'دکان کا ای میل پتہ',
    emailPlaceholder: 'store@email.com',
    pinLabel: 'سیکیورٹی پن (6 ہندسے)',
    pinHint: 'کم از کم 6 ہندسے',
    confirmPinLabel: 'سیکیورٹی پن دہرائیں',
    submitLogin: 'میری دکان میں داخل ہوں',
    submitRegister: 'نیا اکاؤنٹ رجسٹر کریں',
    processing: 'تجوری کھولی جا رہی ہے...',
    noAccountPrompt: 'کیا ابھی تک اکاؤنٹ نہیں ہے؟',
    registerLink: 'یہاں رجسٹر کریں',
    haveAccountPrompt: 'پہلے سے اکاؤنٹ موجود ہے؟',
    loginLink: 'یہاں سائن ان کریں',
    pinMismatch: 'پن کی تصدیق مماثل نہیں ہے!',
    pinMinLength: 'پن کم از کم 6 ہندسوں کا ہونا چاہیے!',
    googleSuccess: 'Google سے کامیابی سے سائن ان ہو گیا!',
  },
  ja: {
    subtitleLogin: '店舗の資金金庫と分割払い管理にログイン',
    subtitleRegister: '誠実な財務管理を始めるためにアカウントを作成',
    tabLogin: 'ログイン',
    tabRegister: '新規店舗登録',
    googleContinue: 'Googleで続ける (1クリック)',
    orUseEmail: 'またはメールアドレスを使用',
    storeNameLabel: '屋号 / 店舗名 / オーナー名',
    storeNamePlaceholder: '例: 誠実商店',
    emailLabel: '店舗メールアドレス',
    emailPlaceholder: 'store@email.com',
    pinLabel: 'セキュリティPINコード (6桁)',
    pinHint: '6桁以上の数字または文字',
    confirmPinLabel: 'PINコード確認',
    submitLogin: '店舗にログイン',
    submitRegister: '新規店舗アカウント登録',
    processing: '金庫を処理中...',
    noAccountPrompt: 'アカウントをお持ちでないですか？',
    registerLink: '新規登録はこちら',
    haveAccountPrompt: 'すでにアカウントをお持ちですか？',
    loginLink: 'ログインはこちら',
    pinMismatch: 'PINコードが一致しません！',
    pinMinLength: 'PINコードは6文字以上必要です！',
    googleSuccess: 'Googleログインに成功しました！',
  },
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { email: string; name: string; token: string }) => void;
  initialMode?: 'login' | 'register';
  language?: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
  language = 'id',
}) => {
  const at = AUTH_TRANSLATIONS[language] || AUTH_TRANSLATIONS.en;
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_pin'>(initialMode);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [otpCode, setOtpCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setForgotStep('request');
      setOtpCode('');
      setNewPin('');
      setConfirmNewPin('');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, initialMode]);

  // Handle Response Credential resmi dari Google
  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response || !response.credential) return;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'google',
          googleToken: response.credential,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.token) localStorage.setItem('titenfin_auth_token', data.token);
        if (data.user?.email) localStorage.setItem('titenfin_user_email', data.user.email);
        setSuccessMessage(at.googleSuccess);
        setTimeout(() => {
          setIsLoading(false);
          onAuthSuccess({
            email: data.user.email,
            name: data.user.name,
            token: data.token,
          });
          onClose();
        }, 500);
      } else {
        setErrorMessage(data.error || 'Authentication error');
        setIsLoading(false);
      }
    } catch {
      setErrorMessage('Connection error during authentication.');
      setIsLoading(false);
    }
  };

  // Inisialisasi Google Identity Services saat modal terbuka
  useEffect(() => {
    if (!isOpen) return;

    const setupGoogleGsi = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const btnElement = document.getElementById('google-btn-container');
          if (btnElement) {
            btnElement.innerHTML = '';
            (window as any).google.accounts.id.renderButton(btnElement, {
              theme: 'outline',
              size: 'large',
              width: 380,
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            });
          }
        } catch (e) {
          console.warn('Google GSI render error', e);
        }
      }
    };

    if ((window as any).google?.accounts?.id) {
      setupGoogleGsi();
    } else {
      const timer = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(timer);
          setupGoogleGsi();
        }
      }, 250);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'register' && pin !== confirmPin) {
      setErrorMessage(at.pinMismatch);
      return;
    }

    if (pin.length < 6) {
      setErrorMessage(at.pinMinLength);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mode,
          email,
          pin,
          name: mode === 'register' ? name : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Gagal memproses autentikasi');
        setIsLoading(false);
        return;
      }

      setSuccessMessage(data.message || 'Berhasil!');
      if (data.token) {
        localStorage.setItem('titenfin_auth_token', data.token);
      }
      if (data.user?.email) {
        localStorage.setItem('titenfin_user_email', data.user.email);
      }

      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess({
          email: data.user.email,
          name: data.user.name,
          token: data.token,
        });
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan jaringan.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt();
    }
  };

  // Handler Kirim Kode OTP Pemulihan PIN
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage(at.emailLabel + ' wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_otp',
          email,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setForgotStep('verify');
        setSuccessMessage(data.message || 'Kode OTP 6-digit telah dikirim ke email Anda.');
      } else {
        setErrorMessage(data.error || 'Gagal mengirim kode OTP.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Terjadi gangguan jaringan saat meminta kode OTP.');
    }
  };

  // Handler Verifikasi OTP & Simpan PIN Baru
  const handleVerifyAndResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPin !== confirmNewPin) {
      setErrorMessage(at.pinMismatch);
      return;
    }

    if (newPin.length < 6) {
      setErrorMessage(at.pinMinLength);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_and_reset',
          email,
          otp: otpCode,
          newPin,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.token) localStorage.setItem('titenfin_auth_token', data.token);
        if (data.user?.email) localStorage.setItem('titenfin_user_email', data.user.email);
        setSuccessMessage(data.message || 'PIN baru berhasil disimpan!');
        setTimeout(() => {
          setIsLoading(false);
          onAuthSuccess({
            email: data.user.email,
            name: data.user.name,
            token: data.token,
          });
          onClose();
        }, 800);
      } else {
        setIsLoading(false);
        setErrorMessage(data.error || 'Gagal mereset PIN.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Terjadi gangguan jaringan saat memverifikasi OTP.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Visual */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white px-6 pt-7 pb-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
              <Logo size={42} color="#10b981" />
            </div>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            Titen<span className="text-emerald-400">Fin</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Cloud
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {mode === 'forgot_pin'
              ? (at.forgotPinTitle || 'Pemulihan PIN Keamanan')
              : mode === 'login'
              ? at.subtitleLogin
              : at.subtitleRegister}
          </p>

          {/* Tab Switcher / Forgot PIN Header */}
          {mode === 'forgot_pin' ? (
            <div className="flex items-center justify-between mt-4 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{at.forgotPinTitle || 'Pemulihan PIN'}</div>
                  <div className="text-[10px] text-slate-300">
                    {forgotStep === 'request'
                      ? (at.forgotPinDesc || 'Masukkan email toko untuk menerima kode OTP')
                      : `${at.otpSentNotice || 'Kode OTP dikirim ke'} ${email}`}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 shrink-0 px-2 py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{at.backToLogin || 'Masuk'}</span>
              </button>
            </div>
          ) : (
            <div className="flex bg-slate-800/80 p-1 rounded-xl mt-5 border border-slate-700/60 text-xs font-bold">
              <button
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {at.tabLogin}
              </button>
              <button
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {at.tabRegister}
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Error & Success Alert */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {mode === 'forgot_pin' ? (
            /* =====================================
               TAMPILAN PEMULIHAN PIN (LUPA PIN)
               ===================================== */
            forgotStep === 'request' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {at.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={at.emailPlaceholder}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    {at.forgotPinDesc || 'Kode OTP 6-digit akan dikirimkan ke email ini untuk memverifikasi kepemilikan akun toko Anda.'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>{at.processing}</span>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>{at.sendOtpBtn || 'Kirim Kode OTP (6 Digit)'}</span>
                    </>
                  )}
                </button>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{at.backToLogin || 'Kembali ke Halaman Masuk'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndResetPin} className="space-y-3.5">
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div>{at.otpSentNotice || 'Kode OTP telah dikirim ke:'} <strong>{email}</strong></div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">Kode berlaku selama 10 menit. Periksa inbox atau folder spam Anda.</div>
                  </div>
                </div>

                {/* Input OTP */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {at.otpLabel || 'Kode OTP (6 Digit)'}
                    </label>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={isLoading}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{at.resendOtp || 'Kirim Ulang'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold font-mono tracking-[0.5em] text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                  />
                </div>

                {/* PIN Baru */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {at.newPinLabel || 'PIN Baru (Minimal 6 Digit)'}
                    </label>
                    <span className="text-[10px] text-slate-400">{at.pinHint}</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      maxLength={12}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 tracking-widest focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Konfirmasi PIN Baru */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {at.confirmNewPinLabel || 'Ulangi PIN Baru'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      maxLength={12}
                      value={confirmNewPin}
                      onChange={(e) => setConfirmNewPin(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 tracking-widest focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>{at.processing}</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{at.saveNewPinBtn || 'Simpan PIN & Buka Toko'}</span>
                    </>
                  )}
                </button>

                <div className="pt-2 border-t border-slate-100 text-center flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('request');
                      setErrorMessage('');
                    }}
                    className="text-slate-500 hover:text-slate-700 font-semibold"
                  >
                    Ganti Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{at.backToLogin || 'Kembali'}</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            /* =====================================
               TAMPILAN LOGIN / REGISTER REGULER
               ===================================== */
            <>
              {/* 1-CLICK GOOGLE LOGIN BUTTON */}
              <div id="google-btn-container" className="w-full flex justify-center min-h-[44px]">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-300 hover:border-slate-400 rounded-xl text-xs flex items-center justify-center gap-3 shadow-xs transition hover:scale-[1.01] active:scale-[0.99]"
                >
                  {/* Google Logo SVG */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{at.googleContinue}</span>
                </button>
              </div>

              {/* Separator */}
              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {at.orUseEmail}
                </span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* Form Email & PIN */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {at.storeNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={at.storeNamePlaceholder}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {at.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={at.emailPlaceholder}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {at.pinLabel}
                    </label>
                    {mode === 'login' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot_pin');
                          setForgotStep('request');
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition"
                      >
                        {at.forgotPin || 'Lupa PIN?'}
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">{at.pinHint}</span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      maxLength={12}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 tracking-widest focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {at.confirmPinLabel}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPin ? 'text' : 'password'}
                        required
                        maxLength={12}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        placeholder="••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 tracking-widest focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>{at.processing}</span>
                  ) : (
                    <>
                      <span>{mode === 'login' ? at.submitLogin : at.submitRegister}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Switching Hint */}
              <div className="text-center pt-2">
                {mode === 'login' ? (
                  <p className="text-xs text-slate-500">
                    {at.noAccountPrompt}{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setErrorMessage('');
                      }}
                      className="font-bold text-emerald-600 hover:text-emerald-700 underline"
                    >
                      {at.registerLink}
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    {at.haveAccountPrompt}{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrorMessage('');
                      }}
                      className="font-bold text-emerald-600 hover:text-emerald-700 underline"
                    >
                      {at.loginLink}
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
