# GateFlow — Development Workflows

**Purpose:** Commands, workflows, skills, subagents, and rules to streamline GateFlow development.

---

## 1. Commands Reference

### Root scripts (run from repo root)

| Command | What it does |
|---------|--------------|
| `pnpm install` | Install all workspace dependencies |
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all workspaces |
| `pnpm test` | Run tests across monorepo |
| `pnpm typecheck` | Type-check all workspaces |
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm dev:client` | Start client-dashboard only (3001) |
| `pnpm dev:admin` | Start admin-dashboard only (3002) |
| `pnpm dev:scanner` | Start scanner-app only (8081) |
| `pnpm dev:marketing` | Start marketing only (3000) |
| `pnpm preflight` | Run lint + typecheck + test (pre-PR) |

### Turborepo filtered commands

```bash
# Single app
pnpm turbo dev --filter=client-dashboard
pnpm turbo dev --filter=admin-dashboard
pnpm turbo dev --filter=scanner-app
pnpm turbo dev --filter=marketing

# Single app build/test
pnpm turbo build --filter=client-dashboard
pnpm turbo test --filter=scanner-app

# Affected packages only (e.g. after git diff)
pnpm turbo build --filter=...[main]
pnpm turbo test --filter=...[main]
```

### Database (run from root or `packages/db`)

```bash
# From root
pnpm db:generate
pnpm db:studio

# From packages/db (more control)
cd packages/db
npx prisma generate              # After schema changes
npx prisma db push               # Push schema (dev, no migration)
npx prisma migrate dev           # Create + apply migration
npx prisma migrate dev --create-only --name add_unit  # Migration only
npx prisma db seed              # Seed database
npx prisma studio               # GUI
```

### Ports

| App | Port |
|-----|------|
| Marketing | 3000 |
| Client Dashboard | 3001 |
| Admin Dashboard | 3002 |
| Resident Portal | 3004 |
| Scanner App (Metro) | 8081 |
| Resident Mobile (Metro) | 8082 |

---

## 2. Development Workflows

### Workflow: Add a new API route

1. **Locate** the correct API directory (e.g. `apps/client-dashboard/src/app/api/` or `[locale]/api/`).
2. **Use template**: `.cursor/templates/TEMPLATE_API_route.md` for scaffold.
3. **Auth first**: `getSessionClaims()` or `requireAuth(request)`; reject if `!claims?.orgId`.
4. **Scope by org**: `where: { organizationId: claims.orgId, deletedAt: null }`
5. **Rate limit** if user-facing: `await rateLimit(request, { max: 10, window: '1m' })`
6. **Validate input** with Zod.
7. **Add tests** using `.cursor/templates/TEMPLATE_API_test.md`.
8. **Run** `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo test --filter=client-dashboard`.

**Contracts:** `.cursor/contracts/CONTRACTS.md` — invariants. **Reference:** `CLAUDE.md` API Route Pattern.

---

### Workflow: Add a new Prisma model or migration

1. **Edit** `packages/db/prisma/schema.prisma`.
2. **Add** `deletedAt DateTime?` and `@@index([deletedAt])` for mutable models.
3. **Add** `organizationId` and `@@index([organizationId])` for tenant models.
4. **Run** `pnpm db:generate`.
5. **Create migration**: `cd packages/db && npx prisma migrate dev --name add_<model_name>`.
6. **Update** `packages/types` if new enums/types are needed.
7. **Run** `pnpm turbo build` to ensure all apps still build.

**Reference:** `packages/db/prisma/schema.prisma`, `.kiro/steering/prisma-queries.md`.

---

### Workflow: Add a new React component

1. **Check** if `@gate-access/ui` already has a similar component.
2. **Create** in app's `components/` or `packages/ui` if shared.
3. **Use** workspace imports: `import { Button } from '@gate-access/ui'`.
4. **i18n**: Use `useTranslations('namespace')` for user-facing text.
5. **Client components**: Add `'use client'` when using hooks/events.
6. **Run** `pnpm turbo lint --filter=<app>`.

**Reference:** `.kiro/steering/component-development.md`, `docs/UI_COMPONENT_LIBRARY.md`.

---

### Workflow: Pre-PR checklist (preflight)

1. `pnpm preflight` (or manually: `pnpm lint && pnpm typecheck && pnpm test`).
2. Ensure no `console.log` or debug code left.
3. Verify `.env` is not committed.
4. Check multi-tenant scoping on any new queries.
5. Run affected app(s) locally: `pnpm dev:client` etc.
6. Create PR with clear description; reference task from `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.

---

### Workflow: New feature (full flow)

