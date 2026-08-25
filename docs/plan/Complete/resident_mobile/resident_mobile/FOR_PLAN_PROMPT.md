# Plan Handoff Prompt — `resident_mobile`

**Slug:** `resident_mobile`  
**Target Plan Directory:** `docs/plan/Draft/resident_mobile/`  
**Primary App:** `apps/resident-mobile`  
**API Provider:** `apps/client-dashboard` (`/api/resident/*`)  
**Source Draft:** `docs/plan/Draft/resident_mobile/DRAFT_resident_mobile.md`

---

## 1. Mission

Deliver the flagship **GateFlow Resident Mobile App** (Expo React Native, SDK 57) providing compound residents with an effortless 3-tap visitor pass creation flow from phone contacts, real-time gate entry push alerts, offline cached pass viewing, guest GPS navigation deep-links, and full Arabic/English bi-directional support using ADS semantic design tokens.

---

## 2. In Scope vs. Out of Scope

### In Scope

- **Backend APIs (`apps/client-dashboard/src/app/api/resident/*`)**:
  - `/api/resident/express-invite`: One-tap pass creation with HMAC-SHA256 signing.
  - `/api/resident/visitors`: List active passes, details, and pass revocation.
  - `/api/resident/history`: Access logs and visitor scan history.
  - `/api/resident/push-token`: Register Expo Push Notification device tokens.
  - `/api/resident/arrived`: Doorstep arrival ping triggered from public pass page (`/s/[shortId]`).
  - Scan webhook/event integration in `scanner` scan processing to trigger push notifications.
- **Client App (`apps/resident-mobile`)**:
  - `contact-picker.tsx`: Native phone address book picker (`expo-contacts`) with name and phone number extraction.
  - `expo-sharing`: Localized WhatsApp/SMS invitation share sheet.
  - `app/(tabs)/qrs/`: Active visitor pass carousel, details modal, and revocation.
  - `app/(tabs)/history/`: Scan history list with status badges and timestamp filters.
  - `expo-notifications`: Push alert listener with deep-linking to the specific history entry.
  - Offline caching via `AsyncStorage` + `expo-secure-store` (`qr-cache.ts`, `history-cache.ts`).
  - Bi-directional Arabic RTL and English support with logical layout (`paddingStart`, `paddingEnd`).
  - ADS tokenized mobile styling via `@gate-access/ui/tokens` (`nativeTokensNewEra`).

### Out of Scope

- Recurring multi-day schedules (maids/drivers presets) — reserved for Phase 2.
- In-app conversational AI assistant (reserved for `gateai` initiative).
- Native continuous GPS breadcrumb tracking.

---

## 3. Users & Constraints

- **Primary Users**: Residents living in gated communities and compound developments.
- **Apps Touched**:
  - `apps/resident-mobile` (Expo Router v6, React Native 0.81.5, Expo SDK 57).
  - `apps/client-dashboard` (REST APIs under `src/app/api/resident/*`).
  - `packages/ui` (`@gate-access/ui/tokens` - `nativeTokensNewEra`).
- **Tenancy & Security**:
  - All DB queries strictly scoped by `organizationId` with `deletedAt: null` filtering (where model defines `deletedAt`).
  - Auth tokens stored exclusively in `expo-secure-store`.
  - Zero hardcoded hex colors or plain CSS vars; use `nativeTokensNewEra`.

---

## 4. Definition of Done

1. **Test Coverage**: 100% passing Jest unit and integration tests across touched endpoints and mobile helpers.
2. **Type Safety & Lint**: `pnpm turbo lint typecheck --filter=resident-mobile --filter=client-dashboard` passes with 0 errors.
3. **One-Tap Pass Creation**: Contact selection creates a cryptographically signed HMAC QR pass and presents the OS share sheet.
4. **Push Notifications**: Live scan at security gate successfully delivers push alert to the resident's registered device.
5. **Offline Support**: Existing passes viewable offline with cached status indicators.
6. **RTL / i18n**: Arabic and English layouts render cleanly without overlapping or alignment regressions.

---

## 5. Suggested Phase Breakdown

- **Phase 01 — Backend API & Push Notification Dispatch**: Harden `/api/resident/*` endpoints, integrate push notification worker on gate scan events, and write integration tests.
- **Phase 02 — Contact Picker & One-Tap Pass Sharing**: Build `contact-picker.tsx` with `expo-contacts` and wire `expo-sharing` invitation sheet.
- **Phase 03 — Active Passes Management & Offline Cache**: Build QRs tab carousel, wire `qr-cache.ts`, and implement pass revocation.
- **Phase 04 — Visitor History & Push Deep-Linking**: Build History tab, configure `expo-notifications` listener, and wire notification deep-links.
- **Phase 05 — Polish, Arabic RTL & Certification**: ADS design audit, Arabic translation pass, error boundaries, and full test suite verification.

---

## 6. References

- **Draft Notes**: `docs/plan/Draft/resident_mobile/DRAFT_resident_mobile.md`
- **Initiative Specs**: `docs/development/initiatives/IDEA_resident_mobile.md` & `IDEA_resident_mobile_one_tap.md`
- **PRD Reference**: `docs/PRD_v7.0.md` §4 (Resident Mobile)

---

## Command to Run

```text
/plan resident_mobile
```
