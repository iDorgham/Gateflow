'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@gateflow/ui';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);

    // Sync across apps using a top-level cookie if on subdomains
    const domain = window.location.hostname.includes('.')
      ? `.${window.location.hostname.split('.').slice(-2).join('.')}`
      : undefined;

    document.cookie = `theme=${newTheme}; path=/; max-age=31536000${domain ? `; domain=${domain}` : ''}`;
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full border border-ds-border bg-ds-surface-raised shadow-sm hover:border-ds-border-brand hover:bg-ds-background-brand-subtle transition-all"
      onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-ds-icon-brand" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-ds-icon-brand" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
