# GateFlow Client Dashboard

<div align="center">

![Banner](docs/gateflow_banner.png)

**Main SaaS Portal for Property Management**

_Complete access control management for properties, gates, visitors, and teams_

[![Status: Production](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)](#)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Auth](https://img.shields.io/badge/Auth-JWT_%2B_Argon2id-blue?style=for-the-badge)](#)
[![Design](https://img.shields.io/badge/Design-ADS_Tokens-green?style=for-the-badge)](#)

</div>

---

## Overview

The **GateFlow Client Dashboard** is the primary hub for property managers. It serves as the "Control Tower" for all gate operations, resident management, and security protocols.

### Key Capabilities

| Capability                | Description                                                       |
| :------------------------ | :---------------------------------------------------------------- |
| **Simplified Navigation** | Accessible directly at root locale path                           |
| **Unified QR System**     | Create passes for guests, contractors, and residents              |
| **Resident Autonomy**     | Manage units and visitor quotas with multi-project organization   |
| **Security Hub**          | Real-time scan feeds, incident tracking, and watchlist management |

---

## Features

### Property Management

| Feature           | Capability                                                  |
| :---------------- | :---------------------------------------------------------- |
| **Organizations** | Multi-tenant isolation for distinct property owners         |
| **Projects**      | Sub-divisions for compound building blocks or events        |
| **Units**         | Map residents to physical units with automated quota limits |
| **Team RBAC**     | Granular permissions (Admin, Manager, Operator)             |

### Security & Operations

| Feature                 | Description                                   |
| :---------------------- | :-------------------------------------------- |
| **Live Feed (SSE)**     | Stateless real-time stream of gate activity   |
| **Waitlists**           | Proactive blocking of individuals or vehicles |
| **Incident Reporting**  | From denial of entry to safety escalations    |
| **Supervisor Override** | Audit-linked PIN bypass for gate operators    |

---

## Tech Stack

| Layer             | Technology                                          |
| :---------------- | :-------------------------------------------------- |
| **Framework**     | Next.js 14 (App Router)                             |
| **Design System** | Atlassian Design System (ADS) tokens + dark mode    |
| **State/Data**    | TanStack Query + Prisma ORM                         |
| **Auth**          | Argon2id password logic with JWT session management |

---

## Getting Started

```bash
# Install dependencies (from root)
pnpm install

# Setup database
pnpm db:generate
pnpm db:push

# Start Client Dashboard
pnpm dev:client
```

**Local Port**: `http://localhost:3001`

---

## Architecture

```
src/
├── app/
│   └── [locale]/           # Root-localized pages
│       ├── dashboard/     # Main dashboard layouts
│       └── api/            # API routes
├── components/
│   └── dashboard/         # Reusable layouts and widgets
└── lib/
    ├── auth.ts             # JWT and session management
    └── password.ts         # Isolated Argon2 logic
```

---

## Related Documentation

| Document                                            | Description                 |
| :-------------------------------------------------- | :-------------------------- |
| [Development Guide](../guides/DEVELOPMENT_GUIDE.md) | Local setup and conventions |
| [Security Overview](../guides/SECURITY_OVERVIEW.md) | Security architecture       |
| [UI Design Guide](../guides/UI_DESIGN_GUIDE.md)     | ADS tokens and components   |
| [Deployment Guide](../deployment/README.md)         | Vercel deployment           |

---

<div align="center">

**Part of the GateFlow Production Ecosystem**

[Main README](../README.md) · [Documentation Index](../README.md) · [gateflow.site](https://gateflow.site)

</div>
