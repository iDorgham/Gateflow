---
name: ui-ux
description: UI/UX design patterns for web and mobile. Use when designing interfaces, layouts, flows, or improving usability.
---

# UI/UX

## GateFlow stack

- **Web:** Next.js, `@gate-access/ui` (shadcn-style), Tailwind
- **Mobile:** Expo/React Native
- **i18n:** AR/EN, RTL support

## Principles

- **Mobile-first** — Design for small screens first
- **Consistency** — Use design tokens, shared components
- **Accessibility** — Focus states, contrast, labels
- **RTL** — Test Arabic layout (direction, alignment)

## Components

- Prefer `@gate-access/ui` over custom
- Extend with `className` (Tailwind) or `style`
- Use `cn()` for conditional classes

## Flows

- **Onboarding** — Step-by-step, clear CTAs
- **Forms** — Validation, clear errors, loading states
- **Navigation** — Breadcrumbs, back, clear hierarchy

## Reference

- `packages/ui/src/` — Component library
- `packages/ui/src/tokens.ts` — Design tokens
- SuperDesign skill for design drafts before implementation
