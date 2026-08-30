# FOR_PLAN_PROMPT — Lighthouse Performance 100 Across All GateFlow Applications

**Slug:** `lighthouse-100`  
**Mission:** Achieve a perfect **Lighthouse Performance score of 100** (Desktop + Mobile) on every web surface of GateFlow while preserving the existing Design System DNA (Satin-Charcoal, Kimchi/Cobalt accents, glassmorphism, micro-animations, full RTL support, and zero hardcoded colors).

---

## In Scope

- `apps/marketing` (public site)
- `apps/client-dashboard` (tenant facility management)
- `apps/admin-dashboard` (super-admin)
- `apps/resident-portal` (resident web PWA)
- `apps/design-system` (brand guidelines + documentation)
- Shared packages that affect runtime performance:
  - `packages/tokens`
  - `packages/ui`
  - `packages/theme` / any global CSS

## Out of Scope

- Native mobile apps (`scanner-app`, `resident-mobile`) — Lighthouse does not apply
- Backend / database query optimization beyond what directly affects TTFB and LCP
- Visual redesigns or new features
- Changing the Design System visual language

---

## Users & Constraints

- **Tenancy & Security:** All multi-tenancy, RBAC, CSP, and encryption rules remain untouched.
- **Performance targets (hard):**
  - Performance: **100**
  - Accessibility: $\ge 95$ (prefer 100)
  - Best Practices: **100**
  - SEO: **100** (marketing + design-system)
  - Core Web Vitals:
    - $\text{LCP} < 1.2\text{s}$
    - $\text{CLS} = 0.00$
    - $\text{INP} < 200\text{ms}$
    - $\text{TTFB} < 200\text{ms}$
- **Stack constraints:**
  - Next.js App Router only
  - Token-first (`--ds-*` / `--gf-*` variables only — never hardcode colors)
  - `next/font` for Inter + Cairo
  - `next/image` exclusively
  - Dynamic imports for any component > ~15 KB or any chart/table/SSE island
- **i18n / RTL:** Logical properties and Cairo/Inter must continue to work with zero CLS.
- **Apps touched:** All five web apps listed above + shared UI/token packages.

---

## Definition of Done

1. Lighthouse CI (or local runs) reports **Performance = 100** on:
   - Desktop & Mobile for every production route of the five apps.
2. All pages use only semantic design tokens (no `bg-slate-*`, `text-zinc-*`, etc.).
3. Zero layout shift (CLS 0.00) verified with real device traces.
4. Critical JS payload per route kept under 150 KB (gzipped) where possible.
5. `pnpm preflight` (lint + typecheck + tests) passes.
6. Lighthouse CI assertions updated so that score < 100 fails the pipeline.
7. Documentation updated: short “Performance Contract” section added to the Design System manifesto and to each app’s README.

---

## Phase Breakdown

1. **Phase 1: Foundation & Measurement Baseline**
   - Establish automated Lighthouse CI baselines for all 5 web applications.
   - Profile shared bundle sizes in `@gateflow/ui`, `@gateflow/theme`, and global CSS tokens.
   - Implement shared performance primitives (Dynamic Import utilities, Image preloads, Font display optimizations).

2. **Phase 2: Marketing & Design System Portal (Brand Guidelines)**
   - Optimize `apps/marketing` (Landing, Pricing, Features, Blog) to 100 Desktop / 100 Mobile.
   - Optimize `apps/design-system` (Tokens Explorer, Pattern Labs, Sandboxes) to 100 Desktop / 100 Mobile.
   - Eliminate heavy upfront animation dependencies and unneeded client chunks.

3. **Phase 3: Resident Portal (PWA & Offline Pass Flows)**
   - Optimize `apps/resident-portal` PWA bundle, service worker hydration, and visitor pass generation routes.
   - Tune Web Share API and QR Canvas rendering to avoid main thread blocking.

4. **Phase 4: Client Dashboard (High-Density Operations & Data Visualizations)**
   - Optimize `apps/client-dashboard` authenticated shell, layout streaming, and tab switches.
   - Dynamic-island loading for Recharts, SSE visitor feeds, and heavy dialogs/drawers.
   - Optimize `DynamicTable` and `AdvancedTable` virtualization without CLS.

5. **Phase 5: Admin Dashboard & Monorepo CI Hard-Gate Enforcement**
   - Optimize `apps/admin-dashboard` SuperAdmin metrics and telemetry views.
   - Hard-gate CI assertions in `.lighthouserc.js` to enforce Performance = 100.
   - Update Performance Contract in documentation and monorepo README.
