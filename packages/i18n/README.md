# @gate-access/i18n

<p align="center">
  <img src="https://img.shields.io/badge/Status-Stable-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/i18next-23.x-blue" alt="i18next">
  <img src="https://img.shields.io/badge/Locales-EN%2FAR-green" alt="Locales">
</p>

Arabic/English internationalization (i18n) support for GateFlow applications. Built with i18next and react-i18next, optimized for MENA region RTL support.

## Installation

```bash
# Auto-installed by pnpm workspace
# No manual installation needed
```

## Usage

### Initialize i18n

```tsx
// In your app entry point (e.g., app/layout.tsx or _app.tsx)
import { i18n, initReactI18next } from '@gate-access/i18n';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: await import('@gate-access/i18n/en'),
    },
    ar: {
      translation: await import('@gate-access/i18n/ar'),
    },
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
```

### Use Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description', { name: 'John' })}</p>
    </div>
  );
}
```

### Switch Language

```tsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    // Update document direction for RTL
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <button onClick={toggleLanguage}>
      {i18n.language === 'en' ? 'العربية' : 'English'}
    </button>
  );
}
```

## Exports

### Named Exports

| Export             | Type             | Description            |
| ------------------ | ---------------- | ---------------------- |
| `i18n`             | i18next instance | Main i18n instance     |
| `initReactI18next` | function         | React integration hook |

### Locale Files

| Export                 | Path                       | Description                 |
| ---------------------- | -------------------------- | --------------------------- |
| `@gate-access/i18n/en` | `./src/locales/en.json`    | English translations        |
| `@gate-access/i18n/ar` | `./src/locales/ar-EG.json` | Arabic (Egypt) translations |

## Supported Locales

| Locale         | Code | Direction |
| -------------- | ---- | --------- |
| English        | `en` | LTR       |
| Arabic (Egypt) | `ar` | RTL       |

## RTL Support

GateFlow is optimized for Arabic (RTL). Key considerations:

1. **Direction attribute** — Set `dir="rtl"` on `<html>` for Arabic
2. **CSS logical properties** — Use `margin-inline-start` instead of `margin-left`
3. **Bidirectional icons** — Mirror icons that indicate direction
4. **Text alignment** — Use `text-align: start/end` instead of left/right

```css
/* Good: RTL-aware */
.container {
  padding-inline: 1rem;
  margin-inline-start: 0.5rem;
}

/* Avoid for RTL support */
.container {
  padding-left: 1rem;
  margin-left: 0.5rem;
}
```

## Translation Keys Structure

Common translation namespaces:

```
common/
  save, cancel, delete, edit, create, search, filter
auth/
  login, logout, register, forgotPassword
dashboard/
  welcome, overview, settings
qrCodes/
  generate, scan, validate, expired
gates/
  name, status, add, remove
scans/
  entry, exit, success, failed
errors/
  unauthorized, forbidden, notFound, serverError
```

## Dependencies

- `i18next` — Core i18n library
- `react-i18next` — React bindings for i18next

## Related Documentation

- [i18n Guide](../../docs/guides/UI_DESIGN_GUIDE.md#internationalization)
- [GateFlow i18n Skill](../../.opencode/skills/gf-i18n/SKILL.md)
- [MENA Market Support](../../CLAUDE.md)
