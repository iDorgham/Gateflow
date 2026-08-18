<h1 align="center">
  <br>
  <b>GateFlow</b>
  <br>
</h1>

<p align="center">
  <img src="assets/Images/gateflow-compound-access-cover-v10.png" alt="A young driver and happy golden-brown dog presenting a mobile access pass at a Red Sea residential compound" width="100%">
</p>

<p align="center">
  <b>Secure arrivals. Connected communities. One access platform.</b><br>
  <i>GateFlow connects residents, visitors, security teams, and property operators across every gate—from invitation to verified entry.</i>
</p>

<p align="center">
  <a href="https://github.com/iDorgham/Gateflow/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/iDorgham/Gateflow/ci.yml?branch=master&label=CI&style=flat-square&color=22c55e" alt="CI status"></a>
  <a href="https://github.com/iDorgham/Gateflow/actions/workflows/codeql-analysis.yml"><img src="https://img.shields.io/github/actions/workflow/status/iDorgham/Gateflow/codeql-analysis.yml?branch=master&label=CodeQL&style=flat-square&color=3b82f6" alt="CodeQL status"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/release-v0.4.0-6366f1?style=flat-square" alt="Release 0.4.0"></a>
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 20 or later">
  <img src="https://img.shields.io/badge/pnpm-8.15-F69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm 8.15">
  <img src="https://img.shields.io/badge/license-proprietary-lightgrey?style=flat-square" alt="Proprietary license">
</p>

<p align="center">
  <a href="#-what-is-gateflow">Product</a> •
  <a href="#-choose-your-path">Choose Your Path</a> •
  <a href="#-application-ecosystem">Applications</a> •
  <a href="#master-architecture">Architecture</a> •
  <a href="#-getting-started">Quick Start</a> •
  <a href="docs/INDEX.md">Documentation</a>
</p>

<br>

<details>
<summary><b>📖 Table of Contents</b></summary>

