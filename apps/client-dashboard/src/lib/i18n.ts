import 'server-only';
import { Locale, i18n, LOCALE_COOKIE, isRtl } from './i18n-config';
import type en from '@gate-access/i18n/en';

export { i18n, LOCALE_COOKIE, isRtl };
export type { Locale };

export type Dictionary = en;

type PathImpl<T, K extends keyof T> =
  K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

export type Path<T> = PathImpl<T, keyof T> | keyof T;

export type PathValue<T, P extends Path<T>> =
  P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Path<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

const dictionaries = {
  en: () => import('@gate-access/i18n/en').then((module) => module.default as unknown as Dictionary),
  'ar-EG': () => import('@gate-access/i18n/ar').then((module) => module.default as unknown as Dictionary),
};

export const fetchTranslations = async (locale: string): Promise<Dictionary> => {
  try {
    return await dictionaries[locale as Locale]();
  } catch (error) {
    return await dictionaries['en']();
  }
};

export async function getTranslation<N extends keyof Dictionary>(locale: Locale, namespace: N) {
  const fullDict = await fetchTranslations(locale);
  const dict = fullDict[namespace] || ({} as Dictionary[N]);

  const t = <K extends Path<Dictionary[N]>>(key: K, options?: { returnObjects?: boolean, [key: string]: any }): PathValue<Dictionary[N], K> => {
    const text = key.split('.').reduce((obj, k) => (obj || {})[k], dict as any);
    
    let result = text;
    if (options && options.count !== undefined && text && typeof text === 'object' && !Array.isArray(text)) {
       const pluralText = text as Record<string, any>;
       if (options.count === 1 && pluralText.one) result = pluralText.one;
       else if (pluralText.other) result = pluralText.other;
    }

    if (!result) return (options?.defaultValue ?? key) as any;
    if (typeof result !== 'string' && !options?.returnObjects) return (options?.defaultValue ?? key) as any;

    let finalStr = result;
    if (options && typeof finalStr === 'string') {
      Object.keys(options).forEach((v) => {
        if (v !== 'returnObjects' && v !== 'defaultValue') {
          finalStr = finalStr.replace(new RegExp(`{{${v}}}`, 'g'), String(options[v]));
        }
      });
    }
    return finalStr as PathValue<Dictionary[N], K>;
  };

  return { t, dict };
}
