# Plan — lighthouse-100: Lighthouse Performance 100 Across All GateFlow Applications

**Slug:** `lighthouse-100`  
**Vision:** Achieve a perfect **Lighthouse Performance score of 100** (Desktop + Mobile) on every web application of GateFlow while preserving the existing Design System DNA, animations, and full RTL localization.

---

## 🚀 Phases Breakdown

### Phase 1: Foundation & Measurement Baseline

- **Primary Role:** Architecture / DevOps
- **Preferred Tool:** Opencode / Gemini
- **Scope:**
  - Establish automated Lighthouse CI baselines for all 5 web apps (`marketing`, `design-system`, `resident-portal`, `client-dashboard`, `admin-dashboard`).
  - Audit critical JS bundle weights across `@gateflow/ui`, `@gateflow/theme`, and shared packages.
  - Implement shared performance primitives in `@gateflow/ui` (dynamic import helpers, skeleton layout placeholders, optimized image wrappers).
- **Depends on:** `None`
- **Acceptance Criteria:** Baseline audit reports generated; shared package bundle sizes measured and documented.

---

### Phase 2: Marketing & Design System Portal Optimization

- **Primary Role:** Frontend
- **Preferred Tool:** Cursor / Gemini
- **Scope:**
  - **`apps/marketing`**: Optimize hero image LCP with `priority` and responsive `sizes`; prefetch critical routes; lazy load ROI calculator and testimonial carousels.
  - **`apps/design-system`**: Virtualize token list in `TokenExplorer.tsx`; dynamically load Pattern Laboratories and Vibe Check sandboxes.
  - Optimize `next/font` Inter + Cairo configurations for zero font-swap layout shift ($0.00\text{ CLS}$).
- **Depends on:** Phase 1
- **Acceptance Criteria:** `apps/marketing` and `apps/design-system` score **100 Performance, $\ge 98$ A11y, 100 Best Practices, 100 SEO** on both Desktop and Mobile.

---

### Phase 3: Resident Portal (PWA & Offline Pass Optimization)

- **Primary Role:** Frontend / Mobile
- **Preferred Tool:** Cursor
- **Scope:**
  - **`apps/resident-portal`**: Optimize PWA service worker caching headers and hydration sequences.
  - Offload cryptographic QR code generation and SVG rendering off the critical rendering path.
  - Lazy load bottom sheets, history dialogs, and Web Share utilities.
- **Depends on:** Phase 1
- **Acceptance Criteria:** `apps/resident-portal` passes Lighthouse audit with **100 Performance** on Mobile and Desktop with $\text{LCP} < 1.2\text{s}$ and $\text{CLS} = 0.00$.

---

### Phase 4: Client Dashboard (High-Density Operations & Data Islands)

- **Primary Role:** Frontend / Architecture
- **Preferred Tool:** Cursor
- **Scope:**
  - **`apps/client-dashboard`**: Convert heavy Recharts analytics and metrics widgets into dynamic client islands with synchronous skeleton shells.
  - Defer Server-Sent Events (SSE) connection handshake until after initial layout paint.
  - Optimize `DynamicTable` and `AdvancedTable` DOM node counts and virtualization rendering.
  - Strip unused client-side JS from server component page wrappers.
- **Depends on:** Phase 1, 2
- **Acceptance Criteria:** Authenticated dashboard routes hit **100 Performance** on Desktop and $\ge 98$ on Mobile with $0.00\text{ CLS}$.

---

### Phase 5: Admin Dashboard & Monorepo CI Hard-Gate Enforcement

- **Primary Role:** DevOps / Architecture
- **Preferred Tool:** Kiro / Claude
- **Scope:**
  - **`apps/admin-dashboard`**: Optimize SuperAdmin global metrics grids, tenant switcher drawers, and audit log tables.
  - Configure `.lighthouserc.js` to enforce strict CI assertion: `minScore: 0.98` for Performance on all 5 web apps.
  - Write Performance Contract section into [DESIGN.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/DESIGN.md) and monorepo documentation.
- **Depends on:** Phase 1, 2, 3, 4
- **Acceptance Criteria:** All 5 web apps pass automated Lighthouse CI at 100/100; `pnpm preflight` passes cleanly; PRD and CHANGELOG updated.
