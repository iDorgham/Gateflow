---
name: guide
description: GateFlow workspace guide — phase router plus coach. Directs to the right command; does not execute phases. Load gf-guide for full assessment.
---

# /guide — Workspace Guide (Router + Coach)

## Workflow v2 status contract

Start with `pnpm workflow:v2:guide --json` (or `status|next|prompt|delivery`)
and render the result with `.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`.
Every response must include: `Active application`, `Current stage`,
`Current plan`, `Pilot-flow coverage`, `Page-score summary`, `Blockers`, and
`Next command`. Refuse unrelated application work and route to `/focus`,
`/audit`, `/plan`, `/dev`, `/check`, or `/certify` according to the state. End
with exactly one copy-ready command.

Guide agent: `.agents/agents/workflow-v2/gateflow-guide.md` (skill: `gf-guide`).

**GateFlow workflow guide.** Interprets intent, routes to the right slash command, and coaches with Situation → Teach → Ask → Action → Motivate.

**Load skill:** `.agents/skills/gf-guide/SKILL.md` for pre-flight, state scan, and full “what should I do now” reports. Read `docs/development/learning/GUIDE_PREFERENCES.md` for user tone and priorities.

## Execution boundary

| Command      | Role                                                       |
| ------------ | ---------------------------------------------------------- |
| **`/guide`** | Direct and coach only — **does not** implement phases      |
| **`/dev`**   | Execute one phase end-to-end (preflight, code, tests, git) |
| **`/ship`**  | Execute all remaining phases sequentially                  |
| **`/pilot`** | Orchestrate pilot application through certification        |

---

## Mode A — Router (explicit subcommand)

When the user adds text after `/guide` that maps to a known token, **fire the target command** (or tell them to run it) without re-explaining the whole lifecycle.

### Sub-commands

| Command     | When to fire                                          |
| ----------- | ----------------------------------------------------- |
| `/plan`     | User wants plan, breakdown, or starting new epic      |
| `/prompt`   | Need phase prompt for implementation                  |
| `/dev`      | Implementing code for current phase                   |
| `/ship`     | Running all remaining phases to completion            |
| `/pilot`    | Orchestrating pilot application through certification |
| `/test`     | Focused test suites or full preflight runs            |
| `/check`    | Deterministic workspace checks                        |
| `/docs`     | Behavior changed, need to update docs                 |
| `/audit`    | Evidence-backed read-only app/system audit            |
| `/security` | Auth, RBAC, multi-tenant, QR review                   |
| `/github`   | Branch, commit, push — after phase done               |
| `/deploy`   | Deploying app changes to environments                 |

### Shorthand (user types after `/guide`)

| User says         | Fire                              |
| ----------------- | --------------------------------- |
| `/guide status`   | `pnpm workflow:v2:guide status`   |
| `/guide next`     | `pnpm workflow:v2:guide next`     |
| `/guide prompt`   | `pnpm workflow:v2:guide prompt`   |
| `/guide delivery` | `pnpm workflow:v2:guide delivery` |
| `/guide check`    | `/check`                          |
| `/guide plan X`   | `/plan X`                         |
| `/guide phase N`  | `/prompt phase N`                 |
| `/guide dev`      | `/dev`                            |
| `/guide ship`     | `/ship`                           |
| `/guide github`   | `/github`                         |
| `/guide test`     | `/test`                           |
| `/guide security` | `/security`                       |
| `/guide audit`    | `/audit`                          |

### Phased flow (reference)

1. **Check** → `/check` (or `pnpm preflight`) — verify clean workspace before starting
2. **Plan** → `/plan <slug>` — create or refine phased plan
3. **Prompt** → `/prompt <slug> <N>` — load phase prompt
4. **Dev** → `/dev <slug> <N>` — implement, test, and commit phase
5. **Ship** → `/ship <slug>` — run remaining phases sequentially
6. **Audit/Certify** → `/audit` / `/certify` — verify pilot gates and evidence
7. **Deploy** → `/deploy <app>` when changes are ready for staging/prod

---

## Mode B — Coach (bare `/guide`, “what should I do now”, natural language)

When the user runs **`/guide`**, **`/guide what should I do now`**, or asks for direction without a router token:

1. **Load `gf-guide`** and run state assessment (git, plans under `docs/plan/`, preflight status, backlog).
2. Reply using **Situation → Teach → Ask → Action → Motivate** (concise; honor GUIDE_PREFERENCES).
3. Include **Must do**, **Recommended**, **Critical** (write `None` if empty). **Improvements** only when concrete.
4. End with **one copy-ready** next step: `/dev`, `/plan`, `/prompt`, or a single shell command.

### Coach response template

```markdown
### Situation

[1–3 bullets: branch, dirty tree, active plan + next phase, preflight unknown/green/red]

### Teach

[One short paragraph: why this matters now; minimal jargon]

### Ask

[One clarifying question only if blocked; otherwise skip or write "None — path is clear."]

### Action

#### Must do

- …

#### Recommended

- …

#### Critical

- None | …

### Motivate

[One sentence — forward motion, no hype]

### Next command

\`\`\`
/dev
\`\`\`
```

### Hardlocks

- **CLI 80%+:** Load `cli-limits`. Do not suggest that CLI unless the user explicitly approves. Offer Kiro, Kilo, Qwen, Opencode, or Cursor instead.
- **Security / tenant / QR work:** Remind to load `security` skill and `.agents/contracts/CONTRACTS.md`.
- **`packages/ui` changes:** Remind `pnpm preflight` before commit.

### Pre-flight (before non-trivial work)

If something should happen first (uncommitted work, failing preflight, wrong branch), offer:

- **1 — Proceed**
- **2 — Do suggestions first**

---

## Agents (role personas)

Adopt role for phase domain: `.agents/agents/roles/` (planning, security, backend-api, frontend, etc.). Scenarios: `.agents/agents/scenarios/` (code-review, security-audit).

## MCP (when available)

- **Prisma-Local** — migrations, schema, Prisma Studio
- **Context7** — docs for React, Next.js, Prisma
- **Browser / Playwright** — E2E verification
- **mcp-guide** — `.agents/skills/mcp-guide/SKILL.md`

## Rules (always apply)

- pnpm only
- `organizationId` scope; `deletedAt: null`
- QR payloads HMAC-SHA256 signed
- No secrets in git

## Related

- **`/man`** — seven-domain orchestrator (tasks, settings, mindset)
- **`/dev`** — execute one phase
- **`/ship`** — execute full plan
- Docs: `docs/workspace/COMMAND_GUIDE.md`, `docs/workspace/WORKSPACE_GUIDE.md`
