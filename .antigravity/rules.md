# GateFlow Workspace Rules (Antigravity)

This repo’s canonical AI context lives in `.antigravity/` (mirrored from `.cursor/`).

## 1. Operational Modes

You can switch between specialized modes to focus your capabilities. Each mode prioritizes specific skills and agents.

### [Development Mode] (Default)

Standard implementation, debugging, and feature work.

- **Skills**: `gf-dev`, `gf-api`, `gf-database`, `typescript`, `react`.
- **Agents**: `roles/frontend.md`, `roles/backend-api.md`.

### [Design Mode]

High-fidelity UI/UX, animations, and branding.

- **Skills**: `gf-design-guide`, `gf-creative-ui-animation`, `superdesign`, `ui-ux`, `tailwind`, `tokens-design`.
- **Docs**: `docs/guides/UI_DESIGN_GUIDE.md`, `docs/guides/MOTION_AND_ANIMATION.md`.
- **Action**: Run `SuperDesign` drafts before implementation. Verify with `browser-use` subagent.

### [Architect Mode]

System-level design, refactoring, and planning.

- **Skills**: `gf-architecture`, `gf-planner`, `pro-prd-writer`.
- **Agents**: `roles/planning.md`, `roles/architecture.md`.

### [Security Mode]

Deep audits, compliance, and RBAC checks.

- **Skills**: `gf-security`.
- **Contracts**: `.antigravity/contracts/CONTRACTS.md`.

## 2. Resource Hierarchy (Skills, Agents, Workflows)

You have full authority to use any resource in the workspace:

- **Workflows**: Located in `.agent/workflows/`. Use for automation (`/guide`, `/dev`, `/plan`).
- **Skills**: Located in `.antigravity/skills/`. Load `SKILL.md` from the relevant folder.
- **Agents**: Located in `.antigravity/agents/` and `.antigravity/subagents/`. Use for specialized roles.
- **Templates**: Located in `.antigravity/templates/` for consistent code/doc generation.

## 3. Guide

When the user says "guide" or "what should I do now", behave like Cursor’s `/guide`:

- Load and follow `.antigravity/skills/gf-guide/SKILL.md`
- Load `GATEFLOW_CONFIG.md`, `CLAUDE.md`, and `docs/plan/`
- Assess repo state (git status, preflight, active plan/phase)
- **Report**: Must do / Recommended / Critical / Improvements / **Active Mode**.
