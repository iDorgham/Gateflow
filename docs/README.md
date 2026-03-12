<p align="center">
  <img src="./docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow</h1>

<p align="center">
  <strong>Zero-Trust Digital Gate Infrastructure Platform</strong><br>
  <em>Secure, Auditable, and Marketing-First Access Control for the MENA Region</em>
</p>

<p align="center">
  <a href="https://github.com/iDorgham/Gate-Access/stargazers">
    <img src="https://img.shields.io/github/stars/iDorgham/Gate-Access?style=social" alt="Stars">
  </a>
  <a href="https://github.com/iDorgham/Gate-Access/network/members">
    <img src="https://img.shields.io/github/forks/iDorgham/Gate-Access?style=social" alt="Forks">
  </a>
  <img src="https://img.shields.io/badge/Status-95%25%20MVP-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Security-Strict-blue" alt="Security">
  <a href="https://twitter.com/intent/tweet?text=Check+out+GateFlow+-+Zero-Trust+Digital+Gate+Infrastructure+Platform&url=https%3A%2F%2Fgithub.com%2FiDorgham%2FGate-Access">
    <img src="https://img.shields.io/badge/Tweet-Share-blue" alt="Tweet">
  </a>
</p>

---

## 📋 Table of Contents

- [✨ What is GateFlow?](#-what-is-gateflow)
- [🎯 Who is it for?](#-who-is-it-for)
- [⚠️ What Problem Does It Fix?](#️-what-problem-does-it-fix)
- [🚀 Key Features](#-key-features)
- [💻 Tech Stack](#-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [📱 The 6-App Ecosystem](#-the-6-app-ecosystem)
- [🔐 Security](#-security)
- [🛠️ Quick Start](#️-quick-start)
- [📖 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ What is GateFlow?

GateFlow is a **next-generation digital gate infrastructure platform** designed to replace outdated paper guest books and chaotic WhatsApp QR sharing. Built specifically for **gated compounds, real estate developers, schools, clubs, marathons, and high-end venues** across the MENA region, GateFlow transforms physical access points into secure, trackable, and marketing-enabled digital nodes.

> **Vision:** Stripe-level infrastructure for physical access — controlled entry + live intelligence + enterprise-grade security.

---

## 🎯 Who is it for?

| Persona | Description |
| ------- | ----------- |
| **Property Managers** | Compound managers who need secure, auditable visitor access |
| **Event Organizers** | Wedding planners, corporate event managers who need reliable gate control |
| **Security Heads** | Supervisors who need live visibility and operator accountability |
| **Gate Operators** | Security guards who need fast, reliable scanning with offline support |
| **Residents** | Unit owners who want self-service guest management |
| **Real Estate Developers** | Marketing teams who need attribution between digital ads and physical visits |
| **Developers** | IT teams who need REST API and webhook integrations |

### Target Industries

- 🏠 **Gated Compounds & Residential Communities**
- 🏢 **Real Estate Developers**
- 🏫 **Private Schools & Universities**
- 🏖️ **Beach Clubs & Marinas**
- 💒 **Wedding Venues & Event Spaces**
- 🌙 **Nightclubs & Entertainment**
- 🚀 **Corporate Events & Conferences**

---

## ⚠️ What Problem Does It Fix?

### Before GateFlow

| Pain Point | Consequence |
| ---------- |-------------|
| **Paper guest books** | Lost records, illegible handwriting, no searchability |
| **WhatsApp QR chaos** | Screenshots, expired codes, no verification |
| **No real-time visibility** | Security breaches go unnoticed |
| **Manual tracking** | Time-consuming, error-prone |
| **No audit trail** | Disputes cannot be resolved |
| **Weak team separation** | No role-based access control |
| **No marketing attribution** | Cannot track visitor sources |
| **No offline capability** | Internet down = gates stop working |

### After GateFlow

✅ **Cryptographically signed QR codes** — Every scan is verified and immutable  
✅ **Offline-first mobile scanners** — Works without internet, syncs when connected  
✅ **Real-time dashboard** — Live visibility into every gate  
✅ **Complete audit trail** — Full history for disputes and compliance  
✅ **Role-based access** — Granular permissions for every team member  
✅ **Marketing-first** — UTM tracking, Meta Pixel, CRM webhooks  
✅ **Resident self-service** — Guests create their own passes  

---

## 🚀 Key Features

### Core Platform

- 🔲 **QR Code System** — Single, recurring, permanent, and visitor-created passes
- 📱 **Mobile Scanner App** — Offline-capable with AES-256 encrypted sync queue
- 🚪 **Gate Management** — Multiple gates per property with assignments
- 👥 **Team & RBAC** — Built-in roles + custom permission-based roles
- 📊 **Analytics Dashboard** — Real-time metrics and exportable reports
- 🔌 **Webhooks & API** — Full REST API with scoped API keys
- 🏢 **Multi-Project Support** — Organize by compound, event, or campaign
- 👤 **Contacts (CRM)** — Full visitor relationship management
- 🏠 **Units & Residents** — Unit-based resident system with quota tracking

### Security

- 🛡️ **Zero-Trust Architecture** — Every request verified
- 🔐 **HMAC-SHA256 QR Signing** — Cryptographically secure codes
- 🔑 **JWT + Argon2id** — Enterprise-grade authentication
- 🏷️ **Watchlists** — Person and vehicle blocking
- 📋 **Incident Tracking** — Full workflow for security events
- 🆔 **Identity Verification** — 3-level identity capture (0/1/2)
- ⏱️ **Supervisor Override** — PIN-based bypass with audit trail
- 🔒 **Field Encryption** — AES-256 for sensitive data

### Marketing-First

- 📈 **UTM Attribution** — Track visitor sources
- 📱 **Meta Pixel & GA4** — Retarget visitors
- 🔗 **CRM Webhooks** — Sync with your tools
- 📤 **Export & Reports** — CSV/PDF for analysis

### Real-Time

- ⚡ **Server-Sent Events (SSE)** — Live dashboard updates
- 🔔 **Push Notifications** — Instant alerts to residents
- 📡 **Event Streaming** — Org-scoped real-time events

---

## 💻 Tech Stack

| Category | Technology |
|----------|------------|
| **Web Frontend** | Next.js 14 (App Router) |
| **Mobile (Scanner)** | Expo SDK 54 / React Native |
| **Mobile (Resident)** | Expo SDK 54 / React Native |
| **Database** | PostgreSQL 15+ |
| **ORM** | Prisma 5 |
| **Authentication** | JWT (jose) + Argon2id |
| **Package Manager** | pnpm 8+ |
| **Build System** | Turborepo 2 |
| **UI Components** | Custom (shadcn/ui-style) + Tailwind CSS |
| **QR Signing** | HMAC-SHA256 (crypto-js) |
| **Offline Storage** | AES-256 + PBKDF2 |
| **Rate Limiting** | Upstash Redis |
| **Real-Time** | Server-Sent Events (SSE) |
| **Push Notifications** | Expo Push |
| **Testing** | Jest + ts-jest |
| **i18n** | Arabic (RTL) + English |

### Shared Packages

- [`@gate-access/db`](packages/db) — Prisma schema & database client
- [`@gate-access/types`](packages/types) — Shared TypeScript types
- [`@gate-access/ui`](packages/ui) — Reusable UI component library
- [`@gate-access/api-client`](packages/api-client) — Fetch utilities
- [`@gate-access/i18n`](packages/i18n) — Arabic/English translations

---

## 🏗️ Architecture

```
Gate-Access/
├── apps/
│   ├── admin-dashboard/      # Super admin panel — Next.js 14, port 3002
│   ├── client-dashboard/    # Main SaaS portal — Next.js 14, port 3001
│   ├── scanner-app/         # Mobile QR scanner — Expo SDK 54, port 8081
│   ├── marketing/           # Public marketing site — Next.js 14, port 3000
│   ├── resident-portal/     # Resident self-service — Next.js 14, port 3003
│   └── resident-mobile/     # Resident mobile app — Expo SDK 54
├── packages/
│   ├── db/                   # Prisma schema, client, migrations
│   ├── types/                # Shared TypeScript types
│   ├── ui/                   # UI component library (shadcn-style)
│   ├── api-client/          # Shared fetch utilities
│   ├── i18n/                # Arabic/English internationalization
│   └── config/              # Shared ESLint/TS/Tailwind configs
├── docs/                     # Documentation
└── turbo.json               # Turborepo pipeline config
```

---

## 📱 The 6-App Ecosystem

| # | App | Purpose | Users | Status |
|---|-----|---------|-------|--------|
| 1 | **Client Dashboard** | Main SaaS portal for property management | Admins, managers | ✅ 95% |
| 2 | **Admin Dashboard** | Super-admin platform management | Platform operators | ✅ 95% |
| 3 | **Scanner App** | Gate scanning with offline support | Security/operators | ✅ 100% |
| 4 | **Marketing Site** | Public-facing lead generation | Prospects | ✅ 90% |
| 5 | **Resident Portal** | Self-service guest management | Unit owners/renters | ✅ 95% |
| 6 | **Resident Mobile** | Native mobile app for residents | Unit owners/renters | 🔄 60% |

---

## 🔐 Security

GateFlow follows **zero-trust** security principles:

- ✅ **Multi-tenant isolation** — Every query scoped by `organizationId`
- ✅ **Soft deletes** — No hard deletes, full audit trail
- ✅ **Short-lived tokens** — 15-minute access tokens with rotation
- ✅ **Secure storage** — Cookies (web) / SecureStore (mobile)
- ✅ **QR signing** — HMAC-SHA256, never unsigned codes
- ✅ **Offline crypto** — AES-256 + PBKDF2 encrypted sync
- ✅ **Rate limiting** — Upstash Redis, multi-instance safe
- ✅ **CSRF protection** — Double-submit cookie pattern

---

## 🛠️ Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+

### Installation

```bash
# Clone the repository
git clone https://github.com/iDorgham/Gate-Access.git
cd Gate-Access

# Install dependencies
pnpm install

# Setup database
cd packages/db
cp .env.example .env
# Edit .env with your DATABASE_URL
npx prisma migrate dev
npx prisma db seed

# Start all applications
cd ../..
pnpm turbo dev
```

### Development Ports

| App | Port | Command |
|-----|------|---------|
| Marketing Site | 3000 | `pnpm turbo dev --filter=marketing` |
| Client Dashboard | 3001 | `pnpm turbo dev --filter=client-dashboard` |
| Admin Dashboard | 3002 | `pnpm turbo dev --filter=admin-dashboard` |
| Resident Portal | 3003 | `pnpm turbo dev --filter=resident-portal` |
| Scanner App | 8081 | `cd apps/scanner-app && npx expo start` |

### Common Commands

```bash
# Install dependencies
pnpm install

# Start all apps
pnpm turbo dev

# Build all apps
pnpm turbo build

# Run linter
pnpm turbo lint

# Run tests
pnpm turbo test

# Type-check
pnpm turbo typecheck
```

---

## 📖 Documentation

> **Start here:** [Documentation Hub](./docs/README.md)

| Document | Description |
|----------|-------------|
| [PRD v7.0](./docs/PRD_v7.0.md) | Complete product requirements |
| [Project Progress](./docs/PROJECT_PROGRESS_DASHBOARD.md) | MVP completion status |
| [Development Guide](./docs/DEVELOPMENT_GUIDE.md) | Local setup and workspace |
| [Security Overview](./docs/SECURITY_OVERVIEW.md) | Security architecture |
| [API Reference](./docs/PRD_v7.0.md#11-api-reference) | REST API documentation |

---

## 🤝 Contributing

We welcome contributions! Please read our [contributing guidelines](./CONTRIBUTING.md) before getting started.

### Ways to Contribute

- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 💻 Submit pull requests
- 🌍 Translate to more languages

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<p align="center">
  <strong>Built with ❤️ for secure physical spaces in the MENA region</strong><br>
  <a href="https://gateflow.io">Website</a> • 
  <a href="https://twitter.com/gateflow">Twitter</a> • 
  <a href="mailto:hello@gateflow.io">Contact</a>
</p>
