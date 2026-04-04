# Phase 3: CI/CD Hardening & Minimal Privileges

---

## Phase 3: CI/CD Hardening

### Primary role

SECURITY | DEVOPS

### Preferred tool

- [ ] Claude CLI
- [x] Gemini CLI
- [ ] Opencode CLI
- [ ] Kilo CLI
- [ ] Qwen CLI
- [ ] Cursor CLI
- [ ] Kiro CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard, admin-dashboard, scanner-app, marketing, resident-portal, resident-mobile
- **Packages**: db, types, ui, api, scanner, gate-logic, business-logic
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS)
- **Goal**: Harden all GitHub workflows to follow the Principle of Least Privilege.

### Goal

> Implement top-level `permissions` blocks in all GitHub workflows, verify pnpm lockfile integrity, and ensure no workflow runs with elevated privileges by default.

### Scope (in)

- All `.github/workflows/*.yml` files.
- `pnpm-lock.yaml` verification logic in CI.
- Audit of `GITHUB_TOKEN` usage in all jobs.

### Scope (out)

- Dependency updates (deferred to Phase 4).
- Third-party security tools like Snyk (deferred to Phase 5).

### Steps (ordered)

1. Audit all `.github/workflows/*.yml` for missing `permissions` blocks.
2. Add top-level `permissions: contents: read` to all workflows.
3. Add job-specific permissions where needed (e.g., `pull-requests: write`, `deployments: write`).
4. Implement lockfile hash verification: `pnpm install --frozen-lockfile`.
5. Verify workflows in parallel: `pnpm turbo lint/typecheck/test`.

### Acceptance criteria

- [ ] Every `.github/workflows/*.yml` has a top-level `permissions` block.
- [ ] `GITHUB_TOKEN` is scoped to the minimum required per job.
- [ ] CI fails if `pnpm install` detects any lockfile changes (frozen-lockfile).
- [ ] All tests pass, build is green.
