# TASKS: Resident Portal — Responsive & Mobile App Experience

**Slug:** `resident_portal_responsive`  
**Plan:** `PLAN_resident_portal_responsive.md` (plan folder root)

## Phase 1: Foundation – Layout & Nav

- [x] Create `useBreakpoint` hook (xs, sm, md, lg)
- [x] Create `BottomNav` component (Home, Visitors, Create, History, Profile)
- [x] Create `Sidebar` component (Desktop layout)
- [x] Create `PortalShell` layout wrapper
- [x] Create `PageHeader` shared component
- [x] Create `QuickCreateFAB` component
- [x] Refactor all portal pages to use `PortalShell`
- [x] Verify `organizationId` scoping on shell links
- [ ] `phase_logs/PHASE_LOG_phase_01.md` updated (backfill if missing)

## Phase 2: PWA – Install & Offline

- [x] Configure `manifest.json` and meta tags
- [x] Setup `next-pwa` or custom SW handling
- [x] Implement `offline-cache.ts` for QR storage (IndexedDB)
- [x] Wire QR views to check cache first when offline
- [x] Add "Offline" banner/indicator
- [x] Web Push: registration flow and server-side subscription storage
- [ ] `phase_logs/PHASE_LOG_phase_02.md` updated (backfill if missing)

## Phase 3: Home & Visitors Redesign

- [x] Redesign `(portal)/page.tsx` for desktop (grid-based widgets)
- [x] Redesign `(portal)/visitors/page.tsx` (Table on Desktop, List on Mobile)
- [x] Implement modal/panel overlay for visitor creation on Desktop
- [x] Add quick-select templates to FAB
- [ ] `phase_logs/PHASE_LOG_phase_03.md` updated (backfill if missing)

## Phase 4: History & Maintenance

- [x] Redesign `(portal)/history/page.tsx` (Timeline vs Table)
- [x] Redesign `(portal)/maintenance/page.tsx` (Split-view List-Detail)
- [x] Integrate maintenance form into responsive layout
- [x] Wire notification toggles in `Profile` to API
- [ ] `phase_logs/PHASE_LOG_phase_04.md` updated (backfill if missing)

## Phase 5: Polish & Final QA

- [x] Add Framer Motion page transitions
- [x] Implement swipe gestures for BottomNav switching
- [x] Conduct full RTL audit (Arabic focus)
- [x] Add loading skeletons for all core pages
- [ ] Final PWA and Lighthouse audit (Target 90+)
- [ ] `phase_logs/PHASE_LOG_phase_05.md` updated
