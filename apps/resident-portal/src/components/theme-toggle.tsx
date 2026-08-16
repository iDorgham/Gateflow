'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@gateflow/theme';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, isDark } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={compact ? 'h-9 w-9' : 'h-10 w-full'} aria-hidden />;
  }

  const nextTheme = isDark || theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className={
        compact
          ? 'rounded-md p-2 text-ds-icon-subtle transition-colors hover:bg-ds-surface-raised hover:text-ds-text'
          : 'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-ds-text-subtle transition-colors hover:bg-ds-surface-raised hover:text-ds-text'
      }
      aria-label={`Switch to ${nextTheme} mode`}
    >
      {compact ? (
        <span className="sr-only">Switch to {nextTheme} mode</span>
      ) : (
        <span>Appearance</span>
      )}
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
