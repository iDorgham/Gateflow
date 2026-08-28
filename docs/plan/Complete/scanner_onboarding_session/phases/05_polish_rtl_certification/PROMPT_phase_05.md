# Phase 5: Polish, Biometric Inactivity Guard, Arabic RTL & Full Monorepo Certification

---

## Phase 5: Polish, Biometric Inactivity Guard, Arabic RTL & Full Monorepo Certification

### Primary role

QA / MOBILE

### Preferred tool

- [x] Cursor IDE — review, polish, verification
- [ ] Claude CLI — security, invariant verification
- [ ] Kiro IDE — review, specs

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: `apps/scanner-app` (Expo SDK 57 / React Native)
- **Standard**: WCAG 2.2 AA accessibility, Arabic RTL bidirectional layout, 100% monorepo preflight pass.
- **Refs**: [`docs/plan/Draft/scanner_onboarding_session/PLAN_scanner_onboarding_session.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/scanner_onboarding_session/PLAN_scanner_onboarding_session.md)

### Goal

Implement the background inactivity `BiometricGuard`, audit full Arabic RTL bidirectional layouts, verify monorepo preflight, and certify the completed initiative.

### Scope (in)

- Global `BiometricGuard` app state listener prompting for unlock after 5 minutes of background inactivity.
- Arabic RTL layout verification for Onboarding Wizard and Home Screen.
- Full monorepo preflight check (`pnpm preflight`).
- Comprehensive unit test execution across all workspaces.
- Phase log and documentation sync.

### Scope (out)

- External hardware biometric driver patches (Expo baseline).

### Steps (ordered)

1. Implement `src/components/security/BiometricGuard.tsx` wrapping the application root.
2. Track `AppState` transitions and enforce 5-minute background re-lock timer.
3. Audit RTL mirroring on all wizard slides and home dashboard cards.
4. Run `pnpm --filter scanner-app test`.
5. Run monorepo preflight: `pnpm preflight`.
6. Create `docs/plan/Draft/scanner_onboarding_session/phase_logs/PHASE_LOG_phase_05.md`.
7. Move plan from `Active/` $\rightarrow$ `Complete/` via `node scripts/plan/ralph-plan.js done scanner_onboarding_session`.
8. Commit: `git commit -m "chore(scanner-app): complete biometric guard, rtl audit and certification"`

### Acceptance criteria

- [ ] App prompts for biometric/PIN unlock when reopened after 5+ minutes of backgrounding.
- [ ] Arabic RTL layout renders cleanly with mirrored icons and logical alignments.
- [ ] Monorepo preflight passes with 15/15 tasks green (`pnpm preflight`).
- [ ] Full certification documentation updated.
