# Phase 1 — Fix Dark Mode Wiring

**Primary role:** FRONTEND
**Preferred tool:** Cursor
**Scope:** `packages/tokens`, all `apps/*/tailwind.config.ts`
**Goal:** Make dark mode actually activate in all apps — zero visual redesign, just fix the broken wiring.

---

## Root Cause

`ThemeProvider` sets `data-color-mode="dark"` on `<html>`.
All tailwind configs use `darkMode: ['class']` — looking for `.dark` class.
**They never agree. Dark mode never fires.**

Additionally, `tokens.css` does not override the shadcn HSL aliases in dark mode:

```css
/* `:root` only — never updated in [data-color-mode="dark"] */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--card: 0 0% 100%;
...
```

---

## Steps

### Step 1 — Update all `tailwind.config.ts` files (5 apps)

In **each** of these files:

- `apps/client-dashboard/tailwind.config.ts`
- `apps/admin-dashboard/tailwind.config.ts`
- `apps/resident-portal/tailwind.config.ts`
- `apps/marketing/tailwind.config.ts`
- `apps/design-system/tailwind.config.ts` (if it exists, else `tailwind.config.js`)

Change:

```ts
darkMode: ['class'],
```

To:

```ts
darkMode: ['selector', '[data-color-mode="dark"]'],
```

This tells Tailwind: "apply `dark:` variants when an ancestor has `data-color-mode="dark"`."

### Step 2 — Add shadcn dark mode HSL overrides to `tokens.css`

File: `packages/tokens/css/tokens.css`

In the `[data-color-mode="dark"]` block, add overrides for all shadcn HSL aliases:

```css
[data-color-mode='dark'] {
  /* existing --gf-color-* overrides ... */

  /* shadcn/ui HSL aliases — dark mode */
  --background: 222 18% 9%; /* warm charcoal, not pure black */
  --foreground: 210 20% 94%;

  --card: 222 18% 12%;
  --card-foreground: 210 20% 94%;

  --popover: 222 18% 10%;
  --popover-foreground: 210 20% 94%;

  --primary: 20 95% 55%; /* Kimchi-adjacent for dark mode */
  --primary-foreground: 0 0% 100%;

  --secondary: 222 18% 16%;
  --secondary-foreground: 210 20% 88%;

  --muted: 222 18% 16%;
  --muted-foreground: 215 16% 55%;

  --accent: 222 18% 16%;
  --accent-foreground: 210 20% 88%;

  --destructive: 0 70% 50%;
  --destructive-foreground: 0 0% 100%;

  --border: 222 18% 20%;
  --input: 222 18% 20%;
  --ring: 20 95% 55%;
}
```

### Step 3 — Verify `ThemeProvider` attribute

File: `packages/theme/src/ThemeProvider.tsx`

Confirm `attribute = 'data-color-mode'` is still the default (no change needed — already correct).

### Step 4 — Update `globals.css` dark mode border

File: `packages/ui/src/globals.css`

The `* { @apply border-border; }` rule uses the `border` Tailwind color which now resolves correctly via the HSL update. No change needed — but verify the `:root` HSL `--border` is defined.

---

## Acceptance Criteria

- [ ] Toggle dark mode in `design-system` app — all shadcn components (Button, Card, Input, Dialog, Select) switch colors
- [ ] `dark:bg-background` Tailwind utility applies the dark background
- [ ] `dark:text-foreground` applies the dark foreground
- [ ] No `.dark` class references remain in tailwind configs
- [ ] `pnpm turbo typecheck` passes
- [ ] `pnpm turbo build --filter=@gateflow/design-system` passes
