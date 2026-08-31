# NOTEBOOKLM SOURCE 1: GateFlow Master System Architecture & PRD Summary (v13.0)

## 1. Executive Summary & Vision

**GateFlow** is an enterprise-grade multi-tenant physical-access, resident operations, and operational intelligence platform specifically engineered for gated communities, residential compounds, and real estate developments across the MENA region.

### Core Value Proposition & Differentiators

- **Full-Lifecycle Traceability:** Complete digital-to-physical tracking linking initial marketing campaigns down to physical gate entry events.
- **Strict Multi-Tenant Isolation:** Guaranteed organization and project boundaries enforced at the database, API gateway, and UI levels.
- **Offline-First Scan & Patrol Execution:** Edge scan execution on mobile verification devices (`scanner-app`) with queued async sync and physical HMAC QR patrol checkpoint verification.
- **Perimeter Situational Awareness:** Live guard shift visual map, real-time gate terminal occupancy, active shift counters, and handover controls.
- **Resident One-Tap Biometrics:** Native iOS/Android instant pass generation with $\le 800\text{ms}$ biometric unlock, fail-closed PIN vault, and 3-tap pass sharing.
- **Bilingual MENA Native:** Out-of-the-box Arabic (RTL) and English (LTR) UX across all web and mobile apps, with Cairo Arabic typography and unified `.gateflow.site` locale persistence.

---

## 2. Product Surfaces & Applications Overview

| Application          | Path                    | Type       | Primary Role & Purpose                                                                                                                                       | Key Tech Stack                                            |
| :------------------- | :---------------------- | :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| **Client Dashboard** | `apps/client-dashboard` | Web App    | Main operational console for property managers, admin staff, and security leads. Handles resident CRM, QR studio, gate monitoring, shift map, and analytics. | Next.js 14 (App Router), React 19, Tailwind CSS, Recharts |
| **Admin Dashboard**  | `apps/admin-dashboard`  | Web App    | Platform-level control plane for system super-admins. Manages organization lifecycle, tenant provisioning, system health, and CMS content.                   | Next.js 14 (App Router), React 19, Tailwind CSS           |
| **Scanner App**      | `apps/scanner-app`      | Mobile App | High-speed mobile field application for security guards at compound gates. Focuses on offline QR validation, patrol checkpoints, and instant check-ins.      | React Native, Expo SDK 57, Reanimated, Vision Camera      |
| **Resident Mobile**  | `apps/resident-mobile`  | Mobile App | Native self-service app for compound residents with One-Tap biometric passes, visitor pass sharing, and interactive arrival alerts.                          | React Native, Expo SDK 57, React Navigation               |
| **Resident Portal**  | `apps/resident-portal`  | Web App    | Web/PWA equivalent of the resident mobile experience for desktop or browser guest pass management with network-first service worker v2.                      | Next.js 14 (App Router), React 19, Tailwind CSS           |
| **Marketing Site**   | `apps/marketing`        | Web App    | Public marketing landing pages, lead ingestion, localized pricing, and blog/content delivery with high-performance CSS marquees.                             | Next.js 14 (App Router), Tailwind CSS, Content Layer      |
| **Design System**    | `apps/design-system`    | Web App    | Interactive portal & documentation catalog for shared ADS UI components, OKLCH Satin Charcoal tokens, switchable accents, and Vibe-Check AI sandbox.         | Next.js 14, Tailwind CSS, Radix UI                        |

---

## 3. Core Technical Architecture & Shared Packages

GateFlow is structured as a **Turborepo monorepo** managed with `pnpm` across **19 workspace packages**:

### Monorepo Structure & Package Boundaries

- `packages/db`: Prisma 6.x ORM schema (`schema.prisma`), PostgreSQL connection pools (Accelerate + Direct connection), 67 data models, database migrations, and retention executors.
- `packages/ui`: Shared design system component library built with Radix UI, Tailwind, 3-tier token architecture, and FormField/Badge/Card/DynamicTable primitives.
- `packages/theme`: `@gateflow/theme` providing OKLCH dark mode layers (`--ds-layer-01` to `--ds-layer-04`), switchable accent profiles (Kimchi, Cobalt, Emerald), and synchronous cookie sync.
- `packages/i18n`: Dictionaries and locale translation helpers (`@gate-access/i18n`) with parent domain `.gateflow.site` resolution.
- `packages/types`: Shared TypeScript interfaces, API contracts, patrol DTOs, scan decision enums, and domain model types.
- `packages/security`: AES-256-GCM field encryption, HMAC-SHA256 signing, and SHA-256 hash-chained audit ledger.
- `packages/config`: Shared ESLint, TypeScript (`tsconfig`), and Tailwind configurations.
- `packages/utils`: Cross-cutting helpers (HMAC signature generation, formatting, date utilities).

---

## 4. Key Invariants & Security Mandates

### 1. Tenant Isolation

Every database query scoped to tenant data MUST explicitly filter by `organizationId`. App router API routes enforce request-local fail-closed tenant scoping via `AsyncLocalStorage`.

### 2. Soft-Delete Semantics

Models containing `deletedAt` must include `deletedAt: null` in all standard queries. Hard deletions are forbidden in operational workflows. Log models (`ScanLog`, `AuditLog`, `ShiftLog`, `PatrolLog`) do NOT use soft deletes.

### 3. QR Security & Integrity

All physical guest passes are generated as cryptographically signed HMAC-SHA256 tokens containing timestamp boundaries, unit IDs, deterministic `qrId` database binding, and scope restrictions. Scanners verify signature integrity locally before recording a scan event.

---

## 5. Development Lifecycle & Workflow v2

GateFlow utilizes an automated, phase-driven development process:

- **Initiative Planning (`/idea`, `/plan`):** Requirements start as an `IDEA` document, progress to an approved `PLAN_<slug>.md` split into discrete implementation phases.
- **Phase Execution (`/dev`):** Each phase is executed independently with strict pre-flight checks (`pnpm preflight` checking types, linting, and tests).
- **Execution Lifecycle:** Plans move automatically through `Draft/` -> `Ready/` -> `Active/` -> `Complete/`.
