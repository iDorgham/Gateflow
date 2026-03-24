---
name: man
description: One Man — one command, seven domains (Code, Brand, SaaS, Marketing, Business, Content, Copywrite). Subcommands give more power. Tasks, settings, mindset, inspire, run, ship.
---

# /man — One Man

**One command, seven domains.** Subcommands **give more power** — faster, easier workflow. Task manager, settings, mindset (change profile), inspire, run, ship.

**Domains:** Code | Brand | SaaS | Marketing | Business | Content | Copywrite

See `docs/plan/ONE_MAN_CODE.md` and `one-man` skill.

---

## What /man does

1. **Scans state** — Backlog, planning, planned, in-progress, done, git, preflight; current profile from memory
2. **Assesses** — What's next? Blocked? Ready?
3. **Guides in chat** — One step at a time; confirms before long runs
4. **Recommends or executes** — Single clear action, or run it

---

## Subcommands

| Subcommand | Purpose |
|------------|---------|
| `/man` (default) | Status + next action; ask or remember domain; guide in chat |
| `/man code` | One Man Code — tasks, run, ship, settings |
| `/man brand` | One Man Brand — voice, guidelines, assets |
| `/man saas` | One Man SaaS — tenant scope, RBAC, plans, audit |
| `/man marketing` | One Man Marketing — campaigns, channels |
| `/man business` | One Man Business — goals, positioning, metrics |
| `/man content` | One Man Content — strategy, structure, SEO |
| `/man copywrite` | One Man Copywrite — copy, headlines, UX copy |
| **`/man tasks`** | **Task manager** — list, add, move, start, focus |
| **`/man settings`** | Interactive wizard — GitHub, MCPs, skills, planning flow |
| **`/man mindset`** | **Change profile** — list profiles, set current |
| `/man inspire` | Ideation with user — create something new |
| `/man run` | Execute next step (context: current domain) |
| `/man go` | Same as `run` |
| `/man ship <slug>` | Ship plan to completion (code) |
| `/man status` | Quick overview |

### Task manager (`/man tasks`)

- **List** — Backlog / planning / planned / in-progress / done with counts; active plan and next phase
- **Add** — `/man tasks add "Dark mode toggle"` — quick-add to backlog
- **Move** — Move a plan between folders (e.g. planning → planned)
- **Start** — Start next phase for chosen plan (same as run for that plan)
- **Focus** — Set active plan for subsequent `/man run`

### Settings (`/man settings`)

Step-by-step wizard: GitHub (auto branch/commit/push), GitHub auth (PAT for MCP), planning flow (requirements-first / design-first / quick), MCPs (enable/disable), skills (enable/disable). Persists to `docs/plan/learning/ONE_MAN_CODE_SETTINGS.md`.

### Mindset (`/man mindset`)

List available profiles (seven domains); show current; set current profile with `/man mindset <name>`. Persists to `docs/plan/learning/ONE_MAN_MEMORY.md`. Next `/man` uses this profile.

### Inspire (`/man inspire`)

Collaborative ideation: ask area, clarify, propose directions, output short idea; suggest saving to backlog or IDEA.

---

## Folder structure (task manager)

```
docs/plan/
  backlog/        → Raw tasks
  context/        → IDEA_<slug>.md
  planning/       → Draft plans
  planned/        → Ready for dev
  in-progress/    → Active development
  done/           → Completed
```

---

## Implementation notes (for agents)

- **Always load** `one-man` skill when handling `/man`.
- **`/man mindset`:** List profiles (seven domains), show current, set and persist to ONE_MAN_MEMORY.md.
- **`/man tasks`:** Task manager. List: scan backlog, planning, planned, in-progress, done; output counts and active plan. Add: append to backlog. Move: use plan-move.md. Start/Focus: set active and run.
- **`/man settings`:** Run wizard. One step at a time; persist to `docs/plan/learning/ONE_MAN_CODE_SETTINGS.md`. Do not write PAT or secrets; guide user to add to `.cursor/mcp.json`.
- **Skills:** If `ONE_MAN_CODE_SETTINGS.md` exists and lists `skillsDisabled`, skip loading those skills when running `/man run` or `/man ship`.
- **Default `/man`:** Scan folders, git, preflight; report status and single recommended step.
- **`/man run`:** If autoGithub in settings, run /github after phase. Else same as before: resolve action, run /dev, preflight.
- **`/man ship <slug>`:** Resolve plan, run `/dev` until done. Move to done/ when last phase complete.
- **Pre-start check:** Before running a phase or non-trivial task, validate plan slug, phase, scope; if off or risky, warn in chat and ask "Proceed anyway? (yes / no / fix)."
- **Agents & skills:** Per phase prompt — adopt Primary role, load Skills (excluding skillsDisabled), use MCP, invoke subagents. SaaS: prefer BACKEND-API + FRONTEND for dashboard/settings/team.
