# <p align="center">GateFlow — Feature Pipeline & Roadmap</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Security_Shipped_Ready_Next-blueviolet?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Next_Sprint-Resident_Mobile_%26_Portal-blue?style=for-the-badge" alt="Next Sprint">
</p>

---

> **Roadmap SSOT:** This file is the canonical place for pipeline status, initiatives, and strategic goals.

## 🏗️ Active Initiatives & Next Milestones

Real-time status of the engineering pipeline.

### 🟡 In Planning (Next Sprint Candidates)

| Initiative                       | Goal                                                                             | App                    | Priority             |
| :------------------------------- | :------------------------------------------------------------------------------- | :--------------------- | :------------------- |
| **`resident_portal_responsive`** | Responsive ADS modernization, unit family management, and visitor request flow   | `apps/resident-portal` | **P1 (Recommended)** |
| **`admin_emulation_hub`**        | Superadmin fleet terminal emulation, load generator, and perimeter telemetry hub | `apps/admin-dashboard` | **P2**               |

### ⚪ Backlog Initiatives

- **WhatsApp Concierge Gateway**: Automated visitor pre-clearance and WhatsApp bot pass delivery.
- **Enterprise Self-Serve Billing**: Multi-tenant Stripe billing portal with automated tier entitlement provisioning.
- **ANPR License Plate Recognition Engine**: Video stream plate recognition and automated barrier lane triggers.

---

## ✅ Recently Shipped (August 2026)

> [!TIP]
> **Resident Mobile One-Tap Biometric & Instant Pass Experience (`resident_mobile_one_tap`)** — _Shipped 2026-08-30_ — [Plan](../../plan/Complete/resident_mobile_one_tap/)
>
> - Biometric-first pass unlocking in $\le 800\text{ms}$ with fail-closed PIN fallback after 3 attempts.
> - High-contrast vector QR display with encrypted SecureStore offline cache and $\le 2\text{ min}$ expiry countdown warning.
> - 3-tap instant visitor sharing (Family, Driver, Contractor, Day-Guest) with rolling 1-hour rate limiting ($\le 15\text{/hr}$).
> - Real-time smart arrival notifications with interactive action triggers (_Open Gate_, _Reject Entry_, _Call Guard_).
> - Universal PII masking and tamper-evident local encrypted audit ledger.

> [!TIP]
> **Lighthouse 100 & Zero-CLS Core Web Vitals Across All Monorepo Applications (`lighthouse-100`)** — _Shipped 2026-08-30_ — [Plan](../../plan/Complete/lighthouse-100/)
>
> - 5-phase performance overhaul across Marketing, Resident Portal, Client Dashboard, Admin Dashboard, and Design System Portal.
> - Zero-CLS `DynamicIsland` primitives with pre-styled skeleton loaders and `preloadCriticalImage` utilities in `@gateflow/ui`.
> - Preloaded dual-language font metric overrides (`Inter`, `Cairo`, `Poppins`) with `adjustFontFallback: true`.
> - Non-blocking idle PWA service worker hydration and dynamic wizard code-splitting in Resident Portal.
> - Strict `.lighthouserc.js` CI assertion hard-gates ($\ge 0.98$ Performance, $\ge 0.95$ A11y, $1.00$ SEO).

> [!TIP]
> **GateFlow Design System Impeccable Revamp & Enterprise Radii Calibration (`design_system_revamp`)** — _Shipped 2026-08-30_
>
> - 3-tier token architecture (`@gateflow/tokens`, `@gateflow/theme`, `@gateflow/ui`, `@gateflow/components`).
> - Calibrated Enterprise Radii scale (`sm: 4px`, `md: 6px`, `lg: 10px`, `xl: 14px`, `2xl: 16px`).
> - Refined input padding (`!pl-11`), high-contrast white button typography, and tab spacing in `TokenExplorer.tsx`.
> - Verified `apps/design-system` portal on port 3005 (`design.gateflow.site`).

> [!TIP]
> **Scanner App Onboarding & Biometric Session Management (`scanner_onboarding_session`)** — _Shipped 2026-08-28_ — [Plan](../../plan/Complete/scanner_onboarding_session/)
>
> - 4-step onboarding wizard (`OnboardingNavigator`) with system settings deep-linking recovery.
> - Fail-closed biometric hardware authentication with SHA-256 PIN vault in `expo-secure-store`.
> - Shift-gated scanning preventing barcode scans without an active, matching shift.
> - ADS Home Screen redesign with 8pt spatial grid, 72x72px `MasterScanFab`, and live duty timer.
> - `BiometricGuard` 5-minute background inactivity auto-lock.

> [!TIP]
> **Guard Patrol Checkpoints & QR Route Scanner (`guard_patrol_checkpoints`)** — _Shipped 2026-08-28_ — [Plan](../../plan/Complete/guard_patrol_checkpoints/)
>
> - Defined patrol loops, physical HMAC-signed QR checkpoint tokens, and route editor (`PatrolRouteManager.tsx`).
> - Live polyline map telemetry overlay on `GuardShiftVisualMap.tsx`.
> - Supervisor patrol compliance monitoring (`PatrolComplianceSummary.tsx`).

> [!TIP]
> **Guard Shift Visual Map & Real-Time Gate Monitor (`guard_shift_visual_map`)** — _Shipped 2026-08-28_ — [Plan](../../plan/Complete/guard_shift_visual_map/)
>
> - Live gate terminal occupancy, active shift duration counters, terminal health indicators, and shift handover controls on Client Dashboard.

> [!TIP]
> **Enterprise MENA Security & Encryption Suite (`gateflow_security_readiness_mena`)** — _Shipped 2026-08-25_
>
> - AES-256-GCM field-level PII encryption, SHA-256 tamper-evident chained audit ledger, and Egyptian Law 151 / Saudi PDPL export tooling.

---

## 📈 Strategic Goals (Q3/Q4 2026)

1. **Resident Digital Key Leadership**: Deliver zero-friction one-tap biometric access and arrival push feeds on `resident-mobile`.
2. **Offline Hardware Gate Relays**: Expand CCITT-CRC16 framed TCP/serial barrier relay controllers for unattended high-throughput lanes.
3. **Enterprise Compliance & Auditing**: Maintain 100% auditable system mutations with cryptographically chained SHA-256 logs.
4. **Lighthouse CWV Perfection**: Sub-second LCP, zero CLS, and 98+ Desktop / 95+ Mobile scores on `*.gateflow.site`.
