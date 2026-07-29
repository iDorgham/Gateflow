# Phase 4: History & Maintenance Redesign

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
- **Refs**: `CLAUDE.md`, `docs/development/initiatives/IDEA_resident_portal_responsive.md`, `PLAN_resident_portal_responsive.md` (plan folder root), `CONTEXT_resident_portal_responsive.md`, `context/`

## Goal

> Finalize the responsive redesign for History, Maintenance, and Profile
> pages including timeline/table switching and split-view detail panels.

## Scope (in)

- History: Timeline list on Mobile; date-range filterable Table on Desktop.
- Maintenance: Mobile list with FAB form; Desktop split-view (List-Detail
  pattern).
- Profile: Vertical list on Mobile; Grid/Card layout on Desktop with inline
  editing.
- Notification toggles: Wire actual push/email toggles to resident API.
- Loading skeletons for secondary pages.

## Scope (out)

- Advanced page transitions (Phase 5).
- Web Push server-side logic (Phase 2 completion).

## Steps (ordered)

1. Redesign `apps/resident-portal/src/app/(portal)/history/page.tsx` for desktop
   with Table + DateRangePicker.
2. Update `apps/resident-portal/src/app/(portal)/maintenance/page.tsx` for
   desktop using `SideNavigationShell` or `ResizablePanel` split view.
3. Enhance `apps/resident-portal/src/app/(portal)/profile/page.tsx` for desktop
   with card-based grid layout.
4. Implement `apps/resident-portal/src-components/profile/notification-settings.tsx`
   with API integration for toggles.
5. Create `apps/resident-portal/src-components/common/loading-skeleton.tsx`.
6. Run `pnpm turbo lint --filter=resident-portal`
7. Run `pnpm turbo typecheck --filter=resident-portal`
8. Commit: `git commit -m "feat(portal): final responsive redesign for history,
maintenance, and profile"`

## Acceptance criteria

- [ ] History page adapts from timeline list to tabular desktop view.
- [ ] Maintenance Hub shows split-view (list/detail) on screens ≥ 1200px.
- [ ] Profile and Notification settings are fully functional and responsive.
- [ ] Skeletons display correctly while data is fetching.
- [ ] All tests pass (`pnpm turbo test --filter=resident-portal`)
- [ ] Build green (`pnpm turbo build --filter=resident-portal`)
- [ ] Multi-tenant isolation verified on all new table/grid queries.
