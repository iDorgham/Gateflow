# Antigravity Skills & Capabilities

This guide documents the specialized skills available to the Antigravity agentic system in the GateFlow workspace. Each skill is a collection of instructions and tools designed for specific domains.

## Core Development Skills

### `gf-dev`

**Purpose:** General development workflows, commands, and subagent orchestration.

- **When to use:** Daily implementation, bug fixes, running `/dev` phases.
- **Key Commands:** `/ready`, `/github`, `/test`.

### `gf-architecture`
**Purpose:** Monorepo structure, backend/frontend relationship patterns, and shared packages.
- **When to use:** Architectural decisions, adding new apps/packages, refactoring cross-app logic.

### `gf-api`
**Purpose:** Next.js App Router API patterns, request validation, and route-level security.
- **When to use:** Creating or modifying API endpoints, implementing org-scoping.

### `gf-database`
**Purpose:** Prisma schema management, migrations, seeding, and complex query patterns.
- **When to use:** Schema changes, optimizing DB performance, complex joins.

## Specialized Domain Skills

### `gf-security`
**Purpose:** Auth stack, RBAC, QR signing, and multi-tenant isolation.
- **When to use:** Implementation involving sensitive data, auth flows, or system permissions.
- **Guiding Doc:** `.antigravity/contracts/CONTRACTS.md`.

### `gf-mobile`
**Purpose:** Expo SDK 54, React Native, and offline-sync patterns for Scanner/Resident apps.
- **When to use:** Mobile feature implementation, fixing native bugs, async storage patterns.

### `gf-i18n`
**Purpose:** Arabic/English internationalization and RTL layout support.
- **When to use:** Adding translations, fixing RTL visual bugs, localized market features.

## AI & Design Skills


### `gf-design-guide`
**Purpose:** Theme tokens, typography, colors, and layout constraints.
- **When to use:** Styling components, ensuring consistency with the Atlassian Design System.

### `gf-creative-ui-animation`
**Purpose:** Framer Motion patterns, Tailwind animations, and micro-interactions.
- **When to use:** Adding "Wow" factor, interactive transitions, or layout morphs.

## Planning & Orchestration

### `gf-planner`
**Purpose:** Goal decomposition, phased planning, and phase prompt generation.
- **When to use:** Starting a new initiative with `/plan`.

### `gf-guide`
**Purpose:** Workspace intelligence, state assessment, and "what should I do now?".
- **When to use:** Triggered by `/guide`.

---

## Skill Usage Pattern
To invoke a skill's full intelligence, use the `view_file` tool on its `SKILL.md` path:
`file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/.antigravity/skills/<skill-name>/SKILL.md`
