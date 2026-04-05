'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@gate-access/ui';

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
      className="h-9 w-9 rounded-xl border border-ds-border bg-ds-background-neutral-subtle text-ds-text-subtle hover:text-ds-text-brand hover:border-ds-border-brand hover:bg-ds-background-brand-subtle transition-all"
      onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
