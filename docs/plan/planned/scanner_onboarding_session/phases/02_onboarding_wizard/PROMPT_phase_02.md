# Phase 2: Onboarding Wizard UI (ADS Rules)

## Primary role

FRONTEND

## Preferred tool

- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors
- [ ] Kilo CLI — free agentic, large context
- [ ] Qwen CLI — free agentic, 480B reasoning
- [x] Cursor IDE — UI/visual iteration (manual)
- [ ] Kiro IDE — review, specs (manual)

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: scanner-app (the primary target)
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS); ADS ONLY.
- **Refs**: `CLAUDE.md`, `IDEA_scanner_onboarding_session.md`, `ADS_CORE_TOKENS.md`

## Goal

> Create a high-quality, multi-step onboarding wizard for first-time guards
> using semantic ADS tokens and 8pt grid system.

## Scope (in)

- `OnboardingNavigator` (Stack with slides).
- Welcome Slide: ADS Typography (`font-heading-xlarge`) + Illustration.
- Security Slide: PIN Entry + FaceID toggle (`form-switch` token style).
- Permissions Slide: Camera + Notifications (Full ADS styling).
- `StepIndicator` component using ADS `space.200` width.
- "Scan to Setup" step: Scan a permission QR to link device to gate.

## Scope (out)

- Shift Clock-in/out API (Phase 3).
- Home dashboard redesign (Phase 4).

## Steps (ordered)

1. Create `apps/scanner-app/src/navigators/onboarding-navigator.tsx`.
2. Build `apps/scanner-app/src/screens/onboarding/welcome-screen.tsx` (ADS
   Outfit font, `ds-text-heading`).
3. Build `apps/scanner-app/src/screens/onboarding/security-setup-screen.tsx`
   (Custom PIN keypad using ADS `space.100` gap).
4. Build `apps/scanner-app/src/screens/onboarding/permissions-screen.tsx` (Card
   layout with `radius.large` and `ds-surface-sunken`).
5. Build `apps/scanner-app/src/screens/onboarding/activation-scan-screen.tsx`.
6. Implement `apps/scanner-app/src/components/common/onboarding-footer.tsx` (ADS
   Primary Button style).
7. Run `pnpm turbo lint --filter=scanner-app`
8. Run `pnpm turbo typecheck --filter=scanner-app`
9. Run `pnpm turbo test --filter=scanner-app`
10. Commit: `git commit -m "feat(scanner): wizard-UI with ADS tokens and multi-step
    setup onboarding flow"`

## Acceptance criteria

- [ ] All UI uses `ds-*` tokens with ZERO hardcoded hex codes.
- [ ] Spacing strictly follows the 8pt grid (`space.*` tokens).
- [ ] Typography uses `Heading` and `Body` tokens with appropriate scaling.
- [ ] RTL layout (Arabic) verified for the entire wizard flow.
- [ ] All tests pass (`pnpm turbo test --filter=scanner-app`)
- [ ] Build green (`pnpm turbo build --filter=scanner-app`)
- [ ] No regression on performance or security metrics.
