import 'server-only';
import { Locale, i18n, LOCALE_COOKIE, isRtl } from './i18n-config';
import type en from '@gate-access/i18n/en';

export { i18n, LOCALE_COOKIE, isRtl };
export type { Locale };

export type Dictionary = typeof en;
export type Namespace = keyof Dictionary;

export type Path<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends
        | string
        | number
        | boolean
        | null
        | undefined
        ? `${K}`
        : T[K] extends Array<any>
        ? `${K}` | `${K}.${number}`
        : `${K}` | `${K}.${Path<T[K]>}`;
    }[keyof T & (string | number)]
  : never;

export type TranslationFunction<TNamespace extends Namespace> = <
  K extends Path<Dictionary[TNamespace]>
>(
  key: K,
  options?: { returnObjects?: boolean; count?: number; [key: string]: any }
) => any;

const dictionaries = {
  en: () => import('@gate-access/i18n/en').then((module) => module.default),
  'ar-EG': () => import('@gate-access/i18n/ar').then((module) => module.default),
};

export const fetchTranslations = async (locale: string): Promise<Dictionary> => {
  try {
    return (await dictionaries[locale as Locale]()) as Dictionary;
  } catch (error) {
    return (await dictionaries['en']()) as Dictionary;
  }
};

export async function getTranslation<N extends Namespace>(
  locale: Locale,
  namespace: N
) {
  const fullDict = await fetchTranslations(locale);
  const dict = fullDict[namespace] || ({} as Dictionary[N]);

  const t: TranslationFunction<N> = (
    key: string,
    options?: { returnObjects?: boolean; count?: number; [key: string]: any }
  ): any => {
    // @ts-expect-error - key is a valid path string but split requires string
    let text = key.split('.').reduce((obj, k) => (obj || {})[k], dict);
    
    if (
      options &&
      options.count !== undefined &&
      text &&
      typeof text === 'object' &&
      !Array.isArray(text) &&
      ('one' in text || 'other' in text)
    ) {
      const pluralObj = text as { one?: string; other?: string };
      text = ((options.count === 1 && pluralObj.one ? pluralObj.one : pluralObj.other) ?? text) as typeof text;
    }

    if (!text) return key; 
    if (typeof text !== 'string' && !options?.returnObjects) return key;

    if (options && typeof text === 'string') {
      let str: string = text;
      Object.keys(options).forEach((v) => {
        if (v !== 'returnObjects') {
          str = str.replace(new RegExp(`{{${v}}}`, 'g'), String(options[v]));
        }
      });
      return str;
    }
    return text;
  };

  return { t, dict };
}
