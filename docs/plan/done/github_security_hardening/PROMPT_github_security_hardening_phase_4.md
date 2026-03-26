# Phase 4: Supply Chain Governance & Pinning

---

## Phase 4: Dependabot & Supply Chain

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
- **Packages**: db, types, ui
- **Rules**: pnpm only; SHA-pinning for GitHub Actions.
- **Reference**: `.github/dependabot.yml`

### Goal

> Harden the supply chain by fine-tuning Dependabot groups and schedules, and by pinning all third-party GitHub Actions to immutable Git SHAs instead of mutable tags.

### Scope (in)

- `.github/dependabot.yml` configuration refinements.
- All `.github/workflows/*.yml` (SHA-pinning).
- CI lockfile integrity verification.

### Scope (out)

- Snyk / SAST (deferred to Phase 5).

### Steps (ordered)

1. Review and refine `dependabot.yml` for security-first grouping and schedules.
2. Identify all `uses:` in workflows that use tags (e.g., `@v4`).
3. Replace tags with full 40-character commit SHAs.
4. Add comments to pinned actions indicating the intended version.
5. Verify workflows in preflight.

### Acceptance criteria

- [ ] `dependabot.yml` distinguishes between daily security updates and weekly standard updates.
- [ ] All GitHub Actions in `.github/workflows/` are pinned to SHAs.
- [ ] `pnpm-lock.yaml` is healthy.
- [ ] All tests pass.
