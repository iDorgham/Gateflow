# Phase 03: Enforce HTTP Security Headers Across Next.js Apps

## Primary role

SECURITY + WEB PLATFORM

## Preferred tool

- Tool 1: Gemini CLI
- Tool 2: Cursor

## Goal

Apply a consistent baseline of security headers in all target web apps through Next.js config.

## Scope (in)

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

## Scope (out)

- No unrelated Next.js config rewrites.
- No broad CSP wildcards.

## Steps

1. Review existing config format per app and preserve non-security settings.
2. Add/merge `headers()` export in each target app config.
3. Add baseline security header set with explicit CSP allowlist.
4. Verify locally with running apps:
   - `curl -I http://localhost:<port>`
5. Run verification:
   - `pnpm preflight`
6. Update:
   - `TASKS_security_hotfix_v1.md`
   - `phase_logs/PHASE_LOG_phase_03.md`
   - `SESSION_MEMORY.md`

## Acceptance criteria

- [ ] All four app configs include security headers.
- [ ] All 5 required headers are visible in HTTP response.
- [ ] CSP remains functional for required app behavior.
- [ ] `pnpm preflight` passes.
