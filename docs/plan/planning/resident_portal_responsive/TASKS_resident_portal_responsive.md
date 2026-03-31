# TASKS: Resident Portal — Responsive & Mobile App Experience

## Phase 1: Foundation – Layout & Nav

- [ ] Create `useBreakpoint` hook (xs, sm, md, lg)
- [ ] Create `BottomNav` component (Home, Visitors, Create, History, Profile)
- [ ] Create `Sidebar` component (Desktop layout)
- [ ] Create `PortalShell` layout wrapper
- [ ] Create `PageHeader` shared component
- [ ] Create `QuickCreateFAB` component
- [ ] Refactor all portal pages to use `PortalShell`
- [ ] Verify `organizationId` scoping on shell links

## Phase 2: PWA – Install & Offline

- [ ] Configure `manifest.json` and meta tags
- [ ] Setup `next-pwa` or custom SW handling
- [ ] Implement `offline-cache.ts` for QR storage (IndexedDB)
- [ ] Wire QR views to check cache first when offline
- [ ] Add "Offline" banner/indicator
- [ ] Web Push: registration flow and server-side subscription storage

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
