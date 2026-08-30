# Draft — lighthouse-100

**Slug:** `lighthouse-100`  
**Title:** Lighthouse Performance 100 Across All GateFlow Applications  
**Status:** In Review / Ready for Plan Generation  
**Target:** 100 Performance, $\ge 95$ Accessibility, 100 Best Practices, 100 SEO across all 5 web applications.

---

## 1. Problem Statement

GateFlow features rich design aesthetics (Satin-Charcoal dark mode, glassmorphism, micro-animations, Arabic RTL), but heavier dashboard tables, charting libraries, real-time SSE connections, and upfront font/script execution can degrade initial PageSpeed and Lighthouse metrics on constrained mobile networks.

## 2. Target Metrics & SLA

- **Lighthouse Performance Score**: **100** on Desktop and **100** on Mobile.
- **LCP (Largest Contentful Paint)**: $< 1.2\text{s}$.
- **CLS (Cumulative Layout Shift)**: **0.00** across both LTR and RTL.
- **INP (Interaction to Next Paint)**: $< 200\text{ms}$.
- **TTFB (Time to First Byte)**: $< 200\text{ms}$.
- **Critical JS Payload**: $\le 150\text{KB}$ gzipped initial bundle per route.

## 3. Scope & Apps

| Application | Domain / Purpose | Key Bottlenecks |
| :--- | :--- | :--- |
| `apps/marketing` | `www.gateflow.site` | Hero image LCP, font swapping, dynamic counters |
| `apps/design-system` | `design.gateflow.site` | Token Explorer search trees, sandbox iframe isolation |
| `apps/resident-portal` | `portal.gateflow.site` | PWA service worker hydration, dynamic QR generation |
| `apps/client-dashboard` | `app.gateflow.site` | Recharts bundling, SSE stream listeners, high-density tables |
| `apps/admin-dashboard` | `admin.gateflow.site` | SuperAdmin metrics grids, large tenant audit lists |
| Shared UI Packages | `@gateflow/ui`, `@gateflow/theme` | Chunk splitting, dynamic imports, CSS extraction |

## 4. Architectural Rules & Invariants

1. **Zero Hardcoded Colors**: Maintain strict adherence to `--ds-*` semantic token variables.
2. **Next/Font Optimization**: `next/font/google` for Inter and Cairo with `display: swap`, `preload: true`, and zero layout shift fallback metrics.
3. **Next/Image Enforcement**: Explicit `width`/`height` or `fill` with `sizes` and `priority` on above-the-fold hero images.
4. **Islands Architecture for Heavy UI**: Dynamic import with skeleton fallbacks for all components $> 15\text{KB}$ (Recharts, QR code generators, multi-step modals).
5. **No Layout Shift on RTL**: Bidirectional CSS logical properties only (`ms-*`, `me-*`, `ps-*`, `pe-*`).
