# PROMPT_analytics_rebuild_phase_5 — Extended Charts

**Initiative:** analytics_rebuild  
**Plan:** `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`  
**Phase:** 5 of 6  

---

## Primary role

**FRONTEND** (primary) + **BACKEND-API** — Use for chart components and any missing API endpoints. Ensure Incidents, Quota (stub), Peak Days, and UTM Attribution are wired; optionally add stretch charts.

## Skills to load

- [x] gf-design-guide — radar, funnel, progress rings
- [x] gf-api — if adding or extending analytics routes
- [x] tokens-design — theme colors for all series

## MCP to use

| MCP | When |
|-----|------|
| Context7 | Recharts RadarChart, funnel patterns, progress/custom shapes |

## Preferred tool

- [x] Cursor (default)

---

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: client-dashboard; analytics APIs and components
- **Prerequisites**: Phases 1–4 (layout, APIs, core charts)
- **Refs**: `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`, existing funnel/campaigns APIs

---

## Goal

Implement extended charts: (1) Incidents by Gate/Operator (column or bubble), (2) Resident Quota Usage (multi progress rings or bars; stub if no data), (3) Peak Days (radar or grouped bar), (4) Marketing UTM Attribution (funnel or bar reusing existing funnel/campaigns data). Optionally add 1–2 stretch charts: Dwell Time histogram, QR Creation Trends, Expired QR Attempts, or Gate Access by Shift.

---

## Scope (in)

- **Incidents by Gate/Operator** — Column or bubble chart; data from incidents API (Phase 2); show denied/override counts by gate or operator; use destructive/muted.
- **Resident Quota Usage** — Multi progress rings or horizontal bars; data from quota API (stub if no Resident/Unit quota); clear “No data” or “Coming soon” when stubbed.
- **Peak Days** — RadarChart or grouped BarChart (day of week); data from peak-days API; chart-1.
- **UTM Attribution** — Reuse existing funnel/campaigns APIs; funnel steps or bar chart; chart palette.
- **Stretch (optional):** Dwell Time histogram, QR Creation Trends, Expired QR Attempts, Gate by Shift — only if APIs exist or can be stubbed quickly.

## Scope (out)

- Full i18n and export polish (Phase 6).

---

## Steps (ordered)

1. **Incidents by Gate/Operator**
   - Create `IncidentsByGateChart` or `IncidentsChart`. Fetch from incidents API; BarChart (column) or scatter/bubble by gate and/or operator; color by severity (e.g. destructive for denied). Card wrapper, loading, empty.

2. **Resident Quota Usage**
   - Create `ResidentQuotaChart`. Fetch from quota API; if stub, show “No quota data” or progress at 0. Use progress rings (custom or Recharts) or horizontal bars; success/muted. Card wrapper.

3. **Peak Days**
   - Create `PeakDaysChart`. Fetch from peak-days API; Recharts `RadarChart` or grouped `BarChart` (day labels). Theme colors. Card wrapper, loading, empty.

4. **UTM Attribution**
   - Create or extend `UTMAttributionChart` (or use existing funnel/campaigns components). Funnel steps or bar; use existing `/api/analytics/funnel` and `/api/analytics/campaigns`; ensure theme colors. Card wrapper.

5. **Stretch (if time)**
   - Add one or two of: Dwell Time histogram, QR Creation Trends, Expired QR Attempts, Gate by Shift. Prefer reusing or extending existing APIs; stub if needed.

6. **Wire into grid**
   - Add all new components to analytics-client grid; preserve mode (Security/Marketing) and responsive spans.

7. **Run checks**
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`

8. **Git** — Conventional commit (e.g. `feat(analytics): add Incidents, Quota, Peak Days, UTM charts; stretch optional`).

---

## Acceptance criteria

- [ ] Incidents, Peak Days, and UTM charts render with real or stubbed data; theme colors only.
- [ ] Quota chart shows stub state when no data; no crashes.
- [ ] All use Card wrapper and loading/empty states.
- [ ] Lint and typecheck pass.

---

## Files likely touched

- `apps/client-dashboard/src/components/dashboard/analytics/IncidentsChart.tsx` (or IncidentsByGateChart.tsx)
- `apps/client-dashboard/src/components/dashboard/analytics/ResidentQuotaChart.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/PeakDaysChart.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/UTMAttributionChart.tsx` (or extend existing funnel)
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-client.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/index.ts`
- Optionally: new API routes under `api/analytics/` for incidents, quota, peak-days if not done in Phase 2
