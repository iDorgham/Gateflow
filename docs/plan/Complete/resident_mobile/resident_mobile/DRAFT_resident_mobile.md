# Draft — `resident_mobile`

**Slug:** `resident_mobile`  
**Last updated:** 2026-08-24  
**Primary App:** `apps/resident-mobile`  
**API Provider:** `apps/client-dashboard` (`/api/resident/*`)  
**Linked Initiative:** `docs/development/initiatives/IDEA_resident_mobile.md`

> Raw planning notes. When this feels complete, run **`/prompt resident_mobile`** then **`/plan resident_mobile`**.

---

## Changelog (Continue Mode)

- **2026-08-24 (Update 2)**:
  - Audited `apps/resident-mobile` and `apps/client-dashboard/src/app/api/resident/*`.
  - Mapped 7 live backend endpoints (`/api/resident/express-invite`, `visitors`, `history`, `push-token`, `arrived`, `me`, `quota`) to mobile tabs.
  - Specified offline caching contract with `AsyncStorage` + `SecureStore`.
  - Detailed the 5-phase execution plan for full production readiness and mobile pilot certification.
- **2026-08-24 (Update 1)**: Initial capture synthesized from `IDEA_resident_mobile.md` and `IDEA_resident_mobile_one_tap.md`.

---

## 1. Executive Summary & Vision

The **GateFlow Resident Mobile App** is a high-performance Expo React Native application delivering a 3-tap visitor access pass experience, real-time gate entry push alerts, and guest arrival guidance for residents in GateFlow-managed compounds.

### Core Value Propositions

1. **3-Tap Express Pass**: Resident taps "Invite Guest" $\to$ selects contact from address book $\to$ OS Share sheet opens with HMAC pass URL.
2. **Real-Time Gate Alerts**: Instant push notification when visitor scans in at compound security gates.
3. **Guest GPS & Doorstep Ping**: Guest landing page provides navigation deep-links to unit and an "I've Arrived" doorstep ping back to the resident.
4. **Offline Pass Resilience**: Display existing active passes and visitor history even without cellular coverage.
5. **ADS Mobile & RTL First**: Strict adherence to `@gate-access/ui/tokens` (`nativeTokensNewEra`) with full Arabic/English bi-directional support.

---

## 2. Architecture & API Mapping

### Monorepo Architecture

- **Client App**: `apps/resident-mobile` (Expo SDK 57, Expo Router v6, React Native 0.81.5).
- **Backend API**: `apps/client-dashboard` (`/api/resident/*`) with Prisma and NextAuth JWT authentication.
- **Shared Tokens**: `@gate-access/ui/tokens` (`nativeTokensNewEra`).

### Live Backend Endpoints Inventory

| Route                          | Method        | Purpose                                      | Mobile Screen / Action                   |
| :----------------------------- | :------------ | :------------------------------------------- | :--------------------------------------- |
| `/api/resident/me`             | `GET`         | Resident profile, active unit, permissions   | App bootstrap & Profile screen           |
| `/api/resident/express-invite` | `POST`        | Create instant HMAC visitor pass             | One-tap Contact picker flow              |
| `/api/resident/visitors`       | `GET`, `POST` | List & create visitor passes                 | QRs Tab & Pass management                |
| `/api/resident/history`        | `GET`         | Scan event history for resident's unit       | History Tab                              |
| `/api/resident/push-token`     | `POST`        | Register Expo Push Token for device          | App start / Push permission grant        |
| `/api/resident/arrived`        | `POST`        | Guest arrival alert from public landing page | Web pass `/s/[shortId]` $\to$ Push alert |
| `/api/resident/quota`          | `GET`         | Active visitor quota and usage stats         | Pass Creation Sheet & Home               |

---

## 3. Detailed User Experience & Workflows

### 1. One-Tap Pass Generation (`contact-picker.tsx` $\to$ `/api/resident/express-invite`)

