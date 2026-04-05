# GateFlow Development Guide

**Version:** 2.0
**Aligned with:** `docs/PRD.md`, `CLAUDE.md`, `GATEFLOW_CONFIG.md`

> **New:** See [AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md) for the complete Ralph automation system — all scripts, git hooks, and workflows.

---

## 1. Local Setup

### 1.1 Prerequisites

- Node.js 20+ (LTS)
- pnpm ≥ 8 (package manager)
- PostgreSQL 15+ (local or remote instance)

### 1.2 Automated Onboarding (Recommended)

```bash
pnpm install
pnpm setup:dev    # interactive: sets up env, DB, husky
```

### 1.3 Manual Install

From the repo root:

```bash
pnpm install
```

> **Note:** Use **pnpm only**. Do not use `npm` or `yarn`.

### 1.4 Environment Variables

- Use `pnpm setup:dev` to generate `.env.local` interactively.
- Or copy manually and fill in (see `docs/guides/ENVIRONMENT_VARIABLES.md`).
- At minimum:
  - `DATABASE_URL` for the database.
  - `QR_SIGNING_SECRET` for QR security.
  - `NEXTAUTH_SECRET` for auth sessions.

---

## 2. Running Apps

### 2.1 All Apps (Turborepo)

```bash
pnpm dev               # all apps via Turborepo
```

### 2.2 Individual Apps

```bash
pnpm dev:client        # client-dashboard (port 3001)
pnpm dev:admin         # admin-dashboard
pnpm dev:marketing     # marketing site
pnpm dev:scanner       # Expo scanner app
```

### 2.3 Dev Ports

| App                | Port | Start command                         |
| ------------------ | ---- | ------------------------------------- |
| `marketing`        | 3000 | `next dev -p 3000`                    |
| `client-dashboard` | 3001 | `next dev -p 3001 -H 0.0.0.0`         |
| `admin-dashboard`  | 3002 | `next dev -p 3002`                    |
| `scanner-app`      | 8081 | `expo start --lan -c` (Metro bundler) |

---

## 3. Database Workflow

From `packages/db`:

```bash
cd packages/db

# Generate Prisma client
npx prisma generate

# Apply schema to dev DB
npx prisma db push

# Create and run a new migration (dev only)
npx prisma migrate dev

# Seed data
npx prisma db seed

# Inspect with Prisma Studio
npx prisma studio
```

**Seed flags and traffic emulation** (dry-run, integrity checks, CLI emulation): see [SEED_AND_EMULATION_CLI.md](./SEED_AND_EMULATION_CLI.md).

Conventions:

- Schema file: `packages/db/prisma/schema.prisma`.
- Respect multi‑tenant and soft‑delete conventions (see `SECURITY_OVERVIEW.md` and contracts).

---

## 4. Testing, Linting & Typechecking

```bash
pnpm preflight                          # lint + typecheck + test (all) — run before every push

# Individually
pnpm lint
pnpm test
pnpm typecheck

# Per workspace
pnpm --filter=client-dashboard test
pnpm --filter=scanner-app lint
```

> The `pre-push` git hook runs `pnpm preflight` automatically before every push.

### Quality Checks

```bash
pnpm check:env              # validate env vars across all apps
pnpm check:secrets          # scan repo for leaked secrets
pnpm check:imports          # find circular dependencies
pnpm check:todos            # list all TODO/FIXME with author + age
pnpm check:db-drift         # detect schema drift vs baseline
pnpm check:bundle           # bundle size vs baseline
pnpm check:pre-deploy       # full pre-deploy checklist (5 checks)
```

See [AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md) for full details on all check commands.

---

## 5. AI‑Assisted Workflows (Cursor & CLIs)

GateFlow uses a phased workflow orchestrated by Cursor and CLIs (Claude, Gemini, etc.).

### 5.1 Master Slash Commands (Cursor)

| Command  | Purpose                                                                           |
| -------- | --------------------------------------------------------------------------------- |
| `/idea`  | Capture and refine initiatives into `docs/development/initiatives/IDEA_<slug>.md` |
| `/plan`  | Turn an idea into multi-phase `PLAN_<slug>.md` + per-phase prompts                |
| `/dev`   | Implement **one phase** end-to-end (code, tests, docs, git)                       |
| `/ship`  | Run all remaining phases for a plan sequentially                                  |
| `/guide` | Workspace guide — what to do next, active plan, recommended actions               |

Supporting commands (see `.antigravity/rules/01-gateflow-ai-workflow.mdc` and legacy guidelines in `docs/archive/plan-legacy/guidelines`):

- `/ready` (pre‑dev checks), `/github` (branch/commit/push), `/test`, `/docs`, `/security`, `/perf`, `/clis`, `/automate`.

### 5.2 Plan & Prompt Files

| File                   | Location                                            |
| ---------------------- | --------------------------------------------------- |
| Initiative ideas       | `docs/development/initiatives/IDEA_<slug>.md`       |
| Active plans + prompts | `docs/plan/Draft/<slug>/PLAN_<slug>.md`             |
| Phase prompts          | `docs/plan/Draft/<slug>/PROMPT_<slug>_phase_<N>.md` |
| Phase task checklist   | `docs/plan/Draft/<slug>/TASKS_<slug>.md`            |
| Completed plans        | `docs/plan/Complete/<slug>/`                        |

Template & skills:

- `docs/archive/plan-legacy/execution/TEMPLATE_PROMPT_phase.md` (template; may be moved into `docs/plan/`).
- `.antigravity/skills/gf-planner/SKILL.md` — planning and phase prompts.
- `.antigravity/skills/gf-dev/SKILL.md` — implementation workflow.
- `.antigravity/skills/pro-prd-writer/SKILL.md` — PRD and docs alignment.

### 5.3 Phase Definition of Done

Per `PHASED_DEVELOPMENT_WORKFLOW` (archived guidelines) and updated plans:

- All acceptance criteria in the phase prompt are satisfied.
- Lint, tests, and typechecks pass for affected workspaces (or a documented exception is agreed).
- Relevant docs (PRD, guides, or plan files) are updated.
- Changes are committed on an appropriate branch.

---

## 6. Coding Conventions

Key points (see `CLAUDE.md` and core rules for full list):

- **TypeScript:**
  - Strict mode, ES2020 target.
  - Use workspace packages (`@gate-access/db`, `@gate-access/types`, etc.) over deep relative imports.
- **API routes (Next.js App Router):**
  - Use shared auth helpers (`require-auth`, cookies, CSRF).
  - Always scope by `organizationId` and filter `deletedAt: null`.
  - Use Zod or equivalent for input validation.
- **Security & QR contracts:**
  - Never bypass QR signing or `scanUuid` contracts.
  - Keep scanner offline queue behavior intact when changing mobile flows.

---

## 7. Where to Look for More

- **Product spec:** `docs/PRD.md`
- **Security:** `docs/guides/SECURITY_OVERVIEW.md`, `.antigravity/rules/00-gateflow-core.mdc`, `.antigravity/contracts/CONTRACTS.md`
- **Architecture:** `docs/guides/ARCHITECTURE.md`
- **Environment variables:** `docs/guides/ENVIRONMENT_VARIABLES.md`
- **Legacy guidance & patterns:** `docs/archive/plan-legacy/**`
