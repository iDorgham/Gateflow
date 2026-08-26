# PROMPT: Phase 01 — Code Hygiene & Package Normalization

**Slug:** `marketing_egypt_uiux_polish`  
**Phase:** 01  
**Primary Role:** FRONTEND  
**Preferred Tool:** Cursor / OpenCode  
**App Scope:** `apps/marketing`

---

## Objective

Clean up orphan directory artifacts in `apps/marketing`, eliminate deep cross-package relative imports in navigation and UI components, and align all design tokens to `@gate-access/ui/tokens`.

---

## Context & Files to Touch

- `apps/marketing/app/[locale` (Delete orphan typo directory)
- `apps/marketing/components/nav.tsx` (Replace `../../../packages/ui/...` with `@gate-access/ui`)
- `apps/marketing/components/sections/*.tsx` (Audit token usages)

---

## Steps

1. Delete the orphan directory `apps/marketing/app/[locale` and any nested sub-directories.
2. In `apps/marketing/components/nav.tsx`, update the `GateFlowLogo` import from `../../../packages/ui/src/components/ui/gateflow-logo` to use the canonical `@gate-access/ui` workspace package exports.
3. Audit all component styles in `apps/marketing/components/` to ensure consistency with ADS CSS variables (`--ds-background-brand-bold`, `--ds-text-subtle`, `--ds-border-selected`).
4. Run `pnpm turbo lint typecheck --filter=marketing` to verify zero errors.

---

## Acceptance Criteria

- [ ] `apps/marketing/app/[locale` does not exist.
- [ ] No relative path traversing `../../../packages/` exists in `apps/marketing/components/nav.tsx`.
- [ ] `pnpm turbo lint typecheck --filter=marketing` passes with 0 errors.
