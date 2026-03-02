# One Man Code — Master Orchestrator

**One Man Code** is the master development orchestrator for GateFlow: task-manager folders, smart agents and skills, **SaaS-specialized**. One command to assess, recommend, or run the full workflow.

Remixes: [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD), [Kiro](https://kiro.dev/docs/specs/feature-specs/), Cursor workflows, GateFlow lifecycle.

---

## 1. Subcommands

| Subcommand | Purpose |
|------------|---------|
| `/man` (default) | Status + recommended next action |
| **`/man tasks`** | **Task manager** — list, add, move, start, focus |
| **`/man settings`** | Interactive wizard — GitHub, MCPs, skills, planning flow |
| `/man run` | Execute the recommended step |
| `/man ship <slug>` | Run plan end-to-end until done |
| `/man status` | Quick overview of all folders and next action |

---

## 2. Folder Structure (Task Manager)

```text
docs/plan/
  backlog/           # Raw tasks, ideas — not yet planned
    ALL_TASKS_BACKLOG.md
    quick-*.md
  context/           # Refined initiatives (IDEA_<slug>.md)
  planning/          # Plans being created
    <slug>/
      PLAN_<slug>.md
      PROMPT_<slug>_phase_<N>.md
      TASKS_<slug>.md
  planned/           # Plans ready for development
  in-progress/       # Actively being developed
  done/              # Completed plans
  learning/          # Patterns, incidents, decisions, ONE_MAN_CODE_SETTINGS.md
```

**Flow:** Backlog → Context → Planning → Planned → In Progress → Done

---

## 3. Task Manager (`/man tasks`)

- **List** — Backlog / planning / planned / in-progress / done with counts; active plan and next phase
- **Add** — `/man tasks add "Dark mode toggle"` — quick-add to backlog
- **Move** — Move a plan between folders (e.g. planning → planned)
- **Start** — Start next phase for chosen plan
- **Focus** — Set active plan for subsequent `/man run`

**Output format:**
```
Backlog: 3 | Planning: 1 | Planned: 1 | In progress: 1 | Done: 4
Active: project_dashboard (Phase 3/8)
Next: /man run or /man tasks start
```

---

## 4. Settings (`/man settings`)

Step-by-step wizard. Each step confirms before proceeding.

| Step | Configures | Target |
|------|------------|--------|
| 1. GitHub | Auto branch/commit/push on phase done | ONE_MAN_CODE_SETTINGS.md |
| 2. GitHub auth | PAT for MCP; guide to create if missing | .cursor/mcp.json |
| 3. Planning flow | requirements-first / design-first / quick | ONE_MAN_CODE_SETTINGS.md |
| 4. MCPs | Enable/disable; list installed | ONE_MAN_CODE_SETTINGS.md |
| 5. Skills | Enable/disable skills for OMC flows | ONE_MAN_CODE_SETTINGS.md |

---

## 5. Agents & Skills (Smart Routing)

**SaaS emphasis:** Multi-tenancy (`organizationId`), soft deletes, RBAC, tenant isolation. See `docs/plan/ONE_MAN_CODE_SAAS.md`.

**Backend phases:** BACKEND-Database, BACKEND-API, SECURITY — gf-database, gf-api, gf-security — Prisma-Local MCP.

**Frontend phases:** FRONTEND — gf-design-guide, react, tailwind — Context7, cursor-ide-browser.

**Full-stack:** Both; prefer BACKEND-API + FRONTEND for typical SaaS features (dashboard, settings, team).

---

## 6. Command Mapping

| Action | Delegates to |
|--------|--------------|
| Capture idea | /idea |
| Create plan | /plan |
| Mark ready | /plan ready <slug> |
| Execute phase | /dev |
| Ship all phases | /ship |
| What's next? | /guide |
| Preflight | /ready, pnpm preflight |

---

## 7. References

- `docs/plan/PLAN_LIFECYCLE.md` — Folder transitions
- `docs/plan/ONE_MAN_CODE_SAAS.md` — SaaS checklist
- `docs/plan/learning/ONE_MAN_CODE_SETTINGS.md` — Settings (from wizard)
- `.cursor/commands-ref/one-man-code-settings.md` — Settings wizard flow
- `.cursor/skills/one-man/SKILL.md` — One Man skill (Code domain)
- `GATEFLOW_CONFIG.md` — Config index
