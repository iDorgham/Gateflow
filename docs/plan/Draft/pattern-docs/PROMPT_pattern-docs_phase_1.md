# Phase 1: Analytics Pattern Documentation

### Primary role

FRONTEND

### Tool Selection

|                            | Tool         | Why                                     |
| -------------------------- | ------------ | --------------------------------------- |
| **Tool 1** (best quality)  | Cursor       | High-density UI component assembly      |
| **Tool 2** (free fallback) | OpenCode CLI | Reliable for documentation and snippets |

### Skills to load

- [x] `using-superpowers`
- [x] `ui-ux-pro-max`
- [x] `gf-uiux-animator`
- [x] `gf-ads-data-density`
- [x] `verification-before-completion`

### Goal

Implement high-fidelity, interactive documentation for the "Analytics Dashboard" pattern in the design system.

### Scope (in)

- Interactive `AnalyticsDashboard` lab in `apps/design-system/src/app/(docs)/patterns/analytics/page.tsx`.
- Support for switching Between "Real-time" and "Historical" modes in the lab.
- Documenting `StatGrid` and `ChartLab` usage from `@gateflow/components`.
- Hardened `'use client';` implementation.

### Steps

1. Load `gf-ads-data-density` and `ui-ux-pro-max` skills.
2. Refactor `apps/design-system/src/app/(docs)/patterns/analytics/page.tsx` to use a professional documentation layout (PageHeader, section descriptions).
3. Implement the `AnalyticsDashboard` component (lab) with mock data generation.
4. Add copy-pasteable code snippets for the `StatGrid` assembly.
5. Verify build stability: `pnpm turbo build --filter=@gateflow/design-system`.

### Acceptance criteria

- [ ] `AnalyticsDashboard` lab is interactive and handles RTL correctly.
- [ ] Code snippets are correct and aligned with `@gateflow/components` interfaces.
- [ ] `pnpm turbo build --filter=@gateflow/design-system` passes without errors.
