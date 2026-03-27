# Cache Layer (Workspace)

This document maps caching across workspace tooling, CI, docs, and app-level runtime caches.

## Workspace / Build Caches

- **Turbo cache**: task-level build caching via `turbo` (`turbo.json`, CI `TURBO_TOKEN` / `TURBO_TEAM`).
- **pnpm store cache**: dependency cache in CI (`~/.pnpm-store`) and `node_modules` restore keys.
- **GitHub Actions cache**: reusable cache blocks in `ci.yml` for setup/lint/typecheck/test/performance jobs.

## Documentation Caches

- `docs/cache/CACHE_POLICY.md`
- `docs/cache/WORKSPACE_INDEX.md`
- `docs/cache/API_ROUTES_MAP.md`

## Runtime / App Caches (current examples)

- `apps/client-dashboard/src/lib/analytics-cache.ts`
- `apps/resident-mobile/lib/history-cache.ts`
- `apps/resident-mobile/lib/qr-cache.ts`

## Performance and Audit Caches

- Lighthouse artifacts and local reports (`.lighthouseci/*`, CI artifacts in `lighthouse.yml`).
- Bundle baseline snapshots and checks (`scripts/check-bundle-size.js`).
