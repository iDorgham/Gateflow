'use client';

import { useTranslation } from 'react-i18next';

export default function TranslationsProvider({ children }: { children: React.ReactNode }) {
  // We use this component to boundary any client components that need translation context
  // This just ensures the translations are loaded before children render
  const { ready } = useTranslation();

  if (!ready) {
    return null; // Or a very subtle loading state
  }

  return <>{children}</>;
}
