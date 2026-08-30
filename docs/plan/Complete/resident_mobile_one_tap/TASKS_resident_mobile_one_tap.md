# TASKS — resident_mobile_one_tap

**Slug:** `resident_mobile_one_tap`  
**Status:** ✅ Complete  
**Last Updated:** 2026-08-30  
**Target App:** `apps/resident-mobile`  
**Priority:** P1

---

## Phase 1: Core Foundation + Biometric + QR Display

- [x] Create folder `src/features/one-tap/`
- [x] Create `hooks/useBiometricAuth.ts`
- [x] Create `hooks/useSecureQR.ts`
- [x] Create `components/BiometricGate.tsx`
- [x] Create `components/FullScreenQR.tsx`
- [x] Create `components/PinFallbackModal.tsx`
- [x] Create `screens/OneTapHomeScreen.tsx`
- [x] Integrate SecureStore with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`
- [x] Implement Session Timeout (45–60 seconds) via AppState
- [x] Add offline support for last valid QR
- [x] Verify QR appears in ≤ 800ms after successful biometric
- [x] Test PIN fallback after 3 failed biometric attempts

**Done when:** QR appears ≤ 800ms after biometric + PIN fallback works reliably (Phase 1 Complete ✅)

---

## Phase 2: Instant Visitor Sharing

- [x] Create folder `src/features/visitor-share/`
- [x] Create `hooks/useVisitorInvite.ts`
- [x] Create `hooks/useShareVisitor.ts`
- [x] Create `components/VisitorTemplatePicker.tsx`
- [x] Create `components/ShareSheet.tsx`
- [x] Create `components/VisitorStatusBadge.tsx`
- [x] Create `screens/CreateVisitorScreen.tsx`
- [x] Create `screens/VisitorListScreen.tsx`
- [x] Implement templates: Family / Driver / Contractor / Day-Guest
- [x] Support single + bulk sharing
- [x] Add local Rate Limiting (max 15 invites/hour)
- [x] Track invite status: Sent / Opened / Used / Expired

**Done when:** Create + share an invite in ≤ 3 taps (Phase 2 Complete ✅)

---

## Phase 3: Smart Arrival Notifications

- [x] Create folder `src/features/notifications/`
- [x] Create `hooks/useArrivalNotifications.ts`
- [x] Create `services/pushService.ts`
- [x] Create `handlers/notificationHandlers.ts`
- [x] Create `components/NotificationSettings.tsx`
- [x] Register Push Token with backend
- [x] Support interactive notification actions (Open Gate / Reject / Call Guard)
- [x] Support background + silent push
- [x] Add user notification preference settings

**Done when:** Notification arrives ≤ 3 seconds after scan event (Phase 3 Complete ✅)

---

## Phase 4: Security + Compliance + Audit

- [x] Create folder `src/features/security/`
- [x] Create `hooks/useAuditLogger.ts`
- [x] Create `services/auditService.ts`
- [x] Create `utils/piiMasking.ts`
- [x] Log all sensitive actions to Audit Ledger
- [x] Mask PII in UI (national ID, phone, etc.)
- [x] Enforce strict `organizationId` isolation
- [x] Apply API-level Rate Limiting
- [x] Run basic security tests (Replay / Session Hijacking)

**Done when:** Every action is audited + no sensitive data visible in UI (Phase 4 Complete ✅)

---

## Phase 5: Final Polish + Quality

- [x] Add professional Empty States
- [x] Add Loading Skeletons
- [x] Full RTL support + Cairo font
- [x] Smooth Dark / Light mode
- [x] Unit tests for all hooks
- [x] E2E tests (Maestro or Detox)
- [x] Performance + battery impact measurement
- [x] Final Design System review (Comfortable Density)
- [x] Ensure `pnpm preflight` passes cleanly

**Done when:** All tests green + polished production-ready experience (Phase 5 Complete ✅)

---

## Cross-Cutting Tasks

- [x] Update `FEATURE_LOG.md`
- [x] Update `UPCOMING.md`
- [x] Write phase logs
- [x] Use Design System tokens only (no hardcoded colors)
