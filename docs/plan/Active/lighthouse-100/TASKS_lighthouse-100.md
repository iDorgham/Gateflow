# Tasks — lighthouse-100

**Slug:** `lighthouse-100`  
**Title:** Lighthouse Performance 100 Across All GateFlow Applications  
**Status:** In Review / Ready for Plan Generation  

---

## 📋 Phase Checklists

### Phase 1: Foundation & Measurement Baseline

- [x] Run automated Lighthouse audits across all 5 web apps (`marketing`, `design-system`, `resident-portal`, `client-dashboard`, `admin-dashboard`) to record baseline scores.
- [x] Profile bundle sizes with `@next/bundle-analyzer` or manual chunk inspection.
- [x] Create `@gateflow/ui/performance` utilities (dynamic island loader, Skeleton matching wrappers, image preloading hooks).
- [x] Verify `next/font` configuration across monorepo for Inter and Cairo font metric overrides.

---

### Phase 2: Marketing & Design System Portal Optimization

- [ ] Audit `apps/marketing` landing page LCP element (`gateflow-compound-access-cover-v10.png` or hero image).
- [ ] Add explicit `priority`, `fetchPriority="high"`, and responsive `sizes` to marketing hero media.
- [ ] Dynamically import pricing calculator, complex testimonial sliders, and contact modal.
- [ ] Optimize `apps/design-system` Token Explorer rendering and split pattern lab sandboxes into lazy chunks.
- [ ] Verify Lighthouse 100 on `apps/marketing` and `apps/design-system` (Mobile + Desktop).

---

### Phase 3: Resident Portal (PWA & Offline Pass Optimization)

- [ ] Profile `apps/resident-portal` PWA service worker caching and manifest loading times.
- [ ] Defer QR code Canvas generation and Web Share API initialization until after initial view render.
- [ ] Implement layout skeletons for pass cards and active visitor lists to guarantee `CLS = 0.00`.
- [ ] Verify Lighthouse 100 on `apps/resident-portal` on simulated mobile 4G network.

---

### Phase 4: Client Dashboard (High-Density Operations & Data Islands)

- [ ] Convert Recharts analytics components (`ArrivalTrendsChart`, `CapacityGauge`) to dynamic islands with fixed-dimension skeleton fallbacks.
- [ ] Defer SSE real-time connection establishment until browser `requestIdleCallback` or after initial paint.
- [ ] Optimize `DynamicTable` DOM virtualization to render only visible rows while maintaining smooth scroll.
- [ ] Tree-shake Lucide and Hugeicons imports to ensure only consumed SVG icons are bundled.
- [ ] Verify authenticated routes hit 100 Performance on Desktop and $\ge 98$ on Mobile.

---

### Phase 5: Admin Dashboard & Monorepo CI Hard-Gate Enforcement

- [ ] Optimize `apps/admin-dashboard` SuperAdmin summary metrics and tenant filter drawers.
- [ ] Update `.lighthouserc.js` to enforce strict CI score gates (`performance: 0.98`, `accessibility: 0.95`, `best-practices: 1.0`, `seo: 1.0`).
- [ ] Add Performance Contract section to [DESIGN.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/DESIGN.md) and monorepo README.
- [ ] Run full `pnpm preflight` and verify all 5 applications build and pass CI checks.
- [ ] Sync documentation (`CHANGELOG.md`, `PRD.md`, `FEATURE_LOG.md`).
