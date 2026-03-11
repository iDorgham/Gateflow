# CACHE_STRATEGY_analytics

## Scope

This document defines the caching and refresh behavior for the analytics dashboard in `apps/client-dashboard`.

It covers:

- summary KPIs
- security heatmap
- operator leaderboard
- marketing funnel and campaign charts
- fallback behavior when a real-time channel is unavailable

## Client-side cache (React Query)

The dashboard uses `@tanstack/react-query` via `QueryProvider` and analytics hooks.

- **Default query stale time:** 60 seconds
- **Default GC time:** 5 minutes
- **Summary KPI polling:** every 45 seconds (`useAnalyticsSummary`)
- **Refetch on window focus:** enabled for fresh visible data
- **Query key strategy:** include filter dimensions (`from`, `to`, `projectId`, `gateId`) so cache entries are isolated per view

This keeps filter changes responsive while avoiding redundant network calls across renders.

## API-level cache considerations

For heavy aggregations (heatmap, operators, funnel, campaigns), prefer caching at the API layer with short TTLs:

- `analytics:summary:{orgId}:{projectId}:{gateId}:{from}:{to}` (TTL 30-60s)
- `analytics:heatmap:{orgId}:{projectId}:{gateId}:{from}:{to}` (TTL 5-15m)
- `analytics:operators:{orgId}:{projectId}:{gateId}:{from}:{to}` (TTL 2-5m)
- `analytics:funnel:{orgId}:{projectId}:{from}:{to}` (TTL 2-5m)
- `analytics:campaigns:{orgId}:{projectId}:{from}:{to}` (TTL 2-5m)

If Redis/Upstash is not available, endpoints fall back to direct database aggregation.

## Invalidation strategy

When new scans or QRs are created, invalidate affected buckets:

- on scan success/deny: summary + heatmap + operators + relevant campaign/funnel buckets
- on QR create/update: summary + funnel + campaigns buckets

Recommended future event names:

- `scan.created`
- `scan.denied`
- `qr.created`

## Real-time and fallback

Phase 4 keeps short-polling as the guaranteed fallback path.

- Preferred: event-driven updates (WebSocket channel `org:{orgId}:analytics`) to invalidate dashboard queries.
- Current guaranteed behavior: 45-second polling for KPI summary and filter-driven re-fetch for charts.

This design allows progressive adoption of WebSocket invalidation without blocking dashboard freshness.

## Performance targets

Targets from Phase 4:

- cached load under 2 seconds where feasible
- cold load under 4 seconds where feasible
- filter change to chart update under 800ms for normal payload sizes

Guidance:

- keep chart payloads aggregated and bounded
- avoid unnecessary re-renders by keeping query keys stable
- lazy-load non-primary charts if payload growth increases
