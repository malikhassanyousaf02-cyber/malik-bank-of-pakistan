import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

const STR = {
  en: {
    appName: 'Malik Bank of Pakistan',
    signInSub: 'Sign in to your account',
    registerSub: 'Create your account',
    fullName: 'Full name',
    cnic: 'CNIC (13 digits, no dashes)',
    mobile: 'Mobile number',
    password: 'Password',
    passwordHint: 'At least 8 characters',
    confirmPw: 'Confirm password',
    signIn: 'Sign in',
    createAccount: 'Create account',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    register: 'Register',
    pwMismatch: 'Passwords do not match',
    verifyNote: 'CNIC verification stays pending after you register.',
    tab_home: 'Home', tab_history: 'History', tab_exchange: 'Exchange', tab_insurance: 'Insurance', tab_profile: 'Profile',
    welcome: 'Welcome back',
    available: 'Available balance',
    account: 'Account',
    send: 'Send', bills: 'Bills',
    pending: 'CNIC verification pending',
    pendingSub: 'Your CNIC has not been verified yet.',
    recent: 'Recent transactions',
    noTx: 'No transactions yet.',
    seeAll: 'See all',
    txHistory: 'Transaction history',
    welcomeBonus: 'Welcome bonus',
    transferTo: 'Transfer to {name}',
    receivedFrom: 'Received from {name}',
    insurancePremium: 'Insurance premium: {name}',
    billPaid: '{company} bill ({no})',
    exchangeLabel: 'Exchange',
    sendMoney: 'Send money',
    receiverMobile: "Receiver's mobile number",
    amountPkr: 'Amount (PKR)',
    noteOpt: 'Note (optional)',
    back: 'Back',
    sentOk: 'Rs. {amount} sent successfully',
    billPayment: 'Bill payment',
    consumerNo: 'Consumer / reference number',
    payBill: 'Pay bill',
    billOk: 'Bill paid successfully',
    co_Electricity: 'Electricity', co_Gas: 'Gas', co_Water: 'Water', co_Internet: 'Internet', 'co_Mobile Load': 'Mobile load', co_Education: 'Education',
    currencyExchange: 'Currency exchange',
    youGive: 'You give', youGet: 'You get',
    balance: 'Balance',
    marketRate: 'Market rate', ourRate: 'Our rate',
    youWillReceive: 'You will receive',
    doExchange: 'Exchange',
    exchangeOk: 'Exchange completed',
    chooseCurrency: 'Choose currency',
    search: 'Search (USD, EUR, AED...)',
    close: 'Close',
    ratesLive: 'Live rates', ratesApprox: 'Approximate rates',
    amountIn: 'Amount ({cur})',
    insuranceTitle: 'Insurance',
    insuranceSub: 'Plans from Rs. 1,000 to Rs. 10 lakh, for everyone.',
    premium: 'Premium', cover: 'Cover',
    join: 'Join plan', joined: 'Joined',
    joinTitle: 'Join this plan',
    payJoin: 'Pay & join',
    cancel: 'Cancel',
    myInsurance: 'My insurance',
    joinOk: 'You have joined {name}',
    paid: 'Paid',
    pname_1: 'Basic Plan', pname_2: 'Family Plan', pname_3: 'Plus Plan', pname_4: 'Premium Plan', pname_5: 'Platinum Plan',
    plan_1: 'Basic cover for accidents and minor illness',
    plan_2: 'Health cover for the whole family',
    plan_3: 'Hospital, surgery and ambulance cover',
    plan_4: 'Large life, health and accident cover',
    plan_5: 'Our biggest cover, the Rs. 10 lakh premium plan',
    profileTitle: 'Profile',
    name: 'Name', cnicLabel: 'CNIC', mobileLabel: 'Mobile',
    accountNo: 'Account number',
    cnicVerification: 'CNIC verification',
    verified: 'Verified', pendingShort: 'Pending',
    memberSince: 'Member since',
    accounts: 'Accounts',
    language: 'Language',
    signOut: 'Sign out',
    footer: 'Portfolio project, not a licensed bank.',
  },
  ur: {
    appName: 'ملک بینک آف پاکستان',
    signInSub: 'اپنے اکاؤنٹ میں سائن ان کریں',
    registerSub: 'نیا اکاؤنٹ بنائیں',
    fullName: 'پورا نام',
    cnic: 'شناختی کارڈ نمبر (13 ہندسے، بغیر ڈیش)',
    mobile: 'موبائل نمبر',
    password: 'پاسورڈ',
    passwordHint: 'کم از کم 8 حروف',
    confirmPw: 'پاسورڈ دوبارہ لکھیں',
    signIn: 'سائن ان',
    createAccount: 'اکاؤنٹ بنائیں',
    noAccount: 'اکاؤنٹ نہیں ہے؟',
    haveAccount: 'پہلے سے اکاؤنٹ ہے؟',
    register: 'رجسٹر کریں',
    pwMismatch: 'دونوں پاسورڈ ایک جیسے لکھیں',
    verifyNote: 'رجسٹریشن کے بعد شناختی کارڈ کی تصدیق زیر التوا رہے گی۔',
    tab_home: 'ہوم', tab_history: 'ہسٹری', tab_exchange: 'ایکسچینج', tab_insurance: 'انشورنس', tab_profile: 'پروفائل',
    welcome: 'خوش آمدید',
    available: 'دستیاب بیلنس',
    account: 'اکاؤنٹ',
    send: 'بھیجیں', bills: 'بلز',
    pending: 'شناختی کارڈ کی تصدیق زیر التوا',
    pendingSub: 'آپ کے شناختی کارڈ کی تصدیق ابھی نہیں ہوئی۔',
    recent: 'حالیہ لین دین',
    noTx: 'ابھی کوئی لین دین نہیں۔',
    seeAll: 'سب دیکھیں',
    txHistory: 'لین دین کی ہسٹری',
    welcomeBonus: 'ویلکم بونس',
    transferTo: '{name} کو ٹرانسفر',
    receivedFrom: '{name} سے موصول',
    insurancePremium: 'انشورنس پریمیم: {name}',
    billPaid: '{company} بل ({no})',
    exchangeLabel: 'کرنسی ایکسچینج',
    sendMoney: 'رقم بھیجیں',
    receiverMobile: 'وصول کنندہ کا موبائل نمبر',
    amountPkr: 'رقم (PKR)',
    noteOpt: 'نوٹ (اختیاری)',
    back: 'واپس',
    sentOk: '{amount} روپے کامیابی سے بھیج دیے گئے',
    billPayment: 'بل کی ادائیگی',
    consumerNo: 'کنزیومر / ریفرنس نمبر',
    payBill: 'بل ادا کریں',
    billOk: 'بل کامیابی سے ادا ہو گیا',
    co_Electricity: 'بجلی', co_Gas: 'گیس', co_Water: 'پانی', co_Internet: 'انٹرنیٹ', 'co_Mobile Load': 'موبائل لوڈ', co_Education: 'تعلیم',
    currencyExchange: 'کرنسی ایکسچینج',
    youGive: 'آپ دیتے ہیں', youGet: 'آپ لیتے ہیں',
    balance: 'بیلنس',
    marketRate: 'مارکیٹ ریٹ', ourRate: 'ہمارا ریٹ',
    youWillReceive: 'آپ کو ملیں گے',
    doExchange: 'ایکسچینج کریں',
    exchangeOk: 'ایکسچینج مکمل ہو گیا',
    chooseCurrency: 'کرنسی منتخب کریں',
    search: 'تلاش کریں (USD, EUR, AED...)',
    close: 'بند کریں',
    ratesLive: 'لائیو ریٹس', ratesApprox: 'تقریبی ریٹس',
    amountIn: 'رقم ({cur})',
    insuranceTitle: 'انشورنس',
    insuranceSub: 'ہر ایک کے لیے پلانز، 1,000 روپے سے 10 لاکھ روپے تک۔',
    premium: 'پریمیم', cover: 'کوریج',
    join: 'پلان میں شامل ہوں', joined: 'شامل ہیں',
    joinTitle: 'اس پلان میں شامل ہوں',
    payJoin: 'ادائیگی کریں اور شامل ہوں',
    cancel: 'منسوخ',
    myInsurance: 'میری انشورنس',
    joinOk: 'آپ {name} میں شامل ہو گئے',
    paid: 'ادا شدہ',
    pname_1: 'بنیادی پلان', pname_2: 'فیملی پلان', pname_3: 'پلس پلان', pname_4: 'پریمیم پلان', pname_5: 'پلاٹینم پلان',
    plan_1: 'حادثات اور معمولی بیماری کا بنیادی کور',
    plan_2: 'پورے خاندان کے لیے ہیلتھ کور',
    plan_3: 'ہسپتال، سرجری اور ایمبولینس کور',
    plan_4: 'لائف، ہیلتھ اور حادثے کا بڑا کور',
    plan_5: 'ہمارا سب سے بڑا کور، 10 لاکھ روپے پریمیم والا پلان',
    profileTitle: 'پروفائل',
    name: 'نام', cnicLabel: 'شناختی کارڈ', mobileLabel: 'موبائل',
    accountNo: 'اکاؤنٹ نمبر',
    cnicVerification: 'شناختی کارڈ کی تصدیق',
    verified: 'تصدیق شدہ', pendingShort: 'زیر التوا',
    memberSince: 'ممبر بننے کی تاریخ',
    accounts: 'اکاؤنٹس',
    language: 'زبان',
    signOut: 'سائن آؤٹ',
    footer: 'یہ پورٹ فولیو پراجیکٹ ہے، لائسنس یافتہ بینک نہیں۔',
  },
};

