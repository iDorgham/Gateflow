# Pro Prompt — github_security_hardening — Phase 2: Secret Management & Rotation

This phase audits all environment secrets and establishes a rotation policy.

---

## Phase 2: Secret Inventory & Rotation Logic

### Primary role

SECURITY | ARCHITECTURE

### Preferred tool

- [ ] Claude CLI
- [x] Gemini CLI — Structural analysis of `.env.example` vs workflows
- [ ] Opencode CLI
- [ ] Kilo CLI
- [ ] Qwen CLI
- [ ] Cursor CLI
- [ ] Kiro CLI

### Context

- **Project**: GateFlow (Turborepo)
- **Problem**: Secret drift; `QR_SIGNING_SECRET` and `NEXTAUTH_SECRET` need formal rotation.
- **Reference**: `CLAUDE.md`, `.env.example`, `.github/workflows/ci.yml`.

### Goal

Audit all repository secrets, verify they are mapped correctly in CI, and create a rotation procedure to eliminate long-lived "Master Keys".

### Scope (in)

- Cross-referencing all `.env.example` variables with `.github/workflows/*.yml` secret calls.
- Validating `scripts/scan-secrets.js` effectiveness.
- Authoring a Rotation Procedure (`SECRET_ROTATION.md`).

### Scope (out)

- OIDC setup (Phase 3).
- Dependabot config (Phase 4).

### Steps (ordered)

1. **Inventory Secrets**:
   - Search root and app-level `.env.example` files for all variables.
   - Search `.github/workflows/*.yml` for `${{ secrets.VAR_NAME }}`.
   - Map them in a table: `Var Name | Required in CI? | Verified in Workflow?`.
2. **Scan Audit**: Run `node scripts/scan-secrets.js` locally to see if it flags any test/fake secrets.
3. **Draft Rotation Guide**: Create `docs/security/SECRET_ROTATION_GUIDE.md` defining how to rotate the 5 most critical secrets (DB, Vercel, NextAuth, QR, Stripe).
4. **Leak Detection Audit**: Check a sample of past CI logs (if available/accessible) to ensure no secrets were inadvertently printed.
5. **Git Cycle**: `git add .`, `git commit -m "security(github): secret management — phase 2"`.

### Acceptance criteria

- [ ] Secret inventory table created in Phase summary.
- [ ] `docs/security/SECRET_ROTATION_GUIDE.md` exists with clear steps.
- [ ] `scripts/scan-secrets.js` verified as functional.
- [ ] All `pnpm preflight` checks pass.
