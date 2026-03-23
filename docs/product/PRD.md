# GateFlow — Master Product Requirements Document

**Document Version:** 10.0 — Automation & CRM Edition
**Product Version:** 0.1.0
**Last Updated:** 2026-03-23
**Status:** MVP 100% Complete | Automation Stack Live | CRM UI Complete
**Classification:** Internal — Engineering + Product

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Strategic Vision & Core Pillars](#2-strategic-vision--core-pillars)
3. [The 6-App Ecosystem](#3-the-6-app-ecosystem)
4. [Complete Feature Inventory](#4-complete-feature-inventory)
5. [Technical Architecture](#5-technical-architecture)
6. [Security Architecture](#6-security-architecture)
7. [The Ralph Loop — Automation Stack](#7-the-ralph-loop--automation-stack)
8. [Data Model Overview](#8-data-model-overview)
9. [Release History & Version Log](#9-release-history--version-log)
10. [Current Roadmap](#10-current-roadmap)
11. [Technical Constants & Constraints](#11-technical-constants--constraints)
12. [Performance & Quality Standards](#12-performance--quality-standards)
13. [Internationalization & Accessibility](#13-internationalization--accessibility)

---

## 1. Executive Summary

GateFlow is **Stripe-level infrastructure for physical access control** — a complete enterprise platform that bridges the gap between digital marketing intelligence and physical gate operations. It is not a simple QR scanner; it is a unified operating system for gated communities, premium residential developments, corporate campuses, marinas, and managed events across the MENA region.

The platform delivers three distinct competitive advantages:

1. **Cryptographic-grade security** — HMAC-SHA256 QR signing with offline-first verification means gates open in under 100 milliseconds even with zero network connectivity.
2. **Marketing attribution parity** — Physical gate arrivals are treated as first-class conversion events, with UTM tagging, Meta/Google pixel firing, and real-time CRM webhook delivery.
3. **Autonomous engineering governance** — The Ralph Loop ensures that every line of code meets strict quality, security, and design standards before it ships, without requiring manual oversight.

### Current Status

| Dimension               | Status                                    |
| :---------------------- | :---------------------------------------- |
| Core platform           | ✅ Production-ready                       |
| 6-app ecosystem         | ✅ All apps complete                      |
| Security architecture   | ✅ HMAC + AES-256 + Argon2id              |
| Automation stack        | ✅ 19 scripts, 5 hooks, 12 checks         |
| CRM & Marketing Suite   | ✅ Contacts, Units, UTM, Pixels, Webhooks |
| Team Management         | ✅ Full RBAC + invite flow + team chat    |
| AI Operations Assistant | ✅ GateAI live (claude-haiku-4-5)         |
| RTL / i18n              | ✅ Full AR/EN with logical CSS properties |

---

## 2. Strategic Vision & Core Pillars

### 2.1 Mission

Transform every gate interaction into a meaningful business event — secure, attributable, and actionable.

### 2.2 Target Markets

| Segment                        | Primary User       | Key Pain Point We Solve                                   |
| :----------------------------- | :----------------- | :-------------------------------------------------------- |
| Gated Residential Communities  | Property Manager   | No visibility into who enters, no marketing data          |
| Premium Real Estate Developers | Sales Manager      | Can't track which marketing campaign drove a site visit   |
| Corporate Campuses             | Facilities Manager | Paper-based visitor logs, no audit trail                  |
| Marinas & Yacht Clubs          | Operations Manager | No way to manage seasonal guest passes at scale           |
| Event Venues                   | Event Director     | Manual check-in creates queues and security gaps          |
| MENA Region (Primary)          | All of above       | Existing tools are Western-centric, no Arabic/RTL support |

### 2.3 Core Pillars

#### Pillar 1: Zero-Trust Access Security

Every QR code contains a cryptographic signature. The scanner verifies offline. No network = no vulnerability surface. Every scan is logged with full audit attribution.

#### Pillar 2: Marketing Intelligence at the Gate

Physical visits are tracked with the same precision as website visits. UTM source, medium, and campaign travel with the guest from invitation URL to gate scan. This creates the industry's first physical-visit attribution loop.

#### Pillar 3: Resident Autonomy & Experience

Residents control their own guest access natively from iOS/Android. One tap generates a QR, another tap shares it via WhatsApp. Push notifications fire the moment a guest arrives. No phone calls to reception required.

#### Pillar 4: The Ralph Loop — Autonomous Engineering

A full automation stack (19 scripts, 5 git hooks, 12 quality checks) ensures every feature ships with zero regressions, complete documentation, and enforced quality standards. The development process is itself a product.

---

## 3. The 6-App Ecosystem

GateFlow is a monorepo of 6 strictly decoupled applications sharing a unified database layer, type system, and component library.

### 3.1 Client Dashboard (`apps/client-dashboard`)

**Port:** 3001
**Users:** Property managers, marketing managers, security supervisors
**Framework:** Next.js 14 App Router + Server Components

| Module               | Description                                                                           |
| :------------------- | :------------------------------------------------------------------------------------ |
| **Dashboard**        | Real-time KPIs via SSE: Today's scans, guest volume, active gates, conversion funnels |
| **Projects Hub**     | Multi-project management with gallery, external URLs, gate mode (SINGLE/MULTI)        |
| **QR Management**    | Create/edit/revoke: Single-use, Recurring, Permanent, Open Links, Bulk CSV            |
| **Scans Log**        | Filterable scan history with project filter, gate filter, CSV export, real-time feed  |
| **Contacts CRM**     | Full CRM: create, import, tag by source (MANUAL/IMPORT/QR_SCAN/REFERRAL/OTHER)        |
| **Units Management** | Unit types, contact-unit linking, QR generation from contact                          |
| **Team Management**  | RBAC invite flow, role assignment, team chat, activity timeline                       |
| **Marketing Suite**  | UTM attribution, Meta/Google pixel configuration, CRM webhook management              |
| **GateAI Assistant** | Floating AI panel powered by claude-haiku; creates projects, units, QR; lists scans   |
| **Settings**         | Organization profile, billing, security settings, API keys                            |

**Key Technical Decisions:**

- Server-rendered pages for SEO and performance; client components for real-time elements
- SSE (`/api/events/stream`) for live dashboard updates — no polling
- `useOptimistic` for instant UI feedback on mutations
- Motion.dev for all animations; React Spring for chart transitions

---

### 3.2 Admin Dashboard (`apps/admin-dashboard`)

**Users:** Super-admins (GateFlow internal team)
**Framework:** Next.js 14 App Router

| Module                      | Description                                                    |
| :-------------------------- | :------------------------------------------------------------- |
| **Platform Overview**       | Multi-tenant metrics: active orgs, total scans, billing health |
| **Organization Management** | CRUD for all tenants, quota enforcement, suspension            |
| **Scan Feed**               | Global aggregated scan feed across all tenants                 |
| **Audit Logs**              | Immutable action log for all admin operations                  |
| **System Tools**            | Cache invalidation, DB maintenance, health checks              |
| **Authorization Keys**      | Cryptographic CRUD API for admin bypass keys                   |

---

### 3.3 Scanner App (`apps/scanner-app`)

**Users:** Security guards at gates
**Framework:** React Native + Expo SDK 54

| Module           | Description                                             |
| :--------------- | :------------------------------------------------------ |
| **Scanner Tab**  | Camera-based QR scanning with instant HMAC verification |
| **Today Tab**    | Expected guests for current shift                       |
| **Log Tab**      | Today's scan history with outcomes                      |
| **Chat Tab**     | Supervisor communication                                |
| **Settings Tab** | Haptics, location, clear queue, clear history, sign out |

**Critical Flows:**

1. Scan → if URL, resolve `/s/{shortId}` → local HMAC verify → server validate
2. 4xx = server rejection → show rejected (never treat as offline)
3. 5xx/network error = offline → queue with AES-256 → sync on reconnect
4. Valid scan + Pass decision → POST `/api/scans/{scanId}/deny` if denied

---

### 3.4 Resident Mobile (`apps/resident-mobile`)

**Users:** Residents of gated communities
**Framework:** React Native + Expo Router

| Module                 | Description                                              |
| :--------------------- | :------------------------------------------------------- |
| **My Passes**          | QR code list with status indicators                      |
| **Create Pass**        | Multi-step wizard: visitor type, duration, identity tier |
| **Share**              | Native OS share sheet + WhatsApp deep link               |
| **History**            | Scan log for my passes                                   |
| **Push Notifications** | Instant alert when guest arrives at gate                 |
| **GateAI Concierge**   | On-device AI for autonomous guest management             |

---

### 3.5 Resident Portal (`apps/resident-portal`)

**Users:** Residents preferring web over native app
**Framework:** Next.js 14

| Module              | Description                                 |
| :------------------ | :------------------------------------------ |
| **Pass Management** | Create, revoke, and share visitor passes    |
| **History**         | Complete traversal log                      |
| **Open QR Links**   | Generate permanent passes for trusted staff |

---

### 3.6 Marketing Website (`apps/marketing`)

**Users:** Prospects, sales leads
**Framework:** Next.js 14 (SSR, full SEO)

| Page          | Description                                                |
| :------------ | :--------------------------------------------------------- |
| **Homepage**  | Hero, value props, live demo section, social proof         |
| **Features**  | Deep feature breakdown by user role                        |
| **Pricing**   | Dynamic calculator with tier comparisons                   |
| **Solutions** | Industry-specific: Residential, Marinas, Corporate, Events |
| **Blog**      | SEO-driven content on access control + MENA PropTech       |

---

## 4. Complete Feature Inventory

### 4.1 Access Control

| Feature                      | Status | Details                                                                          |
| :--------------------------- | :----: | :------------------------------------------------------------------------------- |
| HMAC-SHA256 QR signing       |   ✅   | Every QR cryptographically signed; altering one char fails verification          |
| Offline scanner verification |   ✅   | Local verify with `QR_SIGNING_SECRET`; no network required                       |
| AES-256 offline queue        |   ✅   | Unsynced scans encrypted at rest; sync on reconnect with LWW conflict resolution |
| Short URL resolver           |   ✅   | `/s/{shortId}` resolves to full payload (keeps QR version ~2)                    |
| QR types: Single-use         |   ✅   | Fixed-expiry, one traversal                                                      |
| QR types: Recurring          |   ✅   | Weekly/Monthly schedule                                                          |
| QR types: Permanent          |   ✅   | Long-term with revocation                                                        |
| QR types: Open Links         |   ✅   | Public registration pages                                                        |
| Bulk QR CSV generation       |   ✅   | Generate hundreds of passes from CSV                                             |
| Pass deny flow               |   ✅   | Operator deny post-valid-scan; logged as DENIED                                  |
| Identity tiers (0/1/2)       |   ✅   | Tier 0: metadata only; Tier 1: ID photo; Tier 2: biometric                       |
| Supervisor PIN override      |   ✅   | Bypass with mandatory reason logging                                             |
| Gate modes: SINGLE/MULTI     |   ✅   | Per-project gate configuration                                                   |

### 4.2 CRM & Resident Management

| Feature                     | Status | Details                                                    |
| :-------------------------- | :----: | :--------------------------------------------------------- |
| Contacts CRM                |   ✅   | Full CRUD with jobTitle, source, website, notes            |
| Contact sources             |   ✅   | MANUAL, IMPORT, QR_SCAN, REFERRAL, OTHER                   |
| Units management            |   ✅   | UnitType enum, contact-unit linking                        |
| Contact→QR generation       |   ✅   | Create QR directly from contact with "Send QR Link"        |
| Projects hub                |   ✅   | Multi-project with gallery (JSON), external URL, gate mode |
| Project gallery             |   ✅   | Up to N images stored as JSON in `galleryJson`             |
| Project filtering on scans  |   ✅   | URL param `?project=<id>` or cookie-based                  |
| CSV export with project col |   ✅   | `scans_export_{date}_{shortProjectId}.csv`                 |

### 4.3 Team Management

| Feature                | Status | Details                                       |
| :--------------------- | :----: | :-------------------------------------------- |
| RBAC role system       |   ✅   | Roles scoped to Organization → Project → Role |
| Team invite flow       |   ✅   | Email invite with JWT token, role assignment  |
| Team member management |   ✅   | Activate, deactivate, role changes            |
| Team chat              |   ✅   | Real-time messaging within team               |
| Activity timeline      |   ✅   | Audit log of team actions                     |

### 4.4 Marketing Suite

| Feature                     | Status | Details                                           |
| :-------------------------- | :----: | :------------------------------------------------ |
| UTM attribution             |   ✅   | Source, Medium, Campaign captured on registration |
| UTM → gate scan attribution |   ✅   | UTM travels with guest to physical gate arrival   |
| Meta Pixel integration      |   ✅   | Configurable pixel ID; fires on guest page load   |
| Google Analytics 4          |   ✅   | GA4 event firing on guest arrival landing pages   |
| CRM webhooks                |   ✅   | Push to HubSpot, Salesforce, or custom endpoints  |
| Funnel dashboards           |   ✅   | Cost-per-physical-visit metrics                   |
| Live SSE dashboards         |   ✅   | Real-time throughput via Server-Sent Events       |

### 4.5 AI Operations

| Feature                   | Status | Details                                         |
| :------------------------ | :----: | :---------------------------------------------- |
| GateAI Assistant (client) |   ✅   | Floating panel, claude-haiku-4-5-20251001       |
| GateAI: createProject     |   ✅   | Creates project with gate count validation      |
| GateAI: createUnit        |   ✅   | Creates unit with contact link                  |
| GateAI: createQR          |   ✅   | Creates QR with count + unit→project derivation |
| GateAI: listRecentScans   |   ✅   | Last N scans for active project                 |
| GateAI: getProjectStats   |   ✅   | Stats for project                               |
| GateAI: RTL support       |   ✅   | Panel slides from left for `ar-EG` locale       |
| GateAI: localStorage      |   ✅   | Chat history persists (`gateflow-ai-chat-v1`)   |

### 4.6 Auth & Security

| Feature                       | Status | Details                                            |
| :---------------------------- | :----: | :------------------------------------------------- |
| Argon2id password hashing     |   ✅   | Industry strongest modern algorithm                |
| 15-min JWT + 30-day refresh   |   ✅   | Short-lived tokens with rotation                   |
| Multi-device session tracking |   ✅   | Track and revoke individual sessions               |
| Tenant isolation middleware   |   ✅   | Every Prisma query hard-scoped to `organizationId` |
| Admin Authorization Keys      |   ✅   | Cryptographic CRUD with ADMIN_ACCESS_KEY           |
| Audit logging                 |   ✅   | Immutable log with full actor attribution          |
| Pre-commit secret scanner     |   ✅   | 12 HIGH patterns block, 4 MEDIUM warn              |
| Env var validator             |   ✅   | Presence + placeholder + min-length checks         |
| NEXTAUTH_SECRET required      |   ✅   | Throws in production if missing                    |

---

## 5. Technical Architecture

### 5.1 Monorepo Structure

```
pnpm workspaces + Turborepo
├── apps/           — 6 production applications
├── packages/
│   ├── db/         — Prisma schema + client (PostgreSQL)
│   ├── ui/         — shadcn/ui + ADS tokens
│   ├── types/      — Zod schemas + TS types
│   ├── i18n/       — AR/EN dictionaries
│   └── config/     — ESLint, Tailwind, TSConfig
```

### 5.2 Tech Stack

| Layer                  | Technology                        | Version |
| :--------------------- | :-------------------------------- | :------ |
| Monorepo orchestration | Turborepo                         | 2.8     |
| Package manager        | pnpm                              | 8.15    |
| Web framework          | Next.js (App Router + RSC)        | 14.2    |
| Mobile framework       | React Native via Expo             | Expo 54 |
| Language               | TypeScript (strict mode)          | 5.3     |
| Database               | PostgreSQL                        | 15+     |
| ORM                    | Prisma                            | 5.x     |
| UI primitives          | shadcn/ui + Radix                 | Latest  |
| Styling                | Tailwind CSS v3                   | 3.4     |
| Animation (UI)         | Motion.dev (Framer Motion)        | v11     |
| Animation (charts)     | React Spring                      | v9      |
| Animation (branded)    | Lottie React                      | Latest  |
| Charts                 | Recharts / Tremor / ECharts       | Mixed   |
| AI SDK                 | Vercel AI SDK                     | 4.3     |
| AI Model               | claude-haiku-4-5-20251001         | —       |
| Auth                   | NextAuth.js                       | v4      |
| Validation             | Zod                               | 3.22    |
| Testing                | Jest + React Testing Library      | Latest  |
| Linting                | ESLint + Prettier                 | Latest  |
| Git hooks              | Husky                             | v9      |
| Commit standard        | Conventional Commits (commitlint) | v20     |
| Deployment             | Vercel                            | Latest  |

### 5.3 Key API Routes (`apps/client-dashboard`)

| Method         | Route                            | Purpose                                  |
| :------------- | :------------------------------- | :--------------------------------------- |
| POST           | `/api/qrcodes/validate`          | QR validation, creates ScanLog           |
| POST           | `/api/scans/bulk`                | Offline sync (LWW conflict resolution)   |
| POST           | `/api/scans/[scanId]/deny`       | Operator deny after valid scan           |
| GET            | `/api/scans/my-recent`           | Last 100 scans for authenticated scanner |
| GET            | `/api/events/stream`             | SSE live scan feed                       |
| GET            | `/s/[shortId]`                   | Short URL resolver                       |
| POST           | `/api/contacts`                  | Create contact                           |
| GET/PUT/DELETE | `/api/contacts/[id]`             | Contact CRUD                             |
| POST           | `/api/units`                     | Create unit                              |
| GET/PUT/DELETE | `/api/units/[id]`                | Unit CRUD                                |
| GET            | `/api/notifications/expired-qrs` | Notification bell data                   |
| POST           | `/api/ai/assistant`              | GateAI streaming endpoint                |
| GET/POST       | `/api/projects`                  | Project list + create                    |
| GET/PUT        | `/api/projects/[id]`             | Project detail + update                  |
| GET            | `/api/projects/[id]/logs`        | Project scan logs                        |
| GET/POST       | `/api/projects/[id]/team`        | Team management                          |

### 5.4 AccessToken Claims Shape

```typescript
interface AccessTokenClaims {
  sub: string; // userId (NOT a userId field)
  email: string;
  role: string;
  orgId: string;
}
// Always use auth.sub for userId in API routes
```

---

## 6. Security Architecture

### 6.1 Threat Model

| Threat            | Mitigation                                                                                      |
| :---------------- | :---------------------------------------------------------------------------------------------- |
| QR code forgery   | HMAC-SHA256 signature verified offline; altered payload fails immediately                       |
| Man-in-the-middle | Offline verification removes network as attack surface                                          |
| Tenant data leak  | Prisma middleware hard-scopes every query; `clearOrganizationContext()` in all `finally` blocks |
| Secret exposure   | Pre-commit scanner blocks 12 HIGH patterns; required secrets throw in production                |
| Session hijacking | 15-min JWT + 30-day refresh; multi-device session tracking                                      |
| SQL injection     | Prisma ORM parameterized queries; Zod input validation at all boundaries                        |
| XSS               | React default escaping; CSP headers; no `dangerouslySetInnerHTML` with user content             |
| Brute force       | Argon2id hashing; rate limiting on auth endpoints                                               |
| Audit gap         | Every admin action and scan logged immutably with actor attribution                             |

### 6.2 Cryptographic Standards

| Function            | Algorithm    | Where                     |
| :------------------ | :----------- | :------------------------ |
| QR signing          | HMAC-SHA256  | Server + scanner app      |
| Offline queue       | AES-256      | Scanner app local storage |
| Password hashing    | Argon2id     | Auth API                  |
| Session tokens      | JWT (signed) | NextAuth                  |
| Short ID generation | 8-hex CSPRNG | QrShortLink.shortId       |

### 6.3 Multi-Tenancy Rules (Non-Negotiable)

1. Every Prisma read query: `WHERE organizationId = claims.orgId`
2. Every Prisma write mutation: `organizationId: claims.orgId` in create payload
3. Tenant context must be cleared in `finally` — never leave context set between requests
4. Admin dashboard operates outside tenant scope with explicit `ADMIN_ACCESS_KEY` validation

---

## 7. The Ralph Loop — Automation Stack

The Ralph Loop is GateFlow's autonomous engineering governance system. It is itself a product feature — the mechanism that ensures quality, consistency, and documentation are never sacrificed for speed.

### 7.1 Architecture

```
Idea → Plan → Code → Test → Commit → Verify → Ship → Document
  ↑                                                         ↓
  └──────────────── Ralph Loop (automated) ─────────────────┘
```

### 7.2 Git Hook Chain

| Hook          | Fires        | Actions                                                  |
| :------------ | :----------- | :------------------------------------------------------- |
| `commit-msg`  | Every commit | commitlint — enforces `type(scope): description` format  |
| `pre-commit`  | Every commit | Secret scan (12 HIGH block) → lint-staged → prisma guard |
| `post-commit` | Every commit | AI tool sync → CHANGELOG auto-update → phase auto-close  |
| `pre-push`    | Every push   | Branch name enforce → `pnpm preflight` (lint+type+test)  |
| `post-merge`  | After merge  | Auto patch-bump + tag when `feat/*` merges to master     |

### 7.3 Quality Check Scripts

| Script                 | Command            | What It Checks                                                |
| :--------------------- | :----------------- | :------------------------------------------------------------ |
| `scan-secrets.js`      | `check:secrets`    | 12 HIGH + 4 MEDIUM secret patterns across staged/full repo    |
| `check-env.js`         | `check:env`        | Presence, placeholder values, min-length for all app env vars |
| `check-bundle-size.js` | `check:bundle`     | Bundle growth vs baseline (warn >10%, fail >25%)              |
| `check-imports.js`     | `check:imports`    | Circular dependency DFS across all TS/JS files                |
| `check-db-drift.js`    | `check:db-drift`   | Schema hash vs committed baseline                             |
| `todos.js`             | `check:todos`      | TODO/FIXME/HACK with git blame author + age                   |
| `pre-deploy.js`        | `check:pre-deploy` | 5-check gate before any deployment                            |

### 7.4 Plan Lifecycle

```
planning/ → planned/ → in-progress/ → done/
```

| Command                    | Action                                                      |
| :------------------------- | :---------------------------------------------------------- |
| `pnpm plan:new <slug>`     | Create plan + phase prompts in `planning/`                  |
| `pnpm plan:ready <slug>`   | Approve → move to `planned/`                                |
| `pnpm plan:start <slug>`   | Begin → move to `in-progress/` + CHANGELOG entry            |
| `pnpm plan:run <slug> <N>` | Execute phase N with right CLI + mark `[x]`                 |
| `pnpm plan:done <slug>`    | Ship → move to `done/` + update all 5 doc files + create PR |

### 7.5 Commit Convention (Enforced)

```
type(scope): description

Types: feat, fix, chore, perf, docs, refactor, security, ci, test, hotfix, revert, style, build
Scopes: client, admin, scanner, mobile, portal, marketing, db, ui, types, i18n, config, auth,
        qr, scans, gates, contacts, units, projects, team, webhooks, analytics, api,
        notifications, billing, media, search, realtime, cache, jobs, infra
```

### 7.6 Ralph Dashboard

```bash
pnpm ralph         # Full dashboard: git, plans, hooks, quality, next action
pnpm ralph:short   # Compact: git + plans only
```

---

## 8. Data Model Overview

### 8.1 Core Models

| Model          | Key Fields                                                      | Relations                |
| :------------- | :-------------------------------------------------------------- | :----------------------- |
| `Organization` | id, name, slug, plan                                            | → Projects, Users, Gates |
| `Project`      | id, name, orgId, galleryJson, externalUrl, gateMode             | → Gates, QRCodes, Scans  |
| `Gate`         | id, name, projectId, location?                                  | → Scans                  |
| `QrCode`       | id, type, payload, signature, uses, maxUses, expiresAt          | → Scans, QrShortLink     |
| `QrShortLink`  | id, shortId(8-hex), fullPayload, expiresAt                      | → QrCode                 |
| `ScanLog`      | id, qrCodeId, gateId, status, auditTrail, scanUuid              | —                        |
| `Contact`      | id, name, email, phone, jobTitle, source, companyWebsite, notes | → ContactUnit            |
| `Unit`         | id, name, type(UnitType), projectId                             | → ContactUnit            |
| `ContactUnit`  | contactId, unitId                                               | junction                 |
| `User`         | id, email, role, orgId, hashedPassword                          | → Sessions               |
| `EventLog`     | id, type, payload, orgId, timestamp                             | SSE source               |

### 8.2 Key Enums

```typescript
enum QrCodeType {
  SINGLE_USE,
  RECURRING,
  PERMANENT,
  OPEN_LINK,
}
enum ScanStatus {
  SUCCESS,
  FAILED,
  EXPIRED,
  MAX_USES_REACHED,
  INACTIVE,
  DENIED,
}
enum ContactSource {
  MANUAL,
  IMPORT,
  QR_SCAN,
  REFERRAL,
  OTHER,
}
enum GateMode {
  SINGLE,
  MULTI,
}
enum UnitType {
  APARTMENT,
  VILLA,
  OFFICE,
  RETAIL,
  MARINA_BERTH,
  OTHER,
}
```

### 8.3 Critical Implementation Notes

- `QRCode` model → `prisma.qRCode` (Prisma camelCase casing)
- `ScanLog.auditTrail` is `Json[]` → spread and cast: `[...trail, entry] as unknown as Prisma.JsonArray`
- Import enums from `@gate-access/db`, NOT `@prisma/client` directly
- `Dialog` in `@gate-access/ui` is a simple div — use conditional rendering, NOT Radix `<Dialog open={open}>`
- Test files must have `export {}` at top to avoid TS2451 "Cannot redeclare" errors
- POST route tests need `MockNextRequest` — Jest `node` env doesn't support Web `Request.json()`
- `generateScanUuid()` is async — callers must `await` it

---

## 9. Release History & Version Log

Each release section documents what shipped and ends with **5 suggested features** for that version's natural next step — for planning reference.

---

### v0.1.0 — Initial Production Release

**Released:** 2026-03-23
**Theme:** Foundation — Core Platform & Infrastructure

#### What Shipped

- **6-app monorepo** — Turborepo + pnpm workspaces with unified DB, types, UI
- **Client Dashboard** — Real-time scan feed, QR management, 15+ pages, ADS tokens
- **Scanner App** — Offline HMAC verification, AES-256 queue, haptics, 5 tabs
- **Resident Mobile** — Native iOS/Android, one-tap WhatsApp share, push notifications
- **Resident Portal** — Web pass management, history, open QR links
- **Admin Dashboard** — Multi-tenant oversight, billing, authorization keys, audit logs
- **Marketing Site** — SSR, full SEO, dynamic pricing, industry verticals
- **Auth system** — Argon2id + 15-min JWT + multi-device sessions
- **Multi-tenancy** — Prisma middleware hard-scoping every query
- **QR system** — 4 types (Single, Recurring, Permanent, Open Link), Bulk CSV
- **Marketing Suite** — UTM attribution, Meta Pixel, GA4, CRM webhooks
- **CRM** — Contacts + Units + Contact sources + project gallery + gate modes
- **Team management** — RBAC invite flow, role assignment, team chat, activity timeline
- **GateAI Assistant** — claude-haiku-4-5, 5 tools, RTL support, localStorage history
- **Ralph Automation Stack** — 19 scripts, 5 Husky hooks, 12 quality checks
- **Commitlint** — Conventional commits enforced; 13 types, 30 scopes
- **PR automation** — Size labels (XS→XL), affected packages comment
- **GitHub Release** — Auto-published from CHANGELOG on version tag push
- **Short QR URLs** — `/s/{shortId}` resolver, QR version ~2 maintained
- **i18n** — Full AR/EN RTL with logical CSS properties

#### 5 Suggested Features for v0.2.0

|  #  | Feature                                                                                                                         | Value                                                      | Effort |
| :-: | :------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------- | :----: |
|  1  | **WhatsApp Business API Bot** — Let residents request and receive their QR codes via WhatsApp chat without opening any app      | Very High — meets users where they already are in MENA     |   M    |
|  2  | **SMS Gateway** — Automated guest invitation delivery via SMS with regional carrier integration (Twilio/Vonage)                 | High — covers non-smartphone guests and formal invitations |   S    |
|  3  | **Visitor Watchlist** — Residents can flag specific visitors as blocked; scanner shows warning on blocked visitor scan          | High — direct resident safety request                      |   M    |
|  4  | **Live Gate Camera Feed** — Optional IP camera integration showing real-time gate view during scan events for remote monitoring | High — premium differentiator for enterprise accounts      |   L    |
|  5  | **Scan Heatmaps** — Time-of-day and day-of-week heatmap visualization of gate traffic patterns per project                      | Medium — analytics depth for marketing and operations      |   S    |

---

### Planned: v0.2.0 — Reach & Intelligence Edition

**Theme:** Expand communication channels + deepen analytics

#### Goals

- Reduce resident friction to near zero (WhatsApp + SMS flows)
- Add predictive intelligence layer on top of scan data
- Expand marketing attribution to include multi-touch models
- Enable remote gate monitoring for enterprise clients
- Increase platform stickiness with personalization features

#### Scope

| Feature                 | Priority | Description                                      |
| :---------------------- | :------: | :----------------------------------------------- |
| WhatsApp Bot            |    P0    | WhatsApp Business API QR generation and delivery |
| SMS Gateway             |    P0    | Twilio/Vonage automated invitation SMS           |
| Visitor Watchlist       |    P1    | Resident-controlled blocked visitor list         |
| Scan Heatmaps           |    P1    | Time/day traffic pattern visualization           |
| Live Camera Feed        |    P2    | IP camera integration at gate view               |
| Multi-touch attribution |    P2    | Advanced marketing attribution models            |
| Occupancy analytics     |    P2    | Real-time unit/area occupancy tracking           |

#### 5 Suggested Features for v0.3.0

|  #  | Feature                                                                                                                                          | Value                                                       | Effort |
| :-: | :----------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- | :----: |
|  1  | **License Plate Recognition (LPR)** — ANPR camera integration that automatically validates vehicle-based access without any QR scanning required | Very High — premium hardware integration, unique in MENA    |   XL   |
|  2  | **Recurring Access Schedules** — Automatic recurring QR passes for housekeepers/staff with calendar-driven generation (Mon-Fri 8am-5pm)          | High — eliminates manual renewal for property managers      |   M    |
|  3  | **Mobile Check-in for Events** — Dedicated event mode with bulk attendee list upload, on-site registration, and live capacity dashboard          | High — opens event market segment                           |   L    |
|  4  | **Resident Reputation Scoring** — AI-scored trustworthiness based on visitor patterns, complaint history, and community engagement               | Medium — differentiated CRM feature for premium communities |   L    |
|  5  | **Multi-language QR Landing Pages** — Guest-facing landing pages auto-localized to visitor's browser language (AR, EN, FR, UR)                   | Medium — MENA market has diverse expat communities          |   S    |

---

### Planned: v0.3.0 — Hardware & Intelligence Edition

**Theme:** Physical hardware integration + predictive AI

#### Goals

- Bridge digital and physical infrastructure (LPR, turnstiles, intercoms)
- Launch predictive AI layer for proactive security
- Build event management as standalone vertical
- Expand into multi-language emerging markets
- First enterprise sales pilot (5+ gates, 500+ units)

#### 5 Suggested Features for v0.4.0

|  #  | Feature                                                                                                                                                       | Value                                                           | Effort |
| :-: | :------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------- | :----: |
|  1  | **Developer API + Webhooks SDK** — Public REST API with API key management, rate limiting, and official SDKs (Node, Python) for third-party integrations      | Very High — unlocks B2B2C model, partners can build on GateFlow |   L    |
|  2  | **White-label Branding** — Per-organization custom domain, logo, color scheme on all guest-facing pages and scanner app splash                                | Very High — enterprise sales requirement                        |   M    |
|  3  | **Automated Billing & Metering** — Usage-based billing with Stripe integration, overage alerts, self-serve plan upgrades                                      | High — enables self-serve growth                                |   L    |
|  4  | **Offline-first Admin Panel** — Property manager mobile app that works without internet for gate configuration and manual overrides                           | High — critical for sites with poor connectivity                |   L    |
|  5  | **AI Anomaly Detection** — Real-time detection of unusual scan patterns (sudden bursts, off-hours access, repeated failures) with automatic supervisor alerts | High — proactive security selling point                         |   L    |

---

### Planned: v0.4.0 — Platform & Ecosystem Edition

**Theme:** Open platform + white-label + self-serve growth

#### Goals

- Transform GateFlow from product to platform
- Enable white-label for enterprise sales
- Launch developer API for ecosystem partners
- Achieve product-led growth via self-serve billing
- AI-powered security intelligence as standard feature

#### 5 Suggested Features for v0.5.0

|  #  | Feature                                                                                                                                                   | Value                                                       | Effort |
| :-: | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- | :----: |
|  1  | **Community Social Layer** — Resident-to-resident messaging, community announcements, and neighbor recommendations within the app                         | High — increases daily active usage beyond access events    |   XL   |
|  2  | **Marketplace for Service Providers** — Verified service providers (cleaners, maintenance, delivery) can be invited with pre-approved recurring access    | Very High — monetization opportunity + resident convenience |   L    |
|  3  | **Predictive Capacity Planning** — ML model forecasting gate traffic peaks based on historical data, helping managers pre-staff and pre-configure         | High — operational intelligence for large properties        |   L    |
|  4  | **Cross-Community Visitor Network** — Shared trusted visitor registry across communities in the same management group (VIP guests work at all properties) | Medium — enterprise account expansion feature               |   M    |
|  5  | **Carbon & ESG Reporting** — Automated ESG reports tracking paper elimination, digital transformation metrics for sustainability-conscious developers     | Medium — B-Corp and ESG-reporting real estate developers    |   S    |

---

### Planned: v0.5.0 — Scale & Community Edition

**Theme:** Network effects + operational intelligence + new revenue streams

#### Goals

- Drive daily active usage beyond access control events
- Build marketplace revenue stream
- Launch enterprise network features (cross-community)
- Achieve 50+ active property clients
- ESG reporting for sustainability-focused market

#### 5 Suggested Features for v1.0.0

|  #  | Feature                                                                                                                                                                        | Value                                                                 | Effort |
| :-: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- | :----: |
|  1  | **GateFlow Concierge AI (Advanced)** — Fully autonomous AI that handles 90% of guest management without resident intervention; learns patterns and pre-approves known visitors | Very High — product-defining feature, strongest market differentiator |   XL   |
|  2  | **Physical Access Hardware** — GateFlow-branded IoT gate controller that directly integrates with existing boom barriers and turnstiles (no third-party middleware)            | Very High — full hardware-software stack ownership                    |   XL   |
|  3  | **Insurance & Risk Analytics** — Partnership with regional insurers to offer risk-scored premiums based on access log quality and security posture                             | High — B2B2B revenue stream, unique in proptech                       |   L    |
|  4  | **Government & Municipal Integration** — Direct API integration with municipal visitor registration systems for regulatory compliance in UAE/KSA                               | High — mandatory for enterprise government-adjacent properties        |   XL   |
|  5  | **GateFlow Certification Program** — Certified GateFlow integrators (security companies, property managers) with verified training and official partner status                 | Medium — channel sales multiplier                                     |   M    |

---

## 10. Current Roadmap

### Active Plan: None (all phases complete)

### Queued Plans: `pagespeed_100`, `security_isolation_fix`

### Immediate Priorities (Next Sprint)

| Priority | Initiative                                                 | Why Now                                         |
| :------: | :--------------------------------------------------------- | :---------------------------------------------- |
|    P0    | `pagespeed_100` — Lighthouse performance to 100            | Lighthouse CI currently failing threshold       |
|    P0    | `security_isolation_fix` — Complete tenant isolation audit | Pre-deployment security requirement             |
|    P1    | WhatsApp Bot (v0.2.0 planning)                             | Top requested feature from MENA market research |
|    P1    | SMS Gateway integration                                    | Complements QR delivery, reduces friction       |
|    P2    | Scan heatmaps analytics                                    | Quick win analytics depth                       |

### KPIs & Success Metrics

| Metric                 | Current | Target (v0.2.0) |
| :--------------------- | :------ | :-------------- |
| Lighthouse Performance | ~85     | ≥98             |
| Lighthouse A11y        | ~90     | ≥95             |
| Lighthouse SEO         | ~95     | 100             |
| API response P95       | —       | <200ms          |
| Scanner verify time    | <100ms  | <50ms           |
| Test coverage (client) | ~60%    | ≥80%            |
| Circular import cycles | 8       | 0               |

---

## 11. Technical Constants & Constraints

These are non-negotiable invariants. Any code that violates these must be rejected in code review.

### 11.1 Multi-Tenancy (Absolute)

```typescript
// EVERY read query
await prisma.scanLog.findMany({
  where: { organizationId: claims.orgId, ...rest },
});

// EVERY write mutation
await prisma.project.create({
  data: { organizationId: claims.orgId, ...data },
});

// EVERY request handler
try {
  setOrganizationContext(claims.orgId);
  // ... operations
} finally {
  clearOrganizationContext(); // REQUIRED — never omit
}
```

### 11.2 Offline Source of Truth

The `scanUuid` generated on the scanner device is the immutable deduplication key. Server-side bulk sync uses Last-Write-Wins (LWW) on `scanUuid`. Never regenerate or mutate a `scanUuid` after creation.

### 11.3 i18n & RTL (All New UI Code)

```typescript
// CORRECT — logical properties
className = 'ms-4 me-2 ps-3'; // margin/padding start/end

// WRONG — physical properties (breaks RTL)
className = 'ml-4 mr-2 pl-3';

// CORRECT — dir-aware flex
className = 'flex flex-row rtl:flex-row-reverse';
```

### 11.4 Design Token Compliance

```typescript
// CORRECT — ADS tokens
className="text-[color:var(--ds-text)]"
className="bg-[color:var(--ds-background-neutral)]"

// WRONG — raw hex (blocked by enforce-ads-design.js)
className="text-[#ED4B00]"
style={{ color: '#ED4B00' }}

// Exception: Kimchi (#ED4B00) accent at 3.74:1 contrast — use sparingly on non-text elements only
```

### 11.5 Animation Library Decision Tree

```
UI transitions / page animations    → Motion.dev (Framer Motion)
Chart data animations               → React Spring
Branded / complex animations        → Lottie
High-complexity sequence (rare)     → GSAP
```

### 11.6 Import Rules

```typescript
// Enums and types — ALWAYS from @gate-access/db
import { ContactSource, GateMode, ScanStatus } from '@gate-access/db';

// NOT from @prisma/client directly
import { ContactSource } from '@prisma/client'; // ❌ WRONG
```

---

## 12. Performance & Quality Standards

### 12.1 Lighthouse Targets

| Metric         | Minimum | Target |
| :------------- | :------ | :----- |
| Performance    | 90      | 98     |
| Accessibility  | 95      | 100    |
| SEO            | 95      | 100    |
| Best Practices | 90      | 95     |

### 12.2 API Performance Targets

| Endpoint Type                 | P95 Target |
| :---------------------------- | :--------- |
| Read (list)                   | <150ms     |
| Read (single)                 | <80ms      |
| Write (create/update)         | <200ms     |
| QR validation (online)        | <100ms     |
| QR validation (offline local) | <10ms      |

### 12.3 Bundle Size Budgets

| App              | Warn Threshold     | Fail Threshold     |
| :--------------- | :----------------- | :----------------- |
| client-dashboard | +10% from baseline | +25% from baseline |
| marketing        | +10% from baseline | +25% from baseline |

### 12.4 Commit Quality Gates

Every commit automatically passes through:

1. **commitlint** — format enforced
2. **Secret scanner** — no credentials
3. **lint-staged** — ESLint + Prettier on staged files
4. **CHANGELOG** — auto-updated for feat/fix/perf/security

Every push automatically passes through:

1. **Branch name check** — valid pattern
2. **`pnpm preflight`** — lint + typecheck + test (all workspaces)

---

## 13. Internationalization & Accessibility

### 13.1 Language Support

| Language       | Code    | Direction | Status      |
| :------------- | :------ | :-------- | :---------- |
| English        | `en`    | LTR       | ✅ Complete |
| Arabic (Egypt) | `ar-EG` | RTL       | ✅ Complete |

### 13.2 RTL Implementation

- All flex layouts use logical properties (`ms-`, `me-`, `ps-`, `pe-`)
- GateAI panel appears on the **left** for `ar-EG` locale
- Direction set via `dir="rtl"` on `<html>` element
- Welcome messages and UI strings localized per `locale` prop

### 13.3 Accessibility Standards

- Radix UI primitives for all interactive components (keyboard navigation, ARIA)
- Color contrast: primary text meets WCAG AA (4.5:1) minimum
- Kimchi accent (`#ED4B00`, 3.74:1) — used only on non-text decorative elements
- All images have `alt` text; all forms have associated labels
- Screen reader testing target: VoiceOver (iOS/macOS) + TalkBack (Android)

### 13.4 i18n Architecture

```
packages/i18n/
├── en/         — English strings
├── ar/         — Arabic strings
└── index.ts    — getTranslations(locale) function
```

Locale detection: URL segment (`/en/` vs `/ar/`), falling back to `Accept-Language` header.

---

_This document is the authoritative source of truth for GateFlow product and engineering decisions._
_Generated and maintained by the Ralph automation system._
_Next review: after v0.2.0 planning is complete._
