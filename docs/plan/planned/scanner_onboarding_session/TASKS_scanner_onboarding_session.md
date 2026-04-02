# TASKS: Scanner App — Onboarding & Session Management

## Phase 1: Security & Auth Hooks

- [x] Add `expo-local-authentication` to `scanner-app` (declared in package.json; awaiting pnpm install after corepack EPERM fix)
- [x] Create `SecurePINStorage` utility (`expo-secure-store`) — `src/lib/security/secure-pin.ts`
- [x] Implement `useBiometry` hook — `src/hooks/use-biometry.ts`
- [x] Update Prisma schema: Add `ShiftLog` (id, guardId, gateId, startTime, endTime, organizationId)
- [x] Migration: Applied `20260402124145_shift_log` — database in sync

## Phase 2: Onboarding Wizard (UI/UX)

- [ ] Create `OnboardingNavigator` (Stack with slides)
- [ ] Welcome Slide: ADS Typography (Heading XL) + Illustration
- [ ] Security Slide: PIN Entry (`4` or `6` digits) + Bio toggle
- [ ] Permissions Slide: Camera + Notifications (Full ADS styling)
- [ ] `StepIndicator` component using ADS `space.200`
- [ ] Add "Scan to Finalize" step (Permission QR)

## Phase 3: Shift Management System

- [ ] API: `POST /api/scanner/shift/start` (requires Gate Permission QR)
- [ ] API: `POST /api/scanner/shift/end`
- [ ] Hook: `useShiftSession` for local state (persisted)
- [ ] Logic: Block scanner access if shift is not active
- [ ] Database: Ensure `ShiftLog` is linked to site/org context

## Phase 4: Master Scan Home Screen

- [ ] Redesign `HomeScreen` for high-density duty info
- [ ] Widget: Shift Time Active (Live timer component)
- [ ] Master Scan FAB: Centered, 72px, high-contrast action
- [ ] Dynamic Layout: Mobile Dashboard (8pt grid)
- [ ] Stats Grid: Today's Scans, Arrival alerts, System Status

## Phase 5: Polish & Security Audit

- [ ] Page Transitions (`framer-motion-react-native` or `Reanimated`)
- [ ] Global `BiometricGuardHOC` with 5-min inactivity timeout
- [ ] RTL Audit for Wizard and Dashboard (Arabic)
- [ ] Error Boundaries + Loading Skeletons
- [ ] Final Verification: Fail-safe logic and fallback testing
