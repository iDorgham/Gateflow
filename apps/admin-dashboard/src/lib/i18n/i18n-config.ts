export const i18n = {
  defaultLocale: 'en' as const,
  locales: ['en', 'ar-EG'] as const,
};

export type Locale = (typeof i18n)['locales'][number];

export const LOCALE_COOKIE = 'gf_locale';

export function isRtl(locale: Locale): boolean {
  return locale === 'ar-EG';
}
