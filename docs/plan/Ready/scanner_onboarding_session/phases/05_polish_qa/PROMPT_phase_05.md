# Phase 5: Polish – Animation, Security & QA

## Primary role

QA

## Preferred tool

- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [x] OpenCode CLI — code generation, scaffolds, refactors
- [ ] Kilo CLI — free agentic, large context
- [ ] Qwen CLI — free agentic, 480B reasoning
- [ ] Cursor IDE — UI/visual iteration (manual)
- [ ] Kiro IDE — review, specs (manual)

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: scanner-app (the primary target)
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS); ADS ONLY.
- **Refs**: `CLAUDE.md`, `PLAN_scanner_onboarding_session.md` (plan folder root), `CONTEXT_scanner_onboarding_session.md`, `context/`, `ADS_CORE_TOKENS.md`, `PRD_scanner_onboarding.md`

## Goal

> Add premium motion design, implement global session security (BiometricGuard),
> and perform final RTL verification for the complete onboarding experience.

## Scope (in)

- `framer-motion-react-native` or `Reanimated` page transitions.
- `BiometricGuardHOC` with 5-min inactivity timeout.
- Pull-to-refresh on mobile stats/history views.
- Global RTL audit for Arabic (all onboarding steps & dashboard).
- Error Boundaries + Loading Skeletons for dashboard widgets.
- Final verification: Fail-safe logic and fallback testing.

## Scope (out)

- New app features beyond the onboarding/session scope.

## Steps (ordered)

1. Implement `apps/scanner-app/src/components/common/biometric-guard.tsx` wrapping main navigator.
2. Build `apps/scanner-app/src/components/common/route-animator.tsx` for slide
   transitions.
3. Integrate `pull-to-refresh` logic in Home and History screens.
4. Conduct global RTL walkthrough: verify `ms-*`/`me-*` horizontal scroll
   alignment in Arabic.
5. Create `apps/scanner-app/src/screens/error/error-boundary.tsx` with ADS
   illustration.
6. Run `pnpm turbo lint --filter=scanner-app`
7. Run `pnpm turbo typecheck --filter=scanner-app`
8. Run final security audit: verify `organizationId` scoping on all `ShiftLog`
   and `ScanLog` queries.
9. Commit: `git commit -m "feat(scanner): final session security, premium
animations, and RTL certification"`
10. When this is the **last** phase, move the entire plan folder to `docs/plan/Complete/scanner_onboarding_session/` per `docs/development/PLAN_LIFECYCLE.md` and update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` if that file references this plan.

## Acceptance criteria

- [ ] Transition animations are 60fps with no flicker.
- [ ] 5-minute inactivity triggers the `BiometricGuard` prompt.
- [ ] RTL layout is pixel-perfect across all onboarding slides.
- [ ] Fallback PIN is accessible if biometric verification fails.
- [ ] All tests pass (`pnpm turbo test --filter=scanner-app`)
- [ ] Build green (`pnpm turbo build --filter=scanner-app`)
- [ ] No regression on previously certified performance or security metrics.
