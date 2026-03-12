# IDEA: Resident Mobile App — Phase 2 Flagship

**Slug:** `resident_mobile`
**Status:** Ready to plan
**Created:** 2026-03-12
**PRD Reference:** PRD v6.0 §4 (Resident Portal), §14 (Resident Mobile Enhancement Plan)

---

## Problem

Residents living in GateFlow-managed compounds have no mobile-native way to manage visitor access. The resident-portal web app is live but not optimised for on-the-go use. Residents need to:

- Create and share visitor QR codes in one tap from their phone contacts
- Know immediately when a visitor scans in at the gate (push notification)
- Guide guests to their door after gate entry (GPS link)
- Confirm guest arrival without handing out their unit number publicly

The `apps/resident-mobile` directory has a basic 3-tab skeleton (QRs / History / Settings) with expo-router, auth libs, and tab chrome — but zero real features or API integration.

---

## Vision

A lightweight, fast Expo app that lets a resident:
1. Pick a contact → QR is created + share sheet opens → done in 3 taps
2. Get a push when that visitor scans at the gate
3. Send the guest a GPS deep-link to their door
4. Confirm arrival with a single tap ("I've arrived" button on the QR landing page)

Arabic RTL and offline QR display are first-class requirements for the MENA market.

---

## Existing Assets

| Asset | Location | Status |
|---|---|---|
| App skeleton | `apps/resident-mobile/` | 3-tab shell, expo-router, auth libs |
| Resident Portal web | `apps/resident-portal/` | Live — visitors, history, profile, open-qr, notifications |
| Resident Portal APIs | `apps/resident-portal/src/app/api/` | Does not exist — pages only |
| Resident APIs (client-dashboard) | `apps/client-dashboard/src/app/api/` | No `/api/resident/*` routes yet |
| DB Models | `packages/db/prisma/schema.prisma` | Unit, VisitorQR, AccessRule, ResidentLimit exist (from prior work) — verify |
| Push infra | anywhere | Not integrated |

---

## Scope (P0 + P1)

### In scope

**Phase A — Contact-Based QR Creation & Sharing (P0)**
- Resident selects phone contact (expo-contacts) → fills visitor name/phone pre-populated
- Create VisitorQR via API → get short QR link
- Share via OS share sheet (expo-sharing): pre-filled "Your gate pass: [link]"
- Works offline for display of already-created QRs (AsyncStorage cache)

**Phase B — Visitor Scan Push Notification (P0)**
- Backend event when a VisitorQR is scanned → resolve owning resident → Expo Push token → push
- Payload: "[Visitor Name] just scanned in at [Gate Name]"
- Deep link opens Visitor History tab at that entry
- Expo Push Service (not FCM — simpler, free, sufficient for MVP)

**Phase C — GPS Guide for Guest (P1)**
- QR landing page (`/s/[shortId]` in client-dashboard) adds "Get directions" button after scan
- Opens `maps://` (Apple) or `https://maps.google.com/?q=` with unit coordinates
- Coordinates stored on Unit model (optional lat/lng fields)

**Phase D — Arrival Notification (P1)**
- QR landing page shows "I've arrived" button (visible after gate scan succeeds)
- Guest taps → POST to API → push notification to resident: "[Visitor Name] has arrived at your door"
- No continuous GPS tracking; single event only

### Out of scope (P2 / future)
- Smart guest templates (Family, Maid, Driver presets)
- Recurring visitor presets
- Quota widget home screen
- Biometric lock (FaceID/TouchID)
- Combined scan+arrival timeline
- Notification quiet hours UI
- Admin-facing resident management in admin-dashboard

---

## API Layer Decision

**Resident APIs will live in `apps/client-dashboard`** under `/api/resident/*`.

Rationale:
- `client-dashboard` already has Prisma access, auth middleware, rate limiting, and CSRF
- `resident-portal` is a page-only Next.js app with no API infrastructure
- Mobile apps cannot use Next.js server actions — they need REST
- Avoids a third API origin for the mobile app

New routes needed:
```
GET  /api/resident/me             → unit info, quota usage
GET  /api/resident/visitors       → paginated VisitorQR list
POST /api/resident/visitors       → create VisitorQR + AccessRule
GET  /api/resident/visitors/[id]
DELETE /api/resident/visitors/[id]
POST /api/resident/open-qr        → create Open QR
GET  /api/resident/history        → scan logs for resident's QRs
POST /api/resident/push-token     → register Expo push token
POST /api/resident/arrived        → guest "I've arrived" event
```

All routes gated by `requireAuth` with `role === 'RESIDENT'` check.

---

## Auth Model

- Residents log in at `apps/resident-portal/login` (existing) using email+password → JWT with `role: RESIDENT`
- Mobile app (`apps/resident-mobile/app/login.tsx`) will use the same `/api/auth/login` endpoint on client-dashboard
- Tokens stored in `expo-secure-store` (already a dependency)
- 15-min access token + 30-day refresh (same pattern as scanner-app)

---

## New Dependencies (resident-mobile)

```
expo-contacts  ~14.x
expo-sharing   ~13.x
expo-notifications ~0.x
expo-location  ~18.x
```

No new backend packages needed — Expo Push uses HTTPS POST to the Expo push API.

---

## Success Criteria

| Metric | Target |
|---|---|
| Contact to QR created to shared | 3 taps or fewer |
| Push notification latency | Under 5 seconds after gate scan |
| Offline QR display | Works with no network |
| RTL Arabic layout | All screens correct |
| TypeScript strict mode | Zero errors |
| Lint + typecheck | Green before each phase merge |

---

## Risks & Open Questions

| Risk | Mitigation |
|---|---|
| expo-contacts permission denial (iOS) | Graceful fallback to manual name/phone input |
| Expo Push token registration failure | Retry on next app open; show in-app fallback |
| Unit lat/lng not populated | GPS guide degrades gracefully — button hidden if no coords |
| VisitorQR / AccessRule schema not matching web portal | Verify schema early in Phase 1 |
| QR landing page (`/s/[shortId]`) already exists | Extend it, do not replace — scanner-app flow must not break |

---

## Proposed Phase Breakdown (for /plan)

| Phase | Deliverable |
|---|---|
| 1 | Schema verify + API layer: `/api/resident/*` routes in client-dashboard + auth guard |
| 2 | QRs tab: list, create, delete; offline cache |
| 3 | Contact picker + share sheet (Phase A) |
| 4 | Push notifications: token registration + scan event (Phase B) |
| 5 | GPS guide on QR landing page + arrival notification (Phases C+D) |
| 6 | History tab, Settings tab (notification prefs), RTL polish + tests |
