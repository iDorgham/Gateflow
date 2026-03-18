<p align="center">
  <img src="./docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow</h1>

<p align="center">
  <strong>Zero-Trust Digital Gate Infrastructure Platform</strong><br>
  <em>Secure, Auditable, and Marketing-First Access Control for the MENA Region</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-1.0.0--Production-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Stack-Next.js14--Expo54-blue" alt="Stack">
  <img src="https://img.shields.io/badge/Security-Strict-blue" alt="Security">
</p>

---

## 📋 Table of Contents

- [✨ What is GateFlow?](#-what-is-gateflow)
- [🎯 Who is it for?](#-who-is-it-for)
- [🚀 Key Features](#-key-features)
- [💻 Tech Stack](#-tech-stack)
- [🏗️ Architecture](#-architecture)
- [📱 The 6-App Ecosystem](#-the-6-app-ecosystem)
- [🔐 Security Architecture](#-security-architecture)
- [🛠️ Quick Start](#-quick-start)
- [📖 Documentation Index](#-documentation-index)

---

## ✨ What is GateFlow?

**GateFlow** is a **next-generation digital gate infrastructure platform** designed specifically for **gated compounds, real estate developers, schools, clubs, marinas, and high-end venues** across the MENA region.

GateFlow transforms physical access points into **secure, trackable, and marketing-enabled digital nodes**.

> **Vision:** Stripe-level infrastructure for physical access — controlled entry + live intelligence + enterprise-grade security & integrations.

<br>

### 📱 The Six Apps Strategy

GateFlow consists of **6 interconnected applications** working as one:

| App | Mode | Description | Status |
| :--- | :--- | :--- | :--- |
| **Client Dashboard** | Web | Main SaaS portal for property owners | ✅ 1.0.0 |
| **Scanner App** | Native | Offline-capable QR scanner for guards | ✅ 1.0.0 |
| **Resident Mobile** | Native | Resident self-service (iOS/Android) | ✅ 1.0.0 |
| **Admin Dashboard** | Web | Super-admin management for platform | ✅ 1.0.0 |
| **Resident Portal** | Web | Resident self-service (Web/Browser) | ✅ 1.0.0 |
| **Marketing Site** | Web | Public-facing conversion & blog | ✅ 1.0.0 |

<br>

---

## 🚀 Key Features

### 🏗️ Core Platform
- 🔲 **QR Code System** — Single, recurring, permanent, and visitor-created passes.
- 🏢 **Multi-Project Support** — Organize access by compound, event, or building.
- 👥 **Team & RBAC** — Granular role-based access control for every organization.
- 📊 **Real-Time Analytics** — Live scan feed (SSE) and deep-dive reporting.
- 🤝 **Resident Autonomy** — Unit-linked guest management with quota tracking.

### 🛡️ Security Operations
- 🔒 **HMAC-SHA256 QR Signing** — Cryptographically signed signatures prevent forgery.
- 🔐 **Zero-Trust Auth** — Argon2id password hashing and JWT sessions.
- 🏷️ **Watchlists** — Instant blocking and incident creation for restricted entities.
- ids **Identity Verification** — 3-level verification from basic info to ID capture.
- 📍 **Shift Tracking** — Accountability for gate operators and supervisors.

---

## 💻 Tech Stack

| Component | Technology | Version |
| :--- | :--- | :--- |
| **Web Frontend** | Next.js 14 (App Router) | 14.2.x |
| **Mobile Apps** | React Native (Expo SDK 54) | 54.x |
| **Database** | PostgreSQL | 15+ |
| **ORM** | Prisma | 5.x |
| **Styling** | Tailwind CSS | 3.4.x |
| **Security** | Argon2id + HMAC-SHA256 | Latest |
| **Build System** | Turborepo + pnpm | 2.x |

---

## 🏗️ Architecture

### 📁 Structure
```
GateFlow/
├── apps/               # The 6 core interactive apps: Next.js + Expo
├── packages/           # Shared logic: db, types, ui, i18n, api-client
├── docs/               # Technical and product documentation
└── turbo.json          # Monorepo build orchestration
```

---

## 🛠️ Quick Start

### 📋 Prerequisites
- **Node.js** 20+ (LTS recommended)
- **pnpm** 8+ (`npm install -g pnpm`)
- **PostgreSQL** 15+

### 📥 Installation
```bash
# Clone the repo
git clone https://github.com/iDorgham/Gateflow.git && cd Gateflow

# Install everything
pnpm install

# Setup database (in packages/db)
npx prisma migrate dev && npx prisma db seed

# Run local development
pnpm turbo dev
```

---

## 📖 Documentation Index

| Repo Location | Description |
| :--- | :--- |
| [**Docs Home**](docs/README.md) | Entry point for all technical and product documentation. |
| [**Product PRD**](docs/product/PRD_v1.0_FINAL.md) | The definitive scope and requirements for GateFlow v1.0. |
| [**Architecture**](docs/arch/README.md) | System design, database schema, and security flow. |
| [**Deployment**](docs/deployment/README.md) | Guides for Vercel, Expo, and CI/CD pipelines. |
| [**Security**](docs/guides/SECURITY_OVERVIEW.md) | Deep dive into HMAC signing, encryption, and RBAC. |

<br>

<p align="center">
  © 2026 GateFlow. Built for the modern MENA gate.
</p>
