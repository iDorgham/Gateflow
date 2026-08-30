# PROMPT — lighthouse-100 — Phase 4: Client Dashboard Optimization

**Initiative:** `lighthouse-100`  
**Phase:** 4 of 5  
**Primary Role:** Frontend / Architecture  
**Preferred Tool:** Cursor  

---

## 🎯 Phase Goal

Optimize `apps/client-dashboard` (`https://app.gateflow.site`) to achieve a perfect **100 Performance** on Desktop and $\ge 98$ on Mobile across authenticated operational views without compromising high-density tables, Recharts analytics, or real-time SSE arrival feeds.

---

## 🛠️ Step-by-Step Implementation Instructions

1. **Recharts & Data Analytics Islands**:
   - Extract Recharts components (`ArrivalTrendsChart`, `HourlyTrafficChart`, `OccupancyGauge`) into dynamically imported islands with pre-rendered SVG/Skeleton shells.
   - Defer chart animation computation until after layout stabilizes.
2. **Real-time SSE Connection Scheduling**:
   - Defer Server-Sent Events (SSE) `EventSource` initialization until after initial page hydration using `requestIdleCallback` or `useEffect` deferral.
   - Buffer incoming real-time events during initial load to prevent layout thrashing.
3. **High-Density Table Virtualization**:
   - Optimize `DynamicTable` and `AdvancedTable` component rendering so only in-viewport rows are mounted in the DOM.
   - Pre-allocate table container heights to guarantee zero layout shifts when data pagination loads.
4. **App Shell Chunk Optimization**:
   - Ensure the NextAuth session provider, sidebar navigation, and header notifications execute with minimal blocking time.
5. **Verification**:
   - Run Lighthouse audit on `/dashboard`, `/residents`, `/passes`, and `/analytics` routes.

---

## 🧪 Acceptance Criteria

- [ ] `apps/client-dashboard` achieves **100 Performance** on Desktop and $\ge 98$ on Mobile.
- [ ] $\text{LCP} < 1.2\text{s}$, $\text{CLS} = 0.00$, $\text{TTFB} < 200\text{ms}$.
- [ ] Live visitor arrival feeds and table interactions operate smoothly at 60fps.
- [ ] `pnpm --filter client-dashboard build && pnpm --filter client-dashboard typecheck` succeeds.
