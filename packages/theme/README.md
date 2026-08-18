# @gateflow/theme

Theme providers and hooks for the GateFlow Design System.
Designed for **Next.js App Router** and **next-themes** integration.

Light and dark mode are shared across GateFlow web apps (`www`, `app`, `admin`,
`portal`, `design`) through a parent-domain `gateflow-theme` cookie on
`.gateflow.site`. Localhost uses a host-only cookie so every local port sees
the same preference.

## Installation

```bash
npm install @gateflow/theme @gateflow/tokens next-themes
```

## Usage

### Root Layout

Place `ThemeScript` in `<head>` so the shared cookie is copied into
`localStorage` before `next-themes` hydrates. Wrap the tree with `ThemeProvider`.

```tsx
import { ThemeProvider, ThemeScript } from '@gateflow/theme';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

`ThemeProvider` sets both `class="dark"` and `data-color-mode="dark"` so
Tailwind `dark:` variants, `@gateflow/tokens`, and `.dark` CSS variables stay
aligned. Changing theme in any app writes the shared cookie; focusing another
app re-reads it.

### Hook

```tsx
import { useTheme } from '@gateflow/theme';

function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();
  return (
    <button onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {theme}
    </button>
  );
}
```

## Features

- **Cross-app sync**: `gateflow-theme` cookie on `.gateflow.site` (host-only on localhost).
- **Token compatibility**: `class` + `data-color-mode` attributes together.
- **SSR Friendly**: `ThemeScript` avoids a flash of the wrong color mode.
- **System preference**: default theme is `system` unless the user has chosen one.
