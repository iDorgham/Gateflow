# @gateflow/theme

GateFlow Theme Provider and hooks, powered by `next-themes`.

Sets **`data-color-mode`** on `document.documentElement` for Atlassian-style token support (e.g. `[data-color-mode="dark"]`).

## Installation

```bash
pnpm add @gateflow/theme
```

## Setup

Wrap your application in `ThemeProvider`:

```tsx
import { ThemeProvider } from '@gateflow/theme';
import '@gateflow/tokens/tokens.css';

export default function Layout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Usage

Use the `useTheme` hook to switch modes or check current state:

```tsx
import { useTheme } from '@gateflow/theme';

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {isDark ? 'Switch to Light' : 'Switch to Dark'}
    </button>
  );
}
```

## Utilities

Resolve GateFlow tokens into CSS variables:

```tsx
import { getTokenVar } from '@gateflow/theme';

const primaryColor = getTokenVar('color.primary'); // 'var(--gf-color-primary)'
```

## Props

- `attribute`: Defaults to `data-color-mode`.
- `defaultTheme`: Defaults to `system`.
- `enableSystem`: Defaults to `true`.
- `disableTransitionOnChange`: Defaults to `true`.
