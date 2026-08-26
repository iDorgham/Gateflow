import { getBiometricStrings } from './biometrics-i18n';

describe('biometrics-i18n', () => {
  it('returns default English strings', () => {
    const strings = getBiometricStrings('en');
    expect(strings.promptTitle).toBe('Guard Identity Verification');
    expect(strings.cancelButton).toBe('Cancel');
    expect(strings.fallbackPinButton).toBe('Use Master PIN');
  });

  it('customizes English strings for Face ID', () => {
    const strings = getBiometricStrings('en', 'FACIAL_RECOGNITION');
    expect(strings.promptSubtitle).toContain('Face ID');
  });

  it('customizes English strings for Fingerprint', () => {
    const strings = getBiometricStrings('en', 'FINGERPRINT');
    expect(strings.promptSubtitle).toContain('Fingerprint');
  });

  it('returns complete Arabic RTL strings', () => {
    const strings = getBiometricStrings('ar');
    expect(strings.promptTitle).toBe('تأكيد هوية الحارس');
    expect(strings.cancelButton).toBe('إلغاء');
    expect(strings.fallbackPinButton).toBe('استخدام رمز PIN');
    expect(strings.lockoutTitle).toBe('تم قفل الحماية مؤقتاً');
  });

  it('customizes Arabic strings for Face ID and Fingerprint', () => {
    const faceStrings = getBiometricStrings('ar', 'FACIAL_RECOGNITION');
    expect(faceStrings.promptSubtitle).toContain('بصمة الوجه');

    const fingerStrings = getBiometricStrings('ar', 'FINGERPRINT');
    expect(fingerStrings.promptSubtitle).toContain('بصمة الإصبع');
  });
});
