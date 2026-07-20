# Antigravity /guide — GateFlow Workspace Guide

**Canonical workflow:** `.agents/workflows/guide.md` (synced via `pnpm sync`).

**Skill:** `.agents/skills/gf-guide/SKILL.md`

---

## What `/guide` does

- **Router:** `/guide plan|phase|ready|develop|test|github|security|all` → fires the matching GateFlow command.
- **Coach:** bare `/guide` or “what should I do now” → Situation → Teach → Ask → Action → Motivate, plus Must do / Recommended / Critical.
- **Does not execute phases** — use `/dev` or `/ship` for that.

---

## Copy-paste prompt (Antigravity / Gemini CLI)

```text
**Command:** /guide (GateFlow workspace guide)

**Request:** Act as the GateFlow workspace guide. Load `.agents/skills/gf-guide/SKILL.md` and `docs/development/learning/GUIDE_PREFERENCES.md`.

Produce a coach report:

### Situation
### Teach
### Ask
### Action
#### Must do
#### Recommended
#### Critical
### Motivate
### Next command
(one copy-ready /dev, /plan, /prompt, or shell line)

**Context to load:**
- `docs/plan/` — Active / Ready / Draft plans and next phase
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md`
- `docs/development/learning/GUIDE_PREFERENCES.md`
- Git status; preflight green/unknown/red

**Rules:** pnpm only; organizationId scope; deletedAt null; QR HMAC-SHA256. Ref: `docs/CLAUDE.md`.

**Not GateFlow:** `.ai/commands/guide.md` is Sovereign/AIWF — ignore for this repo’s phased loop.
```

---

## Usage

1. Copy the block above into Antigravity or Gemini CLI, or run `/guide` in Cursor.
2. For routing only: `/guide phase 2`, `/guide plan my_feature`, etc.
