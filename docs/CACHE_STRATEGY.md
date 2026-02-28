# GateFlow — Cache Strategy

This document describes Redis caching for the client-dashboard analytics and residents flows. Cache is implemented only when **Upstash Redis** is configured (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`). If Redis is unavailable, all endpoints fall back to live DB queries (no throw).

---

## Environment

| Variable | Purpose |
|----------|---------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST API URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST API token |

---

## Key Patterns & TTLs

All keys are **tenant-scoped** by `organizationId` (orgId). No cross-tenant data is cached.

| Prefix | Description | Key parts | TTL | Invalidation |
|--------|-------------|-----------|-----|--------------|
| `analytics:heatmap` | Day-of-week × hour scan intensity (heatmap) | `orgId`, `dateFrom`, `dateTo`, `projectId`, `gateId` | 600 s (10 min) | Time-based (TTL); new scans only affect future requests after TTL |

**Key format:** `{prefix}:orgId={id}:dateFrom=...:dateTo=...:projectId=...:gateId=...`  
(Keys are built by `cacheKey(prefix, parts)` in `apps/client-dashboard/src/lib/analytics-cache.ts`; parts are sorted alphabetically.)

---

## Implemented Usage

- **`/api/analytics/heatmap`** — Response cached by org + date range + project + gate. Cache hit returns JSON without hitting the database.

---

## Future / Optional

- **`/api/analytics/summary`** — Can use same pattern, e.g. `analytics:summary` with `orgId`, `dateFrom`, `dateTo`, `projectId`, `gateId`, `mode`. Suggested TTL: 300–600 s.
- **Residents aggregates** — If server-side caching is added for contacts/units aggregates, use a prefix such as `org:{orgId}:residents:aggregates:{from}-{to}` and invalidate on ScanLog/QRCode writes (or use short TTL, e.g. 60–120 s).

---

## Invalidation

- Current strategy is **TTL-only**; there is no explicit invalidation on ScanLog or QRCode events.
- For stronger consistency after scan events, consider:
  - Short TTLs (e.g. 1–2 min) for real-time dashboards, or
  - Deleting keys by pattern when scans are written (e.g. `DEL analytics:heatmap:orgId=...` for that org).

---

## Ownership & Conventions

- **Owner:** client-dashboard API routes and `lib/analytics-cache.ts`.
- **Conventions:** All cache keys MUST include `orgId`. Never cache without tenant scope. Use `getCached` / `setCached` from `@/lib/analytics-cache`; do not bypass with raw Redis calls in app code.
