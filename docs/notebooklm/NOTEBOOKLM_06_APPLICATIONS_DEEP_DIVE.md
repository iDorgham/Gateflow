# NOTEBOOKLM SOURCE 6: GateFlow Applications Deep Dive

## 1. Application Portfolio Overview

| Application          | Path                    | Type        | Port | Primary Role                                                                |
| :------------------- | :---------------------- | :---------- | :--- | :-------------------------------------------------------------------------- |
| **Marketing**        | `apps/marketing`        | Web App     | 3000 | Public acquisition, SEO, content, lead capture (`www.gateflow.site`)        |
| **Client Dashboard** | `apps/client-dashboard` | Web App     | 3001 | Tenant operations console for property managers (`app.gateflow.site`)       |
| **Admin Dashboard**  | `apps/admin-dashboard`  | Web App     | 3002 | Platform super-admin governance and CMS (`admin.gateflow.site`)             |
| **Resident Portal**  | `apps/resident-portal`  | Web App/PWA | 3004 | Resident self-service for guest passes and profile (`portal.gateflow.site`) |
| **Scanner App**      | `apps/scanner-app`      | Mobile App  | 8081 | Field QR scanner for guards, fail-closed biometrics, offline-first          |
| **Resident Mobile**  | `apps/resident-mobile`  | Mobile App  | 8082 | Native resident app with one-tap passes and push notifications              |
| **Design System**    | `apps/design-system`    | Web App     | 3004 | Component catalog & ADS token documentation (`design.gateflow.site`)        |

---

## 2. Client Dashboard (`apps/client-dashboard`)

### Purpose

Primary tenant-facing operations dashboard. Handles resident CRM, QR issuance, gate monitoring, guard shift visualization, perimeter patrol telemetry, analytics, workspace governance, and embedded AI workflows.

### What Has Been Completed & Verified

- **Perimeter Guard Patrol Checkpoints (`guard_patrol_checkpoints`):**
  - Interactive route builder (`PatrolRouteManager.tsx`, `PatrolRouteModal.tsx`) with cryptographic HMAC QR printing.
  - Live polyline map monitoring on `GuardShiftVisualMap.tsx` tracking guard progression through checkpoints.
  - Backend API suite: `POST /api/patrols/routes`, `POST /api/patrols/scan`, and `GET /api/patrols/live`.
  - Supervisor compliance reporting (`PatrolComplianceSummary.tsx`) tracking on-time vs delayed checkpoints.
- **Guard Shift Visual Map & Telemetry (`guard_shift_visual_map`):**
  - Real-time gate terminal occupancy, active shift duration counters, terminal health indicators, and shift handover controls (`ShiftHandoverDrawer.tsx`).
  - Shift management API suite: `POST /api/scanner/shift/start`, `POST /api/scanner/shift/end`, `GET /api/scanner/shift/active`, and `GET /api/scanner/shift/live`.
- **Multi-Tenant Isolation & Security Hardening:**
  - Strict tenant scoping (`organizationId`) across all 95+ REST endpoints.
  - Native AES-256-GCM cryptographic encryption and HMAC-SHA256 signature verification.
- **Projects CRM & Resident Lifecycle:**
  - Units, contacts, user preferences, and export rate limiting with tamper-evident `AuditLog` records.
- **Analytics & Operational Intelligence:**
  - PDF export client, multi-dimensional time series, and anomaly detection.
- **GateAI Autonomous Operations:**
  - Vercel AI SDK v6 multi-part UIMessage architecture with interactive tool confirmation lifecycle.

### Test Coverage

- **117 Test Suites Passed (696 Unit Tests)** in `apps/client-dashboard`.

---

## 3. Admin Dashboard (`apps/admin-dashboard`)

### Purpose

Platform-level control plane for super-admins. Manages organizations, users, authorization keys, CMS, intelligence, monitoring, and support.

### Completed Features

- **Platform Governance:** Tenant provisioning, user management, authorization key lifecycle, and database reset tools.
- **Monitoring & Fleet Ops:** Live system health indicators, traffic emulation generator, and anomaly detection.
- **AI & Intelligence:** Autonomous AI assistant with system diagnostic tools and log query capabilities.
- **CMS & Style Hub:** Dynamic page builder, blog engine, and per-tenant branding CSS generator.

