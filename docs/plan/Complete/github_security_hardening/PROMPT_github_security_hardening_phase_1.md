# Pro Prompt — github_security_hardening — Phase 1: Repository & Branch Protection

This phase strengthens the core GitHub repository governance and branch protection rules.

---

## Phase 1: Repository Audit & Branch Governance Architecture

### Primary role

QA | SECURITY | ARCHITECTURE

### Preferred tool

- [x] Claude CLI — Auditing YAML workflows, proposing permissions, architecture
- [ ] Gemini CLI
- [ ] Opencode CLI
- [ ] Kilo CLI
- [ ] Qwen CLI
- [ ] Cursor CLI
- [ ] Kiro CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Problem**: Current `master` branch protection is not formal; lacks `CODEOWNERS` and strict linear history enforcement.
- **Reference**: `CLAUDE.md`, `.github/workflows/ci.yml`.

### Goal

Audit and enforce the GitHub repository governance architecture, ensuring all code follows the **Ralph Loop** standard.

### Scope (in)

- `.github/CODEOWNERS` creation.
- Audit of existing `.github/workflows/*.yml` for permission scoping.
- Proposals for required GH Settings (linear history, signed commits).

### Scope (out)

- Secret rotation (Phase 2).
- CI/CD token hardening (Phase 3).

### Steps (ordered)

1. **Audit Existing Workflows**: List all `.github/workflows/` and identify any `yml` file without an explicit `permissions:` block at the job OR workflow level.
2. **Create CODEOWNERS**: Identify key owners (e.g. `@iDorgham`) for specific directories (`apps/`, `packages/`, `.antigravity/`).
3. **Draft Branch Protection Requirements**: Create a Markdown checklist of the **GitHub Settings** that must be manually toggled (since many GH settings cannot be changed via `git` itself without GH CLI/API).
4. **Permissions Hardening**: Propose specific `permissions` YAML blocks for each workflow identified in Step 1.
5. **Preflight**: Run `pnpm preflight` to ensure no environment drift.
6. **Git Cycle**: `git add .`, `git commit -m "security(github): repository governance — phase 1"`.

### Acceptance criteria

- [ ] `.github/CODEOWNERS` exists and covers all core GateFlow modules.
- [ ] All GitHub Actions (`.github/workflows/*.yml`) have a defined `permissions` block.
- [ ] A checklist of manual GH Setting changes is provided for the user (Branch Protection info).
- [ ] All `pnpm preflight` checks pass.
