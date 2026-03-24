# GateFlow AI Memory

Shared workspace memory — read by Claude, Cursor, Gemini CLI, Kiro, Opencode,
Kilo, and Qwen at the start of every session.

**Load these files instead of re-scanning the codebase** to save tokens and
get accurate, consistent context across all AI tools.

## Files

| File               | Load when                                             |
| ------------------ | ----------------------------------------------------- |
| `architecture.md`  | Any task — always load first                          |
| `api_patterns.md`  | API routes, auth, DB queries, QR, offline sync        |
| `common_errors.md` | Debugging, schema work, testing, UI components        |
| `modules.md`       | Scanner app, Residents, CRM, AI assistant, LoginShell |

## Codebase Snapshots (deeper reference)

| File                            | Load when                               |
| ------------------------------- | --------------------------------------- |
| `docs/cache/WORKSPACE_INDEX.md` | Dep versions, ports, env vars, commands |
| `docs/cache/API_ROUTES_MAP.md`  | Full route list (95+ routes)            |
| `docs/cache/SCHEMA_SNAPSHOT.md` | All 40 Prisma models + enums            |

## Update Policy

Update the relevant file whenever:

- A new app, package, or port is added → `architecture.md`
- An API route is added/removed → `docs/cache/API_ROUTES_MAP.md`
- A Prisma model/enum changes → `docs/cache/SCHEMA_SNAPSHOT.md`
- A new gotcha or recurring mistake is found → `common_errors.md`
- A module ships a new major feature → `modules.md`