1. **Scope** from backlog: `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.
2. **Design**: Check `docs/PRD_v5.0.md`, `docs/APP_DESIGN_DOCS.md`.
3. **Types first**: Add to `packages/types` if needed.
4. **Schema**: Add Prisma models if needed; run migration.
5. **API**: Add routes; add auth, org scope, rate limit.
6. **UI**: Add pages/components; use shared UI and i18n.
7. **Tests**: Unit tests for API + critical logic.
8. **Docs**: Update `docs/` if behavior or setup changes.
9. **Preflight**: `pnpm preflight`.

---

### Workflow: Debug scanner offline sync

1. **Trace** flow: `offline-queue.ts` → `scanner.ts` → bulk sync API.
2. **Key files**: `apps/scanner-app/src/lib/offline-queue.ts`, `qr-verify.ts`, `auth-client.ts`.
3. **API**: `apps/client-dashboard/src/app/api/scans/bulk/route.ts`.
4. **Dedup key**: `scanUuid` — never change this contract.
5. **Test**: Use `pnpm turbo test --filter=scanner-app`; check `offline-queue.test.ts`.

**Reference:** `CLAUDE.md` App Architecture: Scanner App, QR Code Flow.

---

### Workflow: Add a new Cursor rule or skill

1. **Rule**: Create `.cursor/rules/<nn>-<name>.mdc` with frontmatter (`description`, `globs`, `alwaysApply`).
2. **Skill**: Create `.cursor/skills/<name>/SKILL.md`; document purpose, when to use, and key knowledge.
3. **Reference** from `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`.
4. **Test**: Open a file matching the glob; confirm rule/skill is applied.

**Reference:** `.cursor/skills-cursor/create-rule/SKILL.md`, `create-skill/SKILL.md` (if present).

---

### Workflow: Phased development (plan → pro prompts → execute → test → enhance)

1. **Invoke planning subagent** with goal (from backlog or user request). See `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`.
2. **Save plan** to `docs/plan/execution/PLAN_<initiative>.md`.
3. **For each phase**: Write pro prompt using `.cursor/templates/TEMPLATE_PROMPT_phase.md` → save `docs/plan/execution/PROMPT_<initiative>_phase_N.md`.
4. **Execute phase N**:
   - Prefer using the master commands:
     - `/dev` — implement a single phase according to its prompt.
     - `/ship` — run all remaining phases sequentially for a plan.
   - Under the hood, each phase still follows the same steps:
     - Implement based on the phase prompt.
     - Run `pnpm turbo test --filter=<workspace>` and fix failures.
     - Run lint/typecheck.
     - Commit via `/github`.
5. **Next phase**: Repeat until plan complete.

**Reference:** `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`, `.cursor/skills/gf-planner/SKILL.md`.

---

## 3. AI Skills & Subagents (from AI_SKILLS_SUBAGENTS_RULES.md)

**Full reference:** `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`

### When to use which subagent

| Task | Subagent |
|------|----------|
| Trace flows, find features, refactor discovery | **explore** |
| pnpm/turbo, git, prisma, builds | **shell** |
| Login, navigation, filters, exports, i18n checks | **browser-use** |
| Ambiguous mixed investigation | **general-purpose** |
| Create plan, task breakdown, phased execution | **planning** |

Keep prompts **narrow and specific**. Avoid "do everything" requests.

### Definition of done (AI-assisted changes)

- **Correctness**: Works for intended role(s) and tenant scope.
- **Security**: No unsafe defaults, no secrets in git, QR/auth invariants preserved.
- **Quality**: Lint + typecheck pass for touched workspaces; tests for critical logic.
- **Docs**: Update `docs/` when behavior or setup changes.

---

## 4. MCP Servers (when available)

| Task | MCP | Use |
|------|-----|-----|
| Prisma migrations, schema, Studio | **Prisma-Local** | migrate-dev, migrate-status, Prisma-Studio |
| Library/docs (React, Next.js, Prisma) | **Context7** | query-docs, resolve-library-id |
| E2E verification | **cursor-ide-browser** | browser_navigate, browser_snapshot |
| GitHub PRs, issues | **GitHub** | create PR, list issues |

**Skill:** `.cursor/skills/gf-mcp/SKILL.md` | **Setup:** `docs/MCP_SETUP.md`

---

## 5. Skills Index

| Skill | Location | When to use |
|-------|----------|-------------|
| **gf-mcp** | `.cursor/skills/gf-mcp/SKILL.md` | MCP server usage, schema, docs, E2E |
| **gf-architecture** | `.cursor/skills/gf-architecture/SKILL.md` | Monorepo, conventions, architectural decisions |
| **gf-security** | `.cursor/skills/gf-security/SKILL.md` | Auth, RBAC, sensitive data, APIs |
| **gf-database** | `.cursor/skills/gf-database/SKILL.md` | Prisma, migrations, query patterns |
| **gf-testing** | `.cursor/skills/gf-testing/SKILL.md` | Jest, unit/integration tests, mocks |
| **gf-mobile** | `.cursor/skills/gf-mobile/SKILL.md` | Scanner app, resident-mobile, offline sync |
| **gf-i18n** | `.cursor/skills/gf-i18n/SKILL.md` | Arabic/English, RTL, locale switching |
| **gf-api** | `.cursor/skills/gf-api/SKILL.md` | Next.js API routes, auth, validation |
| **gf-dev** | `.cursor/skills/gf-dev/SKILL.md` | Workflows, commands, preflight |
| **gf-planner** | `.cursor/skills/gf-planner/SKILL.md` | Plan creation, pro prompts, phased execution |
| **superdesign** | `.cursor/skills/superdesign/SKILL.md` | UI/UX design, layouts, components |
| **excel-spreadsheets** | `.cursor/skills/excel-spreadsheets/SKILL.md` | Excel .xlsx create, read, edit; spreadsheet exports |
| **multi-cli-cursor-workflow** | `.cursor/skills/multi-cli-cursor-workflow/SKILL.md` | Claude/Opencode/Gemini CLIs alongside Cursor for parallel dev |

*Kiro users: parallel skills exist in `.kiro/skills/` for gf-architecture, security, database, testing, mobile.*

---

## 6. Subagent Prompt Templates (GateFlow)

Use these with Cursor’s explore, shell, or browser-use subagents.

### Explore

```
Trace the end-to-end flow for [QR creation / scan validation / bulk sync] (UI → API → DB). Return key files and a short call graph.
```

```
Find all places where organizationId is used in [app name] and verify multi-tenant scoping.
```

```
List API routes under /api/[path] and summarize auth, input validation, and org scoping.
```

### Planning

```
Create a phased plan for [GOAL/EPIC]. Use docs/plan/backlog/ALL_TASKS_BACKLOG.md and RESIDENT_PORTAL_SPEC. Output: phases with scope, deliverables, test criteria. Save to docs/plan/execution/PLAN_<name>.md.
```

### Shell

```
Run pnpm preflight and report any failure with file:line. Fix the first error and re-run.
```

```
From packages/db: run prisma migrate dev --name [name], then pnpm turbo build from root.
```

```
Run pnpm turbo test --filter=client-dashboard and list failing tests with stack traces.
```

### Subagent prompt library

Extended prompts: `.cursor/templates/subagents/` — explore-library, shell-library, browser-library.

### Browser-use

```
Login to client-dashboard at localhost:3001, navigate to Projects, create a project, switch to it, then verify the project cookie and nav state.
```

```
Toggle locale (AR/EN) on client-dashboard login page and verify RTL layout and labels.
```

---

## 7. Rules Summary

All AI tools and developers must follow:

| Rule | Summary |
|------|---------|
| **Package manager** | pnpm only; never npm or yarn |
| **Multi-tenancy** | All tenant queries scope by `organizationId` |
| **Soft deletes** | Filter `deletedAt: null`; never hard delete |
| **Auth** | Short-lived tokens; secure cookies / SecureStore |
| **QR security** | HMAC-SHA256 signed; preserve `scanUuid` dedup |
| **Secrets** | Never commit `.env`; use `.env.example` |
| **Imports** | Use `@gate-access/*` workspace packages |

**Full rules:** `.cursor/rules/00-gateflow-core.mdc`, `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`.

---

## 8. Quick Links

| Doc | Purpose |
|-----|---------|
| `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` | Role hierarchy for Cursor + all CLIs |
| `CLAUDE.md` | Full AI assistant guide |
| `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` | Plan + pro prompts + phased execution |
| `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` | Skills, subagents, rules |
| `docs/plan/guidelines/DEVELOPMENT_TOOLS.md` | Cursor, Kiro, CLIs |
| `docs/plan/guidelines/REQUIRED_SKILLS_AND_AGENTS.md` | Human skills, Kiro config |
| `docs/plan/backlog/ALL_TASKS_BACKLOG.md` | Task list |
| `docs/plan/execution/` | Plans and pro prompts |
| `.cursor/templates/` | Phase prompt, API route, commit, PR, test, DoD templates |
| `.cursor/contracts/` | Code invariants (multi-tenant, soft delete, QR, auth) |
| `.cursor/agents/` | Role personas, scenarios, orchestrator (adopt for phases) |
| `.kiro/QUICK_REFERENCE.md` | Kiro patterns and templates |

---

**Last Updated:** February 27, 2026
