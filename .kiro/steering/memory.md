---
inclusion: always
---

# GateFlow AI Memory

Load these files at session start to avoid re-scanning the codebase.

## Always load

- `.ai-memory/architecture.md` — monorepo, apps, ports, mandates, commands
- `.ai-memory/api_patterns.md` — auth, org scope, soft deletes, QR, offline sync
- `.ai-memory/common_errors.md` — Prisma gotchas, TS/test pitfalls, UI quirks
- `.ai-memory/modules.md` — scanner flow, Residents, CRM, AI assistant

## Load when relevant

- `docs/cache/API_ROUTES_MAP.md` — full route list (instead of globbing api/)
- `docs/cache/SCHEMA_SNAPSHOT.md` — all 40 Prisma models + enums
- `docs/cache/WORKSPACE_INDEX.md` — dep versions, env vars, ports

## Core rules (summary)

- **pnpm only** — never npm or yarn
- **Every DB query** must include `organizationId` scope
- **Soft deletes** — always filter `deletedAt: null`, never hard delete
- **Enums** — import from `@gate-access/db`, not `@prisma/client`
- **Auth** — `auth.sub` = userId (not `auth.userId`)
- **QR** — every QR must be HMAC-SHA256 signed
- **RTL** — all UI must support en + ar-EG

Full context in `.ai-memory/` files above.
