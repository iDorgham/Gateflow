# TASKS — resident_mobile_one_tap

**Goal:** One-Tap invitation experience for residents — zero-friction sharing, HMAC-signed links, premium landing pages.

---

## Phase 1 — Security & Signing Foundation ✅

- [x] `packages/db/src/security.ts` — `createSecureInviteSignature` + `verifySecureInviteSignature` (HMAC-SHA256, constant-time verify)
- [x] `packages/db/src/security.test.ts` — 15 tests (correctness, tamper-proofing, secret-proofing, edge cases)
- [x] `packages/db/src/index.ts` — exports added
- [x] lint ✅ typecheck ✅ test 15/15 ✅

---

## Phase 2 — Core Logic: Fast Link Generation ✅

- [x] `apps/client-dashboard/src/app/api/resident/express-invite/route.ts` — POST endpoint
- [x] Single-transaction `QrShortLink` + `QRCode` creation
- [x] Anonymous-to-Identified logic (link valid before guest name)
- [x] Returns signed `shortId` link

---

## Phase 3 — Home Tab "Express Invite" UI ✅

- [x] Premium widget on resident Home Tab (QRs Screen)
- [x] `expo-sharing` native share sheet integration
- [x] `expo-contacts` context and Recent Guests quick-access
- [x] Framer Motion / Moti animations

--- [x] Phase 4: Invitee Landing Page - Premium Experience 🚀 - [x] Redesign `/s/[shortId]` in marketing app with high-premium branded UI - [x] Implement "Secure Digital Handshake" visual and status (verification) - [x] Guest info entry form for anonymous invites (updates DB via Server Action) - [x] One-Tap Navigation integration (Google, Apple, Waze) - [x] Signed link validation on server-side - [x] Full Arabic/RTL support and localization

---

## Phase 5 — i18n & GateAI Polish ⬜

- [ ] rings for sharing messages
- [ ] GateAI delegation option for resident pre-clearance
- [ ] Security + RTL audit across entire flow
