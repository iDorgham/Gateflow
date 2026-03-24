---
name: gateflow-i18n
description: Arabic/English internationalization and RTL layout for GateFlow. Use when adding translations, locale switching, RTL/LTR layout, or MENA market support.
---

# GateFlow i18n

## Stack

- **Package**: `@gate-access/i18n`
- **Locales**: `ar` (Arabic), `en` (English)
- **Routing**: `[locale]` segment in app routes (e.g. `app/[locale]/dashboard/`)
- **RTL**: Arabic uses `dir="rtl"`; English `dir="ltr"`

## Route Structure

```
app/
  [locale]/
    layout.tsx      # Sets locale, dir, lang
    dashboard/
    ...
```

Locale comes from URL: `/ar/dashboard`, `/en/dashboard`

## Translations

```typescript
import { useTranslations } from 'next-intl'; // or project i18n hook

function Component() {
  const t = useTranslations('namespace');
  return <span>{t('key')}</span>;
}
```

### With fallback

```typescript
t('key', { defaultValue: 'Fallback text' })
t('scans.exportCsv', { defaultValue: 'Export CSV' })
```

## Locale Switching

- Use `LanguageSwitcher` component or link to `/[locale]/path`
- Persist preference in cookie or user settings
- RTL layout: `dir={locale === 'ar' ? 'rtl' : 'ltr'}` on root

## RTL Layout

- Root layout: `dir={locale === 'ar' ? 'rtl' : 'ltr'}`
- Tailwind RTL: Use `rtl:` variant or logical properties
- Icons: Flip horizontally for RTL where needed
- Nav/sidebar: Swap left/right for RTL

```tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

## Locale Files

- Location: `packages/i18n/src/locales/` or app-specific
- Structure: JSON nested by namespace
- Keys: `scans.exportCsv`, `settings.billing.exportAll`, etc.

## Checklist for New UI

1. Wrap user-facing text in `t('namespace.key')`
2. Add key to locale JSON (en + ar)
3. Use `defaultValue` for graceful fallback
4. Verify RTL layout if adding nav/sidebar
5. Test locale toggle

## Browser-Use Verification

"Toggle locale (AR/EN) and verify RTL layout and labels."

**Reference:** `packages/i18n/`, `docs/APP_DESIGN_DOCS.md`, `apps/client-dashboard/src/components/language-switcher.tsx`
