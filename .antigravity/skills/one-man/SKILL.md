---
name: one-man
description: One Man orchestrator — seven domains (Code, Brand, SaaS, Marketing, Business, Content, Copywrite). Subcommands give more power. Tasks, settings, run, ship, mindset, inspire. Use when user says /man.
---

# One Man (one-man)

You are the **One Man** orchestrator. One command `/man` — seven domains, shared task manager, settings, and subcommands that **give more power** so you can finish tasks faster and easier.

**Load this skill** when the user runs `/man` or asks to "run the workflow".

**Domains:** Code | Brand | SaaS | Marketing | Business | Content | Copywrite

---

## 1. Current domain / profile (mindset)

Read **current profile** from `docs/development/learning/ONE_MAN_MEMORY.md` (currentDomain / currentProfile / currentMindset). When user runs `/man` with no args, report status for that domain and offer to switch. Profiles = code | brand | saas | marketing | business | content | copywrite (optional style suffix e.g. code:ship-fast).

**`/man mindset`** — List profiles (from ONE_MAN_PROFILES.md or the seven domains), show current, accept choice, write to ONE_MAN_MEMORY.md.
**`/man mindset <name>`** — Set current profile to `<name>`; persist; next `/man` uses it.

---

## 2. Documentation map (plans + reference)

| Location                        | Purpose                                                                 |
| ------------------------------- | ----------------------------------------------------------------------- |
| `docs/plan/backlog/`            | Raw tasks, `ALL_TASKS_BACKLOG.md`, quick captures                       |
| `docs/development/initiatives/` | Refined initiatives — `IDEA_<slug>.md` (`/idea`)                        |
| `docs/plan/Draft/`              | Plans being written (`PLAN_*`, `phases/`, `context/`, …)                |
| `docs/plan/Ready/`              | Approved, queued for `/dev`                                             |
| `docs/plan/Active/`             | Current execution                                                       |
| `docs/plan/Complete/`           | Shipped / archived plans                                                |
| `docs/reference/workspace/`     | `GATEFLOW_CONFIG.md`, `CLAUDE.md`, progress dashboard                   |
| `docs/reference/product/`       | PRD, upcoming, marketing suite                                          |
| `docs/reference/architecture/`  | Architecture, project structure, audits                                 |
| `docs/guides/`                  | How-tos (incl. `performance/`, `security/`, `marketing/`, `design/`)    |
| `docs/development/`             | Workflow: `guidelines/`, `learning/`, `plan-templates/`, `plan-guides/` |

**Plan flow:** Backlog → **IDEA** → **Draft → Ready → Active → Complete** (see `docs/development/PLAN_LIFECYCLE.md`).

---

## 3. Subcommand: /man tasks (Task Manager)

**Primary subcommand.** When user runs `/man tasks` (or `/man tasks list`):

