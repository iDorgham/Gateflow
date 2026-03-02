# GateFlow — UI Design Guide

Canonical reference for web app design: colors, typography, grid systems, responsive layout, spacing, dashboard/analytics page patterns, and RTL. Used by Cursor, CLIs, Antigravity, and design skills.

**Stack:** Next.js 14, `@gate-access/ui` (shadcn-style), Tailwind CSS 3.4, `packages/ui/src/tokens.ts`.

---

## 1. Colors

- **Source of truth:** `packages/ui/src/tokens.ts` and `apps/*/src/app/globals.css` (CSS variables).
- **Use semantic tokens only** — never hardcode hex/rgb. Examples:
  - `bg-background`, `text-foreground`
  - `bg-primary`, `text-primary-foreground`
  - `border`, `bg-muted`, `text-muted-foreground`
  - `success`, `warning`, `destructive`, `info`
  - Chart palette: `--chart-1` through `--chart-5`
- **Dark mode:** Tokens switch via `next-themes` class (`dark`); both light and dark variants exist in `globals.css`.
- **Accessibility:** Contrast ratios must meet WCAG AA; semantic pairs (e.g. `primary` + `primary-foreground`) are pre-defined for contrast.

---

## 2. Typography

- **Font:** Inter (web apps). Use `next/font` with subset loading; support Arabic via `@gate-access/i18n`.
- **Scale (from `nativeTokens.typography`):** xs (12), sm (14), base (16), lg (18), xl (20), 2xl (24), 3xl (30).
- **Tailwind classes:** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`.
- **Line heights:** Match tokens (`leading-*`); avoid arbitrary values.
- **Headings:** Use semantic `h1`–`h6`; style via tokens (e.g. `text-2xl font-semibold text-foreground`).
- **RTL:** `lang` and `dir` on `html`; test with `ar-EG` locale.

---

## 3. Design Grid Systems

- **4pt base:** Spacing uses multiples of 4 (4, 8, 12, 16, 20, 24, 32, 40).
- **Tailwind spacing:** `p-4`, `m-2`, `gap-4`, `space-x-2`, etc.
- **Layout grid:** Prefer CSS Grid or Flexbox; use `grid-cols-*`, `flex`, `gap-*`.
- **Breakpoints (Tailwind default):** `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.
- **Columns:** Common patterns: 12-column grid, `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for cards.

---

## 4. Responsive Design

- **Mobile-first:** Base styles for small screens; `md:` and `lg:` for larger.
- **Containers:** Use `container` or `max-w-*`; center with `mx-auto`.
- **Touch targets:** Min 44×44px for interactive elements on mobile.
- **Tables:** Consider horizontal scroll (`overflow-x-auto`) or card layout on small screens.

---

## 5. Spacing

- **Consistent spacing:** Use `gap-*`, `space-*`, `p-*`, `m-*` from Tailwind scale.
- **Component spacing:** `p-4` for cards, `gap-4` for stacked content, `space-y-4` for vertical lists.
- **Avoid:** `margin-top` hacks; prefer `gap` or `space-y` for predictable flow.
- **RTL:** Use logical properties (`ms-4` vs `ml-4`) when Tailwind RTL plugin is enabled.

---

## 6. Dashboard and Analytics Page Design

- **Layout:** Sidebar + main content; `flex` or `grid` with `min-h-screen`.
- **Cards:** Use `@gate-access/ui` Card; `rounded-lg`, `border`, `shadow-sm` per tokens.
- **Charts:** Recharts with `--chart-1`–`--chart-5` for consistent palette.
- **Metrics:** Large numbers (`text-2xl` or `text-3xl`), muted labels (`text-muted-foreground`).
- **Filters:** Horizontal row of Select/Input; collapse to dropdown on mobile.
- **Tables:** `@gate-access/ui` Table; sortable headers, pagination; Zebra striping optional.

---

## 7. Web Analytics Page Design

- **Data density:** Balance information density with readability; use tabs or sections for multiple views.
- **Time ranges:** Standard presets (Today, 7d, 30d) + custom picker.
- **Export:** Support CSV/Excel where applicable; document in API or UI.

---

## 8. App Design Conventions

- **Prefer `@gate-access/ui`** — Button, Input, Card, Badge, Table, Dialog, etc.
- **Extend with `className`** — Use Tailwind; avoid inline styles.
- **`cn()` utility** — For conditional classes (`cn("base", condition && "variant")`).
- **Server Components by default** — `'use client'` only for hooks, events, browser APIs.
- **i18n:** `useTranslations` for all user-facing text; support AR/EN and RTL.

---

## 9. RTL Considerations

- **Layout flip:** `dir="rtl"` on `html` when locale is `ar`; test navigation, tables, forms.
- **Icons:** Flip directional icons (chevron-left/right) based on `dir`.
- **Alignment:** Use `text-start`/`text-end` instead of `text-left`/`text-right` when RTL support exists.
- **Spacing:** Logical properties (`margin-inline-start`) when available.

---

## 10. Real Estate Palette (Applied)

The professional real estate palette is applied across client-dashboard, admin-dashboard, marketing, and `@gate-access/ui`. See `docs/plan/context/IDEA_real_estate_palette.md`.

| Name | Hex | HSL | Contrast | Token mapping |
|------|-----|-----|----------|---------------|
| Anti-Flash White | #F2F3F4 | 210 5% 96% | 18.9:1 | `--background` (light), `--foreground` (dark) |
| Lace Cap | #EBEAED | 260 7% 93% | 17.52:1 | `--muted`, `--secondary`, `--accent` (light) |
| Kimchi | #ED4B00 | 19 100% 46% | 3.74:1 | `--primary`, `--login-accent` — **accent** |
| Midnight Blue | #020035 | 235 94% 11% | 19.92:1 | `--foreground` (light), `--background` (dark) |
| Dark Royalty | #02066F | 234 96% 23% | 16.69:1 | `--muted-foreground` (light), `--muted` (dark) |
| Deep Sea | #2000B1 | 248 100% 35% | 12.38:1 | `--info`, chart/links |

**Contrast notes:** All ratios from the reference image preserved for WCAG AA. Kimchi (`--primary`) used with white (`--primary-foreground`) for CTAs. Light mode: Anti-Flash White backgrounds, Midnight Blue text. Dark mode: Midnight Blue backgrounds, Anti-Flash White text.

---

## 11. References

| Resource | Path |
|----------|------|
| Design tokens | `packages/ui/src/tokens.ts` |
| Global CSS variables | `apps/client-dashboard/src/app/globals.css` |
| Tailwind config | `tailwind.config.ts` |
| UI components | `packages/ui/src/components/` |
| SuperDesign | `.cursor/skills/superdesign/SKILL.md` — run design drafts before implementation |
| Real estate palette plan | `docs/plan/execution/PLAN_real_estate_palette.md` |

---

Use Tailwind 3.4. Do not upgrade to Tailwind v4 without explicit approval.
