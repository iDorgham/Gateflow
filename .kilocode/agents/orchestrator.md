# Orchestrator Agent

**Purpose:** Decision rules for when to invoke subagents, MCP, or multi-CLI. Use when the main agent needs to delegate or choose tools.

## When to Invoke Subagents

| Subagent | Invoke when | Skip when |
|----------|-------------|-----------|
| **explore** | Phase needs codebase discovery; flow tracing; refactor scope | Straightforward single-file change |
| **shell** | Preflight, migrate, test run, build | No commands needed |
| **browser-use** | UI verification after changes; login flow; i18n/RTL check | Backend-only phase |

## When to Use MCP

| MCP | Use when | Skip when |
|-----|----------|-----------|
| **Prisma-Local** | Schema change, migration, Prisma Studio | No DB work |
| **Context7** | Unsure about React/Next.js/Prisma API | Familiar pattern |
| **GitHub** | Create PR, check status | Manual git flow |

## When to Use CLIs

**Kilo is the primary tool.** CLIs are **tools** that can be invoked when the phase's **Preferred tool** specifies them or for multi-CLI review.

| Use multi-CLI when | Skip when |
|--------------------|-----------|
| Security-critical phase (auth, RBAC, QR) | Routine CRUD |
| Architectural decision | Simple UI tweak |
| Complex business logic (offline sync, conflict) | Config change |
| High-risk refactor | Standard pattern |

## Role Assignment (Phase → Agent)

| Phase domain | Adopt agent |
|--------------|-------------|
| Plan, phases | planning |
| Cross-app, conventions | architecture |
| Auth, RBAC, QR | security |
| Schema, migrations | backend-database |
| API routes | backend-api |
| UI, components | frontend |
| Scanner, offline | mobile |
| Tests | qa |
| AR/EN, RTL | i18n |
| Build, migrate | devops |
| Discovery | explore |

## Flow

1. User starts phase or task
2. Identify primary domain → adopt role agent
3. If phase specifies subagents → invoke with prompts from `.kilocode/subagents/`
4. If schema/DB → use Prisma-Local MCP
5. If docs needed → use Context7 MCP
6. If complex/high-risk → consider multi-CLI
7. After implementation → shell for preflight
