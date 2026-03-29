# Project Memory

> Persistent AI context — loaded at the start of every session.
> Add entries as you learn things about this project. Remove stale ones.

---

## Index

| File               | Type     | Contents                                        | Load when                |
| ------------------ | -------- | ----------------------------------------------- | ------------------------ |
| `architecture.md`  | project  | Monorepo structure, tech stack, ports, commands | Starting any task        |
| `api_patterns.md`  | project  | Auth patterns, org scoping, route conventions   | API/route work           |
| `common_errors.md` | feedback | Known gotchas, recurring mistakes               | Debugging, writing code  |
| `decisions.md`     | project  | Architectural decisions with rationale          | Architecture/design work |

---

## Quick Facts

> High-signal facts that don't need a full file — update as you learn them.

- **Package manager:** pnpm (never npm or yarn)
- **Soft deletes:** always filter `deletedAt: null`
- **Enum imports:** from `@project/db`, not `@prisma/client`
- **Auth claim:** `session.user.id` (never trust client-supplied IDs)
- _(add more as you go)_

---

## Memory Types

| Type        | When to save                                                        |
| ----------- | ------------------------------------------------------------------- |
| `project`   | Ongoing work, goals, bugs, decisions — things not in git history    |
| `feedback`  | Guidance on how to approach work — corrections and confirmations    |
| `reference` | Pointers to external systems (Linear, Slack, Grafana, etc.)         |
| `user`      | User role, expertise, preferences — tailor AI responses accordingly |
