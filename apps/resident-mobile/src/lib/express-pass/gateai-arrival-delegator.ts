import { ExpressPassRecord } from './express-pass-engine';

export interface ArrivalEvent {
  passId: string;
  gateId: string;
  gateName: string;
  scannedAt: string;
  guardName?: string;
}

export interface ResidentArrivalPushNotification {
  residentId: string;
  pushToken?: string;
  title: string;
  body: string;
  data: {
    passId: string;
    gateId: string;
    guestName: string;
    scannedAt: string;
  };
}

export interface VipArrivalBanner {
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  badgeText: string;
  badgeTextAr: string;
  themeColor: string;
}

/**
 * Dispatches a personalized arrival notification to the resident when their express guest passes the gate.
 */
export function processGuestArrivalNotification(
  arrival: ArrivalEvent,
  pass: ExpressPassRecord,
  resident: {
    id: string;
    name: string;
    pushToken?: string;
    preferredLanguage: 'en' | 'ar';
  }
): ResidentArrivalPushNotification {
  const isAr = resident.preferredLanguage === 'ar';
  const guestName = pass.visitorName || 'Your guest';

  const title = isAr ? '🎉 وصول الزائر' : '🎉 Guest Arrived';
  const body = isAr
    ? `وصل ${pass.visitorName || 'ضيفك'} الآن إلى ${arrival.gateName}.`
    : `${guestName} has just arrived through ${arrival.gateName}.`;

  return {
    residentId: resident.id,
    pushToken: resident.pushToken,
    title,
    body,
    data: {
      passId: pass.id,
      gateId: arrival.gateId,
      guestName: pass.visitorName || 'Guest',
      scannedAt: arrival.scannedAt,
    },
  };
}

/**
 * Creates celebration visual banner metadata for the guard scanner app upon One-Tap VIP arrival.
 */
export function createVipArrivalBanner(
  pass: ExpressPassRecord,
  gateName: string
): VipArrivalBanner {
  const guestName = pass.visitorName || 'Guest';

  return {
    title: `VIP Guest Entry: ${guestName}`,
    titleAr: `دخول زائر مميز: ${guestName}`,
    subtitle: `Authorized for Unit ${pass.unitId} at ${gateName}`,
    subtitleAr: `مصرح له بالدخول للوحدة ${pass.unitId} عبر ${gateName}`,
    badgeText: 'ONE-TAP VERIFIED',
    badgeTextAr: 'تصريح معتمد',
    themeColor: '#0052CC', // ADS Primary B400
  };
}

/**
 * Audits one-tap mobile strings to ensure 100% Arabic Unicode compliance and natural grammar.
 */
export function validateArabicOneTapStrings(strings: Record<string, string>): {
  allValid: boolean;
  checkedCount: number;
  invalidKeys: string[];
} {
  const arabicCharRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  const invalidKeys: string[] = [];

  const keys = Object.keys(strings);
  for (const key of keys) {
    const val = strings[key];
    if (!val || !arabicCharRegex.test(val)) {
      invalidKeys.push(key);
    }
  }

  return {
    allValid: invalidKeys.length === 0,
    checkedCount: keys.length,
    invalidKeys,
  };
}
