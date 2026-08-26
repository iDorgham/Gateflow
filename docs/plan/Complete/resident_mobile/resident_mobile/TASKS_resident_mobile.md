# TASKS: Flagship Resident Mobile App

**Slug:** `resident_mobile`  
**Plan:** `PLAN_resident_mobile.md`

---

## Phase 1: Backend API & Push Notification Dispatch

- [x] Verify/harden `POST /api/resident/express-invite` with HMAC signing and rate limiting
- [x] Verify/harden `GET /api/resident/visitors` and `DELETE /api/resident/visitors/:id` (revocation)
- [x] Verify/harden `GET /api/resident/history` (scoped by resident unit and org)
- [x] Implement push token registration in `POST /api/resident/push-token`
- [x] Implement gate entry scan notification hook in `scanner` validation flow
- [x] Add integration tests in `apps/client-dashboard` for all resident endpoints
- [x] Write `phase_logs/PHASE_LOG_phase_01.md`

## Phase 2: Contact Picker & One-Tap Pass Sharing

- [x] Wire `apps/resident-mobile/app/contact-picker.tsx` with `expo-contacts`
- [x] Implement permission request dialog and contact search filtering
- [x] Extract normalized name and E.164 phone number from selected contact
- [x] Connect selection to `/api/resident/express-invite` API call
- [x] Launch native share sheet via `expo-sharing` with pre-filled localized invite message
- [x] Write unit tests for contact normalization and invitation payload builder
- [x] Write `phase_logs/PHASE_LOG_phase_02.md`

## Phase 3: Passes Management & Offline Cache

- [x] Implement active visitor pass carousel in `app/(tabs)/qrs/index.tsx`
- [x] Create Pass Detail modal with large printable/shareable QR code
- [x] Wire pass revocation action with confirmation dialog
- [x] Implement offline caching in `lib/qr-cache.ts` using `AsyncStorage`
- [x] Add offline status banner when cached data is rendered without network
- [x] Write unit tests for `qr-cache.ts` and pass state manager
- [x] Write `phase_logs/PHASE_LOG_phase_03.md`

## Phase 4: Visitor History & Push Deep-Linking

- [x] Build Visitor History feed in `app/(tabs)/history/index.tsx`
- [x] Add filter pills (All / Allowed / Denied) and pull-to-refresh
- [x] Configure `expo-notifications` background and foreground listeners in `lib/push-notifications.ts`
- [x] Implement deep-linking to route incoming notification taps directly to history detail
- [x] Wire `lib/history-cache.ts` for offline history browsing
- [x] Write unit tests for push payload parser and history cache
- [x] Write `phase_logs/PHASE_LOG_phase_04.md`

## Phase 5: Polish, Arabic RTL & Certification

- [x] Audit all mobile screens for ADS design tokens (`nativeTokensNewEra`)
- [x] Verify complete Arabic RTL layout alignment and logical properties
- [x] Add `DutyErrorBoundary` and fallback loading states across all tabs
- [x] Run full test suite: `pnpm --filter resident-mobile test` and `pnpm --filter client-dashboard test`
- [x] Verify zero TypeScript errors (`tsc --noEmit`) and zero ESLint warnings
- [x] Write `phase_logs/PHASE_LOG_phase_05.md`
