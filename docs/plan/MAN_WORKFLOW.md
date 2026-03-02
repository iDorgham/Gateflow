# /man — One Man Code (Legacy Reference)

**One Man Code** is the method name for the `/man` master orchestrator. Full spec: **`docs/plan/ONE_MAN_CODE.md`** (subcommands: tasks, settings, run, ship, status; SaaS-specialized).

---

## 1. Folder Structure (Task Manager)

```text
docs/plan/
  backlog/           # Raw tasks, ideas — not yet planned
    ALL_TASKS_BACKLOG.md
    quick-*.md       # Quick-capture ideas
  context/          # Refined initiatives (IDEA_<slug>.md)
    IDEA_<slug>.md
  planning/         # Plans being created
    <slug>/
      PLAN_<slug>.md
      PROMPT_<slug>_phase_<N>.md
      TASKS_<slug>.md
  planned/          # Plans ready for development
    <slug>/
      ...
  in-progress/      # Actively being developed
    <slug>/
      ...
  done/             # Completed plans
    <slug>/
      ...
  learning/         # Patterns, incidents, decisions
```

**Flow:** Backlog → Context (idea) → Planning → Planned → In Progress → Done

---

## 2. What /man Does

**Single entry point.** When you run `/man`:

1. **Scans state** — Backlog, planning, planned, in-progress, done, git, preflight
2. **Assesses** — What's next? Blocked? Ready to ship?
3. **Recommends** — Clear next action (or executes in super-power mode)
4. **Orchestrates** — Invokes idea → plan → plan ready → dev with the right agents and skills

### Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Guide** | `/man` (default) | Report state, recommend next step |
| **Run** | `/man run` or `/man go` | Execute the recommended step |
| **Full** | `/man ship <slug>` | Run plan end-to-end (plan → dev → done) |

---

## 3. Agents & Skills (Smart Routing)

**Backend phases** (schema, API, DB, auth):
- **Primary role:** BACKEND-Database, BACKEND-API, SECURITY
- **Skills:** gf-database, gf-api, gf-security
- **MCP:** Prisma-Local (schema, migrations)
- **Subagents:** explore (trace flows), shell (preflight, migrate)

**Frontend phases** (UI, pages, components):
- **Primary role:** FRONTEND
- **Skills:** gf-design-guide, react, tailwind
- **MCP:** Context7 (docs), cursor-ide-browser (E2E)
- **Subagents:** browser-use (verify UI)
- **SuperDesign:** For new pages/redesigns

**Full-stack phases:**
- Both backend and frontend skills
- Prisma + Context7 + browser

**Security-critical:**
- **Primary role:** SECURITY
- **Skills:** gf-security
- **Commands:** /clis team audit
- **Multi-CLI:** Optional for high-risk

---

## 4. Accuracy & Speed

| Technique | Purpose |
|-----------|---------|
| **Phase prompts** | Concrete steps, file paths, acceptance criteria |
| **Given/When/Then** | Precise, testable requirements |
| **Primary role per phase** | Right context for backend vs frontend |
| **MCP** | Prisma for schema, Context7 for API docs |
| **Preflight gates** | Lint, typecheck, test before commit |
| **Escalation** | When scope grows, suggest breakdown |

---

## 5. Command Mapping

`/man` internally delegates to:

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

## 6. Typical Flow with /man

```
/man                    → "You have project_dashboard in planned/. Run /man run to start Phase 1."
/man run                → Moves planned → in-progress, runs /dev phase 1
/man run                → Runs /dev phase 2 (same plan)
/man ship project_dash  → Runs all remaining phases until done
```

---

## 7. References

- `docs/plan/PLAN_LIFECYCLE.md` — Folder transitions
- `docs/plan/PLANNING_ENHANCEMENTS.md` — BMad/Kiro remix
- `.cursor/skills/one-man/SKILL.md` — /man skill
- `GATEFLOW_CONFIG.md` — Full config index
