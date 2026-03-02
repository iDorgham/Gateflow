---
name: gf-design-guide
description: Web app design — colors, typography, grid systems, responsive layout, spacing, dashboard/analytics patterns, RTL. Use when designing interfaces, layouts, flows, or improving UI/UX. Covers prototyping, design systems, and app design.
---

# gf-design-guide

Web app design reference for GateFlow. Load this skill when designing or refining UI: layouts, dashboards, analytics pages, typography, grid systems, spacing, responsive design, and RTL.

## Canonical doc

**Primary reference:** `docs/guides/UI_DESIGN_GUIDE.md`

Read that file for:
- Colors (semantic tokens, dark mode, chart palette)
- Typography (Inter, scale, RTL)
- Design grid systems (4pt base, Tailwind)
- Responsive design (mobile-first, breakpoints)
- Spacing (gap, space-*, tokens)
- Dashboard and analytics page patterns
- App design conventions (@gate-access/ui, Server Components, i18n)
- RTL considerations

## When to use

- User asks to design, redesign, or improve a page, flow, or component
- Task involves layouts, dashboards, analytics, typography, grid, spacing, responsive
- Before implementing new UI — load this + SuperDesign skill for design drafts

## Stack

- Next.js 14, `@gate-access/ui` (shadcn-style), Tailwind CSS 3.4
- Design tokens: `packages/ui/src/tokens.ts`
- Global CSS: `apps/client-dashboard/src/app/globals.css`

## Related skills

- **superdesign** — Run design drafts before implementation
- **ui-ux** — General UI/UX patterns
- **tokens-design** — Design token architecture
- **tailwind** — Tailwind utilities and theming
