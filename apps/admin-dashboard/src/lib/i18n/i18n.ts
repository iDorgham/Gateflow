import 'server-only';
import { Locale, i18n, LOCALE_COOKIE, isRtl } from './i18n-config';

export { i18n, LOCALE_COOKIE, isRtl };
export type { Locale };

export type TranslationFunction = (
  key: string,
  options?: { returnObjects?: boolean; [key: string]: any }
) => any;

const dictionaries = {
  en: () => import('@gate-access/i18n/en').then((module) => module.default),
  'ar-EG': () => import('@gate-access/i18n/ar').then((module) => module.default),
};

export const fetchTranslations = async (locale: string) => {
  try {
    return await dictionaries[locale as Locale]();
  } catch (error) {
    return await dictionaries['en']();
  }
};

export async function getTranslation(locale: Locale, namespace: string) {
  const fullDict = await fetchTranslations(locale);
  const dict = (fullDict as Record<string, any>)[namespace] || {};

  const t: TranslationFunction = (key, options) => {
    let text = key.split('.').reduce((obj, k) => (obj || {})[k], dict);
    
    if (options && options.count !== undefined && text && typeof text === 'object' && !Array.isArray(text)) {
       if (options.count === 1 && text.one) text = text.one;
       else if (text.other) text = text.other;
    }

    if (!text) return key; 
    if (typeof text !== 'string' && !options?.returnObjects) return key;

    if (options && typeof text === 'string') {
      Object.keys(options).forEach((v) => {
        if (v !== 'returnObjects') {
          text = text.replace(new RegExp(`{{${v}}}`, 'g'), String(options[v]));
        }
      });
    }
    return text;
  };

  return { t, dict };
}
