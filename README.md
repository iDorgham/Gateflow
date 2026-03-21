<div align="center">
  <img src="./docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
  
  <br />
  <br />

  <h1>GateFlow</h1>
  <p>
    <strong>Modern Digital Gate Infrastructure & Access Control</strong>
  </p>
  <p>
    <em>Secure, Auditable, and Marketing-First Access Control for the MENA Region</em>
  </p>

  <p>
    <a href="https://gateflow.com"><img src="https://img.shields.io/badge/Status-1.0.0--Production-brightgreen?style=flat-square" alt="Status"></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Stack-Next.js14--Expo54-blue?style=flat-square" alt="Stack"></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/ORM-Prisma_5-2D3748?style=flat-square&logo=prisma" alt="Prisma"></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/UI-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"></a>
    <a href="https://gateflow.com"><img src="https://img.shields.io/badge/Security-Strict_HMAC--SHA256-red?style=flat-square" alt="Security"></a>
  </p>
</div>

<hr />

## 📋 Table of Contents

- [✨ What is GateFlow?](#-what-is-gateflow)
- [📱 The 6-App Ecosystem](#-the-6-app-ecosystem)
- [🚀 Key Features](#-key-features)
- [💻 Tech Stack](#-tech-stack)
- [🏗️ Architecture & Structure](#-architecture--structure)
- [🔐 Security Architecture](#-security-architecture)
- [🛠️ Quick Start & Installation](#-quick-start--installation)
- [📖 Documentation Index](#-documentation-index)
- [🤝 Contributing](#-contributing)

---

## ✨ What is GateFlow?

**GateFlow** is a **next-generation digital gate infrastructure platform** engineered specifically for **gated communities, educational campuses, real estate developments, marinas, and high-end events** across the MENA region.

Unlike legacy access control systems, GateFlow transforms physical access points into **secure, trackable, and marketing-enabled digital nodes**. 

> **Vision:** To become the *Stripe-level infrastructure* for physical access — providing uncompromising entry control, live intelligence, real-time analytics, and enterprise-grade security integrations seamlessly out of the box.

<br>

## 📱 The 6-App Ecosystem

GateFlow operates not as a single application, but as a meticulously orchestrated ecosystem consisting of **6 interconnected applications** running from a unified Turborepo monorepo:

| App | Platform | Tech | Description | Role / Primary User |
| :--- | :--- | :--- | :--- | :--- |
| **Client Dashboard** | Web | Next.js 14 | The primary SaaS portal offering deep analytics, QR management, and marketing pixels. | Property Managers, Marketing Teams |
| **Admin Dashboard** | Web | Next.js 14 | The central nervous system for platform health, billing cycles, super-admin privileges. | GateFlow Internal Super-Admins |
| **Resident Portal** | Web | Next.js 14 | Responsive web-based self-service for property residents and unit holders. | VIP Guests, Desktop Residents |
| **Marketing Site** | Web | Next.js 14 | Public-facing conversion funnels, industry-specific solutions, and lead generation. | Public Prospects |
| **Scanner App** | Native | Expo 54 | Offline-capable, high-contrast QR scanner with AES-256 local queueing and haptic feedback. | Gate Security Operators / Guards |
| **Resident Mobile** | Native | Expo 54 | Consumer-grade mobile app featuring AI concierges, native contact-picker sharing, and push alerts. | Everyday Residents / Unit Owners |

<br>

---

## 🚀 Key Features

### 🏗️ Core Access Management
- 🔲 **Intelligent QR Logic:** Support for Single-Use (timestamp constrained), Recurring (shift-based/maid service), Permanent (staff/VIP), and Shareable Open QR links.
- 🏢 **Multi-Project & Multi-Tenant:** Deep architectural isolation organizing access by compound, sub-community, event, or specific building.
- 👥 **Granular RBAC:** Deep Role-Based Access Control allowing highly specific permissions per tenant.
- 🤝 **Resident Autonomy:** Empowers unit-linked guests to manage their own visitor quotas without contacting management.

### 📈 Marketing & Intelligence
- **Live Scan Feeds:** Instant SSE (Server-Sent Events) feeds broadcasting live arrivals across dashboards.
- **UTM Attribution:** Invisible capture of digital source tracking parameters upon visitor registration.
- **Retargeting Pixels:** Injectable Meta/Google pixels mapped to guest landing pages for powerful retargeting.
- **CRM Integrations:** Real-time webhooks pushing lead/visit sync directly to HubSpot or Salesforce.

### 🛡️ Uncompromising Security
- 🔒 **Cryptographic Enforcement:** QR codes are structurally generated and verified via mathematical `HMAC-SHA256` signatures preventing absolute forgery.
- 🔐 **Secure Auth Ecosystem:** Leverages Argon2id hashing algorithms with heavily rotated JWT session tracking.
- 🏷️ **Dynamic Watchlists:** Capable of instant entity blocking with automated incident creation for restricted individuals.
- 🆔 **Tiered Identity Verification:** Optional tiered verification ranging from basic metadata up to mandatory photographic or ID Document capture on site.

---

## 💻 Tech Stack

Our foundation prioritizes type-safety, absolute performance, and massive scalability.

| Domain | Technology | Details / Version |
| :--- | :--- | :--- |
| **Web Frontend** | Next.js 14 (App Router) | React Server Components, Server Actions (`14.2.x`) |
| **Mobile Apps** | React Native | Expo SDK `54.x`, Expo Router |
| **Database** | PostgreSQL | Relational integrity & jsonb scalability (`15+`) |
| **ORM** | Prisma | Strongly typed database client (`5.x`) |
| **Styling** | Tailwind CSS / Shadcn UI | Utility-first css with Atlassian Design System tokens (`3.4.x`) |
| **Security** | Argon2id + HMAC-SHA256 | Next-generation cryptography |
| **Build System** | Turborepo + pnpm | Blazing fast monorepo orchestration (`2.x`) |

---

## 🏗️ Architecture & Structure

GateFlow utilizes an enterprise-grade Monorepo architecture to maximize code sharing and strictly enforce type-safety boundaries between micro-applications.

```bash
GateFlow/
├── apps/
│   ├── admin-dashboard/       # Super-admin operations and infrastructure health
│   ├── client-dashboard/      # B2B Property Manager portal
│   ├── marketing/             # GateFlow public landing page & SEO
│   ├── resident-mobile/       # Native Resident application (Expo)
│   ├── resident-portal/       # Web-based Resident portal
│   └── scanner-app/           # Native Security Guard application (Expo)
├── packages/
│   ├── db/                    # Prisma DB schema, clients, raw queries, migrations
│   ├── ui/                    # Shared shadcn components & Tailwind setups
│   ├── types/                 # Universal TypeScript definitions & Zod schemas
│   └── tsconfig/              # Shared Typescript Configurations
├── docs/                      # Global comprehensive documentation
├── package.json               # Root workspace manifest
└── turbo.json                 # Turborepo pipeline configuration
```

---

## 🛠️ Quick Start & Installation

### 📋 Prerequisites
Ensure your local development environment meets the following requirements:
- **Node.js** v20.x or higher (LTS recommended)
- **pnpm** v8.x or higher (`npm install -g pnpm`)
- **PostgreSQL** v15.x or higher running locally or via Docker

### 📥 Initial Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iDorgham/Gateflow.git
   cd Gateflow
   ```

2. **Install all workspace dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure the Environment:**
   Duplicate the example environment file into the root and specific sub-apps:
   ```bash
   cp .env.example .env
   # Ensure DATABASE_URL andNEXTAUTH_SECRET are populated
   ```

4. **Initialize the Database:**
   Generate the Prisma client, migrate the schema, and seed test data.
   ```bash
   cd packages/db
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Spin up the Development Server:**
   Launch the entire orchestrated 6-app ecosystem locally:
   ```bash
   pnpm turbo dev
   ```

Your applications will map to local ports (e.g., `3000` for client-dashboard, `3001` for admin-dashboard).

---

## 📖 Documentation Index

For deeper architectural concepts, product specifications, and operational manuals, please refer to our internal document structures:

| Subject | Documentation Link | Description |
| :--- | :--- | :--- |
| **Product Overview** | [**Master PRD**](./docs/product/PRD.md) | Absolute source of truth for scope, features, and capabilities. |
| **Application Ecosystem** | [**Architecture Overview**](./docs/arch/ARCHITECTURE.md) | Deep dive into SSR fetching, Monorepo layout, and db integrations. |
| **Operations** | [**Deployment Guide**](./docs/deployment/README.md) | CI/CD parameters, Vercel build configs, and Expo submission workflows. |
| **Security Protocols** | [**Security Spec**](./docs/guides/SECURITY_OVERVIEW.md) | Detailed crypto math (HMAC-SHA256) and RBAC execution patterns. |

---

<br>

<div align="center">
  <p><b>Built with precision for the modern MENA gate.</b></p>
  <p>© 2026 GateFlow. All rights reserved.</p>
</div>
