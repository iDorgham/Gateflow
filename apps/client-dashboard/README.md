<p align="center">
  <img src="../../docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow Client Dashboard</h1>

<p align="center">
  <strong>Main SaaS Portal for Property Management</strong><br>
  <em>Complete access control management for properties, gates, visitors, and teams</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-95%25-green" alt="Status">
  <img src="https://img.shields.io/badge/Framework-Next.js%2014-blue" alt="Framework">
  <img src="https://img.shields.io/badge/Auth-JWT%20%2B%20Argon2id-blue" alt="Auth">
</p>

---

## 📋 Overview

The **GateFlow Client Dashboard** is the primary SaaS portal for property managers, security heads, and administrators to manage access control across their properties. It provides a comprehensive interface for QR code management, gate operations, team management, analytics, and integrations.

### Purpose

- 🏢 **Property Management** — Manage organizations, projects, and units
- 🔲 **QR Code Management** — Create, validate, and track visitor passes
- 🚪 **Gate Operations** — Configure and monitor access points
- 👥 **Team Management** — RBAC with built-in and custom roles
- 📊 **Analytics** — Real-time metrics and reporting
- 🔌 **Integrations** — Webhooks, API keys, and external systems

---

## ✨ Features

### Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Organization Management** | Multi-tenant organization setup | ✅ Complete |
| **QR Code Management** | Single, bulk CSV, and recurring passes | ✅ Complete |
| **Gate Management** | CRUD for physical access points | ✅ Complete |
| **Team & RBAC** | Built-in roles + custom permissions | ✅ Complete |
| **Projects** | Multi-project organization | ✅ Complete |
| **Contacts (CRM)** | Visitor relationship management | ✅ Complete |
| **Units** | Residential unit management | ✅ Complete |
| **Watchlists** | Security blocklist | ✅ Complete |
| **Incidents** | Security incident tracking | ✅ Complete |
| **Analytics Dashboard** | Real-time metrics & charts | ✅ Complete |
| **Webhooks** | Event notifications | ✅ Complete |
| **API Keys** | Programmatic access | ✅ Complete |
| **Real-time Updates** | SSE-powered live updates | ✅ Complete |
| **Privacy Controls** | Data retention policies | ✅ Complete |
| **Supervisor Override** | PIN-based bypass | ✅ Complete |

### Security Features

- 🔐 **JWT Authentication** — Short-lived tokens with refresh
- 🔑 **Argon2id Password Hashing** — Enterprise-grade security
- 🛡️ **CSRF Protection** — Double-submit cookie pattern
- ⏱️ **Rate Limiting** — Redis-backed, multi-instance safe
- 🔒 **Field Encryption** — AES-256 for sensitive data
- 📋 **Audit Logs** — Full action trail
- 🏷️ **Role-Based Access** — Granular permissions

---

## 💻 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | PostgreSQL via Prisma |
| **Auth** | JWT (jose) + Argon2id |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **State** | TanStack Query |
| **i18n** | i18next |

### Key Dependencies

```json
{
  "next": "^14.2.35",
  "@gate-access/db": "^0.1.0",
  "@gate-access/ui": "workspace:^",
  "@gate-access/i18n": "workspace:^",
  "argon2": "^0.44.0",
  "jose": "4.15.9",
  "recharts": "^2.15.4",
  "@tanstack/react-query": "^5.90.21"
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+

### Installation

```bash
# From monorepo root
pnpm install

# Setup database
cd packages/db
cp .env.example .env
# Configure DATABASE_URL
npx prisma migrate dev
npx prisma db seed

# Start development
pnpm turbo dev --filter=client-dashboard
```

### Development Server

```bash
# Navigate to app directory
cd apps/client-dashboard

# Run development server
pnpm dev

# Run tests
pnpm test

# Type-check
pnpm typecheck
```

### Default Port

```
http://localhost:3001
```

---

## 📁 Project Structure

```
apps/client-dashboard/
├── app/
│   ├── api/                   # API routes
│   │   ├── auth/             # Authentication
│   │   ├── qrcodes/          # QR code CRUD
│   │   ├── scans/             # Scan operations
│   │   ├── gates/            # Gate management
│   │   ├── projects/         # Project CRUD
│   │   ├── contacts/         # CRM
│   │   ├── units/            # Unit management
│   │   ├── webhooks/         # Webhook config
│   │   ├── api-keys/         # API key management
│   │   └── events/           # SSE endpoint
│   ├── dashboard/            # Protected routes
│   │   ├── qrcodes/          # QR management UI
│   │   ├── scans/            # Scan history UI
│   │   ├── gates/            # Gate management UI
│   │   ├── projects/          # Projects UI
│   │   ├── team/             # Team/RBAC UI
│   │   ├── analytics/        # Analytics UI
│   │   └── workspace/        # Settings UI
│   ├── login/                # Login page
│   └── s/[shortId]/         # Short link redirect
├── lib/
│   ├── auth.ts               # JWT utilities
│   ├── auth-cookies.ts       # Cookie management
│   ├── dashboard-auth.ts     # Route guards
│   ├── rate-limit.ts         # Rate limiting
│   ├── encryption.ts         # Field encryption
│   └── utils.ts              # General utilities
├── components/               # React components
└── prisma/                   # Schema (if local)
```

---

## 🔐 Authentication

### JWT Token Flow

1. **Login** → Access token (15 min) + Refresh token (30 days)
2. **Access Expiry** → Use refresh token
3. **Refresh** → New access + New refresh (rotation)
4. **Logout** → Revoke refresh token

### RBAC Roles

| Role | Access Level |
|------|--------------|
| `TENANT_ADMIN` | Full access |
| `TENANT_USER` | Limited access |
| `SECURITY_MANAGER` | Security operations |
| `GATE_OPERATOR` | Scanner-only access |

---

## 📡 API Endpoints

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/refresh` | POST | Token refresh |
| `/api/auth/logout` | POST | User logout |
| `/api/qrcodes` | GET/POST | QR CRUD |
| `/api/qrcodes/bulk` | POST | Bulk CSV create |
| `/api/qrcodes/validate` | POST | Server validation |
| `/api/scans` | GET | Scan history |
| `/api/gates` | GET/POST | Gate CRUD |
| `/api/projects` | GET/POST | Project CRUD |
| `/api/contacts` | GET/POST | Contact CRM |
| `/api/units` | GET/POST | Unit management |
| `/api/analytics/*` | GET | Analytics data |
| `/api/webhooks` | GET/POST | Webhook config |
| `/api/api-keys` | GET/POST | API key management |
| `/api/events/stream` | GET | SSE real-time |

---

## 🔗 Related Apps

| App | Description | Port |
|-----|-------------|------|
| [Marketing](../marketing) | Public website | 3000 |
| [Admin Dashboard](../admin-dashboard) | Platform admin | 3002 |
| [Scanner App](../scanner-app) | Gate scanning | 8081 |
| [Resident Portal](../resident-portal) | Self-service | 3003 |

---

## 📄 License

MIT License — see [../../LICENSE](../../LICENSE) for details.

---

<p align="center">
  <strong>Part of the GateFlow Ecosystem</strong><br>
  <a href="https://gateflow.io">Website</a> • <a href="https://github.com/iDorgham/Gate-Access">GitHub</a>
</p>
