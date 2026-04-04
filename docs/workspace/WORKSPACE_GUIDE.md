# GateFlow Workspace — Master Commands & Workflow Guide

Welcome to the **GateFlow** workspace. This document is your comprehensive
reference for the commands, agents, skills, and workflows that drive our
phased development lifecycle.

---

## 🚀 The Development Lifecycle (The Ralph Loop)

We use a **Phased Development Workflow** to ensure high quality, traceability,
and autonomous execution. The flow moves through these stages:

### 1. Discovery & Intent (`/idea` & `/draft`)

- **`/idea <slug>`**: Capture high-level initiatives. Creates
  `docs/development/initiatives/IDEA_<slug>.md`.
- **`/draft <slug>`**: Iterate on raw planning notes. Creates
  `docs/plan/Draft/<slug>/DRAFT_<slug>.md`.
- **`/draft <slug> c`**: Refine the draft into structured goals, constraints,
  and a phase sketch.

### 2. Planning (`/prompt` & `/plan`)

- **`/prompt <slug>`**: Generates `FOR_PLAN_PROMPT.md`—a comprehensive prompt
  optimized for the `/plan` command.
- **`/plan <slug>`**: Turns a draft/prompt into a formal, phased plan.
  - Creates `PLAN_<slug>.md` and `TASKS_<slug>.md` in `docs/plan/Draft/<slug>/`.
  - Generates per-phase prompts in `phases/NN_title/PROMPT_phase_NN.md`.
- **`/plan ready <slug>`**: Moves the plan from `Draft/` to `Ready/` for
  execution.

### 3. Execution (`/dev` & `/ship`)

- **`/dev`**: Executes the **next incomplete phase** of the active plan.
  - Moves plan to `Active/`.
  - Implements code, writes tests (TDD), runs enforcers, and commits/tags phase.
- **`/dev <n>`**: Executes a specific phase number.
- **`/ship <slug>`**: Runs the entire plan from start to finish via `/dev` loop.
- **`/dev ralph`**: Activates recursive autopilot to finish all phases.

### 4. Guidance & Maintenance (`/guide` & `/man`)

- **`/guide`**: "What should I do now?" Assess git state, plan progress, and
  provide a "Must do" vs "Recommended" report.
- **`/man`**: The "One Man" orchestrator. High-level command for managing tasks,
  settings, and mindset across 7 domains (Code, Brand, SaaS, etc.).

---

## 🛠 Command Reference (Slash Commands)

| Command          | Sub-commands               | Description                              |
| :--------------- | :------------------------- | :--------------------------------------- |
| **`/idea`**      | `new`, `<slug>`            | Initiative capture and backlog entry.    |
| **`/draft`**     | `c`, `<slug>`              | Iterate on raw specs before planning.    |
| **`/prompt`**    | `<slug>`                   | Build the "big prompt" for `/plan`.      |
| **`/plan`**      | `ready`, `phase <n>`       | Create or transition phased plans.       |
| **`/dev`**       | `ralph`, `<n>`             | Implement one phase (code + test + git). |
| **`/ship`**      | `<slug>`, `all`            | Full automated execution of a plan.      |
| **`/guide`**     | `what to do`               | Workspace status and next steps.         |
| **`/man`**       | `tasks`, `run`, `ship`     | Seven-domain management orchestrator.    |
| **`/docs`**      | `changelog`, `readme`      | Automated documentation sync.            |
| **`/version`**   | `bump`, `tag`              | Semantic versioning and git tagging.     |
| **`/clis-team`** | `seo`, `refactor`, `audit` | Run multi-model agent teams.             |

---

## 🧠 Agent & Skill Hierarchy

### Agents (Roles)

Our agents adopt specific personas based on the task:

- **`frontend.md`**: UI/UX, ADS components, animations.
- **`backend-api.md`**: API routes, auth, validation.
- **`backend-database.md`**: Prisma, migrations, performance.
- **`architecture.md`**: System design, monorepo patterns.
- **`security.md`**: RBAC, data privacy, audits.

### Skills (Capabilities)

We have **83 specialized skills** in `.agents/skills/`. Key skills include:

- **`gf-ads-*`**: Design system tokens and patterns.
- **`gf-uiux-animator`**: Premium Framer Motion and Tailwind animations.
- **`gateflow-database`**: Complex Prisma queries and multi-tenancy.
- **`gf-cli-limits`**: Tracking and respecting AI tool quotas (80% rule).
- **`gf-guide`**: The brain behind `/guide` and state assessment.

### Sub-agents (Tools)

- **`browser-use`**: High-fidelity web browsing and research.
- **`explore`**: Deep codebase search and relationship mapping.
- **`shell`**: Autonomous terminal execution and verification.

---

## 📜 Operational Rules & Best Practices

1. **The 80% Rule**: Before using a paid CLI, check `CLI_LIMITS_TRACKING.md`.
   If at 80%+, ask for permission.
2. **TDD Iron Law**: No production code without a failing (red) test first.
3. **Multi-tenancy Mandate**: Every DB query MUST include `organizationId`
   and `deletedAt: null`.
4. **Auto-Sync**: Planning happens on `master`. Execution happens on `feat/`
   branches. Commands auto-commit and push when checks pass.
