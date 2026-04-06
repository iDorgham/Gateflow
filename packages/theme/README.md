# @gateflow/theme

Theme providers and hooks for the GateFlow Design System.
Designed for **Next.js App Router** and **next-themes** integration.

## Installation

```bash
npm install @gateflow/theme @gateflow/tokens next-themes
```

## Usage

### Root Layout

Wrap your application in `LocaleProvider` and `ThemeProvider` (or equivalent):

```tsx
import { ThemeProvider } from 'next-themes';
import { LocaleProvider } from '@gateflow/theme';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-color-mode" defaultTheme="system">
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Hook

```tsx
import { useLocale } from '@gateflow/theme';

function MyComponent() {
  const { locale, setLocale, isRTL } = useLocale();
  return <div dir={isRTL ? 'rtl' : 'ltr'}>{/* Content */}</div>;
}
```

## Features

- **Directionality (RTL/LTR)**: Built-in support for MENA language parity.
- **Theme Persistence**: Integration with `next-themes` and `localStorage`.
- **SSR Friendly**: No hydration mismatch with standard Next.js patterns.