---

## 4. Scanner App (`apps/scanner-app`)

### Purpose

High-speed, field mobile application for security guards at compound gates. Enforces fail-closed biometric/PIN authentication, shift-gated scanning, and offline-first QR validation.

### What Has Been Completed & Verified (`scanner_onboarding_session`)

- **First-Mile Onboarding Wizard (`OnboardingNavigator`):**
  - 4-step wizard: Vision $\rightarrow$ Hardware Permissions (with deep-link recovery) $\rightarrow$ Security Setup $\rightarrow$ Duty Gate Activation.
  - Custom numeric keypad (`PinKeypad`) and 6-dot feedback (`PinDots`).
- **Biometric Security & Secure PIN Vault:**
  - `checkBiometricAvailability()` detecting FaceID, TouchID, and Fingerprint via `expo-local-authentication`.
  - Fail-closed fallback to mandatory 6-digit PIN stored securely in `expo-secure-store`.
  - `LockoutManager` anti-brute-force rate limiting (3 attempts $\rightarrow$ 60s lockout).
- **Duty Session & Shift Management:**
  - `ShiftSession` manager with SecureStore persistence and durable tombstone protection (`SHIFT_TOMBSTONE_KEY`).
  - Scan-blocking invariant: camera barcode scans are hard-blocked when `canScanWithShift(session, gateId) === false`.
- **ADS Master Scan Home Screen Redesign:**
  - Built with 8pt spatial grid and `@gateflow/ui/tokens` (`nativeTokens`).
  - Central 72x72px `MasterScanFab` (`nativeTokens.colors.primary` / `brandGlow`) for <1s camera launch.
  - `ShiftInfoWidget` with isolated live-ticking duty timer and semantic status pills.
- **Perimeter Guard Patrol Scanning:**
  - Checkpoint QR scanning with HMAC signature verification and out-of-order tolerance.
- **Biometric Inactivity Guard:**
  - Non-intrusive pan-gesture observation with 5-minute auto-lock while preserving active guard duty shifts.

### Test Coverage

- **26 Test Suites Passed (209 Unit Tests)** in `apps/scanner-app`.

---

## 5. Resident Mobile (`apps/resident-mobile`)

### Purpose

Native resident self-service app for iOS/Android. Manages guest passes, views history, receives push notifications, and guides guests to the unit.

### Key Capabilities

- One-tap express invite generation with HMAC-signed QR payloads.
- Unit-linked visitor access rules (one-time, recurring, delivery pass).
- Push notifications for gate arrival events.
- Bilingual Arabic RTL / English support.

---

## 6. Resident Portal (`apps/resident-portal`)

### Purpose

Web/PWA equivalent of resident mobile for desktop or browser-based guest pass management.

### Key Capabilities

- Visitor pass creation and instant WhatsApp sharing.
- Open QR pass generation for recurring deliveries.
- Unit member family management and access log review.
- Service Worker offline QR cache.

---

## 7. Marketing Site (`apps/marketing`)

### Purpose

Public acquisition and conversion surface. High-performance bilingual (Arabic `ar-EG` / English) conversion site.

### Key Capabilities

- Compound security ROI calculator and interactive pricing slider.
- High Core Web Vitals performance (sub-second LCP, 0 CLS).
- Conversion-optimized lead capture forms and marketing attribution tracking.

---

## 8. Shared Packages & Monorepo Architecture

| Package                 | Path                | Purpose                                                                   |
| :---------------------- | :------------------ | :------------------------------------------------------------------------ |
| `@gate-access/db`       | `packages/db`       | Prisma schema, PostgreSQL client, migrations, tenant isolation            |
| `@gate-access/types`    | `packages/types`    | Central TypeScript interfaces, API request/response contracts, enums      |
| `@gateflow/ui`          | `packages/ui`       | ADS design tokens (`nativeTokens`, `tokens`), primitives, buttons, charts |
| `@gate-access/security` | `packages/security` | Native AES-256-GCM encryption, HMAC-SHA256 signing, replay prevention     |
| `@gate-access/i18n`     | `packages/i18n`     | Arabic/English translation strings and locale utilities                   |
