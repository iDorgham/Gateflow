import { BiometricAuthType } from './biometrics';

export interface BiometricStrings {
  promptTitle: string;
  promptSubtitle: string;
  cancelButton: string;
  fallbackPinButton: string;
  lockoutTitle: string;
  lockoutMessage: string;
  successConfirmation: string;
  hardwareUnavailable: string;
}

const STRINGS_EN: BiometricStrings = {
  promptTitle: 'Guard Identity Verification',
  promptSubtitle:
    'Please authenticate with biometrics to proceed with scanning.',
  cancelButton: 'Cancel',
  fallbackPinButton: 'Use Master PIN',
  lockoutTitle: 'Security Lockout Active',
  lockoutMessage: 'Too many incorrect attempts. Please wait 60 seconds.',
  successConfirmation: 'Guard identity verified successfully.',
  hardwareUnavailable: 'Biometric hardware unavailable. Please use PIN.',
};

const STRINGS_AR: BiometricStrings = {
  promptTitle: 'تأكيد هوية الحارس',
  promptSubtitle: 'يرجى تأكيد الهوية باستخدام البصمة لمتابعة عمليات المسح.',
  cancelButton: 'إلغاء',
  fallbackPinButton: 'استخدام رمز PIN',
  lockoutTitle: 'تم قفل الحماية مؤقتاً',
  lockoutMessage: 'محاولات خاطئة متكررة. يرجى الانتظار لمدة 60 ثانية.',
  successConfirmation: 'تم تأكيد هوية الحارس بنجاح.',
  hardwareUnavailable: 'المصادقة البيومترية غير متوفرة. يرجى استخدام رمز PIN.',
};

/**
 * Returns localized security strings for biometric verification dialogs.
 */
export function getBiometricStrings(
  locale: 'en' | 'ar' = 'en',
  biometricType: BiometricAuthType = 'NONE'
): BiometricStrings {
  const base = locale === 'ar' ? { ...STRINGS_AR } : { ...STRINGS_EN };

  if (biometricType === 'FACIAL_RECOGNITION') {
    if (locale === 'ar') {
      base.promptSubtitle =
        'يرجى تأكيد الهوية عبر بصمة الوجه لمتابعة عمليات المسح.';
    } else {
      base.promptSubtitle =
        'Please authenticate with Face ID to proceed with scanning.';
    }
  } else if (biometricType === 'FINGERPRINT') {
    if (locale === 'ar') {
      base.promptSubtitle =
        'يرجى تأكيد الهوية عبر بصمة الإصبع لمتابعة عمليات المسح.';
    } else {
      base.promptSubtitle =
        'Please authenticate with Fingerprint to proceed with scanning.';
    }
  }

  return base;
}
