# PLAN: Flagship Resident Mobile App (Expo SDK 57)

**Slug:** `resident_mobile`  
**Initiative:** One-Tap Visitor Passes, Real-Time Push Alerts & Guest Guidance  
**Goal:** Deliver the full-featured flagship Resident Mobile App on Expo SDK 57 with 3-tap contact visitor pass generation, gate scan push alerts, offline pass cache, and Arabic RTL layout.  
**Status:** Ready for execution (`docs/plan/Ready/resident_mobile/`)  
**Primary app:** `apps/resident-mobile`  
**API Provider:** `apps/client-dashboard` (`/api/resident/*`)  
**Target:** Q3 2026  
**Branch:** `feat/resident-mobile-flagship`

---

## 1. Architecture & Design Invariants

- **Component Library**: Expo + React Native + `@gate-access/ui/tokens` (`nativeTokensNewEra`).
- **Navigation**: Expo Router v6 file-based navigation with logical bi-directional layout.
- **Auth Storage**: JWT access and refresh tokens stored exclusively in `expo-secure-store`.
- **Pass Cryptography**: HMAC-SHA256 signing via `@gate-access/types` with timestamp and nonce.
- **Multi-Tenancy**: All backend database queries strictly enforce `organizationId` and filter `deletedAt: null` (where model defines `deletedAt`).
- **Push Service**: Expo Push Notification Service with token registration and deep-link routing.
- **RTL / i18n**: Arabic RTL and English support with logical properties (`marginStart`, `marginEnd`, `paddingStart`, `paddingEnd`).

---

## 2. Phased Roadmap

| Phase  | Title                                     | Role              | Preferred Tool | Scope & Deliverables                                                                                              |
| :----- | :---------------------------------------- | :---------------- | :------------- | :---------------------------------------------------------------------------------------------------------------- |
| **01** | **Backend API & Push Dispatch**           | BACKEND-API       | Cursor         | Harden `/api/resident/*` endpoints, push token registration, scan event notification hooks, and integration tests |
| **02** | **Contact Picker & One-Tap Sharing**      | FRONTEND / MOBILE | Cursor         | `contact-picker.tsx` via `expo-contacts`, `expo-sharing` WhatsApp/SMS share sheet, and unit tests                 |
| **03** | **Passes Management & Offline Cache**     | FRONTEND / MOBILE | Cursor         | Active passes carousel in `app/(tabs)/qrs/`, `qr-cache.ts` (`AsyncStorage`), and pass revocation flow             |
| **04** | **Visitor History & Push Navigation**     | FRONTEND / MOBILE | Cursor         | `app/(tabs)/history/` feed, `expo-notifications` background listener, and notification deep linking               |
| **05** | **Polish, Arabic RTL & Pilot Validation** | QA / MOBILE       | Cursor         | ADS design system audit, Arabic translation pass, error boundaries, and full test suite verification              |

---

## 3. Success Metrics & Quality Gates

- **One-Tap Pass Creation**: Contact selection generates a verified HMAC QR pass and presents the OS share sheet in $< 1.5\text{s}$.
- **Gate Entry Push Alert**: Live gate scan delivers push notification to the resident device within $< 2\text{s}$.
- **Offline Resilience**: Active passes viewable offline without crash or network freeze.
- **Zero Raw Hex Colors**: 100% of UI elements use semantic tokens from `nativeTokensNewEra`.
- **Test Integrity**: 100% passing Jest unit/integration tests with 0 type errors.

---

## 4. Phase Prompts Registry

- `phases/01_backend_api_push/PROMPT_phase_01.md`
- `phases/02_contact_picker_pass_share/PROMPT_phase_02.md`
- `phases/03_active_passes_offline_cache/PROMPT_phase_03.md`
- `phases/04_visitor_history_push_navigation/PROMPT_phase_04.md`
- `phases/05_polish_arabic_rtl_certification/PROMPT_phase_05.md`
