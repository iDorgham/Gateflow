# Phase 1: Layout & Navigation

## Primary role
FRONTEND

Use this role when implementing in Cursor or when invoking CLIs for this phase.

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001)
- **Packages**: ui, i18n, config
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`)
- **Refs**: `CLAUDE.md`, `docs/plan/planning/settings_v6/PLAN_settings_v6.md`

## Goal
Rebuild the main settings layout with a responsive sidebar and tabbed navigation.

## Scope (in)
- New `SettingsLayout` component.
- Sidebar with icons (Lucide) and labels for 11 tabs.
- Responsive horizontal tabs for mobile.
- Global search bar UI (placeholder for actual search logic).
- Framer Motion transitions for tab switching.

## Scope (out)
- Functional logic for individual tabs (to be done in later phases).
- Backend API integration for search.

## Steps (ordered)
1. Create `apps/client-dashboard/src/components/settings/settings-layout.tsx`.
2. Implement the sidebar navigation using `Link` from `next/link`.
3. Ensure the layout is responsive (sidebar hidden on mobile, replaced by top tabs).
4. Add the search bar UI to the header area.
5. Create empty page components for all 11 tabs to verify routing.
6. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`.
7. After verification: `/github` — commit as `feat(settings): settings layout and navigation (phase 1)`.

## SuperDesign
**SuperDesign create design draft for the 11-tab settings layout before implementation. Use --context-file for sidebar and typography context.**

## Subagents
**Subagent (browser-use):**
"Login at localhost:3001, navigate to /settings, verify that the sidebar and tabs render correctly on both desktop and mobile viewports."

## Acceptance criteria
- [ ] Sidebar renders on desktop with 11 icons/labels.
- [ ] Top horizontal tabs render on mobile.
- [ ] Tab switching updates the URL and breadcrumbs.
- [ ] Global search bar UI is visible.
- [ ] `pnpm turbo lint` and `typecheck` pass.
