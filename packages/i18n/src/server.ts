import { Locale } from './config';

const dictionaries = {
  en: () => import('./locales/en.json').then((module) => module.default),
  'ar-EG': () => import('./locales/ar-EG.json').then((module) => module.default),
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
  const dict = (fullDict as any)[namespace] || {};

  const t = (key: string, options?: { returnObjects?: boolean, [key: string]: any }): any => {
    const text = key.split('.').reduce((obj, k) => (obj || {})[k], dict);

    let result = text;
    if (options && options.count !== undefined && text && typeof text === 'object' && !Array.isArray(text)) {
       if (options.count === 1 && text.one) result = text.one;
       else if (text.other) result = text.other;
    }

    if (!result) return options?.defaultValue ?? key;
    if (typeof result !== 'string' && !options?.returnObjects) return options?.defaultValue ?? key;

    let finalStr = result;
    if (options && typeof finalStr === 'string') {
      Object.keys(options).forEach((v) => {
        if (v !== 'returnObjects' && v !== 'defaultValue') {
          finalStr = finalStr.replace(new RegExp(`{{${v}}}`, 'g'), String(options[v]));
        }
      });
    }
    return finalStr;
  };

  return { t, dict };
}
