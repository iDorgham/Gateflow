# NOTEBOOKLM SOURCE 1: GateFlow Master System Architecture & PRD Summary

## 1. Executive Summary & Vision

**GateFlow** is an enterprise-grade multi-tenant physical-access, resident operations, and operational intelligence platform specifically engineered for gated communities, residential compounds, and real estate developments across the MENA region.

### Core Value Proposition & Differentiators

- **Full-Lifecycle Traceability:** Complete digital-to-physical tracking linking initial marketing campaigns down to physical gate entry events.
- **Strict Multi-Tenant Isolation:** Guaranteed organization and project boundaries enforced at the database, API gateway, and UI levels.
- **Offline-First Scan Operations:** Edge scan execution on mobile verification devices (`scanner-app`) with queued async sync.
- **Bilingual MENA Native:** Out-of-the-box Arabic (RTL) and English (LTR) UX across all web and mobile apps.

---

## 2. Product Surfaces & Applications Overview

| Application          | Path                    | Type       | Primary Role & Purpose                                                                                                                              | Key Tech Stack                                            |
| :------------------- | :---------------------- | :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| **Client Dashboard** | `apps/client-dashboard` | Web App    | Main operational console for property managers, admin staff, and security leads. Handles resident CRM, QR issuance, gate monitoring, and analytics. | Next.js 16 (App Router), React 19, Tailwind CSS, Recharts |
| **Admin Dashboard**  | `apps/admin-dashboard`  | Web App    | Platform-level control plane for system super-admins. Manages organization lifecycle, tenant provisioning, system health, and CMS content.          | Next.js 16 (App Router), React 19, Tailwind CSS           |
| **Scanner App**      | `apps/scanner-app`      | Mobile App | High-speed, one-handed mobile field application for security guards at compound gates. Focuses on offline QR validation and instant check-ins.      | React Native, Expo SDK 57, Reanimated, Vision Camera      |
| **Resident Mobile**  | `apps/resident-mobile`  | Mobile App | Native self-service app for compound residents to manage guest passes, view pass history, and receive community announcements.                      | React Native, Expo SDK 57, React Navigation               |
| **Resident Portal**  | `apps/resident-portal`  | Web App    | Web/PWA equivalent of the resident mobile experience for desktop or browser guest pass management.                                                  | Next.js 16 (App Router), React 19, Tailwind CSS           |
| **Marketing Site**   | `apps/marketing`        | Web App    | Public marketing landing pages, lead ingestion, localized pricing, and blog/content delivery.                                                       | Next.js 16 (App Router), Tailwind CSS, Content Layer      |
| **Design System**    | `apps/design-system`    | Web App    | Interactive Storybook/documentation catalog for shared UI components (`@gate-access/ui`).                                                           | Next.js / Storybook                                       |

---

## 3. Core Technical Architecture & Shared Packages

GateFlow is structured as a **Turborepo monorepo** managed with `pnpm`.

### Monorepo Structure & Package Boundaries

- `packages/db`: Prisma ORM schema (`schema.prisma`), PostgreSQL connection pools (Accelerate + Direct connection), database migrations, and retention executors.
- `packages/ui`: Shared design system component library built with Radix UI, Tailwind, and custom token adapters.
- `packages/types`: Shared TypeScript interfaces, API request/response contracts, scan decision enums, and domain model types.
- `packages/api-client`: Typed HTTP client wrappers for API interactions across client apps.
- `packages/i18n`: Dictionaries and locale translation hooks (English & Arabic).
- `packages/config`: Shared ESLint, TypeScript (`tsconfig`), and Tailwind configurations.
- `packages/utils`: Cross-cutting helpers (HMAC signature generation, formatting, date utilities).

---

## 4. Key Invariants & Security Mandates

### 1. Tenant Isolation

Every database query scoped to tenant data MUST explicitly filter by `organizationId`. App router API routes enforce request-local fail-closed tenant scoping via `AsyncLocalStorage`.

### 2. Soft-Delete Semantics

Models containing `deletedAt` must include `deletedAt: null` in all standard queries. Hard deletions are forbidden in operational workflows.

### 3. QR Security & Integrity

All physical guest passes are generated as cryptographically signed HMAC-SHA256 tokens containing timestamp boundaries, unit IDs, and scope restrictions. Scanners verify signature integrity locally before recording a scan event.

---

## 5. Development Lifecycle & Workflow v2

GateFlow utilizes an automated, phase-driven development process:

- **Initiative Planning (`/idea`, `/plan`):** Requirements start as an `IDEA` document, progress to an approved `PLAN_<slug>.md` split into discrete implementation phases.
- **Phase Execution (`/dev`):** Each phase is executed independently with strict pre-flight checks (`pnpm preflight` checking types, linting, and tests).
- **Execution Lifecycle:** Plans move automatically through `Draft/` -> `Ready/` -> `Active/` -> `Complete/`.
