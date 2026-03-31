# Phase 1: Foundation – Shared Layout & Navigation

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

> Establish the responsive foundational layout components (`useBreakpoint`,
> `BottomNav`, `Sidebar`, `PortalShell`) to switch between mobile
> bottom-navigation and desktop sidebar-navigation.

## Scope (in)

- `useBreakpoint` hook based on `@gate-access/ui` screen tokens.
- `BottomNav` with Home, Visitors, Create, History, and Profile icons.
- `Sidebar` with consistent navigation items for desktop users.
- `PortalShell` layout wrapper that dynamically toggles layouts.
- `PageHeader` shared component for title and back navigation.
- Initial refactoring of root and sub-pages to use the shared shell.

## Scope (out)

- PWA service worker and manifest (Phase 2).
- Offline caching (Phase 2).
- Deep page redesigns for desktop (Phase 3 & 4).

## Steps (ordered)

1. Create `apps/resident-portal/src/hooks/use-breakpoint.ts` following
   `@gate-access/ui` screen tokens.
2. Build `apps/resident-portal/src/components/layout/bottom-nav.tsx` with
   active-route detection.
3. Build `apps/resident-portal/src/components/layout/sidebar.tsx` (collapsible
   design mirroring client-dashboard).
4. Create `apps/resident-portal/src/components/layout/portal-shell.tsx` wrapping
   main content with the appropriate navigation based on `useBreakpoint`.
5. Implement `apps/resident-portal/src/components/layout/page-header.tsx`.
6. Refactor `(portal)/layout.tsx` to use `PortalShell`.
7. Verify all existing pages maintain their functionality inside the new shell.
8. Run `pnpm turbo lint --filter=resident-portal`
9. Run `pnpm turbo typecheck --filter=resident-portal`
10. Commit: `git commit -m "feat(portal): implement responsive foundation and
    shared layout components"`

## Acceptance criteria

- [ ] Navigation switches from BottomNav to Sidebar at `md` breakpoint (992px).
- [ ] `BottomNav` highlights the active route correctly.
- [ ] `Sidebar` navigation items match mobile tabs but adapt to a sidebar layout.
- [ ] `PageHeader` is consistent across all pages.
- [ ] All tests pass (`pnpm turbo test --filter=resident-portal`)
- [ ] Build green (`pnpm turbo build --filter=resident-portal`)
- [ ] No layout shift violations on breakpoint change.
