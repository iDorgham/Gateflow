# PLAN_analytics_dashboard — Analytics Dashboard (Dual-Mode: Security ↔ Marketing)

**Initiative:** analytics_dashboard  
**Source:** User spec — Analytics Dashboard Vision (dual-mode, filter inheritance, KPI cards, heatmap, funnel, Recharts)  
**Primary product spec:** `docs/PRD_v6.0.md` (Client Dashboard, Analytics, Marketing Suite)  
**Related plans:** Compound seed plan (Section 12 analytics phases); existing analytics at `apps/client-dashboard/src/app/[locale]/dashboard/analytics/`  
**Owner:** Product + Engineering  
**Status:** Complete (all phases done)  
**Estimated total:** 8–10 weeks across 4 phases  
**Task checklist:** `docs/plan/execution/TASKS_analytics_dashboard.md`

---

## 1. Objectives

Build **one central place** where property managers, security heads, marketing leads and admins understand what is happening in the compound — actionable insight with context, trends, anomalies and ROI signals.

**Key principles**

- Persona-driven default views (Security vs Marketing) — same data, different lenses
- Filter once, visualize anywhere — filters from Contacts/Units pages flow into dashboard
- No page reloads — instant chart updates on filter change
- Progressive disclosure — start simple (KPIs + 2–3 charts), expand later
- Mobile-first — works on phones/tablets
- RTL + Arabic-ready from day one

---

## 2. Prerequisites & Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Contacts + Units pages | Exists | [residents/contacts](apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/page.tsx), [residents/units](apps/client-dashboard/src/app/[locale]/dashboard/residents/units/page.tsx) |
| Existing analytics page | Exists | Server-rendered, Recharts; heatmap, daily trend, top gates, status breakdown |
| UTM persistence | Not in schema | ScanLog/QRCode lack `utm_campaign`, `utm_source`; add in Phase 1 or stub |
| Tagging system | Not in schema | No `Tag` / `ContactTag`; Phase 2/3 can stub or add minimal model |
| Filter bar component | May need creation | Shared date range, project, gate, tags, unit type, search |

---

## 3. High-Level Phases

| # | Phase | Primary role | Summary |
|---|--------|--------------|---------|
| 1 | Core Dashboard Shell | FRONTEND | Layout, mode toggle, filter bar, KPI row, chart placeholders, filter inheritance |
| 2 | Security View Depth | BACKEND-API + FRONTEND | Heatmap API, threat/anomaly cards, operator leaderboard, short-polling KPIs |
| 3 | Marketing View Depth | BACKEND-API + FRONTEND | Attribution funnel, campaign bar, persona/tag pie, ROI widget, audience export |
| 4 | Polish & Real-time | FRONTEND + BACKEND-API | WebSocket, export/share, mobile optimizations, caching tuning |

---

## 4. Phase 1 — Core Dashboard Shell

**Primary role:** FRONTEND  
**Estimated:** 2–3 weeks

**Scope**

- Dashboard page layout (12-column grid desktop, stacked mobile)
- Mode toggle (Security ◯ Marketing) — persists in URL/state
- Global filter bar (date range, project, gate, tags, unit type, search) — shared schema with Contacts/Units
- KPI row with 4–6 basic counters (Total Visits, Pass Rate, Peak Hour, Unique Visitors, Denied Scans; Attributed Scans if UTM exists)
- Primary chart placeholder: heatmap for Security mode, funnel for Marketing mode
- Filter inheritance: "Open in Analytics Dashboard" from Contacts/Units → dashboard loads with same filters
- "Apply to Contacts/Units" on dashboard → navigate back with current filters
- RTL + i18n wiring for new UI

**Deliverables**

- New or refactored analytics dashboard route with layout
- `AnalyticsFilterBar` component (reusable)
- `AnalyticsModeToggle` component
- KPI card components with basic formulas
- Filter propagation via URL params; shared filter schema

**Depends on:** None (can stub UTM/tags)

**Test criteria**

- Mode toggle switches default chart
- Filter bar updates URL; charts (placeholders) receive filter props
- "Open in Analytics" from Contacts/Units passes filters to dashboard
- `pnpm preflight` passes

---

## 5. Phase 2 — Security View Depth

**Primary role:** BACKEND-API (heatmap, aggregations) + FRONTEND (charts, UI)

**Scope**

