'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const STORAGE_KEY = 'gateflow_cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

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
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* noop */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-2xl">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🍪</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              We use cookies
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We use essential cookies to make our site work, and optional analytics cookies to improve your experience.{' '}
              <Link href="/legal/cookies" className="underline underline-offset-2 hover:text-indigo-600 dark:hover:text-indigo-400">
                Learn more
              </Link>
            </p>
          </div>
          <button
            onClick={() => save('dismissed')}
            className="shrink-0 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          <button
            onClick={() => save('essential')}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Essential only
          </button>
          <button
            onClick={() => save('all')}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-700 text-white hover:bg-indigo-600 transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
