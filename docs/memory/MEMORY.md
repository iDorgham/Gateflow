# Project Memory

> Persistent AI context — loaded at the start of every session.

## Index

| File               | Type     | Contents                               | Load when   |
| ------------------ | -------- | -------------------------------------- | ----------- |
| `architecture.md`  | project  | Monorepo structure, tech stack, ports  | Any task    |
| `api_patterns.md`  | project  | Auth, org scoping, route conventions   | API work    |
| `common_errors.md` | feedback | Known gotchas, recurring mistakes      | Debugging   |
| `decisions.md`     | project  | Architectural decisions with rationale | Design work |

## Quick Facts

- **Package manager:** pnpm
- **Soft deletes:** always filter `deletedAt: null`
- _(add more as you learn them)_