- Guard/Resident opens `contact-picker.tsx`.
- Request contact permission via `expo-contacts`.
- Search or select contact $\to$ extracts normalized name and E.164 phone number.
- Calls `POST /api/resident/express-invite` with `{ visitorName, phone, validForHours: 24 }`.
- Server returns signed QR link (`https://app.gateflow.site/s/[shortId]`).
- App invokes `expo-sharing` with pre-composed localized WhatsApp/SMS invitation message.
- Caches pass locally in `qr-cache.ts`.

### 2. Gate Scan Real-Time Notification Loop

- Security guard scans visitor QR in `scanner-app`.
- Scanner backend processes scan $\to$ validates HMAC and records `ScanLog`.
- Server background worker queries owning resident's active `PushSubscription` tokens.
- Server dispatches push alert via Expo Push Notification service:
  - **Title**: `Visitor Arrival`
  - **Body**: `[Visitor Name] has entered via [Gate Name] at [Time].`
  - **Data Payload**: `{ type: "gate_scan", scanId: "...", tab: "history" }`
- Resident device receives push $\to$ tapping opens app directly to the entry in `history.tsx`.

### 3. Public Pass Landing Page Guidance (`/s/[shortId]`)

- Guest opens pass link on mobile browser.
- Interactive Pass Card displays gate pass status.
- Once scanned at gate, landing page activates:
  - **"Navigate to Unit" Button**: Launches Apple Maps (`maps://?daddr=lat,lng`) or Google Maps (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`).
  - **"I'm at the Door" Button**: Triggers `POST /api/resident/arrived` $\to$ delivers instant notification to resident phone.

### 4. Offline Resilience Contract

- **Pass Display**: Active passes cached in `qr-cache.ts` (`AsyncStorage`). If device is offline, cached passes remain viewable with clear "Offline Cached" indicator.
- **History Feed**: Recent access logs cached in `history-cache.ts`.
- **Pass Creation**: Requires online connectivity to prevent unsynchronized pass creation.

---

## 4. Security & Quality Invariants

1. **Authentication**: All API requests carry `Authorization: Bearer <token>` stored in `expo-secure-store`.
2. **Multi-Tenancy**: All database queries strictly scoped to `organizationId` and filter `deletedAt: null` (where model defines `deletedAt`).
3. **No Raw Hex Colors**: All UI components import `nativeTokensNewEra` from `@gate-access/ui/tokens`.
4. **RTL Integrity**: Use logical layout properties (`marginStart`, `marginEnd`, `paddingStart`, `paddingEnd`, `textAlign: 'left'`).
5. **No Secret Leaks**: No HMAC signing secrets or service tokens bundled in mobile client bundle.

---

## 5. Phased Roadmap Plan Sketch

| Phase  | Phase Name                             | Primary Focus & Deliverables                                                                                          | Verification Gates                                                    |
| :----- | :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| **01** | **Backend API & Push Integration**     | Harden `/api/resident/*` routes in `client-dashboard`, add push dispatch hooks to scan route, write integration tests | Unit tests for all 7 resident endpoints passing with tenant isolation |
| **02** | **One-Tap Pass Creation & Share**      | Connect `contact-picker.tsx` to `express-invite`, wire `expo-sharing`, test permissions & contact parsing             | Contact selection creates valid signed pass and opens share sheet     |
| **03** | **Passes Management & Offline Cache**  | Implement active pass cards in `app/(tabs)/qrs/`, wire `qr-cache.ts`, implement pull-to-refresh & pass revoke         | Offline display of active passes; online pass creation and revocation |
| **04** | **Visitor History & Push Navigation**  | Wire `app/(tabs)/history/` to `/api/resident/history`, configure `expo-notifications` listener for deep linking       | Push alert received on gate scan; tapping navigates to specific log   |
| **05** | **Polish, Arabic RTL & Certification** | Arabic translation pass, logical spacing verification, error boundaries, full Jest test suite                         | 100% test pass rate, 0 type errors, clean Arabic/English layout       |

---

## 6. Open Questions & Approvals

- **Q1**: App Icon and Splash screen assets.
  - _Resolution_: Use existing branded SVG assets from `@gate-access/ui`.
- **Q2**: AI Tab integration (`app/(tabs)/ai`).
  - _Resolution_: Defer full conversational AI bot to `gateai` initiative; keep tab placeholder or link to basic resident assistant.
