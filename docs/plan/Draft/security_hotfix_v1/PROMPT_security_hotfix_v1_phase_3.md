# Phase 3: Enforce HTTP Security Headers Across Next.js Apps

---

## Phase 3: Enforce HTTP Security Headers Across Next.js Apps

### Primary role

SECURITY

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
- **Apps**: client-dashboard, admin-dashboard, scanner-app, marketing, resident-portal
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS)
- **Refs**: `CLAUDE.md`, each target app's `next.config.js`

### Goal

Apply a consistent baseline of security headers in all target web apps through Next.js config.

### Scope (in)

- Add `async headers()` to:
  - `apps/client-dashboard/next.config.js`
  - `apps/admin-dashboard/next.config.js`
  - `apps/resident-portal/next.config.js`
  - `apps/marketing/next.config.js`
- Ensure these headers are present:
  - `Strict-Transport-Security`
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Content-Security-Policy`
- Keep CSP strict while allowing required hydration/analytics domains explicitly.

### Scope (out)

- No unrelated Next.js config rewrites.
- No broad CSP wildcards.

### Steps (ordered)

1. Review existing config format per app and preserve non-security settings.
2. Add/merge `headers()` export in each target app config.
3. Add baseline security header set with explicit CSP allowlist.
4. Verify locally with running apps: `curl -I http://localhost:<port>`
5. Run `pnpm preflight`.
6. Update `TASKS_security_hotfix_v1.md`, `phase_logs/PHASE_LOG_phase_03.md`, and `SESSION_MEMORY.md`.

### Acceptance criteria

- [ ] All four app configs include security headers.
- [ ] All 5 required headers are visible in HTTP response.
- [ ] CSP remains functional for required app behavior.
- [ ] `pnpm preflight` passes; if preflight fails, stop and remediate before marking phase complete.
- [ ] Phase log updated with pass/fail criteria (include preflight failure remediation notes when applicable).
