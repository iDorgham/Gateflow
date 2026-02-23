import 'server-only';
import type { Locale } from '../../i18n-config';

// Load translation JSON file for a specific namespace
export const fetchTranslations = async (locale: string, namespace: string) => {
  try {
    return (await import(`../../locales/${locale}/${namespace}.json`)).default;
  } catch (error) {
    // Fallback to English if the translation file is missing
    return (await import(`../../locales/en/${namespace}.json`)).default;
  }
};

// Server-side translation function
export async function getTranslation(locale: Locale, namespace: string) {
  const dict = await fetchTranslations(locale, namespace);

  const t = (key: string, options?: { returnObjects?: boolean, [key: string]: any }): any => {
    // Navigate dot notation (e.g. "hero.headline")
    let text = key.split('.').reduce((obj, k) => (obj || {})[k], dict);
    
    // Pluralization simple support: check if count is 1 or other
    if (options && options.count !== undefined && text && typeof text === 'object' && !Array.isArray(text)) {
       if (options.count === 1 && text.one) text = text.one;
       else if (text.other) text = text.other;
    }

    if (!text) return key; 
    if (typeof text !== 'string' && !options?.returnObjects) return key; // Fallback to key if not found and not an object request

    // Interpolation
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
