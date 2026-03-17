# Phase 7: Server Health Monitoring

## Primary role
FULLSTACK

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/admin-dashboard`
- **Refs**:
  - `apps/admin-dashboard/src/app/[locale]/(dashboard)/monitoring/page.tsx` — current stub
  - `apps/admin-dashboard/src/components/system-health-widget.tsx` — existing widget (read and reuse/replace)
  - `apps/admin-dashboard/src/lib/admin-auth.ts`
  - `@gate-access/ui` — Card, CardContent, CardHeader, CardTitle, Badge, cn
  - `packages/db/prisma/schema.prisma` — ScanLog, Organization (for queue backlog estimation)

## Goal
Replace the monitoring stub with a live health dashboard that polls every 30 seconds. Checks: DB connectivity, Redis connectivity (graceful degradation if Upstash not configured), recent scan backlog, error rate (failed/total scans last hour), and platform stats snapshot.

## Scope (in)
- **New health API route** `src/app/[locale]/api/admin/health/route.ts`:
  - `GET` — no auth required (or require admin — choose admin)
  - Returns:
    ```ts
    {
      timestamp: string,
      services: {
        database: { status: 'ok' | 'error', latencyMs: number, message?: string },
        redis: { status: 'ok' | 'error' | 'unconfigured', latencyMs?: number },
      },
      metrics: {
        scansLastHour: number,
        failedScansLastHour: number,
        errorRate: number,           // 0–1
        activeScanners: number,      // users with scans in last 15 min
        pendingQueueEstimate: number // scans in last 5 min (proxy for offline queue)
      },
      platform: {
        totalOrgs: number,
        totalUsers: number,
        uptime: number              // process.uptime() seconds
      }
    }
    ```
  - DB check: `prisma.$queryRaw\`SELECT 1\`` with timing
  - Redis check: attempt Upstash ping if `UPSTASH_REDIS_REST_URL` env is set; otherwise `status: 'unconfigured'`
  - Error rate: `failedScansLastHour / scansLastHour` (0 if no scans)
  - Auth: `isAdminAuthenticated()` — return 401 if false
- **`MonitoringPage`** (`src/app/[locale]/(dashboard)/monitoring/page.tsx`):
  - `'use client'` — polls `/api/admin/health` every 30 seconds using `useEffect` + `setInterval`
  - `<PageHeader title="Server Health" subtitle="Live platform monitoring — refreshes every 30s" />`
  - Shows last-updated timestamp
  - **Services row** (2 cards): Database | Redis — each with status dot (green/amber/red), latency badge, message
  - **Metrics grid** (4 cards): Scans/hour | Error rate | Active scanners | Queue estimate
  - **Platform snapshot** (3 cards): Total orgs | Total users | Process uptime
  - Status color logic: `ok` = green, `error` = red, `unconfigured` = amber (with "Not configured" label)
- **`ServiceStatusCard` component** (`src/components/monitoring/ServiceStatusCard.tsx`):
  - Props: `label`, `status: 'ok' | 'error' | 'unconfigured'`, `latencyMs?: number`, `message?: string`
  - Shows color-coded dot + label + latency badge
- **`LiveMetricsGrid` component** (`src/components/monitoring/LiveMetricsGrid.tsx`):
  - Simple 4-column grid of metric cards (number + label + optional trend indicator)

## Steps (ordered)
1. Create `src/app/[locale]/api/admin/health/route.ts` — full health check logic.
2. Create `src/components/monitoring/ServiceStatusCard.tsx`.
3. Create `src/components/monitoring/LiveMetricsGrid.tsx`.
4. Rebuild `src/app/[locale]/(dashboard)/monitoring/page.tsx` as a client component with 30s polling.
5. Test: temporarily set `UPSTASH_REDIS_REST_URL` to empty — Redis status should show "unconfigured" (amber).
6. Run `pnpm turbo lint --filter=admin-dashboard`.
7. Run `pnpm turbo typecheck --filter=admin-dashboard`.
8. Commit: `feat(admin): live server health monitoring with 30s polling (phase 7)`.

## Scope (out)
- SSE/WebSocket real-time streaming (polling is sufficient for v1)
- Alert thresholds / notification emails
- Historical metrics / Datadog integration

## Acceptance criteria
- [ ] Health API returns valid JSON with all fields.
- [ ] DB latency is measured and returned.
- [ ] Redis shows `unconfigured` gracefully when env vars are absent.
- [ ] Monitoring page polls every 30 seconds (confirm via network tab).
- [ ] Last-updated timestamp updates on each poll.
- [ ] Error rate card shows correct value.
- [ ] Services show green/amber/red status dots.
- [ ] API returns 401 if unauthenticated.
- [ ] `pnpm turbo lint --filter=admin-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=admin-dashboard` passes.

## Git commit
```
feat(admin): live server health monitoring with 30s polling (phase 7)
```
