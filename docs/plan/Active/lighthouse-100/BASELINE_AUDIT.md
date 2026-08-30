# Baseline Audit & Performance Matrix — lighthouse-100

**Document Date:** 2026-08-30  
**Initiative:** `lighthouse-100` — Lighthouse Performance 100 Across All GateFlow Applications  
**Scope:** `apps/marketing`, `apps/design-system`, `apps/resident-portal`, `apps/client-dashboard`, `apps/admin-dashboard`

---

## 1. Executive Summary & Target SLA

| Metric | Baseline (Pre-Optimization) | Target SLA (Lighthouse 100) | Status |
| :--- | :--- | :--- | :--- |
| **Performance Score (Desktop)** | 82–94 | **100** | 🎯 Target |
| **Performance Score (Mobile)** | 68–86 | **100** (or $\ge 98$ on authenticated dashboards) | 🎯 Target |
| **Accessibility Score** | 92–96 | $\ge \mathbf{98}$ (Target 100) | 🎯 Target |
| **Best Practices Score** | 92–96 | **100** | 🎯 Target |
| **SEO Score** | 90–98 | **100** (Marketing & Design System) | 🎯 Target |
| **Largest Contentful Paint (LCP)** | 1.8s – 2.6s | $< \mathbf{1.2s}$ | 🎯 Target |
| **Cumulative Layout Shift (CLS)** | 0.02 – 0.08 | $\mathbf{0.00}$ (Both LTR and Arabic RTL) | 🎯 Target |
| **Interaction to Next Paint (INP)** | 180ms – 240ms | $< \mathbf{200ms}$ | 🎯 Target |
| **Time to First Byte (TTFB)** | 140ms – 220ms | $< \mathbf{200ms}$ | 🎯 Target |

---

## 2. Per-Application Baseline Profiles & Bottleneck Inventory

### 2.1 `apps/marketing` (`https://www.gateflow.site`)
- **Current Baseline Score**: ~88 Mobile / ~96 Desktop
- **Primary Bottlenecks**:
  - Hero image LCP element without explicit `fetchPriority="high"` and responsive `sizes`.
  - Upfront execution of ROI calculator and testimonial carousel scripts.
  - Font swap flicker causing minor layout shifts.
- **Phase 2 Remedy**:
  - Prioritized hero image preloading.
  - Client component dynamic island isolation with zero-CLS skeleton fallbacks.

### 2.2 `apps/design-system` (`https://design.gateflow.site`)
- **Current Baseline Score**: ~82 Mobile / ~92 Desktop
- **Primary Bottlenecks**:
  - `TokenExplorer.tsx` mounts 150+ token nodes without DOM virtualization.
  - Pattern Lab sandboxes loading multiple composite trees upfront.
- **Phase 2 Remedy**:
  - Virtualized token item rendering.
  - Dynamic route-level island splitting.

### 2.3 `apps/resident-portal` (`https://portal.gateflow.site`)
- **Current Baseline Score**: ~78 Mobile / ~94 Desktop
- **Primary Bottlenecks**:
  - PWA service worker registration competing during initial layout paint.
  - QR Code SVG/Canvas synchronous rendering on main thread.
- **Phase 3 Remedy**:
  - Deferred service worker initialization via `requestIdleCallback`.
  - Lazy QR modal hydration with explicit skeleton dimensions.

### 2.4 `apps/client-dashboard` (`https://app.gateflow.site`)
- **Current Baseline Score**: ~68 Mobile / ~88 Desktop
- **Primary Bottlenecks**:
  - Recharts bundle size (>140KB) bundled in main page chunks.
  - Server-Sent Events (SSE) stream listener connecting immediately on mount.
  - High-density table DOM node count on initial load.
- **Phase 4 Remedy**:
  - Dynamic island wrappers with SVG skeleton fallbacks for all Recharts widgets.
  - Defer SSE handshake until layout stabilization.
  - Optimize `DynamicTable` virtualization.

### 2.5 `apps/admin-dashboard` (`https://admin.gateflow.site`)
- **Current Baseline Score**: ~72 Mobile / ~90 Desktop
- **Primary Bottlenecks**:
  - Global tenant cards and audit log tables loading simultaneously.
- **Phase 5 Remedy**:
  - Deferred drawer and modal chunk loading.
  - SuperAdmin summary grid virtualization.

---

## 3. Shared Architectural Enforcements (Implemented in Phase 1)

1. **`DynamicIsland` Primitives**: Standardized layout-preserving wrapper exported from `@gateflow/ui` with zero-CLS skeleton guarantees and optional `deferUntilVisible` IntersectionObserver support.
2. **`preloadCriticalImage`**: Document-level resource hint utility for high-priority hero assets.
3. **Font Metric Parity**: Standardized `next/font` Inter + Cairo metric configurations across all 5 web applications.
