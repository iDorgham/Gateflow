# Workspace Cache Policy

**Purpose:** Save AI tokens + reduce latency by pre-loading codebase context from cached
snapshots instead of re-scanning files every session.

---

## Layer 1 — Codebase Snapshots (`docs/cache/`)

| File                 | Contents                                        | Update trigger                 | TTL    |
| -------------------- | ----------------------------------------------- | ------------------------------ | ------ |
| `WORKSPACE_INDEX.md` | Apps, packages, deps, env vars, ports, commands | Dep bump, new app, port change | Manual |
| `API_ROUTES_MAP.md`  | All API routes with methods + auth              | Route added/removed            | Manual |
| `SCHEMA_SNAPSHOT.md` | All DB models + enums + gotchas                 | Schema model/field change      | Manual |

**Auto-generate:** `node scripts/cache-build.js` — scans the project and builds `WORKSPACE_INDEX.md`.

**How AI agents use this:**
Load the relevant snapshot at conversation start instead of globbing `app/api/**` or reading
schema files. Saves 5–15 file reads per session.

---

## Layer 2 — Docs Cache (`docs/cache/context7/`)

Store library doc results locally to avoid re-fetching.

### File naming

`{library}-{version}.md` e.g. `nextjs-15.md`, `prisma-5.md`

### Frontmatter format

```yaml
---
library: next
version: '15'
fetched_at: 2026-01-01
ttl_days: 14
source: context7
---
```

### TTL rule

Re-fetch when `fetched_at + ttl_days < today` OR when the library version in
`WORKSPACE_INDEX.md` bumps.
Run `node scripts/cache-check.js` to see what's stale.

---

## Layer 3 — AI Memory (`docs/memory/`)

Structured memory files loaded at conversation start.

| File               | Type     | Contents                                        |
| ------------------ | -------- | ----------------------------------------------- |
| `MEMORY.md`        | index    | Index of all memory files — always loaded       |
| `architecture.md`  | project  | Monorepo map, apps, packages, ports, tech stack |
| `api_patterns.md`  | project  | Auth patterns, org scope, conventions           |
| `common_errors.md` | feedback | Known gotchas, recurring mistakes to avoid      |
| `decisions.md`     | project  | Architectural decisions with rationale          |

---

## Update Checklist

Run after any of these events:

- [ ] New API route added → update `API_ROUTES_MAP.md`
- [ ] DB model/enum change → update `SCHEMA_SNAPSHOT.md`
- [ ] Dependency version bump → `node scripts/cache-build.js`
- [ ] New app or port change → `node scripts/cache-build.js`
- [ ] Library docs re-fetched → update file in `context7/` with new date
- [ ] Architecture change → update `docs/memory/architecture.md`
- [ ] New gotcha discovered → update `docs/memory/common_errors.md`

---

## Token Savings Estimate

| Avoided action                  | Est. tokens saved |
| ------------------------------- | ----------------- |
| Re-scanning all routes          | ~3,000–6,000      |
| Re-reading schema (large)       | ~2,000–4,000      |
| Re-fetching library docs        | ~2,000–5,000      |
| Re-reading package.json files   | ~500–1,000        |
| **Per session total (typical)** | **~5,000–15,000** |
