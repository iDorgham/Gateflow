# PROMPT — lighthouse-100 — Phase 3: Resident Portal PWA Optimization

**Initiative:** `lighthouse-100`  
**Phase:** 3 of 5  
**Primary Role:** Frontend / Mobile  
**Preferred Tool:** Cursor  

---

## 🎯 Phase Goal

Optimize `apps/resident-portal` (`https://portal.gateflow.site`) to achieve a perfect **100 Performance** score on simulated mobile 4G networks while preserving offline PWA caching, instant guest pass generation, and Web Share integration.

---

## 🛠️ Step-by-Step Implementation Instructions

1. **PWA & Service Worker Hydration**:
   - Optimize service worker registration so it does not compete for main-thread CPU time during initial paint.
   - Set up cache-first strategies for immutable static assets and stale-while-revalidate for pass lists.
2. **Cryptographic QR Pass Rendering**:
   - Defer QR code Canvas computation off the critical main thread until pass modal opens or user taps view.
   - Use layout skeleton cards with explicit dimensions to guarantee $0.00\text{ CLS}$ when active passes stream in.
3. **Interactive Components Lazy Loading**:
   - Dynamically load bottom sheet drawers, pass creation wizards, and notification history.
   - Ensure all touch targets meet or exceed $44\text{px} \times 44\text{px}$ for perfect Accessibility scoring.
4. **Verification**:
   - Test on mobile viewport throttled to simulated 4G and Fast 3G networks.

---

## 🧪 Acceptance Criteria

- [ ] `apps/resident-portal` scores **100 Performance** on Mobile profile.
- [ ] $\text{LCP} < 1.1\text{s}$, $\text{CLS} = 0.00$, $\text{INP} < 150\text{ms}$.
- [ ] PWA offline pass viewing remains 100% operational.
- [ ] `pnpm --filter resident-portal build && pnpm --filter resident-portal typecheck` succeeds.
