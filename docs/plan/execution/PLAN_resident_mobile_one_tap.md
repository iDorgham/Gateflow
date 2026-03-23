# PLAN: resident_mobile_one_tap — Resident Mobile Mastery (v2.0)

This plan outlines the implementation of the "One-Tap" invitation experience for residents. It focuses on zero-friction sharing, high-security HMAC signing, and premium invitee landing pages.

## Phases

### Phase 1: Security & Signing Foundation (P0)
**Goal:** Implement a cryptographically secure foundation for one-tap links.
- **Backend/Security:** Use `HMAC-SHA256` for signing short-link payloads.
- **Package:** Centralize signing logic in a shared package or `packages/db/src/security.ts`.
- **Validation:** Add unit tests for signature generation and verification.
- **Acceptance Criteria:**
  - [ ] `createSecureInviteSignature(payload: string, secret: string): string` implementation.
  - [ ] `verifySecureInviteSignature(payload: string, signature: string, secret: string): boolean` implementation.
  - [ ] Passing unit tests in `@gate-access/db`.

### Phase 2: Core Logic - Fast Link Generation (P0)
**Goal:** Implement the "Silent Generation" of high-speed guest passes.
- **API:** Add `/api/resident/express-invite` endpoint (Next.js).
- **Logic:** Generate a `QrShortLink` and a corresponding `QRCode` in a single transaction.
- **Optimization:** Use "Anonymous-to-Identified" logic: the share link is valid even if the guest name isn't filled yet.
- **Acceptance Criteria:**
  - [ ] API endpoint returns a signed `shortId` link.
  - [ ] `QrShortLink` points to the correct marketing landing page.

### Phase 3: Home Tab "Express Invite" UI (P1)
**Goal:** Build the high-premium "One-Tap" widget in the resident app.
- **Mobile UI:** Premium Home Tab widget using Framer Motion (or Reanimated).
- **Integration:** Use `expo-sharing` and `expo-contacts`.
- **UX:** Recent Guests quick-access buttons.
- **Acceptance Criteria:**
  - [ ] Widget is visible on Home Tab.
  - [ ] Tapping "Express Invite" opens the native share sheet with the signed link.

### Phase 4: Invitee Landing Page - Premium Experience (P1)
**Goal:** Redesign the guest landing page for a world-class invitation experience.
- **Marketing App:** Redesign `/s/[shortId]` route in `apps/marketing`.
- **Features:** High-density branding, interactive GPS guide, RTL support.
- **Access:** Integration for "Add to Apple/Google Wallet."
- **Acceptance Criteria:**
  - [ ] Landing page is fully responsive.
  - [ ] Page handles both LTR and RTL perfectly.

### Phase 5: Refinement - i18n & GateAI Polish (P2)
**Goal:** Finalize the MENA localization and add AI-delegation options.
- **AI Integration:** Option for residents to delegate guest pre-clearance to GateAI.
- **i18n:** Professional Arabic strings for all sharing messages.
- **Audit:** Security & RTL audit across the new flow.
- **Acceptance Criteria:**
  - [ ] Sharing message templates are localized.
  - [ ] No tenant-isolation leaks (verified via /clis-team audit).

---

## Technical Constraints
- **Stack:** Expo SDK 54, Next.js 14, Prisma 5.
- **Tenant Isolation:** Every operation must be scoped to the resident's `organizationId` and `unitId`.
- **Security:** HMAC-SHA256 is mandatory; no unsigned links ever.