// Server ke messages -> [English, Urdu]
const SERVER = {
  'NETWORK': ['Cannot reach the server. Check your internet or IP address.', 'سرور سے رابطہ نہیں ہو رہا۔ انٹرنیٹ یا آئی پی ایڈریس چیک کریں۔'],
  'GENERIC': ['Something went wrong', 'کچھ غلط ہو گیا'],
  'Login required': ['Please sign in', 'براہ کرم سائن ان کریں'],
  'Session expired. Dobara login karein': ['Session expired. Please sign in again.', 'سیشن ختم ہو گیا۔ دوبارہ سائن ان کریں۔'],
  'Bohat zyada koshishein. Thori der baad try karein': ['Too many attempts. Please try again later.', 'بہت زیادہ کوششیں۔ کچھ دیر بعد دوبارہ کوشش کریں۔'],
  'Amount sahi likhein': ['Enter a valid amount', 'درست رقم لکھیں'],
  'Amount zero se zyada hona chahiye': ['Amount must be greater than zero', 'رقم صفر سے زیادہ ہونی چاہیے'],
  'Amount limit se zyada hai': ['Amount is over the limit', 'رقم حد سے زیادہ ہے'],
  'Balance kaafi nahi hai': ['Insufficient balance', 'بیلنس کافی نہیں ہے'],
  'Currency available nahi hai': ['Currency not available', 'یہ کرنسی دستیاب نہیں'],
  'Method not allowed': ['Method not allowed', 'یہ عمل اجازت شدہ نہیں'],
  'Poora naam likhein': ['Enter your full name', 'اپنا پورا نام لکھیں'],
  'CNIC 13 digits ka hona chahiye': ['CNIC must be 13 digits', 'شناختی کارڈ نمبر 13 ہندسوں کا ہونا چاہیے'],
  'Phone number sahi likhein (03XXXXXXXXX)': ['Enter a valid mobile number (03XXXXXXXXX)', 'درست موبائل نمبر لکھیں (03XXXXXXXXX)'],
  'Password kam az kam 8 characters, harf aur number ke saath': ['Password needs 8+ characters with letters and numbers', 'پاسورڈ کم از کم 8 حروف کا ہو، حروف اور ہندسوں کے ساتھ'],
  'CNIC ya phone pehle se registered hai': ['CNIC or mobile number is already registered', 'شناختی کارڈ یا موبائل نمبر پہلے سے رجسٹرڈ ہے'],
  'CNIC ya password galat hai': ['Wrong CNIC or password', 'شناختی کارڈ یا پاسورڈ غلط ہے'],
  'User nahi mila': ['User not found', 'صارف نہیں ملا'],
  'Is number par koi account nahi mila': ['No account found for this number', 'اس نمبر پر کوئی اکاؤنٹ نہیں ملا'],
  'Apne aap ko paise nahi bhej sakte': ['You cannot send money to yourself', 'آپ خود کو رقم نہیں بھیج سکتے'],
  'Company chunein': ['Choose a company', 'کمپنی منتخب کریں'],
  'Consumer number sahi likhein': ['Enter a valid consumer number', 'درست کنزیومر نمبر لکھیں'],
  'Plan nahi mila': ['Plan not found', 'پلان نہیں ملا'],
  'Aap is plan mein pehle se shamil hain': ['You have already joined this plan', 'آپ اس پلان میں پہلے سے شامل ہیں'],
  'Currency sahi chunein': ['Choose valid currencies', 'درست کرنسی منتخب کریں'],
  'Dono currency alag honi chahiye': ['Choose two different currencies', 'دو مختلف کرنسیاں منتخب کریں'],
  'Amount bohat chhota hai': ['Amount is too small', 'رقم بہت کم ہے'],
};

