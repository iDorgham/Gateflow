# Phase 2: Platform Analytics Charts

## Primary role
FULLSTACK

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/admin-dashboard`
- **Refs**:
  - `apps/admin-dashboard/src/app/[locale]/(dashboard)/analytics/page.tsx` — existing stub (has real data queries, no charts)
  - `apps/client-dashboard/src/components/dashboard/analytics/TotalVisitsChart.tsx` — Recharts pattern reference
  - `apps/client-dashboard/src/components/dashboard/analytics/TopGatesChart.tsx` — bar chart pattern
  - `@gate-access/ui` — Card, CardContent, CardHeader, CardTitle, Badge, cn
  - `apps/admin-dashboard/src/lib/admin-auth.ts` — `requireAdmin()`, `isAdminAuthenticated()`

## Goal
Replace the analytics stub with a real Recharts-powered dashboard: scan volume trend (30d), org growth (30d), plan distribution pie, top 10 orgs by scan volume. Add an analytics API route to serve the chart data.

## Scope (in)
- **Install `recharts`** in `apps/admin-dashboard/package.json`
- **New API route** `src/app/[locale]/api/admin/analytics/route.ts`:
  - `GET` — returns JSON:
    ```ts
    {
      scanTrend: { date: string, count: number }[],   // last 30 days daily scan counts
      orgGrowth: { date: string, count: number }[],   // cumulative org count per day
      planDistribution: { plan: string, count: number }[],
      topOrgs: { name: string, scans: number }[],     // top 10 by scan count (30d)
    }
    ```
  - Auth: `isAdminAuthenticated()` — return 401 if false
  - Use raw Prisma queries: `groupBy` for scan trend, `findMany` for growth
- **Chart components** (`src/components/analytics/`):
  - `ScanTrendChart.tsx` — `<AreaChart>` from recharts (30d scan volume)
  - `OrgGrowthChart.tsx` — `<LineChart>` (cumulative orgs)
  - `PlanDistributionChart.tsx` — `<PieChart>` (FREE/PRO/ENTERPRISE)
  - `TopOrgsChart.tsx` — `<BarChart>` horizontal (top 10 orgs)
- **Rebuilt analytics page** (`src/app/[locale]/(dashboard)/analytics/page.tsx`):
  - Server component fetches data from its own API route (or directly via Prisma — prefer direct for simplicity)
  - KPI cards row: Total Orgs | Total Users | Scans This Month | Active Gates
  - `<PageHeader title="Analytics" subtitle="Platform-wide metrics" />`
  - 2x2 chart grid: ScanTrend (full width) | OrgGrowth | PlanDistribution | TopOrgs
  - All charts wrapped in `<Card>` with `<CardHeader>` title

## Steps (ordered)
1. Add `recharts` and `@types/recharts` (if needed) to `apps/admin-dashboard/package.json`. Run `pnpm install`.
2. Create `src/app/[locale]/api/admin/analytics/route.ts`:
   - Auth check first
   - Compute scan trend: last 30 days grouped by date using Prisma `$queryRaw` or `groupBy`
   - Compute org growth: orgs created each day, sorted by date
   - Plan distribution: `prisma.organization.groupBy({ by: ['plan'] })`
   - Top orgs: `prisma.scanLog.groupBy({ by: ['qrCode.organizationId'] })` or join
3. Create `src/components/analytics/` folder with 4 chart components using recharts `ResponsiveContainer`.
4. Rebuild `analytics/page.tsx`:
   - Call Prisma directly (no fetch — server component)
   - KPI cards using existing `Card` from `@gate-access/ui`
   - Render chart components (client components wrapped in `Suspense`)
5. Add `'use client'` directive to chart components.
6. Run `pnpm turbo lint --filter=admin-dashboard`.
7. Run `pnpm turbo typecheck --filter=admin-dashboard`.
8. Commit: `feat(admin): platform analytics charts with Recharts (phase 2)`.

## Scope (out)
- Revenue charts (Phase 6 — Finance)
- Real-time streaming data
- Export to PDF

## Acceptance criteria
- [ ] `recharts` is in `package.json` and `pnpm install` succeeds.
- [ ] Analytics page renders 4 charts with real data (not mocked).
- [ ] Plan distribution pie shows FREE/PRO/ENTERPRISE breakdown.
- [ ] Analytics API route returns 401 if not authenticated.
- [ ] `pnpm turbo lint --filter=admin-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=admin-dashboard` passes.

## Git commit
```
feat(admin): platform analytics charts with Recharts (phase 2)
```
