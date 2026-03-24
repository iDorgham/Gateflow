# GateFlow AI Memory

<div align="center">

**Shared workspace memory for all AI tools**

_Read by Claude, Cursor, Gemini CLI, Kiro, Opencode, Kilo, and Qwen at session start_

</div>

---

## Purpose

Load these files instead of re-scanning the codebase to save tokens and get accurate, consistent context across all AI tools.

---

## Core Files

| File               | Load when                                             |
| :----------------- | :---------------------------------------------------- |
| `architecture.md`  | Any task — always load first                          |
| `api_patterns.md`  | API routes, auth, DB queries, QR, offline sync        |
| `common_errors.md` | Debugging, schema work, testing, UI components        |
| `modules.md`       | Scanner app, Residents, CRM, AI assistant, LoginShell |

---

## Codebase Snapshots

| File                            | Load when                               |
| :------------------------------ | :-------------------------------------- |
| `docs/cache/WORKSPACE_INDEX.md` | Dep versions, ports, env vars, commands |
| `docs/cache/API_ROUTES_MAP.md`  | Full route list (95+ routes)            |
| `docs/cache/SCHEMA_SNAPSHOT.md` | All 40 Prisma models + enums            |

---

## Update Policy

Update the relevant file whenever:

| Change                    | Update this file                |
| :------------------------ | :------------------------------ |
| New app, package, or port | `architecture.md`               |
| API route added/removed   | `docs/cache/API_ROUTES_MAP.md`  |
| Prisma model/enum changed | `docs/cache/SCHEMA_SNAPSHOT.md` |
| New gotcha or mistake     | `common_errors.md`              |
| Major feature shipped     | `modules.md`                    |

---

<div align="center">

_Keeping AI memory fresh = faster, more accurate responses_

</div>
