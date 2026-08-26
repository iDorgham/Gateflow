# GateFlow — NotebookLM Ultimate System Context & Monorepo Source

> **Source Document for NotebookLM & External AI Reasoning Engines**  
> **Repository**: `iDorgham/Gateflow`  
> **Scope**: Monorepo Overview, 6 Web & Mobile Apps, Database Schema, Cryptography, Hardware Integration, Security & Compliance, Design System, Multi-Tenancy  
> **Version**: 0.5.1 | **Date**: August 27, 2026

---

## I. Executive Overview & Problem Domain

GateFlow solves the critical bottlenecks of gated compounds, commercial enterprise hubs, and smart residential facilities across the Middle East and North Africa (MENA):

1. **Manual Entry Bottlenecks**: Replaced with <120ms optical QR scans and ANPR license plate barrier triggers.
2. **Connectivity Vulnerability**: Solved via offline HMAC-SHA256 signature verification directly on guard hardware barrier controllers without cloud roundtrips.
3. **Data Protection Compliance**: Built from the ground up for Egyptian Law 151 and Saudi PDPL compliance, featuring AES-256-GCM encrypted PII and SHA-256 tamper-evident chained audit trails.
4. **MENA Regionalization**: Dual English and Egyptian Arabic support with seamless cross-app cookie persistence on `.gateflow.site`.

---

## II. Complete Monorepo Application Matrix

### 1. `apps/marketing` (Public Web Portal & Growth Engine)

- **Domain**: `https://www.gateflow.site`
- **Stack**: Next.js 14 App Router, Tailwind CSS, ADS Design Tokens, Cairo / Inter Typography.
- **Core Functions**: Enterprise landing page, interactive ROI calculator, dynamic pricing matrix, lead capture API, multi-language switcher.
- **Performance**: Lighthouse 98 Desktop / 95 Mobile, CLS 0.00, LCP 1.2s.

### 2. `apps/client-dashboard` (Facility Management & Tenant Ops)

- **Domain**: `https://app.gateflow.site`
- **Stack**: Next.js 14 App Router, NextAuth JWT, Prisma Accelerate, SSE Real-time streaming.
- **Core Functions**: Security operations console, cryptographic QR pass studio, resident directory, unit management, GateAI autonomous maintenance work orders, compliance export tools.
- **Security**: Granular RBAC (Owner, Admin, Guard, Concierge), step-up MFA challenge modal, zero cross-tenant leakage.

### 3. `apps/admin-dashboard` (SuperAdmin System Governance)

- **Domain**: `https://admin.gateflow.site`
- **Stack**: Next.js 14 App Router, NextAuth, PostgreSQL.
- **Core Functions**: Global organization provisioning, subscription tier billing, feature flag management, global barrier hardware telemetry.

### 4. `apps/resident-portal` (Resident Self-Service PWA)

- **Domain**: `https://portal.gateflow.site`
- **Stack**: Next.js 14 App Router, PWA, Service Worker, WebPush API.
- **Core Functions**: Mobile-optimized resident portal for creating visitor passes, revoking passes, WhatsApp pass sharing, and tracking guest entry.
- **Resilience**: Network-first service worker with offline cached pass viewing for basement garages.

### 5. `apps/scanner-app` (Guard Gate Hardware Controller)

- **Stack**: Expo SDK 54, React Native, Camera Scanner, SQLite.
- **Core Functions**: Scans visitor QR codes, verifies HMAC signatures offline in <120ms, validates nonces to prevent replay attacks, and sends CCITT-CRC16 framed signals to physical gate relays.

### 6. `apps/resident-mobile` (Resident Mobile Key)

- **Stack**: Expo SDK 54, React Native, Biometrics (FaceID / Fingerprint).
- **Core Functions**: Native smartphone resident key, biometric guest pass generator, community notifications.

---

## III. Database Architecture & Key Invariants

- **Multi-Tenancy**: Every entity (`Project`, `Gate`, `Resident`, `VisitorPass`, `ScanLog`) is anchored to an `Organization`. Queries MUST include `where: { organizationId: session.organizationId }`.
- **Soft Deletes**: Use `deletedAt: null` only on entities with `deletedAt` in their Prisma definition (`User`, `Resident`, `VisitorPass`). Do not add to log tables.
- **Connection Strings**: `DATABASE_URL` for runtime queries (Accelerate pooled); `DIRECT_DATABASE_URL` for Prisma CLI migrations.

---

## IV. Cryptographic & Security Architecture

1. **Visitor Pass HMAC-SHA256**:
   Signed token format: `{ qrId, orgId, projId, exp, nonce, sig }`. Verified against tenant secret with sliding replay window check.
2. **PII Field Encryption**:
   National IDs, phone numbers, and vehicle plate strings are encrypted using AES-256-GCM before database write.
3. **Chained Audit Ledger**:
   Each `AuditLog` row contains `prevHash` creating an immutable cryptographic chain of system events.

---

## V. Key Commands & Developer Reference

- `pnpm preflight` — Runs all linters, typecheckers, unit tests, and changelog verification across all packages.
- `pnpm --filter <app-name> test` — Runs isolated unit test suite for a specific package.
- `gh workflow run deploy.yml --ref master -f app=all` — Triggers Vercel production deployment.
