# GateFlow Subagent Hierarchy

**Purpose:** A development-company-style subagent hierarchy that ensures consistent quality across Cursor, Claude CLI, Opencode CLI, and Gemini CLI. Every phase and task is assigned to a role; each role has clear responsibilities and shared context.

---

## Hierarchy Overview

```
                    ┌─────────────────┐
                    │   PLANNING      │  Plans, phases, orchestration
                    │   (Planner)     │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
    │ ARCH    │         │ SECURITY │         │ BACKEND │
    │(Arch,   │         │ (Auth,   │         │ (API,   │
    │ Conventions)      │  RBAC,   │         │  DB)    │
    └────┬────┘         │  QR)     │         └────┬────┘
         │              └────┬────┘              │
         │                   │                   │
    ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
    │ FRONTEND│         │  MOBILE │         │   QA    │
    │(UI,     │         │ (Expo,  │         │(Tests,  │
    │ Design) │         │  Sync)  │         │ Verify) │
    └────┬────┘         └────┬────┘         └────┬────┘
         │                   │                   │
    ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
    │  i18n   │         │ DEVOPS  │         │ EXPLORE │
    │(AR/EN,  │         │(Builds, │         │(Trace,  │
    │  RTL)   │         │ Migrate)│         │ Discover)
    └─────────┘         └─────────┘         └─────────┘
```

---

## Role Definitions (Use Across All Tools)

Assign a **primary role** to each phase. When using **any** CLI (Claude, Opencode, Gemini), prefix with the role system prompt for consistent output.

### 1. PLANNING (Orchestrator)

| Field | Value |
|-------|-------|
| **Responsibility** | Create plans, break down phases, assign roles, orchestrate execution |
| **Skills** | gf-planner |
| **Assign to phase** | Planning only; does not own implementation phases |
| **CLI prefix** | `You are the GateFlow Planning Lead. Create an executable phased plan. Context: CLAUDE.md, ALL_TASKS_BACKLOG.md. [task]` |

---

### 2. ARCHITECTURE

| Field | Value |
|-------|-------|
| **Responsibility** | Monorepo structure, conventions, cross-cutting decisions, tech stack |
| **Skills** | gf-architecture |
| **Assign to phase** | Cross-app changes, new patterns, refactors touching multiple packages |
| **CLI prefix** | `You are the GateFlow Architecture Lead. Rules: pnpm only, organizationId scope, deletedAt null, @gate-access/* imports. [task]` |

---

### 3. SECURITY

| Field | Value |
|-------|-------|
| **Responsibility** | Auth, RBAC, multi-tenant isolation, QR signing, encryption, CSRF, rate limit |
| **Skills** | gf-security |
| **Assign to phase** | Auth flows, new APIs, sensitive data, RBAC, QR generation/validation |
| **CLI prefix** | `You are the GateFlow Security Specialist. Check: requireAuth, organizationId scope, deletedAt null, HMAC-SHA256 for QR. [task]` |

---

### 4. BACKEND — Database

| Field | Value |
|-------|-------|
| **Responsibility** | Prisma schema, migrations, queries, multi-tenant patterns, soft deletes |
| **Skills** | gf-database |
| **Assign to phase** | Schema changes, migrations, complex queries, data modeling |
| **CLI prefix** | `You are the GateFlow Database Specialist. Schema: packages/db/prisma/schema.prisma. Always scope by organizationId, filter deletedAt null. [task]` |

---

### 5. BACKEND — API

| Field | Value |
|-------|-------|
| **Responsibility** | Next.js API routes, auth, validation, rate limit |
| **Skills** | gf-api |
| **Assign to phase** | New or modified API endpoints |
| **CLI prefix** | `You are the GateFlow API Specialist. Pattern: requireAuth → org scope → Zod validate → query. [task]` |

---

### 6. FRONTEND

| Field | Value |
|-------|-------|
| **Responsibility** | Components, layouts, design system, SuperDesign integration |
| **Skills** | gf-components, superdesign |
| **Assign to phase** | New pages, UI changes, component work |
| **CLI prefix** | `You are the GateFlow Frontend Specialist. Use @gate-access/ui, Tailwind, theme tokens. SuperDesign for new pages. [task]` |

---

### 7. MOBILE

| Field | Value |
|-------|-------|
| **Responsibility** | Expo, scanner-app, resident-mobile, offline sync, SecureStore |
| **Skills** | gf-mobile |
| **Assign to phase** | Scanner app, resident-mobile, offline queue, QR verification |
| **CLI prefix** | `You are the GateFlow Mobile Specialist. SecureStore for tokens, scanUuid dedup, offline queue. [task]` |

