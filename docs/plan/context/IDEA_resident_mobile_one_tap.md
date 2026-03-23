# IDEA: resident_mobile_one_tap — Resident Mobile Mastery (v2.0)

## Goal

Transform the resident invitation experience from a multi-step form into a high-speed, "One-Tap" flagship feature. The goal is to reduce the time for a resident to share a guest QR from 1 minute to less than 5 seconds, while improving security and premium branding.

## Background

Under **PRD v9.0 (Growth & Autonomy)**, GateFlow is establishing itself as a resident-centric ecosystem. Existing sharing is functional but "utility-first." By making sharing effortless, we increase product virality (invitees see a premium interface) and resident retention. This initiative introduces **Express Invites**, **Deep-Link Previews**, and **GateAI Delegated Pre-Clearance**.

## Constraints

- **Expo SDK 54**: Must leverage native modules for contact picking and sharing.
- **HMAC-SHA256**: Every shared link must be cryptographically signed by the `resident-mobile` API to prevent link scraping.
- **RTL & Arabic**: The invite message and landing page must be perfectly localized for the MENA market.
- **Tenant Isolation**: Residents can ONLY generate and share passes for their assigned `Unit` and `Organization`.

## Scope

### Phase 1: Security & Signing Foundation (P0)

- Implement a robust HMAC-SHA256 signature utility in the `api/resident` layer.
- Ensure all "One-Tap" links include a non-guessable, signed payload that expires automatically (default 24h).
- Extend `QRCode` or `QrShortLink` models if needed to support "Silent Generation" (generating the link before the guest name is known).

### Phase 2: Core Logic - Fast Link Generation (P0)

- Add a low-latency "Express QR" endpoint that bypasses heavy validation for standard guest passes.
- Create a short-link generator (`gateflow.io/s/[id]`) that routes directly to the premium landing page.
- Implement "Anoymous-to-Identified" logic: allow sharing a blank pass that captures guest info during the first scan.

### Phase 3: Home Tab "Express Invite" UI (P1)

- Build a premium, animated Home Tab widget (Framer Motion / Reanimated) for "One-Tap Share."
- Integrate the `expo-sharing` and `expo-contacts` modules for high-performance guest selection.
- Implement "Recent Guests" quick-share buttons for recurring visitors (e.g., Mom, Cleaner, Delivery).

### Phase 4: Invitee Landing Page - Premium Experience (P1)

- Redesign the guest invitation landing page in `apps/marketing` or `apps/resident-portal`.
- Include high-density branding (Organization Logo), "One-Tap GPS" (Google/Apple Maps integration), and instructions in both English and Arabic.
- Add "Add to Apple Wallet / Google Pay" integration for premium accessibility.

### Phase 5: GateAI Bridge & Arrival Polish (P2)

- Allow residents to "Delegate" pre-clearance to GateAI for specific one-tap links.
- Implement specialized "Arrival Success" animations for the scanner app when a One-Tap guest arrives.
- Conduct a full RTL/Arabic audit of the sharing strings and SMS/WhatsApp templates.

## Success Criteria

- [ ] Residents can share a guest pass in **2 taps** or fewer from the home screen.
- [ ] Shared links are cryptographically signed and bypass manual form filling.
- [ ] Invitee landing page achieves a **100 Lighthouse SEO & Accessibility** score.
- [ ] All "One-Tap" operations are strictly scoped by `organizationId` and `unitId`.
