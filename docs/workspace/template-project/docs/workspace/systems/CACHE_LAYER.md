# Cache Layer

Pre-computed workspace state — saves 5,000–15,000 tokens per AI session.

## Layer 1 — Codebase Snapshots (`docs/system/cache/`)

| File                 | Contents                    | Refresh command                  |
| -------------------- | --------------------------- | -------------------------------- |
| `WORKSPACE_INDEX.md` | Apps, ports, deps, env vars | `pnpm cache:build`               |
| `API_ROUTES_MAP.md`  | All routes, methods, auth   | Manual (update on route change)  |
| `SCHEMA_SNAPSHOT.md` | DB models, enums, gotchas   | Manual (update on schema change) |

Auto-build: `pnpm cache:build` — scans project, generates WORKSPACE_INDEX.md
Staleness check: `pnpm cache:check` — reports stale files (run in CI)

## Layer 2 — Library Docs Cache (`docs/system/cache/context7/`)

Locally cached library docs from Context7 MCP.

Naming: `{library}-{version}.md`
TTL: 14 days (configurable in frontmatter)
Check: `pnpm cache:check`

## Layer 3 — Build Cache (CI)

- **Turbo cache**: task-level caching via `turbo` + `TURBO_TOKEN`
- **pnpm store cache**: `~/.pnpm-store` restored in CI
- **GitHub Actions cache**: setup/lint/test job reuse keys

## Cache Policy

See `docs/system/cache/CACHE_POLICY.md` for TTL rules, update triggers, and token savings estimates.
