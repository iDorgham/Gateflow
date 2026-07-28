# Workspace Cache Policy

**Purpose:** Save AI tokens + reduce latency by pre-loading codebase
context from cached snapshots instead of re-scanning files every session.

---

## Layer 1 — Codebase Snapshots (`docs/reference/cache/`)

| File                 | Contents                                                 | Update trigger                 |
| -------------------- | -------------------------------------------------------- | ------------------------------ |
| `WORKSPACE_INDEX.md` | Ports, packages, deps, env vars, commands, auth patterns | Dep bump, new app, port change |
| `API_ROUTES_MAP.md`  | All 187 API routes with methods + auth (heuristic)       | Route added/removed            |
| `SCHEMA_SNAPSHOT.md` | All 63 Prisma models + 41 enums + gotchas                | Schema model/field change      |

**How AI agents use this:**
Load the relevant snapshot at conversation start instead of globbing
`app/api/**` or reading `schema.prisma`. Saves 5–15 file reads per session.

**Regenerating:** run `node scripts/cache-build.js` from repo root — it rebuilds
all three files above from the live repo state (package.json files, `app/api/**`,
`schema.prisma`). Previously this script was referenced but didn't exist, so the
cache silently went stale (last hand-written 2026-03-28, drifted to ~2x the
routes/models listed). It's now a real script — re-run it after the triggers
in the table above instead of hand-editing these files.

---

## Layer 2 — Docs Cache (`docs/reference/cache/context7/`)

Store Context7 library doc results locally to avoid re-fetching.

### File naming

`{library}-{version}.md` e.g. `nextjs-15.md`, `prisma-5.md`, `expo-54.md`

### Frontmatter format

```yaml
---
library: next
version: '15'
fetched_at: 2026-03-24
ttl_days: 14
source: context7
---
```

### TTL rule

- Re-fetch when `fetched_at` + `ttl_days` < today, OR when the version
  in `WORKSPACE_INDEX.md` bumps.
- Before calling Context7 MCP: check if a local cache file exists and
  is within TTL. If yes, read the local file instead.

---

## Layer 3 — Claude Memory (`~/.claude/projects/.../memory/`)

Structured memory files loaded at conversation start.

| File                         | Contents                                            |
| ---------------------------- | --------------------------------------------------- |
| `MEMORY.md`                  | Index of all memory files                           |
| `project_ui_library_v2.5.md` | UI token table, animation rules                     |
| `architecture.md`            | Monorepo map, ports, packages _(to create)_         |
| `api_patterns.md`            | Auth patterns, org scope, soft delete _(to create)_ |
| `common_errors.md`           | Known gotchas _(to create)_                         |

---

## Update Checklist

Run after any of these events:

- [ ] New API route added → update `API_ROUTES_MAP.md`
- [ ] Prisma model/enum change → update `SCHEMA_SNAPSHOT.md`
- [ ] Dependency version bump → update `WORKSPACE_INDEX.md`
- [ ] New app or port change → update `WORKSPACE_INDEX.md`
- [ ] Library docs re-fetched → update file in `context7/` with new date

---

## Token savings estimate

| Avoided action                             | Est. tokens saved |
| ------------------------------------------ | ----------------- |
| Re-scanning `app/api/**` (95 routes)       | ~3,000–6,000      |
| Re-reading `schema.prisma` (40 models)     | ~2,000–4,000      |
| Re-fetching Context7 docs (per library)    | ~2,000–5,000      |
| Re-reading `package.json` files (all apps) | ~500–1,000        |
| **Per session total (typical)**            | **~5,000–15,000** |
