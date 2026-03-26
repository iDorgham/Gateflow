# Phase 5: Security Gate Automation & Finalization

---

## Phase 5: Automated Scans & Certification

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
- **Goal**: Integrate the secret scanner into the CI pipeline as a blocking gate and finalize the initiative status.
- **Reference**: `scripts/scan-secrets.js`

### Goal

> Finalize the GitHub Security Hardening initiative by automating secret scans in the CI pipeline and generating a final certification report.

### Scope (in)

- `.github/workflows/ci.yml` (New scan job).
- `package.json` (New `check:secrets` script).
- `docs/security/GITHUB_SECURITY_HARDENING_REPORT.md`.

### Scope (out)

- Any non-GitHub security issues.

### Steps (ordered)

1. Add `"check:secrets": "node scripts/scan-secrets.js --all"` to the root `package.json`.
2. Add a new `security` job to `.github/workflows/ci.yml` that runs `pnpm check:secrets`.
3. Ensure the `ci-ok` summary gate depends on the `security` job.
4. Generate the final certification report in `docs/security/GITHUB_SECURITY_HARDENING_REPORT.md` summarising all 5 phases.
5. Update initiative status to `done` and clean up folder transitions.

### Acceptance criteria

- [ ] `pnpm check:secrets` is active in `package.json`.
- [ ] GitHub CI now fails if `scripts/scan-secrets.js` detects a `HIGH` severity secret.
- [ ] Final security report is committed and reflects all work done.
- [ ] Initiative is marked as complete.