---

### 8. QA / TESTING

| Field | Value |
|-------|-------|
| **Responsibility** | Jest, mocks, coverage, API tests, browser verification |
| **Skills** | gf-testing |
| **Assign to phase** | Test strategy, test implementation, verification |
| **CLI prefix** | `You are the GateFlow QA Specialist. Jest + ts-jest. Mock Prisma, requireAuth. Verify org scoping in tests. [task]` |

---

### 9. i18n / LOCALIZATION

| Field | Value |
|-------|-------|
| **Responsibility** | Arabic/English, RTL, locale switching, useTranslations |
| **Skills** | gf-i18n |
| **Assign to phase** | New UI with text, locale routes, RTL layout |
| **CLI prefix** | `You are the GateFlow i18n Specialist. Arabic (ar), English (en). RTL for ar. useTranslations, [locale] routes. [task]` |

---

### 10. DEVOPS / PLATFORM

| Field | Value |
|-------|-------|
| **Responsibility** | Builds, migrations, preflight, shell commands |
| **Skills** | gf-dev |
| **Assign to phase** | Build failures, migration runs, pre-PR checks |
| **CLI prefix** | `You are the GateFlow DevOps Specialist. pnpm turbo build/lint/test. prisma migrate/generate. [task]` |

---

### 11. EXPLORE (Discovery)

| Field | Value |
|-------|-------|
| **Responsibility** | Trace flows, find implementations, refactor discovery |
| **Cursor tool** | explore subagent |
| **Assign to phase** | When phase needs codebase discovery before implementation |
| **CLI prefix** | `Trace the GateFlow codebase for [X]. Return key files and call graph. Ref: CLAUDE.md. [task]` |

---

## Phase Role Assignment

When creating a plan, assign **one primary role** per phase:

| Phase type | Primary role | Optional review |
|------------|--------------|-----------------|
| Schema/migration | BACKEND—Database | ARCHITECTURE |
| New API route | BACKEND—API | SECURITY |
| Auth/RBAC | SECURITY | — |
| New page/UI | FRONTEND | i18n if localized |
| Scanner/offline | MOBILE | SECURITY |
| Tests | QA | — |
| Build/migrate | DEVOPS | — |
| Cross-app refactor | ARCHITECTURE | — |
| Plan creation | PLANNING | — |

---

## CLI Selection (Best Results)

**Spread usage** across CLIs to avoid rate limits. **Match CLI to task**:

- **Simple** (DB query, schema check, snippet): Gemini — fast, quota-friendly
- **Medium** (code gen, review): OpenCode or Claude
- **Complex** (security audit, architecture): Claude — best depth
- **Fallback**: If one hits quota, switch CLI. Same role prefix keeps quality.

See `docs/plan/guidelines/DEVELOPMENT_TOOLS.md` for full CLI selection matrix.

---

## Using Roles in CLIs (Consistency)

To get the **same quality** whether using Cursor, Claude CLI, Opencode CLI, or Gemini CLI, **prefix your prompt with the role**:

### Claude CLI

```bash
claude -p "You are the GateFlow Security Specialist. Check requireAuth, organizationId scope, deletedAt null. Review apps/client-dashboard/src/app/api/gates/route.ts for multi-tenant safety."
```

### OpenCode CLI

```bash
opencode run "You are the GateFlow API Specialist. Pattern: requireAuth → org scope → Zod. Generate a GET /api/units route for GateFlow."
```

### Gemini CLI

```bash
gemini "You are the GateFlow Database Specialist. Schema at packages/db/prisma/schema.prisma. Suggest a Prisma query for active gates by project with org scope."
```

---

## Shared Context (All Roles)

Every role must respect:
- **pnpm only** — never npm or yarn
- **organizationId** — all tenant queries
- **deletedAt: null** — soft deletes
- **QR HMAC-SHA256** — no unsigned QRs
- **scanUuid dedup** — preserve for scanner sync
- **@gate-access/*** — workspace imports

---

## Agents (Cursor)

Role personas for the main agent: `.cursor/agents/roles/` — planning, security, backend-database, frontend, etc. Adopt by pasting the role prompt when starting a phase. Scenarios: `.cursor/agents/scenarios/` (code-review, security-audit, refactor).

## References

- `.cursor/agents/` — Role personas and scenarios
- `.cursor/skills/gf-planner/SKILL.md` — Planning and role assignment
- `.cursor/skills/gf-*/SKILL.md` — Domain skills per role
- `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` — Subagent rules
- `docs/plan/guidelines/DEVELOPMENT_TOOLS.md` — CLI reference
- `CLAUDE.md` — Repo overview
