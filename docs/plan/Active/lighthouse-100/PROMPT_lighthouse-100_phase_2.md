# PROMPT — lighthouse-100 — Phase 2: Marketing & Design System Portal Optimization

**Initiative:** `lighthouse-100`  
**Phase:** 2 of 5  
**Primary Role:** Frontend  
**Preferred Tool:** Cursor / Gemini  

---

## 🎯 Phase Goal

Optimize `apps/marketing` (`https://www.gateflow.site`) and `apps/design-system` (`https://design.gateflow.site`) to achieve a perfect **100 Performance, $\ge 98$ Accessibility, 100 Best Practices, and 100 SEO** score on both Desktop and Mobile.

---

## 🛠️ Step-by-Step Implementation Instructions

1. **`apps/marketing` Optimization**:
   - Add `priority`, `fetchPriority="high"`, and explicit `sizes="(max-width: 768px) 100vw, 1200px"` to the hero image on the landing page.
   - Convert interactive calculators, testimonial sliders, and contact modal forms to dynamic client imports with instant SSR skeletons.
   - Ensure critical CSS for above-the-fold content is inlined and non-critical assets load asynchronously.
   - Optimize SEO metadata, OpenGraph tags, canonical links, and semantic heading hierarchies.
2. **`apps/design-system` Optimization**:
   - Virtualize token rendering in `TokenExplorer.tsx` to handle large token sets with zero frame drops.
   - Dynamically load sandbox playgrounds and pattern labs on tab activation.
   - Minimize initial bundle size below 120KB gzipped.
3. **Verification**:
   - Run local Lighthouse runs on both apps and confirm scores reach 100/100.

---

## 🧪 Acceptance Criteria

- [ ] `apps/marketing` scores **100 Performance** on Desktop and Mobile.
- [ ] `apps/design-system` scores **100 Performance** on Desktop and Mobile.
- [ ] $\text{LCP} < 1.2\text{s}$ and $\text{CLS} = 0.00$ verified on real viewport throttles.
- [ ] `pnpm --filter marketing build && pnpm --filter @gateflow/design-system build` succeeds with zero errors.
