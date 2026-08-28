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

| Initiative                       | Goal                                                                                            | App                    | Priority             |
| :------------------------------- | :---------------------------------------------------------------------------------------------- | :--------------------- | :------------------- |
| **`resident_mobile_one_tap`**    | One-tap biometric QR pass generation, instant visitor sharing & gate arrival push notifications | `apps/resident-mobile` | **P1 (Recommended)** |
| **`resident_portal_responsive`** | Responsive ADS modernization, unit family management, and visitor request flow                  | `apps/resident-portal` | **P1**               |
| **`admin_emulation_hub`**        | Superadmin fleet terminal emulation, load generator, and perimeter telemetry hub                | `apps/admin-dashboard` | **P2**               |

### ⚪ Backlog Initiatives

- **WhatsApp Concierge Gateway**: Automated visitor pre-clearance and WhatsApp bot pass delivery.
- **Enterprise Self-Serve Billing**: Multi-tenant Stripe billing portal with automated tier entitlement provisioning.
- **ANPR License Plate Recognition Engine**: Video stream plate recognition and automated barrier lane triggers.

---

## ✅ Recently Shipped (August 2026)

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
