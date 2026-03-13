<p align="center">
  <img src="./docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow</h1>

<p align="center">
  <strong>Zero-Trust Digital Gate Infrastructure Platform</strong><br>
  <em>Secure, Auditable, and Marketing-First Access Control for the MENA Region</em>
</p>

<p align="center">
  <a href="https://github.com/iDorgham/Gateflow/stargazers">
    <img src="https://img.shields.io/github/stars/iDorgham/Gateflow?style=social" alt="Stars">
  </a>
  <a href="https://github.com/iDorgham/Gateflow/network/members">
    <img src="https://img.shields.io/github/forks/iDorgham/Gateflow?style=social" alt="Forks">
  </a>
  <img src="https://img.shields.io/badge/Status-100%25%20MVP-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Version-7.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/Security-Strict-blue" alt="Security">
  <a href="https://twitter.com/intent/tweet?text=Check+out+GateFlow+-+Zero-Trust+Digital+Gate+Infrastructure+Platform&url=https%3A%2F%2Fgithub.com%2FiDorgham%2FGateflow">
    <img src="https://img.shields.io/badge/Tweet-Share-blue" alt="Tweet">
  </a>
</p>

---

## 📋 Table of Contents

- [✨ What is GateFlow?](#-what-is-gateflow)
- [🎯 Who is it for?](#-who-is-it-for)
- [⚠️ What Problem Does It Fix?](#-what-problem-does-it-fix)
- [🚀 Key Features](#-key-features)
- [💻 Tech Stack](#-tech-stack)
- [🏗️ Architecture](#-architecture)
- [📱 The 6-App Ecosystem](#-the-6-app-ecosystem)
- [🔐 Security Architecture](#-security-architecture)
- [📊 Development Progress](#-development-progress)
- [🛠️ Quick Start](#-quick-start)
- [📖 Documentation Index](#-documentation-index)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ What is GateFlow?

**GateFlow** is a **next-generation digital gate infrastructure platform** designed to replace outdated paper guest books and chaotic WhatsApp QR sharing. Built specifically for **gated compounds, real estate developers, schools, clubs, marinas, wedding venues, and high-end venues** across the MENA (Middle East & North Africa) region.

GateFlow transforms physical access points into **secure, trackable, and marketing-enabled digital nodes**.

> **Vision:** Stripe-level infrastructure for physical access — controlled entry + live intelligence + enterprise-grade security & integrations.

<br>

### 🏗️ The Six Apps Strategy

GateFlow consists of **6 interconnected applications** working together:

|  #  | App                   | Purpose                    | Users               | Status |
| :-: | --------------------- | -------------------------- | ------------------- | :----: |
|  1  | **Admin Dashboard**   | Super admin management     | Platform operators  |   ✅   |
|  2  | **Client Dashboard**  | Property/Org management    | Admins, managers    |   ✅   |
|  3  | **Scanner App**       | Gate scanning              | Security/operators  |   ✅   |
|  4  | **Marketing Website** | Public marketing           | Prospects           |   ✅   |
|  5  | **Resident Portal**   | Self-service for residents | Unit owners/renters |   ✅   |
|  6  | **Resident Mobile**   | Native resident app        | Unit owners/renters |   ✅   |

<br>

---

## 🎯 Who is it for?

<br>

### 👥 Target Personas

| Persona               | Role                  | Pain Points                            | Must-Have Features                                            |
| :-------------------- | :-------------------- | :------------------------------------- | :------------------------------------------------------------ |
| **Platform Admin**    | Super admin           | No platform visibility                 | Org management, system analytics, billing oversight           |
| **Property Manager**  | Compound/School Admin | Security breaches, resident complaints | Bulk CSV, team RBAC, live dashboard, audit logs               |
| **Event Organizer**   | Project Manager       | Gate chaos, VIP fraud                  | Per-event projects, bulk + manual QR, analytics export        |
| **Security Head**     | Gate Supervisor       | Fake entries, operator abuse           | Live scan feed, operator management, watchlists, incidents    |
| **Gate Operator**     | Security Guard        | Fast & reliable scanning               | Offline-capable mobile app, vibration/sound, simple UI        |
| **Resident**          | Unit Owner/Renter     | Can't give guests access easily        | Self-service QR creation, quota tracking, Open QR, mobile app |
| **Marketing Manager** | Real Estate Marketing | No link between ads and visits         | Marketing suite, UTM attribution, pixels, CRM webhooks        |
| **Developer**         | Integrator            | Easy CRM/booking sync                  | Full REST API, webhooks, API keys with scopes                 |

<br>

### 🏢 Target Industries

- 🏠 **Gated Compounds & Residential Communities**
- 🏢 **Real Estate Developers & Brokerages**
- 🏫 **Private Schools & Universities**
- 🏖️ **Beach Clubs & Marinas**
- 💒 **Wedding Venues & Event Spaces**
- 🌙 **Nightclubs & Entertainment**
- 🚀 **Corporate Events & Conferences**

<br>

---

## ⚠️ What Problem Does It Fix?

<br>

### ❌ Before GateFlow

| Pain Point                   | Consequence                                           |
| :--------------------------- | :---------------------------------------------------- |
| **Paper guest books**        | Lost records, illegible handwriting, no searchability |
| **WhatsApp QR chaos**        | Screenshots, expired codes, no verification           |
| **No real-time visibility**  | Security breaches go unnoticed                        |
| **Manual tracking**          | Time-consuming, error-prone                           |
| **No audit trail**           | Disputes cannot be resolved                           |
| **Weak team separation**     | No role-based access control                          |
| **No marketing attribution** | Cannot track visitor sources                          |
| **No offline capability**    | Internet down = gates stop working                    |

<br>

### ✅ After GateFlow

- 🔐 **Cryptographically signed QR codes** — Every scan is verified and immutable
- 📱 **Offline-first mobile scanners** — Works without internet, syncs when connected
- 📊 **Real-time dashboard** — Live visibility into every gate
- 📋 **Complete audit trail** — Full history for disputes and compliance
- 👥 **Role-based access** — Granular permissions for every team member
- 📈 **Marketing-first** — UTM tracking, Meta Pixel, CRM webhooks
- 🏠 **Resident self-service** — Guests create their own passes

<br>

---

## 🚀 Key Features

<br>

### 🏗️ Core Platform

- 🔲 **QR Code System** — Single, recurring, permanent, visitor-created, and OPEN passes
- 📱 **Mobile Scanner App** — Offline-capable with AES-256 encrypted sync queue
- 🚪 **Gate Management** — Multiple gates per property with assignments and location enforcement
- 👥 **Team & RBAC** — Built-in roles + custom permission-based roles
- 📊 **Analytics Dashboard** — Real-time metrics with Recharts and exportable reports
- 🔌 **Webhooks & API** — Full REST API with scoped API keys and HMAC signatures
- 🏢 **Multi-Project Support** — Organize by compound, event, or campaign
- 👤 **Contacts (CRM)** — Full visitor relationship management with tags
- 🏠 **Units & Residents** — Unit-based resident system with quota tracking
- 🧬 **Advanced Seeding Matrix** — Realistic data ecosystem generation for stress testing
- 🤖 **AI Admin Assistant** — Gemini-powered natural language platform management

<br>

### 🛡️ Security Operations

- 🛡️ **Zero-Trust Architecture** — Every request verified
- 🔐 **HMAC-SHA256 QR Signing** — Cryptographically secure codes
- 🔑 **JWT + Argon2id** — Enterprise-grade authentication (t=3, m=65536, p=4)
- 🏷️ **Watchlists** — Person and vehicle blocking with automatic incident creation
- 📋 **Incident Tracking** — Full workflow (Under Review → Resolved/Escalated)
- 🆔 **Identity Verification** — 3-level identity capture (Level 0/1/2)
- ⏱️ **Supervisor Override** — PIN-based bypass with audit trail (Security Manager only)
- 🔒 **Field Encryption** — AES-256-GCM for webhook secrets
- 📍 **Location Enforcement** — Optional GPS-based gate validation

<br>

### 📈 Marketing-First Access

- 📈 **UTM Attribution** — Track visitor sources from digital campaigns
- 📱 **Meta Pixel & GA4** — Retarget visitors who attended physical events
- 🔗 **CRM Webhooks** — Sync with your existing tools (HubSpot, Salesforce, etc.)
- 📤 **Export & Reports** — CSV/PDF for analysis and compliance

<br>

### ⚡ Real-Time Intelligence

- ⚡ **Server-Sent Events (SSE)** — Live dashboard updates (stateless, DB-polling based)
- 🔔 **Push Notifications** — Instant alerts to residents via Expo Push
- 📡 **Event Streaming** — Org-scoped real-time events with 24-hour TTL

<br>

### 🏠 Resident Experience

- 🏠 **Unit-Based System** — Quota limits by unit type (Studio → Villa)
- 🎫 **Self-Service QR Creation** — Residents create visitor passes independently
- ⏰ **Access Time Controls** — One-time, date-range, recurring, permanent rules
- 📱 **Mobile App** — Native iOS/Android app with offline QR cache
- 🔔 **Arrival Notifications** — Get notified when visitors arrive at the gate

<br>

---

## 💻 Tech Stack

<br>

### 🏗️ Core Technologies

| Component              | Technology                 | Version | Purpose                      |
| :--------------------- | :------------------------- | :------ | :--------------------------- |
| **Web Frontend**       | Next.js 14                 | 14.x    | App Router, Serverless/Edge  |
| **Mobile (Scanner)**   | Expo                       | SDK 54  | React Native with camera     |
| **Mobile (Resident)**  | Expo                       | SDK 54  | React Native with push       |
| **Database**           | PostgreSQL                 | 15+     | Primary data store           |
| **ORM**                | Prisma                     | 5.x     | Type-safe database access    |
| **Authentication**     | JWT (jose) + Argon2id      | Latest  | Token-based auth             |
| **Package Manager**    | pnpm                       | 8.x     | Fast, disk-efficient         |
| **Build System**       | Turborepo                  | 2.x     | Monorepo build orchestration |
| **UI Components**      | Custom (shadcn-style)      | —       | Consistent design system     |
| **Styling**            | Tailwind CSS               | 3.4.x   | Utility-first CSS            |
| **QR Signing**         | HMAC-SHA256 (crypto-js)    | Latest  | Cryptographic signatures     |
| **Offline Storage**    | AES-256 + PBKDF2           | —       | Encrypted local queue        |
| **Rate Limiting**      | Upstash Redis              | Latest  | Multi-instance safe          |
| **Real-Time**          | Server-Sent Events (SSE)   | —       | Live dashboard updates       |
| **Push Notifications** | Expo Push                  | Latest  | Mobile notifications         |
| **Testing**            | Jest + ts-jest             | Latest  | Unit and integration tests   |
| **i18n**               | Custom (@gate-access/i18n) | —       | Arabic (RTL) + English       |

<br>

### 📦 Shared Packages

| Package                                          |  Status   | Purpose                            |
| :----------------------------------------------- | :-------: | :--------------------------------- |
| [`@gate-access/db`](packages/db)                 | ✅ Stable | Prisma schema, client, migrations  |
| [`@gate-access/types`](packages/types)           | ✅ Stable | Shared TypeScript types and enums  |
| [`@gate-access/ui`](packages/ui)                 | ✅ Stable | Reusable UI component library      |
| [`@gate-access/api-client`](packages/api-client) | ✅ Stable | Fetch utilities with JWT auth      |
| [`@gate-access/i18n`](packages/i18n)             | ✅ Stable | Arabic/English translations        |
| [`@gate-access/config`](packages/config)         | ✅ Stable | ESLint, TSConfig, Tailwind presets |

<br>

---

## 🏗️ Architecture

<br>

### 📁 Monorepo Structure

```
Gateflow/
├── apps/
│   ├── admin-dashboard/      # Super admin panel — Next.js 14, port 3002
│   ├── client-dashboard/     # Main SaaS portal — Next.js 14, port 3001
│   ├── scanner-app/          # Mobile QR scanner — Expo SDK 54, port 8081
│   ├── marketing/            # Public marketing site — Next.js 14, port 3000
│   ├── resident-portal/      # Resident self-service — Next.js 14, port 3003
│   └── resident-mobile/      # Resident mobile app — Expo SDK 54
├── packages/
│   ├── db/                   # Prisma schema, client, migrations
│   ├── types/                # Shared TypeScript types
│   ├── ui/                   # UI component library (shadcn-style)
│   ├── api-client/           # Shared fetch utilities
│   ├── i18n/                 # Arabic/English internationalization
│   └── config/               # Shared ESLint/TS/Tailwind configs
├── docs/                     # Comprehensive documentation
├── infra/                    # Infrastructure configurations
├── scripts/                  # Automation scripts
└── turbo.json                # Turborepo pipeline config
```

<br>

### 📊 System Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Residents / Tenants / Admins                  │
│              Web (Next.js) / Mobile (Expo SDK 54)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Client Dashboard │ Admin Dashboard │ Resident Portal │ Scanner │
│                    (Next.js App Router API Layer)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         PostgreSQL (Prisma) + Redis (Rate Limiting/Cache)        │
└─────────────────────────────────────────────────────────────────┘
```

<br>

### 🗄️ Database Schema (30 Core Models)

| Model            | Purpose                          | Key Fields                                                |
| :--------------- | :------------------------------- | :-------------------------------------------------------- |
| `Organization`   | Multi-tenant root entity         | id, name, slug, plan, settings                            |
| `Project`        | Sub-grouping within organization | id, orgId, name, gallery                                  |
| `Role`           | RBAC roles with permissions      | id, orgId, name, permissions (JSON)                       |
| `User`           | Authentication                   | id, orgId, roleId, unitId, role (ADMIN/RESIDENT/OPERATOR) |
| `Gate`           | Physical access points           | id, orgId, projectId, name, location, mode                |
| `GateAssignment` | User-gate mapping                | id, gateId, userId, shiftStart, shiftEnd                  |
| `QRCode`         | Access codes                     | id, orgId, type, status, signature, maxUses               |
| `ScanLog`        | Immutable audit trail            | id, gateId, qrCodeId, status, location                    |
| `VisitorQR`      | Resident-created QRs             | id, qrCodeId, unitId, accessRuleId                        |
| `AccessRule`     | Time-based access                | id, type (ONE_TIME/DATE_RANGE/RECURRING/PERMANENT)        |
| `Unit`           | Residential units                | id, orgId, number, type, area                             |
| `Contact`        | CRM contacts                     | id, orgId, name, phone, email, tags                       |
| `Watchlist`      | Security watchlist               | id, orgId, name, idNumber, phone                          |
| `Incident`       | Security incidents               | id, gateId, scanId, status, severity                      |
| `Webhook`        | Outbound notifications           | id, orgId, url, events, secret (encrypted)                |
| `ApiKey`         | Programmatic access              | id, orgId, hash, scopes, lastUsed                         |
| `EventLog`       | Real-time events                 | id, orgId, type, data, createdAt (24h TTL)                |

> **Multi-Tenancy Rules:**
>
> - Every model has `organizationId` field
> - All queries MUST filter by `organizationId`
> - Soft deletes via `deletedAt` field (no hard deletes for audit trail)
> - Row-level security enforced at API layer

<br>

---

## 🔐 Security Architecture

GateFlow follows **zero-trust** security principles with defense in depth.

<br>

### 🔑 Authentication

| Feature              | Implementation                       | Details                               |
| :------------------- | :----------------------------------- | :------------------------------------ |
| **Password Hashing** | Argon2id                             | t=3, m=65536, p=4 (OWASP recommended) |
| **Access Tokens**    | JWT (HS256)                          | 15-minute expiry                      |
| **Refresh Tokens**   | Database-backed                      | 30-day expiry with rotation           |
| **Token Storage**    | Cookies (web) / SecureStore (mobile) | HttpOnly, Secure, SameSite=Strict     |
| **CSRF Protection**  | Double-submit cookie                 | Synchronizer token pattern            |

<br>

### 🛡️ Authorization

| Feature                    | Implementation            | Details                                         |
| :------------------------- | :------------------------ | :---------------------------------------------- |
| **RBAC**                   | Role-based access control | Built-in + custom roles                         |
| **Permissions**            | JSON-based                | `gates:manage`, `qr:create`, `scans:view`, etc. |
| **Multi-tenant Isolation** | organizationId scoping    | All queries filtered                            |
| **Gate Assignments**       | User-gate mapping         | Optional shift times                            |

<br>

### 🔒 Data Protection

| Feature              | Implementation             | Details                           |
| :------------------- | :------------------------- | :-------------------------------- |
| **QR Signing**       | HMAC-SHA256                | Never unsigned codes              |
| **Field Encryption** | AES-256-GCM                | Webhook secrets, sensitive fields |
| **Offline Storage**  | AES-256 + PBKDF2           | Encrypted sync queue in scanner   |
| **Rate Limiting**    | Upstash Redis              | Multi-instance safe               |
| **Security Headers** | HSTS, CSP, X-Frame-Options | DENY for frames                   |

<br>

### 🚨 Security Operations

| Feature                  | Implementation          | Details                                 |
| :----------------------- | :---------------------- | :-------------------------------------- |
| **Watchlists**           | Person/Vehicle blocking | Hard stop at gate, auto-incident        |
| **Incidents**            | Workflow tracking       | Under Review → Resolved/Escalated       |
| **Identity Levels**      | 3-tier verification     | Level 0 (Name+Phone) → Level 2 (ID OCR) |
| **Supervisor Override**  | PIN-based bypass        | Security Manager only, audited          |
| **Guard Accountability** | Shift tracking          | Scans per operator, override rate       |

<br>

---

## 📊 Development Progress

<br>

### 📈 MVP Completion Status: **100%** ✅

<br>

#### ✅ Completed Features (100%)

| Feature                              | Status | Notes                                     |
| :----------------------------------- | :----: | :---------------------------------------- |
| Organization CRUD                    |   ✅   | Multi-tenant architecture                 |
| JWT Auth (Argon2id + token rotation) |   ✅   | 15-min access, 30-day refresh             |
| Single QR Code Creation              |   ✅   | Individual visitor passes                 |
| Bulk CSV QR Creation                 |   ✅   | Batch generation                          |
| Gate Management                      |   ✅   | Physical access point CRUD                |
| Mobile Scanner (offline-capable)     |   ✅   | Expo app with AES-256 sync                |
| Scanner App - 5 Tabs                 |   ✅   | Scanner, Today, Log, Chat, Settings       |
| RBAC (roles + permissions)           |   ✅   | Built-in + custom roles                   |
| Gate Assignments                     |   ✅   | User-gate mapping with shifts             |
| Live Analytics Dashboard             |   ✅   | Real-time scan monitoring                 |
| Webhooks + API Keys                  |   ✅   | Event notifications + programmatic access |
| Admin - Authorization Keys           |   ✅   | Platform-wide auth key management         |
| CSRF Protection                      |   ✅   | Double-submit cookie pattern              |
| Rate Limiting                        |   ✅   | Upstash Redis                             |
| Field Encryption                     |   ✅   | AES-256 for webhook secrets               |
| QR Signing                           |   ✅   | HMAC-SHA256                               |
| Supervisor Override                  |   ✅   | PIN-based bypass in scanner               |
| Advanced Analytics                   |   ✅   | Charts and reporting                      |
| Admin Dashboard                      |   ✅   | Super-admin panel                         |
| Resident Portal (Web)                |   ✅   | Visitor pass management, quota, profile   |
| Marketing Site                       |   ✅   | Full platform marketing                   |
| Projects (Multi-project)             |   ✅   | Sub-grouping within organization          |
| Contacts (CRM)                       |   ✅   | Full contact management                   |
| Units (Resident Management)          |   ✅   | Unit-based resident system                |
| Watchlists                           |   ✅   | Security watchlist management             |
| Incidents                            |   ✅   | Incident tracking and resolution          |
| Visitor Identity Levels              |   ✅   | 0/1/2 identity verification               |
| Privacy & Retention Controls         |   ✅   | Configurable data retention               |
| Real-time Updates (SSE)              |   ✅   | Live dashboard updates                    |
| Custom Roles                         |   ✅   | Org-specific role creation                |
| Location Enforcement                 |   ✅   | GPS-based gate validation                 |
| Shift Tracking                       |   ✅   | Guard shift management                    |
| ID Capture                           |   ✅   | Photo capture at gate                     |
| **Resident Mobile App**              |   ✅   | All 6 phases complete                     |
| - Contact Picker                     |   ✅   | Native contact selection                  |
| - Share Sheet                        |   ✅   | OS share integration                      |
| - Push Notifications                 |   ✅   | Scan event notifications                  |
| - GPS Guide                          |   ✅   | Directions to unit                        |
| - Arrival Notification               |   ✅   | Guest arrival alerts                      |
| - History & Settings                 |   ✅   | Full app functionality                    |
| **Marketing Website**                |   ✅   | All 5 phases complete                     |
| - Homepage Conversion                |   ✅   | Social proof, testimonials                |
| - Solutions Pages                    |   ✅   | Vertical content                          |
| - Blog (MDX)                         |   ✅   | 4 launch posts                            |
| - Contact Form                       |   ✅   | Resend integration                        |
| - SEO & Content                      |   ✅   | OG, JSON-LD, i18n                         |

<br>

#### 🚀 Post-MVP Features (Planned)

| Feature                        | Priority  | Phase  | Notes                     |
| :----------------------------- | :-------- | :----- | :------------------------ |
| Marketing Suite - Pixels       | 🟡 Medium | Future | Meta Pixel / GA4 tracking |
| Marketing Suite - UTM          | 🟡 Medium | Future | UTM-powered profiling     |
| WhatsApp/Omni-channel Delivery | 🟢 Low    | Future | Multi-channel delivery    |
| LPR Integration                | 🟢 Low    | Future | License Plate Recognition |

<br>

### 📅 Phase Roadmap

<br>

#### **Phase 1: MVP (Completed)** — 100% Complete ✅

**Completed:**

- ✅ Core platform infrastructure
- ✅ Client Dashboard
- ✅ Admin Dashboard
- ✅ Scanner App (offline-capable, 5 tabs)
- ✅ Marketing Site
- ✅ Security features (JWT, RBAC, encryption)
- ✅ Resident Portal (web)
- ✅ Real-time updates (SSE)
- ✅ Projects (multi-project support)
- ✅ Contacts (CRM)
- ✅ Units (resident management)
- ✅ Watchlists and incidents
- ✅ Visitor identity levels
- ✅ Privacy and retention controls
- ✅ Gate assignments
- ✅ Custom roles

<br>

#### **Phase 2: Resident Mobile & Real-time** — Complete ✅

**Status:** 100% Complete

**Completed:**

- ✅ Real-time updates (SSE)
- ✅ Resident mobile app skeleton
- ✅ QR list and creation
- ✅ Offline QR cache
- ✅ Visitor history
- ✅ Settings
- ✅ Contact picker & share sheet
- ✅ Push notifications (scan events)
- ✅ GPS guide for guests
- ✅ Arrival notifications

**New Features:**

- Self-service guest management for residents
- Unit-linked visitor passes
- Quota limits by unit type
- Access rules (one-time, recurring, permanent)
- Resident mobile app (iOS/Android)

**New Prisma Models:**

- `Unit` — residential unit linked to org and user
- `VisitorQR` — visitor QR created by resident
- `AccessRule` — time-based access constraints
- `ResidentLimit` — per-org quota config by unit type
- `EventLog` — real-time event stream

<br>

#### **Phase 3: Marketing Suite** — Future 📋

- WhatsApp integration
- SMS delivery
- Meta Pixel / GA4 tracking
- UTM-powered visitor profiling
- CRM webhooks for lead sync

<br>

### 📱 App Status

| App              | Port | Status  | Documentation                                                 |
| :--------------- | :--: | :-----: | :------------------------------------------------------------ |
| Marketing        | 3000 | ✅ Done | [marketing/README.md](apps/marketing/README.md)               |
| Client Dashboard | 3001 | ✅ Done | [client-dashboard/README.md](apps/client-dashboard/README.md) |
| Admin Dashboard  | 3002 | ✅ Done | [admin-dashboard/README.md](apps/admin-dashboard/README.md)   |
| Scanner App      | 8081 | ✅ Done | [scanner-app/README.md](apps/scanner-app/README.md)           |
| Resident Portal  | 3003 | ✅ Done | [resident-portal/README.md](apps/resident-portal/README.md)   |
| Resident Mobile  | TBD  | ✅ Done | [resident-mobile/README.md](apps/resident-mobile/README.md)   |

<br>

### 📦 Package Status

| Package                   |  Status   | Purpose                    |
| :------------------------ | :-------: | :------------------------- |
| `@gate-access/db`         | ✅ Stable | Prisma schema & client     |
| `@gate-access/types`      | ✅ Stable | Shared TypeScript types    |
| `@gate-access/ui`         | ✅ Stable | UI component library       |
| `@gate-access/api-client` | ✅ Stable | Fetch utilities            |
| `@gate-access/i18n`       | ✅ Stable | AR/EN translations         |
| `@gate-access/config`     | ✅ Stable | ESLint, TSConfig, Tailwind |

<br>

---

## 🛠️ Quick Start

<br>

### 📋 Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** 8+ (`npm install -g pnpm`)
- **PostgreSQL** 15+ (local or cloud)
- **Git** for version control

<br>

### 📥 Installation

```bash
# 1. Clone the repository
git clone https://github.com/iDorgham/Gateflow.git
cd Gateflow

# 2. Install dependencies
pnpm install

# 3. Setup database
cd packages/db
cp .env.example .env
# Edit .env with your DATABASE_URL
npx prisma migrate dev
npx prisma db seed

# 4. Return to root and start all applications
cd ../..
pnpm turbo dev
```

<br>

### 🌐 Development Ports

| App              | Port | Command                                    |
| :--------------- | :--: | :----------------------------------------- |
| Marketing Site   | 3000 | `pnpm turbo dev --filter=marketing`        |
| Client Dashboard | 3001 | `pnpm turbo dev --filter=client-dashboard` |
| Admin Dashboard  | 3002 | `pnpm turbo dev --filter=admin-dashboard`  |
| Resident Portal  | 3003 | `pnpm turbo dev --filter=resident-portal`  |
| Scanner App      | 8081 | `cd apps/scanner-app && npx expo start`    |

<br>

### ⚡ Common Commands

```bash
# Install dependencies
pnpm install

# Start all apps
pnpm turbo dev

# Build all apps and packages
pnpm turbo build

# Run linter across all apps
pnpm turbo lint

# Run tests
pnpm turbo test

# Type-check all TypeScript
pnpm turbo typecheck

# Run preflight (lint + typecheck + test)
pnpm preflight

# Database commands
pnpm db:generate    # Generate Prisma client
pnpm db:studio      # Open Prisma Studio

# Start specific apps
pnpm dev:client     # Client dashboard only
pnpm dev:admin      # Admin dashboard only
pnpm dev:scanner    # Scanner app only
pnpm dev:marketing  # Marketing site only
```

<br>

### 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gateflow?schema=public"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
QR_SIGNING_SECRET="your-qr-signing-secret-min-32-chars"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# App URLs
NEXT_PUBLIC_MARKETING_URL="http://localhost:3000"
NEXT_PUBLIC_CLIENT_URL="http://localhost:3001"
NEXT_PUBLIC_ADMIN_URL="http://localhost:3002"
NEXT_PUBLIC_RESIDENT_URL="http://localhost:3003"
EXPO_PUBLIC_API_URL="http://localhost:3001"

# Email (Resend)
RESEND_API_KEY="re_your-api-key"

# Expo Push (for mobile notifications)
EXPO_PUSH_TOKEN="your-expo-push-token"
```

> 📖 See [Environment Variables Guide](docs/guides/ENVIRONMENT_VARIABLES.md) for complete reference.

<br>

---

## 📖 Documentation Index

> **Start here:** [Documentation Hub](docs/README.md)

<br>

### 📚 Core Documentation

| Document              | Description                              | Link                                       |
| :-------------------- | :--------------------------------------- | :----------------------------------------- |
| **PRD v7.0**          | Complete product requirements document   | [View](docs/PRD_v7.0.md)                   |
| **Architecture**      | System design and data flow              | [View](docs/ARCHITECTURE.md)               |
| **Project Progress**  | MVP completion status and roadmap        | [View](docs/PROJECT_PROGRESS_DASHBOARD.md) |
| **Development Guide** | Local setup and workspace guide          | [View](docs/DEVELOPMENT_GUIDE.md)          |
| **Security Overview** | Security architecture and best practices | [View](docs/guides/SECURITY_OVERVIEW.md)   |

<br>

### 📖 User Guides

| Document                  | Description                | Link                                         |
| :------------------------ | :------------------------- | :------------------------------------------- |
| **Environment Variables** | Complete env var reference | [View](docs/guides/ENVIRONMENT_VARIABLES.md) |
| **Scanner Operations**    | Gate operator workflows    | [View](docs/guides/SCANNER_OPERATIONS.md)    |
| **Resident Experience**   | Resident portal guide      | [View](docs/guides/RESIDENT_EXPERIENCE.md)   |

<br>

### 📋 Planning & Execution

| Document            | Description                    | Link                                           |
| :------------------ | :----------------------------- | :--------------------------------------------- |
| **Execution Plans** | All phase plans and prompts    | [Browse](docs/plan/execution/)                 |
| **Learning**        | Patterns, decisions, incidents | [Browse](docs/plan/learning/)                  |
| **Backlog**         | Task backlog and ideas         | [View](docs/plan/backlog/ALL_TASKS_BACKLOG.md) |

<br>

### 📑 Reference

| Document              | Description                    | Link                                       |
| :-------------------- | :----------------------------- | :----------------------------------------- |
| **Prompts Reference** | AI prompts used in development | [View](docs/PROMPTS_REFERENCE.md)          |
| **CLI Commands**      | Command-line reference         | [View](docs/cli-context/commands/guide.md) |
| **Skills**            | Agent skills documentation     | [Browse](docs/cli-context/skills/)         |

<br>

### 🗄️ Archive

| Document         | Description                 | Link                                      |
| :--------------- | :-------------------------- | :---------------------------------------- |
| **PRD v6.0**     | Previous PRD version        | [View](docs/archive/old-prds/PRD_v6.0.md) |
| **Legacy Plans** | Archived planning documents | [Browse](docs/archive/legacy-plans/)      |

<br>

---

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines before getting started.

<br>

### 🌟 Ways to Contribute

- 🐛 **Report bugs** and issues
- 💡 **Suggest new features** and improvements
- 📝 **Improve documentation** and translations
- 💻 **Submit pull requests** with fixes or features
- 🌍 **Translate** to more languages (AR/EN already supported)

<br>

### 🔄 Development Workflow

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** from `main` (e.g., `feature/my-feature`)
4. **Make changes** following code conventions
5. **Run tests** and ensure everything passes
6. **Commit** with clear messages
7. **Push** to your fork
8. **Open a Pull Request**

<br>

### 📝 Code Conventions

- **TypeScript** for all code (no JavaScript)
- **Prettier** for formatting (auto-applied on save)
- **ESLint** for linting (errors must pass)
- **Conventional Commits** for commit messages
- **English** for code comments and documentation

<br>

### 🧪 Running Tests

```bash
# Run all tests
pnpm turbo test

# Run tests for specific app
pnpm test --filter=client-dashboard

# Run tests with coverage
pnpm turbo test -- --coverage
```

<br>

### ✅ Before Submitting

```bash
# Run preflight checks
pnpm preflight

# This runs: lint + typecheck + test
```

<br>

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

<br>

---

## 📞 Contact & Support

- **Website:** [gateflow.site](https://gateflow.site)
- **Twitter:** [@gateflow](https://twitter.com/gateflow)
- **Email:** hello@gateflow.site
- **Documentation:** [docs.gateflow.site](https://docs.gateflow.site)

<br>

---

<p align="center">
  <strong>Built with ❤️ for secure physical spaces in the MENA region</strong><br>
  <em>Replacing WhatsApp chaos with Stripe-level infrastructure</em>
</p>

<p align="center">
  <a href="#-table-of-contents">↑ Back to top ↑</a>
</p>
