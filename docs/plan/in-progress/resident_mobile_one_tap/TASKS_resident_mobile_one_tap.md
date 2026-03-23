# TASKS — resident_mobile_one_tap

**Goal:** One-Tap invitation experience for residents — zero-friction sharing, HMAC-signed links, premium landing pages.

---

## Phase 1 — Security & Signing Foundation ✅

- [x] `packages/db/src/security.ts` — `createSecureInviteSignature` + `verifySecureInviteSignature` (HMAC-SHA256, constant-time verify)
- [x] `packages/db/src/security.test.ts` — 15 tests (correctness, tamper-proofing, secret-proofing, edge cases)
- [x] `packages/db/src/index.ts` — exports added
- [x] lint ✅ typecheck ✅ test 15/15 ✅

---

## Phase 2 — Core Logic: Fast Link Generation ⬜

- [ ] `apps/client-dashboard/src/app/api/resident/express-invite/route.ts` — POST endpoint
- [ ] Single-transaction `QrShortLink` + `QRCode` creation
- [ ] Anonymous-to-Identified logic (link valid before guest name)
- [ ] Returns signed `shortId` link

---

## Phase 3 — Home Tab "Express Invite" UI ⬜

- [ ] Premium widget on scanner-app / resident Home Tab
- [ ] `expo-sharing` native share sheet integration
- [ ] `expo-contacts` for recent guests quick-access
- [ ] Framer Motion / Reanimated animations

---

## Phase 4 — Invitee Landing Page ⬜

- [ ] Redesign `apps/marketing` `/s/[shortId]` route
- [ ] Fully responsive, LTR + RTL support
- [ ] Interactive GPS guide section
- [ ] Apple/Google Wallet integration hook

---

## Phase 5 — i18n & GateAI Polish ⬜

- [ ] Professional Arabic strings for sharing messages
- [ ] GateAI delegation option for resident pre-clearance
- [ ] Security + RTL audit across entire flow
