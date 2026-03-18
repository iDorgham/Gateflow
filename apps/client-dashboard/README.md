<p align="center">
  <img src="../../docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow Client Dashboard</h1>

<p align="center">
  <strong>Main SaaS Portal for Property Management</strong><br>
  <em>Complete access control management for properties, gates, visitors, and teams</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-1.0.0--Production-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Framework-Next.js%2014-blue" alt="Framework">
  <img src="https://img.shields.io/badge/Auth-JWT%20%2B%20Argon2id-blue" alt="Auth">
</p>

---

## 📋 Overview

The **GateFlow Client Dashboard** is the primary hub for property managers. It serves as the "Control Tower" for all gate operations, resident management, and security protocols.

### Key Capabilities
- **Simplified Navigation**: Accessible directly at the root locale path (`/[locale]/`) for instant overview.
- **Unified QR System**: Create passes for guests, contractors, and permanent residents.
- **Resident Autonomy**: Manage units and visitor quotas with multi-project organization.
- **Security Hub**: Real-time scan feeds, incident tracking, and watchlist management.

---

## ✨ Features

### 🏢 Property Management
| Feature | Capability |
| :--- | :--- |
| **Organizations** | Multi-tenant isolation for distinct property owners. |
| **Projects** | Sub-divisions for compound building blocks or specific events. |
| **Units** | Map residents to physical units with automated quota limits. |
| **Team RBAC** | Granular permissions (Admin, Manager, Operator) with custom roles. |

### 🛡️ Security & Ops
- **Live Feed (SSE)**: Stateless real-time stream of all gate activity.
- **Waitlists**: Proactive blocking of individuals or vehicles.
- **Incident Reporting**: From denial of entry to safety escalations.
- **Supervisor Override**: Audit-linked PIN bypass for gate operators.

---

## 💻 Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Design System**: Atlassian Design System (ADS) tokens + dark mode.
- **State/Data**: TanStack Query + Prisma ORM.
- **Auth**: Decoupled Argon2id password logic with JWT session management.

---

## 🚀 Getting Started

```bash
# Install root
pnpm install

# Setup DB
pnpm db:migrate

# Start Client Dashboard
pnpm dev:client
```

**Local Port**: `http://localhost:3001`

---

## 📂 Architecture

- `src/app/[locale]/`: Root-localized pages with the new "Home Dashboard" at `page.tsx`.
- `src/components/dashboard/`: Reusable layouts (`DashboardWrapper`) and widgets.
- `src/lib/password.ts`: Isolated native Argon2 logic for high-security hashing.
- `src/lib/auth.ts`: JWT and session management layer.

---

<p align="center">
  <strong>Part of the GateFlow 1.0 Production Ecosystem</strong><br>
  <a href="../../README.md">Main Project</a> • <a href="../../docs/README.md">Documentation</a>
</p>