- [✨ What is GateFlow?](#-what-is-gateflow)
  - [At a glance](#at-a-glance)
  - [What this repository contains](#what-this-repository-contains)
- [🎯 Choose Your Path](#-choose-your-path)
- [📱 Application Ecosystem](#-application-ecosystem)
  - [Property and platform operations](#property-and-platform-operations)
  - [Resident and visitor experience](#resident-and-visitor-experience)
  - [Gate operations and growth](#gate-operations-and-growth)
  - [Product foundation](#product-foundation)
  - [How the applications connect](#how-the-applications-connect)
- [🏛️ Master Architecture](#master-architecture)
- [🛡️ Strategic Core Pillars](#strategic-core-pillars)
- [⚡ Getting Started](#-getting-started)
  - [Quick Start (2 Commands)](#quick-start-2-commands)
  - [Monorepo Dev Server Commands](#monorepo-dev-server-commands)
- [🔒 Security & Compliance](#-security--compliance)
- [🌐 Localization & i18n](#-localization--i18n)
- [🧠 Analytics & Intelligence](#-analytics--intelligence)
- [🤖 Custom Automation Tooling (internally called Ralph)](#-custom-automation-tooling-internally-called-ralph)
- [📊 Performance & Governance](#-performance--governance)
- [🔮 Upcoming Features & Activity](#-upcoming-features--activity)
- [📚 Documentation Index](#-documentation-index)

</details>

---

## ✨ What is GateFlow?

**GateFlow is a multi-tenant access-management platform for gated compounds, residential communities, resorts, and controlled properties.** It replaces phone calls, paper visitor logs, and fragmented access control systems with one unified digital workflow shared by residents, visitors, security guards, and property operators.

> [!IMPORTANT]
>
> ### 💡 Core Competitive Advantage
>
> **The first platform that closes the gap between digital advertising spend and physical gate access — tracking a visitor from ad click all the way to the actual residential gate and recording it as a real conversion.**
>
> By persisting UTM parameters and campaign metadata from initial ad engagement through pass creation to offline physical scanner validation, GateFlow triggers server-side conversion events (via Meta CAPI and GA4) upon physical entry—giving property developers and operators true end-to-end attribution on marketing campaigns.

### At a glance

| Dimension       | Details                                                                              |
| :-------------- | :----------------------------------------------------------------------------------- |
| **Product**     | Multi-tenant physical-access, visitor-management, and growth platform                |
| **Surfaces**    | Six product applications plus an internal design-system application                  |
| **Web Tech**    | Next.js 16, React 19, TypeScript, and Tailwind CSS                                   |
| **Mobile Tech** | Expo SDK 57 and React Native for residents and gate security                         |
| **Data Layer**  | PostgreSQL 16, Prisma ORM, and tenant-scoped domain isolation                        |
| **Security**    | Cryptographically signed QR credentials, RBAC, AES-256 encrypted offline queue       |
| **Markets**     | Built for Middle Eastern & international operations (Arabic & English, full RTL/LTR) |

### What this repository contains

This repository is the GateFlow product monorepo. It houses the complete source code for customer- and operator-facing applications, shared core packages, database schemas, local setup scripts, security primitives, unit/integration test suites, and deployment workflows.

---

## 🎯 Choose Your Path

Whether you are evaluating GateFlow for property operations or building on the platform as a developer, jump directly to the section tailored to your role:

<table width="100%">
<tr>
<td width="50%" valign="top">

### 🏢 Property Managers & Decision Makers

Evaluate GateFlow's operational value, visitor workflows, physical-to-digital ROI, and multi-tenant security control towers.

- 📱 **[Application Ecosystem](#-application-ecosystem)** — Explore dashboards, portals, and mobile apps.
- 🛡️ **[Strategic Core Pillars](#strategic-core-pillars)** — Learn about zero-trust security & marketing attribution.
- 🔒 **[Security & Compliance](#-security--compliance)** — Understand data privacy, audit trails, and RBAC.
- 📈 **[Marketing Suite & Attribution](docs/reference/product/MARKETING_SUITE.md)** — Deep dive into physical ad attribution.
- 📋 **[PRD Specification](docs/reference/product/PRD.md)** — Review full product requirements and feature matrices.

</td>
<td width="50%" valign="top">

### 💻 Developers & Technical Contributors

Explore monorepo architecture, technology stack, zero-trust QR cryptography, local setup, and automation tooling.

- 🏛️ **[Master Architecture](#master-architecture)** — Monorepo structure, apps, and shared packages.
- ⚡ **[Getting Started](#-getting-started)** — Lightweight quick start to launch local servers.
- 📖 **[Full Developer Setup Guide](docs/developer-setup.md)** — Detailed step-by-step environment & DB setup.
- 🤖 **[Automation Tooling Guide](docs/guides/AUTOMATION_GUIDE.md)** — CLI scripts, hooks, and execution workflows.
- 📚 **[Documentation Index](docs/INDEX.md)** — Complete index of technical specifications.

</td>
</tr>
</table>

---

## 📱 Application Ecosystem

GateFlow separates each user role into a dedicated, optimized application while sharing database models, security invariants, authorization rules, and UI design foundations.

### Property and platform operations

| Application                                   | Primary users                             | Responsibility                                                                                                               |
| :-------------------------------------------- | :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **[Client Dashboard](apps/client-dashboard)** | Property managers, supervisors, operators | Operational control tower for properties, units, residents, gates, live scan activity, incidents, watchlists, and reporting. |
| **[Admin Dashboard](apps/admin-dashboard)**   | Platform administrators                   | Global tenant onboarding, organization lifecycle management, subscriptions, cross-tenant analytics, and system health.       |

### Resident and visitor experience

| Application                                 | Primary users                  | Responsibility                                                                                                                 |
| :------------------------------------------ | :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| **[Resident Mobile](apps/resident-mobile)** | Residents using iOS or Android | Native mobile experience for instant guest invitations, recurring passes, quota tracking, and real-time arrival notifications. |
| **[Resident Portal](apps/resident-portal)** | Residents using a web browser  | Web self-service portal for pass management, multi-unit access, pass revocation, and account management.                       |

### Gate operations and growth

| Application                          | Primary users                      | Responsibility                                                                                                                          |
| :----------------------------------- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **[Scanner App](apps/scanner-app)**  | Guards and gate supervisors        | Frontline mobile app for rapid QR scanning, offline signature validation, encrypted scan queues, shift tools, and supervised overrides. |
| **[Marketing Site](apps/marketing)** | Prospective customers and partners | Public bilingual website for product showcases, industry solutions, lead capture, SEO content, and marketing funnels.                   |

### Product foundation

| Workspace                               | Primary users           | Responsibility                                                                                                               |
| :-------------------------------------- | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **[Design System](apps/design-system)** | Designers and engineers | Interactive documentation for Atlassian Design System (ADS) tokens, UI primitives, accessibility rules, and RTL conventions. |
| **[Shared Packages](packages)**         | All applications        | Shared database access, Zod schemas, API clients, UI components, TypeScript types, and localization dictionaries.            |

### How the applications connect

```text
Resident Mobile / Portal
          │ creates and shares a signed pass
          ▼
     Visitor QR credential
          │ presented at the compound gate
          ▼
        Scanner App ────── offline queue & background sync
          │ validates signature & records entry
          ▼
       Client Dashboard ── live operations & real-time analytics
          │
          └────────────── Admin Dashboard for platform governance
```

---

## 🏛️ Master Architecture

GateFlow follows an enterprise monorepo structure managed by **Turborepo** and **pnpm**, delivering strict workspace boundaries and cached incremental builds.

```text
/Gateflow (Monorepo Root)
├── /apps                          # Mission-Critical Applications
│   ├── admin-dashboard            # Platform Admin Operations (Next.js 16)
│   ├── client-dashboard           # B2B Property Manager Control Tower (Next.js 16)
│   ├── marketing                  # Public Landing & Growth Funnels (Next.js 16)
│   ├── resident-mobile            # Native Resident Mobile App (Expo SDK 57)
│   ├── resident-portal            # Web Resident Self-Service (Next.js 16)
│   └── scanner-app               # Offline-First Gate Verification (React Native)
├── /packages                      # Shared Infrastructure Packages
│   ├── db                         # Prisma ORM, PostgreSQL schema & tenant isolation
│   ├── ui                         # Atlassian Design System (ADS) UI library
│   ├── types                      # Universal TypeScript types & Zod schemas
│   ├── i18n                       # Localized AR/EN translation dictionaries
│   ├── api-client                 # Type-safe API client wrappers
│   └── config                    # Shared ESLint, Tailwind, & TSConfig presets
├── /scripts                       # Engineering Automation Scripts (Ralph Tooling)
└── /docs                          # Workspace & Product Documentation
```

---

## 🛡️ Strategic Core Pillars

### 1. Cryptographic Zero-Trust Access

Verification happens exclusively at the edge. Every visitor QR code contains a cryptographically signed HMAC payload. Security guards can scan and validate access passes instantly even during complete cellular or internet outages. All offline scan events are buffered in an AES-256 encrypted local storage queue and synchronized automatically when connectivity resumes.

### 2. Physical-to-Digital Marketing ROI

GateFlow bridges the gap between online advertising campaigns and physical property arrivals:

- **UTM Lifecycle Persistence**: Preserves campaign tracking metadata (`utm_source`, `utm_campaign`, ad IDs) from initial ad click through digital pass generation to physical gate arrival.
- **Server-Side Conversion APIs**: Automatically triggers Meta Conversions API (CAPI) and Google Analytics 4 events when a visitor scans their pass at the physical gate.

### 3. Atlassian Design System (ADS) Foundation

Built on global design tokens for color, typography, spacing, and elevation. Ensures 100% visual and behavioral consistency across Next.js web dashboards and React Native / Expo mobile surfaces.

---

## ⚡ Getting Started

Launch your local development environment in minutes.

### Quick Start (2 Commands)

```bash
# 1. Automated environment setup & database initialization
pnpm setup:dev

# 2. Launch the Client Dashboard (http://localhost:3001)
pnpm dev:client
```

### Monorepo Dev Server Commands

| Target Application      | Command              | Local Address           |
| :---------------------- | :------------------- | :---------------------- |
| **Client Dashboard**    | `pnpm dev:client`    | `http://localhost:3001` |
| **Admin Dashboard**     | `pnpm dev:admin`     | `http://localhost:3002` |
| **Marketing Site**      | `pnpm dev:marketing` | `http://localhost:3000` |
| **Resident Portal**     | `pnpm dev:resident`  | `http://localhost:3004` |
| **Scanner Mobile App**  | `pnpm dev:scanner`   | Expo CLI / Simulator    |
| **Resident Mobile App** | `pnpm dev:mobile`    | Expo CLI / Simulator    |

> [!TIP]
> **Need detailed step-by-step instructions?**
> Read the complete **[Developer Setup & Local Environment Guide](docs/developer-setup.md)** for PostgreSQL configuration, environment variable matrices, database seeding, mobile simulators, and troubleshooting.

---

## 🔒 Security & Compliance

GateFlow adheres to strict security-by-design standards across all applications:

- **HMAC-SHA256 QR Signing**: Every access credential is cryptographically signed and tamper-proof.
- **Fail-Closed Tenant Isolation**: Request-local Prisma context (`AsyncLocalStorage`) automatically scopes queries by `organizationId` and fails closed if context is absent.
- **AES-256 Encryption**: Native encryption applied to sensitive offline scan queues and database credentials.
- **Granular RBAC**: Role-Based Access Control enforced at both API route and UI component levels.
- **Security Headers**: HSTS, CSP, and CORS policies configured across Next.js applications; CMS content sanitized at trust boundaries.

---

## 🌐 Localization & i18n

Engineered specifically for Middle Eastern and global operations:

- **Arabic-First Design**: Native Right-to-Left (RTL) layout support across all web and mobile interfaces.
- **Bi-Directional Typography**: Dynamic font rendering utilizing Cairo for Arabic and Inter for English.
- **Zero-Friction Locale Switching**: Dynamic translation loading with zero layout shift (CLS).

---

## 🧠 Analytics & Intelligence

- **Real-Time Scan Streaming**: Server-Sent Events (SSE) deliver live gate scan logs directly to control panels.
- **GateAI Co-Pilot**: Operational assistant layer for infrastructure management via natural language.
- **High-Density Dashboards**: Integrated Recharts data visualizations for visitor volume, peak hours, and resident CRM metrics.

---

## 🤖 Custom Automation Tooling (internally called Ralph)

GateFlow's engineering lifecycle is accelerated by **custom automation tooling (internally called Ralph / Ralph Loop)**—a set of Node.js/Bash scripts, Husky git hooks, and phase verification tools located in `/scripts` and `.agents/`:

- **Automated Seeding & Emulation**: CLI utilities to seed test data and emulate live gate traffic.
- **Husky Git Hooks**: Enforces pre-commit secret scanning, code formatting, and pre-push verification.
- **Phase Validation Runner**: Automates phased feature implementation with strict lint, test, and documentation checkpoints.
- **Cross-Package Sync**: Keeps TypeScript schemas and localized dictionaries synchronized across all monorepo workspaces.

For details, view the [Automation Tooling Guide](docs/guides/AUTOMATION_GUIDE.md).

---

## 📊 Performance & Governance

- **Lighthouse Strategy**: Targeting consistent 100/100 performance scores across marketing and portal surfaces (tracked in [UPCOMING.md](docs/reference/product/UPCOMING.md)).
- **pnpm Dependency Pinning**: Root `pnpm.overrides` ensures unified transitive dependencies across all workspaces.
- **Automated CI/CD**: GitHub Actions workflows validate builds, linting, and type checking. Web apps deploy to **Vercel**, mobile apps via **Expo EAS** (see [infra/README.md](infra/README.md)).

---

## 🔮 Upcoming Features & Activity

> [!NOTE]
> **Strategic Roadmap Single Source of Truth:**
> For active feature initiatives, sprint plans, shipped features, and strategic goals, visit **[UPCOMING.md — Strategic Roadmap & Initiatives](docs/reference/product/UPCOMING.md)**.

---

## 📚 Documentation Index

| Category           | Reference Document                                                | Purpose                                                  |
| :----------------- | :---------------------------------------------------------------- | :------------------------------------------------------- |
| **Product**        | **[PRD Specification](docs/reference/product/PRD.md)**            | Technical product requirements & feature matrix          |
| **Setup**          | **[Developer Setup Guide](docs/developer-setup.md)**              | Step-by-step local environment & database setup          |
| **Environment**    | **[Environment Variables](docs/guides/ENVIRONMENT_VARIABLES.md)** | Complete environment variable matrix per application     |
| **Attribution**    | **[Marketing Suite](docs/reference/product/MARKETING_SUITE.md)**  | Physical attribution, CAPI integration, & growth funnels |
| **Automation**     | **[Automation Guide](docs/guides/AUTOMATION_GUIDE.md)**           | Ralph Loop automation scripts, hooks, & CLI tooling      |
| **Infrastructure** | **[Infrastructure Guide](infra/README.md)**                       | Vercel, Expo EAS, and deployment workflows               |
| **History**        | **[CHANGELOG](CHANGELOG.md)**                                     | Version history and audit remediation outcomes           |
| **Full Index**     | **[Docs Index](docs/INDEX.md)**                                   | Complete map of all repository documentation             |

---

<p align="center">
  <a href="https://github.com/iDorgham/Gateflow/stargazers"><img src="https://img.shields.io/github/stars/iDorgham/Gateflow?style=flat-square&logo=github&color=0ea5e9" alt="GitHub stars"></a>
  <a href="https://github.com/iDorgham/Gateflow/network/members"><img src="https://img.shields.io/github/forks/iDorgham/Gateflow?style=flat-square&logo=github&color=8b5cf6" alt="GitHub forks"></a>
  <img src="https://img.shields.io/github/languages/top/iDorgham/Gateflow?style=flat-square&color=3178C6" alt="Top language">
  <img src="https://img.shields.io/github/repo-size/iDorgham/Gateflow?style=flat-square&color=0ea5e9" alt="Repository size">
  <img src="https://img.shields.io/badge/Infrastructure-Vercel_+_EAS-000000?style=flat-square&logo=vercel&logoColor=white" alt="Infrastructure">
  <img src="https://img.shields.io/badge/License-Proprietary-lightgrey?style=flat-square" alt="License">
</p>

<div align="center">
  <sub>Accelerated by <b>Custom Automation Tooling</b> (internally called Ralph).</sub><br>
  <sub>&copy; 2026 GateFlow. All rights reserved.</sub>
</div>
