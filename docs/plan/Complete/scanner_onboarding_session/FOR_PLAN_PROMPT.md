# FOR_PLAN_PROMPT — `scanner_onboarding_session`

> Ready-to-consume input prompt for **`/plan scanner_onboarding_session`**.

---

## 1. Mission

Implement an enterprise-grade First-Mile Onboarding Wizard, Fail-Closed Biometric/PIN Security Vault, Shift Clock-In Session Lifecycle, and ADS Home Screen Master Scan Action for the GateFlow Scanner Mobile App (`apps/scanner-app`), guaranteeing 100% of physical gate entry scans are authenticated, attributed to an active guard shift, and executed with sub-second camera readiness.

---

## 2. In Scope vs Out of Scope

### In Scope

- **Security & Vault Layer**:
  - `expo-local-authentication` wrapper with multi-tier biometric detection (`FaceID`, `TouchID`, `Fingerprint`) and fail-closed architecture.
  - `expo-secure-store` salted 6-digit PIN vault with exponential lockout rate-limiting (30s after 3 attempts, 5m after 5 attempts).
  - Background inactivity listener triggering `BiometricGuard` unlock prompt after 5 minutes.
- **First-Mile Onboarding Wizard (`OnboardingNavigator`)**:
  - 4-step guided slide sequence: Vision $\rightarrow$ Hardware Permissions (Camera/Haptics/Notifications with deep-link settings recovery) $\rightarrow$ PIN & Biometrics Setup $\rightarrow$ Gate Duty Activation.
- **Shift Session Lifecycle (`useShiftSession`)**:
  - Guard clock-in / clock-out modal workflows with gate lane assignment.
  - Hard gate: Camera scanner path is blocked unless an active shift session is verified.
- **ADS Home Screen Redesign**:
  - Duty Telemetry Widget (Gate Name, Active Duty Timer, Scans Today tally).
  - Prominent 72x72px Master Scan Action FAB (`nativeTokens.colors.blue700` / high-contrast glow) with <1s camera launch.
  - Full Arabic RTL bidirectional layout and ADS dark mode token compliance.
- **Backend Shift APIs**:
  - `POST /api/scanner/shift/start` and `POST /api/scanner/shift/end` with multi-tenant organization scoping.

### Out of Scope

- Resident mobile onboarding (handled in `resident-mobile`).
- Real-time continuous GPS tracking breadcrumbs.
- Enterprise MDM (Mobile Device Management) hardware provisioning.

---

## 3. Users & Constraints

- **Target Personas**: Perimeter Security Guards, Shift Supervisors, Property Security Administrators.
- **Apps Touched**:
  - `apps/scanner-app` (Expo SDK 57 / React Native)
  - `packages/db` (Prisma schema & migrations)
  - `packages/types` (Shared shift and auth DTOs)
  - `packages/ui` (`@gateflow/ui/tokens` & `nativeTokens`)
- **Security Invariants**:
  - Fail-closed biometrics: If biometrics are missing or un-enrolled, mandatory 6-digit PIN setup is required.
  - Secure storage: All tokens and PIN salts stored exclusively in `expo-secure-store` (never `AsyncStorage`).
  - Multi-tenancy: All shift APIs must strictly validate `organizationId` from authenticated claims.
- **Design Tokens**:
  - 100% adherence to `@gateflow/ui/tokens` (`nativeTokens` for React Native `StyleSheet`). No raw hex strings.

---

## 4. Definition of Done

- [ ] All unit tests pass in `apps/scanner-app` with 100% green suites (`pnpm --filter scanner-app test`).
- [ ] Monorepo preflight passes with 0 errors (`pnpm preflight`).
- [ ] Fail-closed biometric fallback logic verified via automated unit tests.
- [ ] Shift clock-in and scan blocking behavior verified.
- [ ] Zero un-themed raw hex colors in newly added mobile screens.
- [ ] Arabic RTL layout verified for onboarding wizard and home dashboard.

---

## 5. Suggested Phase Breakdown

1. **Phase 1 — Foundation: Biometric Security, Secure PIN Vault & Fail-Closed Invariants** (Role: MOBILE / SECURITY | Tool: Cursor)
2. **Phase 2 — Onboarding Wizard UI & Hardware Permission Workflows** (Role: FRONTEND / MOBILE | Tool: Cursor)
3. **Phase 3 — Shift Session Management API, State Hooks & Scan Blocking** (Role: BACKEND-API / MOBILE | Tool: Cursor)
4. **Phase 4 — ADS Master Scan Home Screen Redesign & Real-Time Telemetry** (Role: FRONTEND / MOBILE | Tool: Cursor)
5. **Phase 5 — Polish, Biometric Inactivity Guard, Arabic RTL & Full Monorepo Certification** (Role: QA / MOBILE | Tool: Cursor)

---

## 6. References

- **Draft Notes**: [`docs/plan/Draft/scanner_onboarding_session/DRAFT_scanner_onboarding_session.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/scanner_onboarding_session/DRAFT_scanner_onboarding_session.md)
- **Initiative Spec**: [`docs/development/initiatives/IDEA_scanner_onboarding_session.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/development/initiatives/IDEA_scanner_onboarding_session.md)
- **PRD**: [`docs/reference/product/PRD.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/reference/product/PRD.md)
- **ADS Mobile Design Standard**: [`docs/guides/UI_DESIGN_GUIDE.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/guides/UI_DESIGN_GUIDE.md)

---

## Next Command

```text
/plan scanner_onboarding_session
```
