'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { Locale } from '../i18n-config';

interface I18nContextProps {
  locale: Locale;
  dictionaries: Record<string, any>;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export function I18nProvider({ 
  children, 
  locale, 
  dictionaries 
}: { 
  children: ReactNode; 
  locale: Locale; 
  dictionaries: Record<string, any>;
}) {
  return (
    <I18nContext.Provider value={{ locale, dictionaries }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation(namespace: string) {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }

  const { dictionaries } = context;
  const dict = dictionaries[namespace] || {};

  const t = (key: string, variables?: Record<string, string | number>) => {
    let text = key.split('.').reduce((obj, k) => (obj || {})[k], dict);
    
    if (variables && variables.count !== undefined && typeof text === 'object') {
       if (variables.count === 1 && text.one) text = text.one;
       else if (text.other) text = text.other;
    }

    if (!text || typeof text !== 'string') return key;

    if (variables) {
      Object.keys(variables).forEach((v) => {
        text = text.replace(new RegExp(`{{${v}}}`, 'g'), String(variables[v]));
      });
    }
    return text;
  };

  return { t, dict };
}
