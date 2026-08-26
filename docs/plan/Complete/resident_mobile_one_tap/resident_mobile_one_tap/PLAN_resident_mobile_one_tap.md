# PLAN: Resident Mobile Mastery (v2.0) — One-Tap Express Invites

- **Initiative:** `resident_mobile_one_tap`
- **Application:** Cross-Platform (`apps/resident-mobile`, `apps/marketing`, `packages/db`)
- **Status:** ✅ Complete — all phases 1–5 complete (verified)
- **Priority:** P1 — Mobile Resident Experience & Product Virality
- **Branch:** `feat/resident-mobile-one-tap`

---

## Executive Summary

Transform the resident visitor pass experience into a high-speed "One-Tap" flow (< 5s invite sharing) backed by cryptographically signed HMAC-SHA256 short links, native mobile contact integration, a luxury bilingual invitee landing page, and GateAI arrival pre-clearance.

---

## Ordered Implementation Phases

### Phase 1: Cryptographic Short-Link & Silent Token Foundation

- **Role:** BACKEND-API / SECURITY
- **Preferred Tool:** Cursor IDE
- **Scope:**
  - Build cryptographic HMAC-SHA256 token generator for silent express links.
  - Implement short-link signing, payload structure, and tamper-proof verification logic.
  - Unit tests for token generation, expiration math, and signature verification.
- **Acceptance Criteria:**
  - Valid signatures pass verification; expired or tampered tokens are rejected.
  - Multi-tenant parameters (`organizationId`, `unitId`) cryptographically bound.
  - 100% unit test pass rate.

### Phase 2: Express Link Core Engine & Anonymous-to-Identified Resolver

- **Role:** BACKEND-API / MOBILE
- **Preferred Tool:** Cursor IDE
- **Scope:**
  - Build Express Pass issuance API and state resolver.
  - Implement anonymous-to-identified redemption flow (visitor claims pass by name/phone upon opening link).
  - Unit tests for state transitions, anonymous redemption, and QR token binding.
- **Acceptance Criteria:**
  - Express links can be generated silently in $< 50$ms.
  - Visitor identity binds accurately on first redemption without invalidating signature.
  - 100% unit test pass rate.

### Phase 3: Resident Mobile Home Tab Express Share Widget

- **Role:** MOBILE / FRONTEND
- **Preferred Tool:** Cursor IDE
- **Scope:**
  - Build animated QuickShare card on mobile Home tab with Recent Guests pills.
  - Implement native contact selection and platform native Share Sheet dispatch.
  - High-density ADS mobile token styling (`@gate-access/ui/tokens`).
- **Acceptance Criteria:**
  - One-tap triggers native share sheet with localized pre-composed message.
  - Recent Guests list updates dynamically upon each pass generation.
  - Unit tests verify widget state and recent guest filtering.

### Phase 4: Luxury Invitee Landing Page & Wallet Pass Export

- **Role:** FRONTEND / FULLSTACK
- **Preferred Tool:** Cursor IDE
- **Scope:**
  - Build responsive guest invitation landing page with organization logo and compound GPS navigation.
  - Implement 1-tap "Add to Apple Wallet / Google Pay" pass export metadata generator.
  - Dual English/Arabic presentation with smooth micro-animations.
- **Acceptance Criteria:**
  - Landing page renders perfectly with zero layout shift on mobile viewports.
  - Digital wallet pass payload adheres to PKPass / Google Wallet schemas.
  - Unit tests verify landing page state and wallet export generation.

### Phase 5: GateAI Arrival Pre-Clearance, Arabic RTL Audit & Full Certification

- **Role:** QA / MOBILE / DESIGN
- **Preferred Tool:** Opencode CLI
- **Scope:**
  - Implement GateAI arrival pre-clearance delegator and scanner VIP notification banners.
  - Full Arabic RTL localization audit for SMS, WhatsApp, and UI strings.
  - Automated test suite execution across all affected packages.
- **Acceptance Criteria:**
  - Arabic copy natural, welcoming, and 100% RTL compliant.
  - Scanner app triggers arrival celebration animation on VIP express scan.
  - 100% automated test pass rate with 0 errors.

---

## Reference Documents

- `docs/plan/Draft/resident_mobile_one_tap/DRAFT_resident_mobile_one_tap.md`
- `docs/development/initiatives/IDEA_resident_mobile_one_tap.md`
