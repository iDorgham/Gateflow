import 'server-only';
import type { Locale } from './i18n-config';

// We enumerate all dictionaries here for better linting and typescript support
// We also use the public folder or relative paths to the package
const dictionaries = {
  en: () => import('../../packages/i18n/src/locales/en.json').then((module) => module.default),
  'ar-EG': () => import('../../packages/i18n/src/locales/ar-EG.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();
