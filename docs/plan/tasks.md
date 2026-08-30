# GateFlow — Task Tracking & Feature Inventory

This document tracks completed milestones, active tasks, and future feature expansion across the GateFlow ecosystem.

---

## 🟢 Completed Milestones (August 2026)

- [x] **Lighthouse 100 Performance**: 5-phase optimization across all 5 web apps with zero-CLS `DynamicIsland` primitives and `.lighthouserc.js` CI hard-gates.
- [x] **GateFlow Design System Impeccable Revamp**: 3-tier token architecture, Enterprise Radii scale (`4px`–`16px`), `apps/design-system` portal on port 3005.
- [x] **Guard Shift Visual Map & Real-Time Gate Monitor (PR #308)**: Live gate terminal occupancy, active shift duration counters, and shift handover drawer.
- [x] **Scanner App Onboarding & Biometric Session Vault**: 4-step wizard, biometric auth, shift-gated scanner, and master scan FAB.
- [x] **Guard Patrol Checkpoints & QR Route Scanner**: Perimeter patrol loops, physical HMAC QR checkpoints, and supervisor compliance reporting.
- [x] **Integrated Pilot Certification**: End-to-end residential flow certified across Client Dashboard, Resident Portal, and Scanner App.
- [x] **Tenant Isolation**: Migrated all Prisma queries to fail-closed `AsyncLocalStorage` request-local context.
- [x] **Cross-Subdomain SSO**: Live session sharing across `.gateflow.site` (`app.gateflow.site` and `portal.gateflow.site`).
- [x] **Admin Evolution (Phases 1–9)**: Traffic emulation hub, AI blog and landing page generator, and platform CRM.

---

## 🛠️ Active & Prioritized Tasks

### 🤳 Scanner App (`apps/scanner-app`)

- [ ] **P0: Monolith Decomposition**: Refactor `App.tsx` (2,100+ lines) into `AppNavigator.tsx`, `CameraScannerView.tsx`, and `OnboardingWizardView.tsx`.
- [ ] **P0: Arabic Localization Wiring**: Connect `@gate-access/i18n` dictionary strings into the scanner onboarding wizard, shift tracking, and scan overlays.
- [ ] **P1: Headless Hermes Export Alignment**: Ensure `expo export --bytecode` passes cleanly without `hermes-compiler` packaging issues.
- [ ] **P2: Optical Character Recognition (OCR)**: Add national ID and driver's license photo capture at guard booths.

### 🏢 Client Dashboard (`apps/client-dashboard`)

- [ ] **P1: WhatsApp Pass Dispatch**: Automatically send QR pass links to visitor WhatsApp numbers upon creation.
- [ ] **P2: Live ANPR Ingestion Feed**: Display camera license plate recognition events directly in scan log tables.

### 🌐 Resident Portal & Mobile (`apps/resident-portal` / `apps/resident-mobile`)

- [ ] **P1: One-Tap Biometric Passes**: One-tap biometric authenticated pass generation with offline IndexedDB / SQLite caching.
- [ ] **P1: WhatsApp Share Template**: Pre-formatted bilingual visitor invitations via Web Share API.
- [ ] **P1: EAS Mobile Build Workflow**: Automated GitHub Action dispatch for `.ipa` and `.aab` production builds.
- [ ] **P2: Apple Wallet / Google Wallet Integration**: Export passes directly into native device wallets.

### 🛡️ Admin Dashboard & Marketing (`apps/admin-dashboard` / `apps/marketing`)

- [ ] **P0: TypeScript Strictness**: Transition remaining `"strict": false` apps to `"strict": true`.
- [ ] **P1: Interactive ROI Calculator**: Embed compound savings calculator on `www.gateflow.site`.
- [ ] **P2: Multi-Region Database Sharding**: Global compute scaling via Neon PostgreSQL.
