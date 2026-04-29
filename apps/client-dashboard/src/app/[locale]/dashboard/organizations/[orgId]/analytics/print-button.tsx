'use client';

import { Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function PrintButton() {
  const { t } = useTranslation('common');
  return (
    <button
      onClick={() => window.print()}
      className="no-print flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
      aria-label={t('print')}
    >
      <Printer className="h-3.5 w-3.5" aria-hidden="true" />
      {t('print')}
    </button>
  );
}
