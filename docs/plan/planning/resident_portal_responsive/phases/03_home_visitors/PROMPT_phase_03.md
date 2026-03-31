# Phase 3: Home & Visitors Redesign

## Primary role

FRONTEND

## Preferred tool

- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors
- [ ] Kilo CLI — free agentic, large context
- [ ] Qwen CLI — free agentic, 480B reasoning
- [x] Cursor IDE — UI/visual iteration (manual)
- [ ] Kiro IDE — review, specs (manual)

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: resident-portal (the primary target)
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS)
- **Refs**: `CLAUDE.md`, `docs/plan/context/IDEA_resident_portal_responsive.md`

## Goal

> Transform the Home dashboard and Visitors list into high-density,
> multi-column layouts for Desktop while maintaining a native-app feel on
> Mobile with FAB creation.

## Scope (in)

- Home dashboard: Desktop 2-column grid (Unit + Quota, Active Visitors +
  History).
- Visitors list: Mobile 1-column list with FAB; Desktop table with sidebar
  filters.
- `QuickCreateFAB` component integration.
- Modal/Panel overlay for visitor creation on Desktop (above visitors table).
- Quick-select visitor templates in FAB.

## Scope (out)

- History and Maintenance page redesigns (Phase 4).
- Page transitions (Phase 5).

## Steps (ordered)

1. Redesign `apps/resident-portal/src/app/(portal)/page.tsx` for desktop using
   `md:grid-cols-2`.
2. Enhance `apps/resident-portal/src/components/visitors/visitors-list.tsx` to
   handle table/list switching based on `useBreakpoint`.
3. Build `apps/resident-portal/src/components/layout/quick-create-fab.tsx` with
   a radial menu or single-tap options.
4. Implement `apps/resident-portal/src/components/visitors/new-visitor-sheet.tsx`
   supporting SideDrawer (mobile) vs Modal (desktop).
5. Verify `organizationId` is scoped correctly in all visitor fetch queries on
   the new layouts.
6. Run `pnpm turbo lint --filter=resident-portal`
7. Run `pnpm turbo typecheck --filter=resident-portal`
8. Commit: `git commit -m "feat(portal): redesign home and visitors for desktop
    responsiveness"`

## Acceptance criteria

- [ ] Home dashboard shows multi-column grid on screens ≥ 992px.
- [ ] Visitors page shows a filterable table instead of a list on desktop.
- [ ] FAB on mobile allows creating a visitor in < 2 taps.
- [ ] `organizationId` is correctly scoped on all new queries.
- [ ] All tests pass (`pnpm turbo test --filter=resident-portal`)
- [ ] Build green (`pnpm turbo build --filter=resident-portal`)
- [ ] 0 layout shift or z-index issues between FAB and BottomNav.
