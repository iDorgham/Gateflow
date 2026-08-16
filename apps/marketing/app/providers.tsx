'use client';

import { ThemeProvider } from '@gateflow/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