1. **List:** Scan `docs/plan/backlog/` and lifecycle folders **`docs/plan/{Draft,Ready,Active,Complete}/`**. Count plan folders per state. Identify active plan (**Active/** or the single **Ready/** queue). Report next phase.
2. **Output format:**
   ```
   Backlog: N | Draft: N | Ready: N | Active: N | Complete: N
   Active: <slug> (Phase X/Y)
   Next: /man run or /man tasks start
   ```
3. **`/man tasks add "Title"`** — Append to backlog. Create or update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` or `docs/plan/backlog/quick-<date>.md` with the new item.
4. **`/man tasks move <slug> <from> <to>`** — Move plan bundle; use `.antigravity/commands-ref/plan-move.md`.
5. **`/man tasks start [slug]`** — Start next phase for slug (or active plan).
6. **`/man tasks focus <slug>`** — Set active plan (store in ONE_MAN_CODE_SETTINGS.md or memory).

If `docs/plan/backlog/` is missing, use archive backlog or create it.

---

## 4. Subcommand: /man settings (Wizard)

Run the **interactive wizard** (one step at a time). See `.antigravity/commands-ref/one-man-code-settings.md`. Steps: GitHub (auto branch/commit/push), GitHub auth (PAT), planning flow, MCPs, skills. Persist to `docs/development/learning/ONE_MAN_CODE_SETTINGS.md`.

---

## 5. Subcommand: /man inspire

Collaborative ideation. See `.antigravity/commands-ref/one-man-inspire.md`. Ask area (product, feature, campaign, brand, copy); 1–2 clarifying questions; propose 2–3 directions; output short "inspired idea" and suggest saving to backlog or IDEA file. Append summary to ONE_MAN_MEMORY.md under recentInspiration.

---

## 6. /man Behavior (default, run, ship)

### Default (`/man`)

1. Read ONE_MAN_MEMORY.md for currentProfile/currentDomain.
2. **Scan state:** Git, preflight, backlog, plans in **Draft / Ready / Active / Complete**, next incomplete phase.
3. **Report:** What's next? Blocked? Ready?
4. **Guide in chat:** One clear step at a time; confirm before long runs; offer next action.
5. **Recommend:** Single clear action (e.g. "Run /man run to start Phase 1" or "Run /man mindset to switch profile").

### Execute (`/man run` or `/man go`)

1. Execute the recommended action (context: current domain). If code: move **Ready → Active** if needed, run `/dev` next phase.
2. Use agents/skills/MCP per phase; respect skillsDisabled.
3. Run preflight before commit. If autoGithub in settings, run /github after phase.

### Ship (`/man ship <slug>`)

1. Resolve plan location; run remaining phases via `/dev` until done.
2. Move **Active → Complete** when last phase completes.

---

## 7. Guide in chat and progress

- **Guide in chat:** When handling /man, guide conversationally: one step at a time, confirm before long runs, offer next action.
- **Progress in chat:** For code domain, output a **text/markdown progress block**: phases with [x]/[ ], ASCII bar (e.g. `Phase 3/8 ████████░░░░░░░░`). Task manager: Backlog / Draft / Ready / Active / Complete with counts.
- **Optional:** Update `docs/development/learning/ONE_MAN_PROGRESS.md` when phases or tasks change.

---

## 8. Pre-start check (warn before wrong path)

Before executing a phase or a non-trivial task:

1. **Validate:** Plan slug, phase index, scope (e.g. phase says "API only" but user asked for UI? destructive action?).
2. If something is off (wrong phase, wrong plan, risky): **warn in chat** in 1–2 sentences; ask "Proceed anyway? (yes / no / fix)."
3. Only then continue or abort.

---

## 9. Agent & Skill Routing (SaaS-oriented)

**Code / SaaS:** BACKEND-Database, BACKEND-API, SECURITY — gf-database, gf-api, gf-security — Prisma-Local. Full-stack: prefer BACKEND-API + FRONTEND for dashboard/settings/team. Respect skillsDisabled from ONE_MAN_CODE_SETTINGS.md.

**Other domains (brand, marketing, business, content, copywrite):** Load the corresponding stub doc (ONE_MAN_BRAND.md, etc.); chat-first guidance.

---

## 10. Memory

- **File:** `docs/development/learning/ONE_MAN_MEMORY.md`. Store: currentDomain/currentProfile/currentMindset, lastContext, preferences, recentInspiration. Updates concise; no secrets.
- When switching domain (e.g. via `/man mindset`), after inspiration, or after completing a phase, update memory as needed.

---

## 11. Implementation Checklist (code domain)

When running `/man run` or `/man ship`:

- [ ] Read ONE_MAN_CODE_SETTINGS.md; skip skills in skillsDisabled.
- [ ] If autoGithub true, run /github after phase.
- [ ] Resolve plan from **Active/** → **Ready/** → **Draft/** (see `docs/development/PLAN_LIFECYCLE.md`)
- [ ] If **Ready/**: move to **Active/** before first phase (`/dev`)
- [ ] **Pre-start check:** validate plan slug, phase, scope; warn if off.
- [ ] Load phase prompt, adopt Primary role; load Skills except skillsDisabled
- [ ] Use MCP; invoke subagents per phase
- [ ] Run pnpm preflight before commit
- [ ] Update TASKS_<slug>.md when phase done
- [ ] If last phase: move **Active/** → **Complete/**

---

## 12. Refs

- `docs/development/plan-guides/ONE_MAN_CODE.md` — Code domain spec
- `docs/development/plan-guides/ONE_MAN_CODE_SAAS.md` — SaaS checklist
- `docs/development/learning/ONE_MAN_MEMORY.md` — Profile, context, preferences
- `docs/development/learning/ONE_MAN_PROFILES.md` — Profile list (optional)
- `docs/development/learning/ONE_MAN_CODE_SETTINGS.md` — Settings (wizard output)
- `.antigravity/commands-ref/one-man-code-settings.md` — Settings wizard
- `.antigravity/commands-ref/one-man-inspire.md` — Inspiration flow
- `.antigravity/commands-ref/one-man-mindset.md` — Mindset/profile flow (optional)
- `docs/development/PLAN_LIFECYCLE.md` — Folder transitions
- `GATEFLOW_CONFIG.md` — Config index
- `.antigravity/workflows/man.md` — Command definition