- `/api/analytics/heatmap` endpoint: day-of-week × hour matrix, gate filter, date range, org scope
- Full heatmap chart implementation (Recharts or custom; MENA weekend peaks)
- Threat/anomaly cards (simple rules: e.g. denied >5%, spike in last hour)
- Operator leaderboard (top scanners by org)
- Real-time KPI updates via short-polling (30–60s)
- Redis caching for heatmap buckets (5–15 min TTL) — if Redis available

**Deliverables**

- Heatmap API and chart
- Anomaly cards component
- Operator leaderboard API + UI
- Short-polling hook for KPI refresh

**Depends on:** Phase 1

**Test criteria**

- Heatmap shows correct day×hour data for org
- Anomaly cards reflect thresholds
- KPIs auto-refresh
- `pnpm preflight` passes

---

## 6. Phase 3 — Marketing View Depth

**Primary role:** BACKEND-API + FRONTEND

**Scope**

- UTM schema addition if not done: `utm_campaign`, `utm_source` on QRCode or ScanLog (or via join)
- `/api/analytics/funnel` endpoint: QR generated → opened → scanned conversion by campaign
- Attribution funnel chart (Recharts)
- Campaign performance bar chart
- Persona/tag pie chart (stub if tagging not present)
- ROI calculator widget
- Audience export button (CSV of contacts in filter)

**Deliverables**

- Funnel API and chart
- Campaign bar chart
- Persona/tag pie (or placeholder)
- ROI widget
- Export to CSV with injection protection

**Depends on:** Phase 1; UTM persistence (schema/seed) recommended before or during

**Test criteria**

- Funnel shows realistic conversion stages
- Campaign bar reflects UTM-attributed scans
- Export produces valid CSV
- `pnpm preflight` passes

---

## 7. Phase 4 — Polish & Real-time

**Primary role:** FRONTEND + BACKEND-API

**Scope**

- WebSocket channel `org:{orgId}:analytics` for live scan events (Phase 2–3 per spec)
- Export & share (PNG/CSV/JSON; shareable dashboard URL)
- Mobile optimizations (collapsible filter accordion, horizontal scroll KPIs, stacked layout)
- Performance tuning: cache hit rate >85%, load <2s cached / <4s cold, filter change → chart update <800ms

**Deliverables**

- WebSocket integration for live KPIs (optional fallback to short-polling)
- Export/share UI
- Mobile-responsive refinements
- `docs/.../CACHE_STRATEGY.md` or equivalent caching doc

**Depends on:** Phases 1–3

**Test criteria**

- Load and filter-change targets met
- Mobile layout works on narrow viewport
- `pnpm preflight` passes

---

## 8. KPI Cards Reference

| Card | Formula | Security Emphasis | Marketing Emphasis |
|------|---------|-------------------|---------------------|
| Total Visits | COUNT(ScanLog) status=SUCCESS | 24h/7d | 30d/campaign |
| Pass Rate | PASS/(PASS+DENY)×100 | Low = alert | vs baseline |
| Peak Hour | Hour with MAX(scans) | Staffing | Best time for events |
| Unique Visitors | COUNT(DISTINCT contactId)* | Watchlist overlap | Prospect vs repeat |
| Denied Scans | COUNT status=DENIED | >5% critical | Friction point |
| Attributed Scans | COUNT utm_campaign IS NOT NULL | — | Campaign ROI proxy |

*Requires contactId on ScanLog or via QRCode→VisitorQR→Unit→Contact join; may need schema extension.

---

## 9. Filter Schema (Unified)

All analytics inherit filters from table views. Fields: `organizationId` (session), `projectId`, `dateFrom`, `dateTo`, `granularity`, `contactIds`, `unitIds`, `gateIds`, `tagIds`, `unitType`, `qrCodeType`, `scanStatus`. Persist via URL query string and optional `User.preferences.defaultDashboardFilters`.

---

## 10. Risks & Blockers

- **UTM/tagging not in schema:** Phase 1 can ship without; Phases 2–3 add minimal schema or stub. Plan migration if needed.
- **Contact–scan linkage:** `ScanLog` has no `contactId`. Unique Visitors may require linking via QRCode→VisitorQR→Unit→Contact or adding `contactId` to ScanLog.
- **Redis:** Caching strategy assumes Redis (Upstash); fallback to PostgreSQL aggregates if unavailable.
