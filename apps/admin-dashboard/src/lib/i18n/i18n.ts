import 'server-only';

export { i18n, LOCALE_COOKIE, isRtl, type Locale } from './i18n-config';
export { fetchTranslations, getTranslation } from '@gate-access/i18n/server';
