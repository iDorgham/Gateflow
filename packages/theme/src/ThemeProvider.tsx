'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from 'next-themes';
import type { ThemeProviderProps as NextThemesProviderProps } from 'next-themes';

export interface ThemeProviderProps extends NextThemesProviderProps {
  children: React.ReactNode;
}

/**
 * GateFlow Theme Provider
 *
 * Wraps `next-themes` and synchronizes `data-color-mode` for Atlassian/GateFlow token compatibility.
 * Consumes `@gateflow/tokens` (CSS variables under `[data-color-mode="dark"]`).
 */
export function ThemeProvider({
  children,
  attribute = 'data-color-mode',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
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

  // Logical shorthand for GateFlow data-color-mode
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