5. **ADS Compliance**: Every color must be a `token()` from `@atlaskit/tokens`.
   Hardcoded hex codes are strictly forbidden.
6. **Session Memory**: `/dev` and `/ship` use `SESSION_MEMORY.md` to persist
   state across context resets.

---

## 💻 Terminal Scripts & Commands

| Command                                           | Description                                   |
| :------------------------------------------------ | :-------------------------------------------- |
| **`pnpm preflight`**                              | Run lint, typecheck, and tests monorepo-wide. |
| **`pnpm turbo dev`**                              | Start all apps in development mode.           |
| **`pnpm workspace:install`**                      | Initialize workspace and sync AI tools.       |
| **`node scripts/ralph-git.js branch`**            | Automated branching for phases.               |
| **`node scripts/enforce-ads-design.js`**          | UI audit for ADS compliance.                  |
| **`node scripts/enforce-security-invariants.js`** | Backend audit for RBAC.                       |
| **`pnpm docs:changelog:format`**                  | Normalize changelog casing/spacing.           |

---

## 🎭 Agents (Core Roles)

| Agent                     | Description         | Primary Responsibility                |
| :------------------------ | :------------------ | :------------------------------------ |
| **`frontend.md`**         | UI/UX Specialist    | ADS components, RSCs, and RTL layout. |
| **`backend-api.md`**      | API & Auth Guru     | Next.js API, Zod, and org scoping.    |
| **`backend-database.md`** | Database Architect  | Prisma, migrations, and performance.  |
| **`architecture.md`**     | Systems Architect   | Monorepo structure and packages.      |
| **`security.md`**         | Security Auditor    | RBAC, GDPR, and QR security.          |
| **`mobile.md`**           | Expo/RN Specialist  | Scanner app and offline sync.         |
| **`qa.md`**               | Testing Engineer    | Jest, Playwright, and quality gates.  |
| **`planning.md`**         | Roadmap Specialist  | Phased plans and feasibility.         |
| **`i18n.md`**             | Localization Expert | Arabic/English flows and MENA market. |
| **`explore.md`**          | Discovery Agent     | Deep codebase investigation.          |
| **`devops.md`**           | Infrastructure Lead | CI/CD and Vercel deployments.         |

---

## 🤖 Sub-agents (Specialized Tools)

| Sub-agent                    | Description        | Best For                               |
| :--------------------------- | :----------------- | :------------------------------------- |
| **`browser-use.md`**         | Autonomous Browser | Market research and scraping.          |
| **`explore.md`**             | Code Finder        | Tracing cross-app dependencies.        |
| **`shell.md`**               | CLI Lead           | Build scripts and terminal benchmarks. |
| **`ads-ux.md`**              | Design Auditor     | 100% ADS token compliance.             |
| **`visual-storytelling.md`** | Content Architect  | Scripting cinematic content.           |
| **`ads-animation.md`**       | Motion Designer    | Framer/CSS micro-interactions.         |

---

## ⚡ Skills (Domain Capabilities)

| Skill Category         | Key Capabilities & Descriptions                                                                                                                                           |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Core Workflow**      | **`gf-guide`**: Workspace guidance. <br> **`gf-planner`**: Phased planning. <br> **`prompt-writer`**: Prompt engineering.                                                 |
| **UI & Design**        | **`gf-ads-core`**: ADS foundations. <br> **`uiux-animator`**: SaaS animations. <br> **`framer-motion`**: Motion patterns. <br> **`shadcn-composables`**: Widget patterns. |
| **Backend & Data**     | **`gateflow-api`**: API security. <br> **`database`**: Prisma performance. <br> **`rbac`**: Permission logic. <br> **`qr-crypto`**: Secure QR logic.                      |
| **Mobile & Offline**   | **`expo-mobile-optimization`**: Performance. <br> **`expo-offline-sync`**: Offline logic. <br> **`mobile`**: Hardware access.                                             |
| **Marketing & SEO**    | **`creative-director`**: Brand DNA. <br> **`seo-content`**: Copywriting. <br> **`seo-planning`**: Search strategy.                                                        |
| **Ops & Verification** | **`github-ci-cd`**: Pipeline mgmt. <br> **`testing`**: Jest/E2E setup. <br> **`cli-limits`**: Quota tracking.                                                             |

---

## 📏 Workspace Rules & Guardrails

We enforce strict **system invariants** for safety and consistency:

1. **Multi-tenancy Isolation**: Every query MUST scope to `organizationId`.
2. **RTL/LTR Standard**: UI must support Arabic/English (use `ms-`/`me-`).
3. **Soft-Deletes Only**: Never delete; update `deletedAt`.
4. **TDD Lifecycle**: Feature code requires unit/integration tests.
5. **ADS Compliance**: Use `token()`. No hardcoded hex codes.
6. **AI Budgeting**: Respect the **80% Rule** (see `CLI_LIMITS_TRACKING.md`).
7. **Atomic Commits**: Commits tagged by phase (e.g., `v1.2.0-phase-3`).

---

> [!TIP]
> Use **`/guide`** for next steps. It scans the filesystem and outputs
> the exact command you need.

> [!IMPORTANT]
> Always check **`docs/CLAUDE.md`** for up-to-date project nuances.
