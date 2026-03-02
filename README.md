<p align="center">
  <img src="./docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow</h1>

<p align="center">
  <strong>The Zero-Trust Digital Gate Infrastructure Platform</strong><br>
  <em>Secure, Auditable, and Marketing-First Access Control for the MENA Region.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-98%25%20MVP-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Security-Strict-blue" alt="Security">
  <img src="https://img.shields.io/badge/Architecture-Monorepo-orange" alt="Architecture">
  <img src="https://img.shields.io/badge/Tech-Next.js%20%7C%20Expo-blue" alt="Tech Stack">
</p>

---

## 🌟 Vision & Purpose

GateFlow is a next-generation infrastructure platform designed to replace paper guest books and screenshot QR chaos. Built for **Gated Compounds, Real Estate Developers, Schools, Marinas, and High-End Venues**, GateFlow turns physical access points into secure, trackable, and marketing-enabled nodes.

### 🚀 Key Value Propositions
- **Zero-Trust Security**: Every scan is cryptographically signed (HMAC-SHA256) and verified in real-time or offline.
- **Marketing-First Strategy**: "QR as a Link" delivery allows for visitor profiling, UTM tracking, and retargeting (Meta Pixel/GA4).
- **Omni-Channel Delivery**: Instant QR delivery via WhatsApp, Email, or SMS.
- **Offline-First Resilience**: Mobile scanners work without internet, syncing encrypted queues once connectivity is restored.

---

## 📱 The 6-App Ecosystem

GateFlow is a unified monorepo managed by **Turborepo** and **pnpm**, consisting of 6 specialized applications:

| App | Purpose | Main Tech |
| :--- | :--- | :--- |
| **Client Dashboard** | Main SaaS portal for property owners | Next.js 14, Recharts |
| **Admin Dashboard** | Super-admin management and system health | Next.js 14 |
| **Scanner App** | Native mobile app for gate operators | Expo SDK 54 |
| **Marketing Site** | Public-facing lead gen and pricing | Next.js 14 |
| **Resident Portal** | Self-service guest management (Web) | Next.js 14 |
| **Resident Mobile** | Resident app for native notifications | Expo |

---

## 🛠️ Technical Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React Native (Expo)
- **State & UI**: Tailwind CSS, shadcn/ui components
- **Backend & Database**: Prisma (PostgreSQL), jose (JWT), Argon2id
- **Operations**: Upstash Redis (Rate Limiting), Turborepo, pnpm

### Shared Packages
- `@gate-access/db`: Prisma schema and database client.
- `@gate-access/ui`: Premium, reusable UI component library.
- `@gate-access/i18n`: Comprehensive Arabic & English localization.
- `@gate-access/api-client`: Unified fetch utilities for all applications.

---

## 📖 Global Documentation Center

Our documentation is structured into a phase-oriented hierarchy for maximum clarity.

> [!TIP]
> **Start here:** [Documentation Hub](./docs/README.md)

- [**Progress Dashboard**](./docs/plan/overview/PROJECT_PROGRESS_DASHBOARD.md) — 98% MVP completion status.
- [**Phase 1 (MVP) Specs**](./docs/plan/phase-1-mvp/specs/PRD_v5.0.md) — Core product logic.
- [**Phase 2 (Resident Portal)**](./docs/plan/phase-2-resident-portal/specs/RESIDENT_PORTAL_SPEC.md) — Self-service requirements.
- [**Marketing Vision**](./docs/plan/phase-3-marketing-ai/specs/PRD_WHATSAPP_MARKETING_EDITION.md) — Omni-channel delivery spec.
- [**Security & Operations**](./docs/plan/operations/SECURITY_OVERVIEW.md) — Encryption and audit protocols.

---

## 🚦 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+

### Setup
```bash
# Clone the repository
git clone https://github.com/iDorgham/Gate-Access.git

# Install dependencies
pnpm install

# Start all applications in development mode
pnpm turbo dev
```

**One Man workflow:** In Cursor, use **`/man`** for the One Man workflow — task manager, domains (Code, Brand, SaaS, Marketing, Business, Content, Copywrite), and subcommands to finish tasks faster and easier. Use `/man mindset` to change profile.

### Development Ports
- **Marketing**: 3000
- **Client Dashboard**: 3001
- **Admin Dashboard**: 3002
- **Scanner App**: 8081

---

<p align="center">
  Built with ❤️ for secure physical spaces.
</p>
