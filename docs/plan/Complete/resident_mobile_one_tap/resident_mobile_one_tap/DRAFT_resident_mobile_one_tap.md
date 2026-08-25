# Draft — `resident_mobile_one_tap`

**Slug:** `resident_mobile_one_tap`  
**Last updated:** 2026-08-24  
**Champion:** Mobile Engineering & Growth Team  
**Initiative Link:** `docs/development/initiatives/IDEA_resident_mobile_one_tap.md`  
**Target:** Q3 / Q4 2026

> Raw planning notes for Resident Mobile Mastery v2.0 (High-Speed One-Tap Express Invites, Cryptographic Short-Links, Apple/Google Wallet Access, and Premium Bilingual Invitee Landing Experience). When this feels complete, run **`/prompt resident_mobile_one_tap`** then **`/plan resident_mobile_one_tap`**.

---

## 1. What I Want

- **One-Tap Express Guest Pass Generator**:
  - Reduce guest pass sharing time from $> 60$ seconds to $< 5$ seconds.
  - "Silent Pre-Generation": Generate secure pass links instantly before guest name is entered, capturing guest identity upon redemption/arrival.
- **Cryptographic Short-Link Foundation**:
  - Format: `gateflow.site/s/<shortCode>?sig=<hmacSignature>`.
  - Timing-safe HMAC-SHA256 signature validating expiration (24h default) and multi-tenant scoping.
- **Resident Mobile Home Screen Express Widget**:
  - Animated QuickShare card on mobile Home tab with "Recent Guests" pills (e.g. Cleaner, Family, Delivery).
  - Native iOS/Android Contact Picker & Share Sheet integration.
- **Luxury Invitee Landing Page Experience**:
  - Responsive, high-density guest landing view at `gateflow.site/s/[id]`.
  - Organization branding, interactive compound GPS navigation, and 1-tap "Add to Apple Wallet / Google Pay" pass export.
- **GateAI Arrival Delegator & Guard Notification**:
  - Seamless auto-clearance rules for recurring guests.
  - Instant guard notification banner when a VIP Express guest arrives at the gate.

---

## 2. Constraints & Guardrails

- **Expo SDK 54**: Must utilize Expo native sharing APIs (`expo-sharing`) and modular components compatible with React Native 0.76+.
- **HMAC-SHA256 Cryptographic Security**: Every short link must carry an unforgeable cryptographic signature protecting tenant ID and unit ID.
- **Full Arabic RTL Localization**: All WhatsApp/SMS invite templates, mobile widgets, and guest landing pages must support natural Arabic.
- **Multi-Tenant Hard-Scoping**: Residents can strictly issue passes bound to their authorized `organizationId` and `unitId`.

---

## 3. Suggested 5-Phase Plan Sketch

1. **Phase 1: Cryptographic Short-Link & Silent Token Foundation**:
   - Implement HMAC-SHA256 token generator and validation utility for express short links (`apps/resident-mobile/src/lib/express-pass/`).
2. **Phase 2: Express Link Core Engine & Anonymous-to-Identified Resolver**:
   - Build express pass creation service and redemption handler that binds visitor name on first access.
3. **Phase 3: Resident Mobile Home Tab Express Share Widget**:
   - Build high-performance React Native express widget with Recent Guests chips and native share sheet dispatch.
4. **Phase 4: Luxury Invitee Landing Page & Wallet Pass Export**:
   - Implement premium landing view with organization branding, 1-tap GPS directions, and digital wallet pass generation.
5. **Phase 5: GateAI Arrival Pre-Clearance, Arabic RTL Audit & Full Certification**:
   - Implement arrival alerts, verify Arabic RTL localization, and execute automated test suites.

---

## 4. Open Questions

- [ ] Should express pass links allow single-use only or multi-entry within the 24-hour validity window?
- [ ] Do we want to support direct WhatsApp API template triggers from the mobile app?

---

## 5. Changelog

- **2026-08-24**: Drafted initiative from `IDEA_resident_mobile_one_tap.md` covering express pass signing, mobile widget, and luxury landing page.
