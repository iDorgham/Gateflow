# PROMPT_analytics_dashboard_phase_3 — Marketing View Depth

**Initiative:** analytics_dashboard  
**Plan:** `docs/plan/execution/PLAN_analytics_dashboard.md`  
**Phase:** 3 of 4  

---

## Primary role

**BACKEND-API** (funnel, campaign, export) + **FRONTEND** (funnel chart, campaign bar, ROI widget)

## Preferred tool

- **Cursor** (default)

---

## Context

- **Project**: GateFlow (Turborepo, pnpm)
- **Phase 1–2**: Dashboard shell, Security heatmap, KPIs, operator leaderboard
- **Schema**: ScanLog, QRCode — **UTM fields may not exist**; add `utmCampaign`, `utmSource` to QRCode (or JSON metadata) if needed for attribution
- **Refs**: `PLAN_analytics_dashboard.md`, `docs/PRD_v7.0.md` (Marketing Suite)

---

## Goal

Implement Marketing view: attribution funnel (QR generated → opened → scanned), campaign performance bar, persona/tag pie (stub if no tags), ROI calculator widget, and audience export (CSV with injection protection).

---

## Scope (in)

- UTM schema (if not present): add `utmCampaign String?`, `utmSource String?` to QRCode; migration; seed or leave null
- `/api/analytics/funnel` — stages: QR created, QR used (scanned), conversion rate; filter by utm_campaign, date range
- Attribution funnel chart (Recharts)
- `/api/analytics/campaigns` — bar chart data: campaigns with scan counts, pass rate
- Campaign performance bar chart
- Persona/tag pie — stub with "All" or hide if no Tag model
- ROI calculator widget (simple: attributed scans × configurable value per scan)
- Audience export: `/api/analytics/export` or inline — CSV of contacts/visitors in filter; escape `=`, `+`, `-`, `@` to prevent formula injection

## Scope (out)

- Full tagging system (stub persona/tag)
- WebSocket
- Complex ROI models

---

## Steps (ordered)

1. **UTM schema (if needed)**
   - Add `utmCampaign String?`, `utmSource String?` to QRCode
   - Migration: `prisma migrate dev --name add_utm_to_qrcode`
   - Update QR creation flows to accept UTM params (optional; can seed later)

2. **Implement `/api/analytics/funnel`**
   - Stages: QR created (count), QR scanned (count), conversion %
   - Filter by dateFrom, dateTo, projectId, utmCampaign
   - Return `{ stages: { name, count, dropoffRate? }[] }`
   - Org-scoped

3. **Implement `/api/analytics/campaigns`**
   - Group by utmCampaign; count scans, pass rate
   - Filter by date range, project
   - Return `{ campaigns: { name, scans, passRate }[] }`

4. **Build funnel chart**
   - Recharts or custom funnel
   - Click stage → future: show contact list (stub for now)
   - Consume `/api/analytics/funnel`

5. **Build campaign bar chart**
   - Bar chart: campaign name vs scan count
   - Optional: secondary axis for pass rate
   - Consume `/api/analytics/campaigns`

6. **Persona/tag pie**
   - If Tag exists: pie by tag
   - Else: single segment "All" or hide

7. **ROI calculator widget**
   - Input: value per attributed scan (e.g. $X)
   - Display: attributed scans × value = total ROI
   - Simple client-side calc

8. **Audience export**
   - Button "Export audience"
   - Fetch contacts/visitors in current filter
   - Generate CSV; escape `=`, `+`, `-`, `@` in cells
   - Download or `/api/analytics/export` endpoint

9. **Wire Marketing mode**
   - When mode=Marketing, primary chart = funnel; secondary = campaign bar
   - ROI widget in sidebar or panel
   - Export button visible

10. **Run checks**
    - `pnpm preflight` for client-dashboard
    - Test CSV export with cells containing `=`, `+`

11. **Git** — conventional commit, push

---

## Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | Find QR creation flow | "Where is QRCode created? Show API route and any UTM handling." |
| **shell** | Migration | "From packages/db run prisma migrate dev --name add_utm_to_qrcode" |

---

## Acceptance criteria

- [ ] Funnel chart shows QR created → scanned stages with conversion
- [ ] Campaign bar shows UTM campaign performance (or empty if no UTM data)
- [ ] ROI widget calculates correctly
- [ ] CSV export produces valid file; no formula injection
- [ ] Marketing mode shows funnel as primary chart
- [ ] `pnpm preflight` passes

---

## Files likely touched

- `packages/db/prisma/schema.prisma` (UTM fields)
- `packages/db/prisma/migrations/`
- `apps/client-dashboard/src/app/api/analytics/funnel/route.ts` (new)
- `apps/client-dashboard/src/app/api/analytics/campaigns/route.ts` (new)
- `apps/client-dashboard/src/app/api/analytics/export/route.ts` (new, or inline in page)
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/` (funnel, campaign bar, ROI, export)
