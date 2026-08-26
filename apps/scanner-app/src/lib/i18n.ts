/**
 * i18n.ts
 *
 * Dedicated internationalization catalog and translation helpers for GateFlow Scanner.
 * Supports dynamic English (en) and Arabic (ar-EG) switching with RTL layout helpers.
 */

export type SupportedLocale = 'en' | 'ar';

export interface ScannerTranslations {
  tabs: {
    home: string;
    scanner: string;
    today: string;
    log: string;
    chat: string;
    settings: string;
  };
  topBar: {
    selectGate: string;
    startShift: string;
    endShift: string;
    queue: string;
    signOut: string;
    pleaseWait: string;
  };
  scanner: {
    header: string;
    selectGateHint: string;
    startShiftHint: string;
    onDutyHint: string;
    verifying: string;
    pass: string;
    deny: string;
    scanAgain: string;
    cameraRequired: string;
    grantPermission: string;
    override: string;
    reportIssue: string;
  };
  status: {
    online: string;
    offline: string;
    allNormal: string;
    syncIssue: string;
    syncIssues: string;
  };
}

export const TRANSLATIONS: Record<SupportedLocale, ScannerTranslations> = {
  en: {
    tabs: {
      home: 'Home',
      scanner: 'Scan',
      today: 'Today',
      log: 'Log',
      chat: 'Chat',
      settings: 'Settings',
    },
    topBar: {
      selectGate: 'Select Gate',
      startShift: 'Start Shift',
      endShift: 'End Shift',
      queue: 'Queue',
      signOut: 'Sign out',
      pleaseWait: 'Please wait',
    },
    scanner: {
      header: 'GateFlow Scanner',
      selectGateHint: 'Select a gate to begin scanning',
      startShiftHint: 'Start your shift to unlock scanning',
      onDutyHint: 'On duty',
      verifying: 'Verifying…',
      pass: 'Pass Entry',
      deny: 'Deny Entry',
      scanAgain: 'Scan Again',
      cameraRequired: 'Camera Access Required',
      grantPermission: 'Grant Permission',
      override: 'Request Override',
      reportIssue: 'Report Issue',
    },
    status: {
      online: 'Online',
      offline: 'Offline',
      allNormal: 'All systems normal',
      syncIssue: '1 sync issue',
      syncIssues: '{{count}} sync issues',
    },
  },
  ar: {
    tabs: {
      home: 'الرئيسية',
      scanner: 'المسح',
      today: 'اليوم',
      log: 'السجل',
      chat: 'المحادثة',
      settings: 'الإعدادات',
    },
    topBar: {
      selectGate: 'اختر البوابة',
      startShift: 'بدء الوردية',
      endShift: 'إنهاء الوردية',
      queue: 'قائمة المزامنة',
      signOut: 'تسجيل الخروج',
      pleaseWait: 'يرجى الانتظار',
    },
    scanner: {
      header: 'ماسح جيت فلو',
      selectGateHint: 'اختر بوابة للبدء بالمسح',
      startShiftHint: 'ابدأ ورديتك لتمكين المسح',
      onDutyHint: 'في الخدمة',
      verifying: 'جارٍ التحقق…',
      pass: 'سماح بالدخول',
      deny: 'رفض الدخول',
      scanAgain: 'مسح مجدداً',
      cameraRequired: 'مطلوب إذن الكاميرا',
      grantPermission: 'منح الإذن',
      override: 'طلب تجاوز مشرف',
      reportIssue: 'إبلاغ عن عطل',
    },
    status: {
      online: 'متصل',
      offline: 'غير متصل',
      allNormal: 'جميع الأنظمة تعمل بشكل طبيعي',
      syncIssue: 'مشكلة مزامنة واحدة',
      syncIssues: '{{count}} مشكلات مزامنة',
    },
  },
};

export function getScannerTranslations(
  locale: SupportedLocale = 'en'
): ScannerTranslations {
  return TRANSLATIONS[locale] ?? TRANSLATIONS.en;
}
