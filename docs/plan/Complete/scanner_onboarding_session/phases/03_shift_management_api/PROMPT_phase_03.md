# Phase 3: Shift Session Management API, State Hooks & Scan Blocking

---

## Phase 3: Shift Session Management API, State Hooks & Scan Blocking

### Primary role

BACKEND-API / MOBILE

### Preferred tool

- [x] Cursor IDE — API routes & mobile state integration
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] Claude CLI — security, architecture, complex reasoning

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: `apps/client-dashboard` (API), `apps/scanner-app` (Mobile)
- **Invariant**: No unauthenticated or unattributed scans. Camera scan flow is hard-blocked if `isShiftActive === false`.
- **Refs**: [`docs/plan/Draft/scanner_onboarding_session/PLAN_scanner_onboarding_session.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/scanner_onboarding_session/PLAN_scanner_onboarding_session.md)

### Goal

Implement backend shift management API endpoints (`clockIn`, `clockOut`) and mobile `useShiftSession` hook with scan-blocking enforcement.

### Scope (in)

- Verify Prisma `ShiftLog` schema in `packages/db`.
- `POST /api/scanner/shift/start` with tenant scoping and gate ID validation.
- `POST /api/scanner/shift/end` with duty duration calculation.
- `useShiftSession` React hook and Context Provider.
- Scan-blocking logic preventing camera scan activation without an active shift.
- Unit tests for shift APIs and client scan-blocking interceptor.

### Scope (out)

- Home screen redesign (Phase 4).
- Biometric inactivity guard (Phase 5).

### Steps (ordered)

1. Verify/create `apps/client-dashboard/src/app/api/scanner/shift/start/route.ts` with tenant isolation.
2. Verify/create `apps/client-dashboard/src/app/api/scanner/shift/end/route.ts`.
3. Implement `src/hooks/use-shift-session.ts` and `src/context/ShiftSessionContext.tsx` in `apps/scanner-app`.
4. Wrap camera scan trigger with `useShiftSession` validation gate.
5. Write unit tests in `src/hooks/use-shift-session.test.ts` and API route tests.
6. Run `pnpm --filter scanner-app test` and `pnpm --filter client-dashboard test`.
7. Create `docs/plan/Draft/scanner_onboarding_session/phase_logs/PHASE_LOG_phase_03.md`.
8. Commit: `git commit -m "feat(scanner-app): implement shift session lifecycle and scan gate"`

### Acceptance criteria

- [ ] Shift clock-in assigns guard to gate lane and generates active `ShiftLog` entry.
- [ ] Shift clock-out closes shift record and returns summary statistics.
- [ ] Attempting to scan without an active shift displays a clean clock-in prompt.
- [ ] Multi-tenant isolation verified with zero cross-org leaks.
- [ ] All unit tests passing green.
