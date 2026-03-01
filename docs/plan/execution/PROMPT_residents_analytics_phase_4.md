# Pro Prompt — Residents & Analytics: Phase 4 (Analytics Depth & Filter Sync)

## Phase 4: Analytics Depth & Filter Sync

### Primary role

**FRONTEND + BACKEND-API** — Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Preferred tool

- [x] Cursor (default)

### Context

- **Project:** GateFlow — Analytics at apps/client-dashboard/src/app/[locale]/dashboard/analytics; filter helpers in lib/analytics
- **Refs:** PLAN_residents_analytics.md, AnalyticsFilterBar, buildAnalyticsUrl, buildContactsUrl, buildUnitsUrl

### Goal

Align Analytics URL params with Contacts/Units filter schema; add Marketing view placeholders (funnel, persona/tag pie, ROI); optionally add Redis caching for analytics APIs; ensure RTL for charts.

### Scope (in)

- Audit and align Analytics filter schema with Contacts/Units: dateFrom, dateTo, projectId, gateId, unitType, search; optionally tagIds if Analytics APIs support. buildAnalyticsUrl and parseFiltersFromSearchParams (or equivalent) accept and persist these. buildContactsUrl/buildUnitsUrl already accept filters; ensure Analytics "Apply to Contacts/Units" passes full filter state.
- Marketing view: add placeholders or minimal implementations for (1) Attribution funnel (Link Open → Scan → Repeat → Lead), (2) Persona/tag pie (by tag from contacts), (3) ROI calculator widget. Can be "Coming soon" or stub charts.
- Optional: Redis caching for /api/analytics/summary and /api/analytics/heatmap (key e.g. org:{orgId}:analytics:summary:{filterHash}, TTL 5–15 min). If added, create or update docs/CACHE_STRATEGY.md (or docs/plan/...) with key patterns and TTLs.
- RTL: ensure Recharts axis labels, tooltips, and legend respect direction; test with Arabic locale.

### Scope (out)

- Full Marketing funnel/persona APIs (can stub with mock data)
- WebSocket real-time (Phase 5 or later)

### Steps (ordered)

1. Review lib/analytics/analytics-filters and build-analytics-url.ts. Ensure Analytics page reads and writes URL params: dateFrom, dateTo, projectId, gateId, unitType, search (and tagIds if backend supports). AnalyticsApplyFiltersButton already uses buildContactsUrl/buildUnitsUrl; verify filters passed include all of the above.
2. If Analytics summary/heatmap APIs do not accept unitType or tagIds, add optional params and filter logic (e.g. filter scans by unit type via Unit, or by tag via ContactTag); or document as future and keep stubs.
3. Marketing view: in Analytics client, when mode === 'marketing', render placeholder or stub for (a) funnel chart, (b) persona/tag pie, (c) ROI widget. Use existing AnalyticsChartPlaceholder or new components with "Coming in Phase 2" or mock data.
4. Optional Redis: in /api/analytics/summary and /api/analytics/heatmap, compute cache key from orgId + filter hash; get/set with TTL. Document in CACHE_STRATEGY.md.
5. RTL: in heatmap and other Recharts components, set layout direction or mirror axis if locale is RTL; verify tooltips and labels in ar.
6. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`.

### Acceptance criteria

- [ ] Analytics URL params align with Contacts/Units; "Apply to Contacts/Units" applies current Analytics filters on target page
- [ ] Marketing view shows at least placeholders for funnel, persona pie, ROI
- [ ] If Redis added: CACHE_STRATEGY.md documents keys and TTLs
- [ ] RTL layout correct for Analytics charts
- [ ] `pnpm turbo lint --filter=client-dashboard` and typecheck pass

### Files likely touched

- apps/client-dashboard/src/lib/analytics/analytics-filters.ts
- apps/client-dashboard/src/lib/analytics/build-analytics-url.ts
- apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-client.tsx
- apps/client-dashboard/src/components/dashboard/analytics/* (placeholders)
- apps/client-dashboard/src/app/api/analytics/summary/route.ts (optional cache)
- apps/client-dashboard/src/app/api/analytics/heatmap/route.ts (optional cache)
- docs/CACHE_STRATEGY.md or docs/plan/.../CACHE_STRATEGY.md (if cache added)
