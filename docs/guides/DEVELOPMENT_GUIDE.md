# GateFlow Development Guide (Docs v2)

**Version:** 1.0  
**Aligned with:** `docs/PRD_v6.0.md`, `CLAUDE.md`, `GATEFLOW_CONFIG.md`  

---

## 1. Local Setup

### 1.1 Prerequisites

- Node.js (LTS; see project `.nvmrc` if present).
- pnpm ≥ 8 (package manager).
- PostgreSQL 15+ (local or remote instance).

### 1.2 Install Dependencies

From the repo root:

```bash
pnpm install
```

> **Note:** Use **pnpm only**. Do not use `npm` or `yarn`.

### 1.3 Environment Variables

- Copy example envs to local files per app (see `docs/guides/ENVIRONMENT_VARIABLES.md` for details).
- At minimum:
  - `DATABASE_URL` for the database.
  - `QR_SIGNING_SECRET` for QR security.

---

## 2. Running Apps

### 2.1 All Apps (Turborepo)

```bash
pnpm turbo dev
```

### 2.2 Individual Apps

```bash
pnpm turbo dev --filter=client-dashboard
pnpm turbo dev --filter=scanner-app
pnpm turbo dev --filter=marketing
# resident-portal, admin-dashboard, etc. follow the same pattern
```

See `CLAUDE.md` for full port mapping and commands.

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

Conventions:

- Schema file: `packages/db/prisma/schema.prisma`.
- Respect multi‑tenant and soft‑delete conventions (see `SECURITY_OVERVIEW.md` and contracts).

---

## 4. Testing, Linting & Typechecking

Global via Turborepo:

```bash
pnpm turbo lint
pnpm turbo test
pnpm turbo typecheck
pnpm turbo build
```

Per app (examples):

```bash
pnpm --filter=client-dashboard test
pnpm --filter=scanner-app test
```

Follow any additional instructions in each app’s README where present.

---

## 5. AI‑Assisted Workflows (Cursor & CLIs)

GateFlow uses a phased workflow orchestrated by Cursor and CLIs (Claude, Gemini, etc.).

### 5.1 Master Slash Commands (Cursor)

- `/idea` — Capture and refine initiatives into `docs/plan/context/IDEA_<slug>.md`.
- `/plan` — Turn an idea into multi‑phase `PLAN_<slug>.md` + per‑phase prompts.
- `/dev` — Implement **one phase** using its prompt (code, tests, docs, git).
- `/ship` — Run all remaining phases for a plan sequentially.

Supporting commands (see `.cursor/rules/01-gateflow-ai-workflow.mdc` and legacy guidelines in `docs/archive/plan-legacy/guidelines`):

- `/ready` (pre‑dev checks), `/github` (branch/commit/push), `/test`, `/docs`, `/security`, `/perf`, `/clis`, `/automate`.

### 5.2 Plan & Prompt Files

- Ideas: `docs/plan/context/IDEA_<slug>.md`
- Plans: `docs/plan/execution/PLAN_<slug>.md`
- Phase prompts: `docs/plan/execution/PROMPT_<slug>_phase_<N>.md`

Template & skills:

- `docs/archive/plan-legacy/execution/TEMPLATE_PROMPT_phase.md` (template; may be moved into `docs/plan/`).
- `.cursor/skills/gf-planner/SKILL.md` — planning and phase prompts.
- `.cursor/skills/gf-dev/SKILL.md` — implementation workflow.
- `.cursor/skills/pro-prd-writer/SKILL.md` — PRD and docs alignment.

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

- **Product spec:** `docs/PRD_v6.0.md`
- **Security:** `docs/guides/SECURITY_OVERVIEW.md`, `.cursor/rules/00-gateflow-core.mdc`, `.cursor/contracts/CONTRACTS.md`
- **Architecture:** `docs/guides/ARCHITECTURE.md`
- **Environment variables:** `docs/guides/ENVIRONMENT_VARIABLES.md`
- **Legacy guidance & patterns:** `docs/archive/plan-legacy/**`

