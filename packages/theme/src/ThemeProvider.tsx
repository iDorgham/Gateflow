'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from 'next-themes';
import type { ThemeProviderProps as NextThemesProviderProps } from 'next-themes';
import { THEME_STORAGE_KEY } from './constants';
import {
  parseTheme,
  persistThemeCookie,
  readThemeCookie,
  type ThemeName,
} from './cookie';

export interface ThemeProviderProps extends NextThemesProviderProps {
  children: React.ReactNode;
}

function ThemeCookieSync() {
  const { theme, setTheme } = useNextTheme();
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const cookieTheme = readThemeCookie();
      if (cookieTheme && cookieTheme !== theme) {
        setTheme(cookieTheme);
        return;
      }
    }

    const parsed = parseTheme(theme);
    if (parsed) {
      persistThemeCookie(parsed);
    }
  }, [theme, setTheme]);

  React.useEffect(() => {
    const syncFromCookie = () => {
      const cookieTheme = readThemeCookie();
      if (cookieTheme && cookieTheme !== theme) {
        setTheme(cookieTheme);
      }
    };

    const onFocus = () => syncFromCookie();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') syncFromCookie();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [theme, setTheme]);

  return null;
}

/**
 * GateFlow Theme Provider
 *
 * Wraps `next-themes`, sets both `class` and `data-color-mode` for token/Tailwind
 * compatibility, and persists the preference to a parent-domain cookie so every
 * `*.gateflow.site` app stays in sync.
 */
export function ThemeProvider({
  children,
  attribute = ['class', 'data-color-mode'],
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = true,
  storageKey = THEME_STORAGE_KEY,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      storageKey={storageKey}
      {...props}
    >
      <ThemeCookieSync />
      {children}
    </NextThemesProvider>
  );
}

/**
 * Hook to access and switch GateFlow themes.
 * Wrapper around `next-themes.useTheme`.
 */
export function useTheme() {
  const context = useNextTheme();

  const isDark = context.resolvedTheme === 'dark';
  const isLight = context.resolvedTheme === 'light';

  return {
    ...context,
    isDark,
    isLight,
    mode: context.resolvedTheme as 'light' | 'dark' | undefined,
  };
}

/**
 * Specific hook for GateFlow Color Mode (semantic alias)
 */
export const useGateFlowColorMode = useTheme;

export type { ThemeName };
