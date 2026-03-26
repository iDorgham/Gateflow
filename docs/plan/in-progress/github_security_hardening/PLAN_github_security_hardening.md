# PLAN: Github Security Hardening

**Slug:** `github_security_hardening`
**Status:** planning
**Created:** 2026-03-24
**Target:** Q4 2026

## Overview

The Github Security Hardening initiative hardens the GateFlow supply chain, enforces repository governance, and secures CI/CD environments (GitHub Actions) to ensure that only trusted, audited code reaches production and that long-lived secrets are minimized and rotated.

## Phases

| #   | Phase                                           | Tool     | Status |
| --- | ----------------------------------------------- | -------- | ------ |
| 1   | **Repository & Branch Protection Architecture** | claude   | [x]    |
| 2   | **Secret Management & Rotation Logic**          | gemini   | [ ]    |
| 3   | **CI/CD Hardening (OIDC & Minimal Privs)**      | claude   | [ ]    |
| 4   | **Supply Chain Governance (Dependabot)**        | claude   | [ ]    |
| 5   | **Security Gate Automation (CI + Scan)**        | opencode | [ ]    |

## Technical Constraints

- **Multi-tenancy**: CI/CD must never leak `organizationId` or tenant context.
- **Secrets**: Use GitHub Actions environment-level secrets for `production`.
- **Commits**: Conventional commits (`commitlint`) must be mandatory for CI to pass.
- **OIDC**: Prefer OIDC for Vercel/DB access where possible (avoid long-lived `SECRET` tokens).

## Tools Reference

| Tool     | Best for                                  | Auto-accept flag                 |
| -------- | ----------------------------------------- | -------------------------------- |
| claude   | Security, architecture, complex reasoning | `--dangerously-skip-permissions` |
| gemini   | DB/schema, fast structural analysis       | `--yolo`                         |
| opencode | Code generation, scaffolds, refactors     | `run` mode                       |
| cursor   | UI/visual iteration                       | IDE (manual)                     |

---

## Acceptance Criteria per Phase

### Phase 1: Repository & Branch Protection

- [ ] `master` branch protection: requires 1 PR approval, linear history, signed commits.
- [ ] Auditor role created in GH Actions if possible.
- [ ] `CODEOWNERS` file committed to root.

### Phase 2: Secret Management & Rotation

- [ ] Inventory of all `GITHUB_SECRET` keys vs `.env.example`.
- [ ] Rotation of `NEXTAUTH_SECRET` and `QR_SIGNING_SECRET`.
- [ ] Audit trail for secret access enabled.

### Phase 3: CI/CD Hardening

- [ ] All `.github/workflows/*.yml` updated with `permissions` blocks.
- [ ] No workflows run with elevated privileges by default.
- [ ] `pnpm-lock.yaml` hash verification in CI.

### Phase 4: Supply Chain Governance

- [ ] `dependabot.yml` active in `.github/`.
- [ ] Weekly schedules for standard deps; daily for `security`.
- [ ] `Renovate` (optional) evaluated for grouping non-breaking updates.

### Phase 5: Security Gate Automation

- [ ] `scripts/scan-secrets.js` runs as a mandatory CI step (using `pnpm check:secrets`).
- [ ] Build fails if any High-Risk secret pattern is found.
- [ ] Final security audit report generated for the initiative.
