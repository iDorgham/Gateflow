# IDEA_client_dashboard_ui_refine — Client Dashboard UI/UX Refinement with Real Estate Palette

**Owner:** Product + Design  
**Created:** 2026-03-02  
**Status:** Draft (Idea captured)  
**Depends on:** IDEA_real_estate_palette (tokens and palette already applied in globals.css)  

---

## 1. Problem & Motivation

The client dashboard uses the real estate palette in `globals.css`, but individual pages and components may still have:

- **Hardcoded hex/rgb** instead of semantic tokens
- **Inconsistent spacing, typography, and hierarchy**
- **Charts and metrics** not using `--chart-1` through `--chart-5`
- **Settings tabs** and dense pages (Contacts, Units, Analytics) needing token alignment and layout polish

Users want a cohesive, professional experience across all dashboard pages and settings, with clear focus on high-traffic areas: Create QR, Analytics, Units, Contacts, and Settings.

---

## 2. Goals

1. **Replace hardcoded colors** with semantic tokens (`text-foreground`, `bg-muted`, `border-border`, `text-primary`, etc.) across all client-dashboard pages and settings tabs.

2. **Refine layout and hierarchy** for Analytics, Units, Contacts, and Settings using `docs/guides/UI_DESIGN_GUIDE.md` and gf-design-guide patterns.

3. **Create or fix QR create page** — sidebar and overview link to `/dashboard/qrcodes` and `/dashboard/qrcodes/create`; ensure routes exist and use the palette.

4. **Consistent charts** — KPI cards, bar charts, pie charts, heatmaps use `--chart-1`–`--chart-5`.

5. **Settings page and tabs** — General, Profile, Workspace, Projects, API Keys, Webhooks, Billing, Team, Roles, Notifications, Integrations all use tokens and consistent spacing.

---

## 3. Scope

### 3.1 In scope

- `apps/client-dashboard/src/app/[locale]/dashboard/` — all page routes
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/` — page, charts, KPI cards, filters
- `apps/client-dashboard/src/app/[locale]/dashboard/residents/units/` — units page
- `apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/` — contacts page
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/` — settings page and all tabs
- `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/` — create and list (add if missing)
- `apps/client-dashboard/src/components/dashboard/` — sidebar, shell, shared components
- `packages/ui` components used by client-dashboard (only if needed for token alignment)

### 3.2 Out of scope

- Admin dashboard, marketing, scanner app
- New features or API changes
- Resident portal, resident-mobile

---

## 4. Constraints

- **Tailwind 3.4** only (no v4 upgrade)
- **Semantic tokens only** — no hardcoded hex in components
- **RTL** — all refinements must work in AR/EN and RTL
- **prefers-reduced-motion** — animations respect user preference
- **Existing API contracts** — no breaking changes to data fetching

---

## 5. Reference

| Resource | Path |
|----------|------|
| UI Design Guide | `docs/guides/UI_DESIGN_GUIDE.md` |
| Motion & Animation | `docs/guides/MOTION_AND_ANIMATION.md` |
| Design tokens | `packages/ui/src/tokens.ts` |
| Client globals | `apps/client-dashboard/src/app/globals.css` |
| Real estate palette | Section 10 of `UI_DESIGN_GUIDE.md` |

---

## 6. Skills & Tools

- **gf-design-guide** — layout, typography, grid, dashboard/analytics patterns
- **tokens-design** — semantic token architecture
- **gf-creative-ui-animation** — motion, reduced motion
- **tailwind** — utility classes
- **SuperDesign** — optional design draft for high-impact pages before implementation
