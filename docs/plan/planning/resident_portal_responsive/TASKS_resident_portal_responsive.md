# TASKS: Resident Portal — Responsive & Mobile App Experience

## Phase 1: Foundation – Layout & Nav

- [x] Create `useBreakpoint` hook (xs, sm, md, lg)
- [x] Create `BottomNav` component (Home, Visitors, Create, History, Profile)
- [x] Create `Sidebar` component (Desktop layout)
- [x] Create `PortalShell` layout wrapper
- [x] Create `PageHeader` shared component
- [x] Create `QuickCreateFAB` component
- [x] Refactor all portal pages to use `PortalShell`
- [x] Verify `organizationId` scoping on shell links

## Phase 2: PWA – Install & Offline

- [x] Configure `manifest.json` and meta tags
- [x] Setup `next-pwa` or custom SW handling
- [x] Implement `offline-cache.ts` for QR storage (IndexedDB)
- [x] Wire QR views to check cache first when offline
- [x] Add "Offline" banner/indicator
- [x] Web Push: registration flow and server-side subscription storage

## Phase 3: Home & Visitors Redesign

- [ ] Redesign `(portal)/page.tsx` for desktop (grid-based widgets)
- [ ] Redesign `(portal)/visitors/page.tsx` (Table on Desktop, List on Mobile)
- [ ] Implement modal/panel overlay for visitor creation on Desktop
- [ ] Add quick-select templates to FAB

## Phase 4: History & Maintenance

- [ ] Redesign `(portal)/history/page.tsx` (Timeline vs Table)
- [ ] Redesign `(portal)/maintenance/page.tsx` (Split-view List-Detail)
- [ ] Integrate maintenance form into responsive layout
- [ ] Wire notification toggles in `Profile` to API

## Phase 5: Polish & Final QA

- [ ] Add Framer Motion page transitions
- [ ] Implement swipe gestures for BottomNav switching
- [ ] Conduct full RTL audit (Arabic focus)
- [ ] Add loading skeletons for all core pages
- [ ] Final PWA and Lighthouse audit (Target 90+)
