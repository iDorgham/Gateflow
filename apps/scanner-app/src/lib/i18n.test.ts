import { describe, it, expect } from '@jest/globals';
import { getScannerTranslations, TRANSLATIONS } from './i18n';

describe('i18n.ts (Scanner Translations)', () => {
  it('returns English translations by default', () => {
    const t = getScannerTranslations();
    expect(t.tabs.home).toBe('Home');
    expect(t.tabs.scanner).toBe('Scan');
    expect(t.topBar.selectGate).toBe('Select Gate');
    expect(t.scanner.header).toBe('GateFlow Scanner');
  });

  it('returns Arabic translations when requested', () => {
    const t = getScannerTranslations('ar');
    expect(t.tabs.home).toBe('الرئيسية');
    expect(t.tabs.scanner).toBe('المسح');
    expect(t.topBar.selectGate).toBe('اختر البوابة');
    expect(t.scanner.header).toBe('ماسح جيت فلو');
    expect(t.status.online).toBe('متصل');
  });

  it('falls back to English when given an invalid locale', () => {
    const t = getScannerTranslations('fr' as any);
    expect(t.tabs.home).toBe('Home');
  });

  it('has identical keys in English and Arabic dictionaries', () => {
    const enKeys = Object.keys(TRANSLATIONS.en).sort();
    const arKeys = Object.keys(TRANSLATIONS.ar).sort();
    expect(enKeys).toEqual(arKeys);

    const enTabKeys = Object.keys(TRANSLATIONS.en.tabs).sort();
    const arTabKeys = Object.keys(TRANSLATIONS.ar.tabs).sort();
    expect(enTabKeys).toEqual(arTabKeys);
  });
});
