# PROMPT_analytics_rebuild_phase_2 — API & Data Layer

**Initiative:** analytics_rebuild  
**Plan:** `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`  
**Phase:** 2 of 6  

---

## Primary role

**BACKEND-API** (primary) + **BACKEND-Database** — Use for API route design, Prisma aggregations, and multi-tenant scoping. Ensure requireAuth, organizationId, deletedAt: null on all queries.

## Skills to load

- [x] gf-api — API routes, requireAuth, validation
- [x] gf-database — Prisma groupBy, filters
- [x] gf-security — org scope, RBAC

## MCP to use

| MCP | When |
|-----|------|
| Prisma-Local | Schema lookup, query patterns |

## Preferred tool

- [x] Cursor (default)

---

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: client-dashboard; API under `src/app/api/analytics/`
- **Existing**: `/api/analytics/summary`, `heatmap`, `funnel`, `campaigns`, `operators`, `export`
- **Rules**: pnpm only; every tenant query must scope by `organizationId` and `deletedAt: null`; use `requireAuth` (or getSessionClaims) before any data access
- **Refs**: `CLAUDE.md`, `.cursor/contracts/CONTRACTS.md`, `packages/db/prisma/schema.prisma`, `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`

---

## Goal

Add or extend analytics API endpoints and shared TypeScript types so that the dashboard can power 12+ charts: visits over time, unit types ranking, top gates, scan outcome, visitor type, incidents, quota (stub), peak days, top units. All endpoints must be auth-protected, org-scoped, and filter-aware (dateFrom, dateTo, projectId, gateId, unitType).

---

## Scope (in)

- New or updated GET routes under `apps/client-dashboard/src/app/api/analytics/`:
  - **Visits over time** — time series (e.g. by day or hour); count of ScanLogs; filters: dateFrom, dateTo, projectId, gateId.
  - **Unit types visit ranking** — aggregate by unit type (if available via Project/QRCode/Unit) or stub.
  - **Top gates by traffic** — count by gateId; same filters.
  - **Scan outcome** — groupBy status (SUCCESS, DENIED, OVERRIDE or equivalent from schema).
  - **Visitor type distribution** — e.g. by QRCode type or stub.
  - **Incidents by gate/operator** — denied/override counts by gate and/or operator (scannedByUserId).
  - **Peak days** — count by day of week.
  - **Top active units** — top 10 units (or QRCode/contact proxy) by scan count; stub if Unit not in schema.
  - **Resident quota usage** — stub (e.g. return empty or “not available”) if Resident/Unit quota not in schema.
- Shared response types for these payloads (in `@gate-access/types` or `apps/client-dashboard/src/lib/analytics/types.ts`).
- Consistent query schema: dateFrom, dateTo (YYYY-MM-DD), projectId?, gateId?, unitType?; validate project/gate belong to org.
- Use Prisma groupBy, rawQuery, or aggregate; always `where: { organizationId: orgId, deletedAt: null, ... }` (via relation from ScanLog → QRCode → Organization or Gate → Organization).

## Scope (out)

- UI chart components (Phases 3–5).
- Changing Prisma schema (only read/aggregate; stub where schema lacks fields).

---

## Steps (ordered)

1. **Shared types**
   - Define TypeScript interfaces for: visits over time (e.g. `{ date: string; count: number }[]`), top gates (`{ gateId: string; gateName: string; count: number }[]`), scan outcome (`{ status: string; count: number }[]`), peak days (`{ dayOfWeek: number; label: string; count: number }[]`), top units (stub), etc. Export from a single file (e.g. `lib/analytics/types.ts` or types package).

2. **Visits-over-time endpoint**
   - Create `GET /api/analytics/visits-over-time` (or extend summary). Parse dateFrom, dateTo, projectId, gateId; validate auth and org; build Prisma where (ScanLog with qrCode.organizationId, scannedAt range, optional gateId/projectId). Group by date (or hour); return array of { date, count }.

3. **Top gates, scan outcome, peak days**
   - Implement endpoints (or one “analytics/breakdown” that returns multiple datasets). Top gates: groupBy gateId, count. Scan outcome: groupBy status. Peak days: groupBy day of week (Prisma: extract dow from scannedAt). Same auth and filter pattern.

4. **Unit types, visitor type, incidents, top units, quota**
   - Unit types: if schema has unit type (e.g. on Project or QRCode), groupBy and count; else return stub. Visitor type: e.g. groupBy qrCode.type or stub. Incidents: filter status IN (DENIED, OVERRIDE), groupBy gateId and/or userId. Top units: if Unit/linking exists, top 10 by scan count; else stub. Quota: stub with message or empty array.

5. **Validation and security**
   - Use Zod for query params. Ensure projectId/gateId are validated against org (existing pattern from summary/heatmap). No raw user input in queries; use parameterized Prisma.

6. **Documentation**
   - Add short comments or a README listing each new route, query params, and response shape. Optionally add example Prisma snippets for 2–3 key charts in plan or in code comments.

7. **Run checks**
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`
   - `pnpm turbo test --filter=client-dashboard` (if analytics API tests exist, ensure they pass or add minimal smoke tests).

8. **Git** — Conventional commit (e.g. `feat(analytics): add visits-over-time, top-gates, scan-outcome, peak-days APIs and types`).

---

## Acceptance criteria

- [ ] All new endpoints require auth and scope by organizationId; projectId/gateId validated.
- [ ] Response types are shared and used in route return types.
- [ ] At least 3–4 key charts have corresponding working endpoints (visits over time, top gates, scan outcome, peak days).
- [ ] Stubs for missing data (quota, top units if no Unit) return valid JSON and clear structure.
- [ ] Lint, typecheck, and existing tests pass.

---

## Files likely touched

- `apps/client-dashboard/src/app/api/analytics/visits-over-time/route.ts` (new or similar)
- `apps/client-dashboard/src/app/api/analytics/top-gates/route.ts` (new or similar)
- `apps/client-dashboard/src/app/api/analytics/scan-outcome/route.ts` (new or similar)
- `apps/client-dashboard/src/app/api/analytics/peak-days/route.ts` (new or similar)
- Optional: `apps/client-dashboard/src/app/api/analytics/unit-types/route.ts`, `incidents/route.ts`, `top-units/route.ts`, `quota/route.ts`
- `apps/client-dashboard/src/lib/analytics/types.ts` (or `packages/types/src/analytics.ts`)
