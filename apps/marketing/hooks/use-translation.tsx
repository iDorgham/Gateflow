'use client';

import * as React from 'react';
import type { Locale } from '../i18n-config';

interface I18nContextProps {
  locale: Locale;
  dictionaries: Record<string, unknown>;
}

const I18nContext = React.createContext<I18nContextProps | undefined>(
  undefined
);

/**
 * GateFlow I18n Provider
 * React 19 Refactor: Using Context directly as a provider to bypass build worker issues.
 */
export function I18nProvider({
  children,
  locale,
  dictionaries,
}: {
  children: React.ReactNode;
  locale: Locale;
  dictionaries: Record<string, any>;
}) {
  return <I18nContext value={{ locale, dictionaries }}>{children}</I18nContext>;
}

export function useTranslation(namespace: string) {
  const context = React.useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }

  const { dictionaries } = context;
  const dict = (dictionaries[namespace] as any) || {};

  const t = (key: string, variables?: Record<string, string | number>) => {
    let text = key.split('.').reduce((obj, k) => (obj || {})[k], dict);

    if (
      variables &&
      variables.count !== undefined &&
      typeof text === 'object'
    ) {
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