const Ctx = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('lang')
      .then((v) => { if (v === 'ur' || v === 'en') setLangState(v); })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const setLang = useCallback(async (l) => {
    setLangState(l);
    try { await SecureStore.setItemAsync('lang', l); } catch (e) {}
  }, []);

  const t = (key, vars) => {
    let s = (STR[lang] && STR[lang][key]) || STR.en[key] || key;
    if (vars) Object.keys(vars).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  };
  const tr = (msg) => {
    const e = SERVER[msg];
    return e ? (lang === 'ur' ? e[1] : e[0]) : msg;
  };

  if (!ready) return null;
  return <Ctx.Provider value={{ lang, setLang, t, tr, isRTL: lang === 'ur' }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);

const PLAN_ID_BY_NAME = { 'Suraksha Basic': 1, 'Suraksha Family': 2, 'Suraksha Plus': 3, 'Suraksha Premium': 4, 'Suraksha Platinum': 5 };

// Database ka plan naam -> current language ka naam
export function planName(name, t) {
  const id = PLAN_ID_BY_NAME[name];
  return id ? t('pname_' + id) : name;
}

// Transaction ka note (database mein English) ko current language mein dikhata hai
export function txLabel(tx, t) {
  const n = tx.note || '';
  let m;
  if (/^Welcome bonus/.test(n)) return t('welcomeBonus');
  if ((m = n.match(/^Transfer to (.+?)(?: - (.*))?$/))) return t('transferTo', { name: m[1] }) + (m[2] ? ' - ' + m[2] : '');
  if ((m = n.match(/^Received from (.+?)(?: - (.*))?$/))) return t('receivedFrom', { name: m[1] }) + (m[2] ? ' - ' + m[2] : '');
  if ((m = n.match(/^Insurance premium: (.+)$/))) return t('insurancePremium', { name: planName(m[1], t) });
  if ((m = n.match(/^(.+) bill \((.+)\)$/))) {
    const key = 'co_' + m[1];
    const co = STR.en[key] ? t(key) : m[1];
    return t('billPaid', { company: co, no: m[2] });
  }
  if (String(tx.type).indexOf('exchange') === 0) return t('exchangeLabel') + ': ' + n;
  return n;
}
