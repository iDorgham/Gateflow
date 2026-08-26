# Phase 2: Contact Picker & One-Tap Pass Sharing

## Primary Role

FRONTEND / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (React Native / Expo UI iteration)
- **Tool 2**: Qwen CLI (Helper refactoring & formatting)

## Context

- **Focused App**: `apps/resident-mobile`
- **Scope**: `apps/resident-mobile/app/contact-picker.tsx` and native share sheet integration.
- **Packages**: `expo-contacts`, `expo-sharing`, `@gate-access/ui/tokens` (`nativeTokensNewEra`).

## Goal

Implement a seamless, 3-tap contact picker that accesses the device address book, creates an instant HMAC pass via `/api/resident/express-invite`, and launches the native OS share sheet.

## Scope (In)

1. `contact-picker.tsx`:
   - Request contacts permission using `expo-contacts.requestPermissionsAsync()`.
   - Render searchable, virtualized list of contacts with alphabetical grouping.
   - Clean and normalize selected contact names and phone numbers (E.164 formatting).
2. API & Share Flow:
   - Call `POST /api/resident/express-invite` with selected contact details.
   - On success, launch `expo-sharing.shareAsync()` or native WhatsApp/SMS deep link with pre-filled localized invitation text.
   - Save created pass to local cache (`qr-cache.ts`).
3. Unit tests:
   - Phone normalization tests.
   - Contact search filter tests.
   - Mocked share payload generation tests.
4. Write `phase_logs/PHASE_LOG_phase_02.md`.

## Acceptance Criteria

- [ ] Contact picker handles permission granted, denied, and restricted states gracefully.
- [ ] Selecting a contact creates a valid HMAC pass and triggers the native share sheet.
- [ ] All UI elements use semantic tokens from `nativeTokensNewEra`.
- [ ] Unit tests pass cleanly.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_02.md` created.
