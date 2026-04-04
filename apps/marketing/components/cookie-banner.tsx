'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useTranslation } from '../hooks/use-translation';

const STORAGE_KEY = 'gateflow_cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation('components');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const timer = setTimeout(() => setVisible(true), 1800);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, []);

  function save(value: string) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* noop */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-2xl">
      <div className="rounded-2xl border border-ds-border bg-ds-surface p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🍪</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              {t('cookieBanner.title')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('cookieBanner.desc')}{' '}
              <Link
                href="/legal/cookies"
                className="underline underline-offset-2 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {t('cookieBanner.learnMore')}
              </Link>
            </p>
          </div>
          <button
            onClick={() => save('dismissed')}
            className="shrink-0 p-1 rounded-lg hover:bg-ds-surface-raised text-ds-text-subtlest transition-colors"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          <button
            onClick={() => save('essential')}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-ds-border text-ds-text-subtle hover:bg-ds-surface-raised transition-colors"
          >
            {t('cookieBanner.essential')}
          </button>
          <button
            onClick={() => save('all')}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-700 text-white hover:bg-indigo-600 transition-colors"
          >
            {t('cookieBanner.acceptAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
