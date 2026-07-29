# TASKS: Resident Portal — Responsive & Pilot Readiness

**Slug:** `resident_portal_responsive`  
**Plan:** `PLAN_resident_portal_responsive.md`

## Baseline Phases 1–5 (UI present — not pilot-certified)

### Phase 1: Foundation – Layout & Nav

- [x] Create `useBreakpoint` hook (xs, sm, md, lg)
- [x] Create `BottomNav` component (Home, Visitors, Create, History, Profile)
- [x] Create `Sidebar` component (Desktop layout)
- [x] Create `PortalShell` layout wrapper
- [x] Create `PageHeader` shared component
- [x] Create `QuickCreateFAB` component
- [x] Refactor all portal pages to use `PortalShell`
- [x] Verify `organizationId` scoping on shell links
- [ ] `phase_logs/PHASE_LOG_phase_01.md` updated (backfill if missing)

### Phase 2: PWA – Install & Offline

- [x] Configure `manifest.json` and meta tags
- [x] Setup custom SW handling
- [x] Implement `offline-cache.ts` for QR storage (IndexedDB write)
- [x] Wire QR views to **read** cache when offline (done in Phase 07)
- [x] Add "Offline" banner/indicator
- [x] Web Push: registration flow and server-side subscription storage
- [ ] `phase_logs/PHASE_LOG_phase_02.md` updated (backfill if missing)

### Phase 3: Home & Visitors Redesign

- [x] Redesign `(portal)/page.tsx` for desktop (grid-based widgets)
- [x] Redesign `(portal)/visitors/page.tsx` (Table on Desktop, List on Mobile)
- [x] Implement modal/panel overlay for visitor creation on Desktop
- [x] Add quick-select templates to FAB
- [ ] `phase_logs/PHASE_LOG_phase_03.md` updated (backfill if missing)

### Phase 4: History & Maintenance

- [x] Redesign `(portal)/history/page.tsx` (Timeline vs Table)
- [x] Redesign `(portal)/maintenance/page.tsx` (Split-view List-Detail)
- [x] Integrate maintenance form into responsive layout
- [x] Wire notification toggles in `Profile` to API
- [x] Cookie-authenticated history/maintenance fetch (done in Phase 07)
- [ ] `phase_logs/PHASE_LOG_phase_04.md` updated (backfill if missing)

### Phase 5: Polish & Final QA

- [x] Add Framer Motion page transitions
- [x] Implement swipe gestures for BottomNav switching
- [ ] Conduct full RTL audit (Arabic focus) — incomplete per 2026-07-29 audit
- [x] Add loading skeletons for core pages (partial coverage)
- [ ] Final PWA and Lighthouse audit (Target 90+) — Phase 09
- [ ] `phase_logs/PHASE_LOG_phase_05.md` updated

---

## Workflow v2 readiness (next)

### Phase 6: Auth, session, tenant containment — DONE

- [x] Portal layout redirects unauthenticated users to `/login`
- [x] Remove all `dev-resident-id` / `dev-org-id` fallbacks from data pages
- [x] Use `orgId` (with `org`/`orgId` fallback) consistently on pages
- [x] JWT secret fail-closed in `src/lib/auth.ts` / `jwt-secret.ts`
- [x] Negative tests: unauthenticated portal, missing org claim
- [x] `phase_logs/PHASE_LOG_phase_06.md` + SESSION_MEMORY update

### Phase 7: API proxy, scannable QR, offline read

- [x] Env-based `/api/resident/*` upstream (no hardcoded `localhost:3001`)
- [x] Render scannable QR from signed payload (`visitor-qr-card`, `open-qr-card`)
- [x] Offline IndexedDB **read** path for active QR
- [x] Forward auth for history/maintenance RSC fetches
- [x] Tests: QR render smoke; proxy config; offline read
- [x] `phase_logs/PHASE_LOG_phase_07.md`

### Phase 8: Pilot UX completion

- [ ] Wire revoke and/or share/download on `/visitors/[id]` where APIs exist
- [ ] Implement Sign Out on `/profile`
- [ ] Remove or hide dead `/settings/privacy` and `/settings/help` links
- [ ] Explicit empty/error UI when unit missing on create flows
- [ ] `phase_logs/PHASE_LOG_phase_08.md`

### Phase 9: i18n/RTL, tests, measurable evidence

- [ ] `lang`/`dir` strategy or documented interim + logical CSS pass on P0 routes
- [ ] Expand tests for Phases 06–07
- [ ] Lighthouse/PWA evidence or dated deferral
- [ ] Backfill phase logs 01–05 if still missing
- [ ] `phase_logs/PHASE_LOG_phase_09.md`

### Phase 10: Pilot gate & certification packet

- [ ] Refresh `docs/audits/resident-portal/PILOT_GATE_*.json`
- [ ] Browser evidence for owned pilot steps (or honest static blockers)
- [ ] Certification evidence packet for `/check` → `/pilot` → `/certify`
- [ ] Deferrals have owner, reason, expiry
- [ ] `phase_logs/PHASE_LOG_phase_10.md`
