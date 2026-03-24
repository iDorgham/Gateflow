# GateFlow Admin Dashboard

<div align="center">

![Banner](docs/gateflow_banner.png)

**Super-Admin Platform Management**

_Platform-wide organization management, analytics, and system health monitoring_

[![Status: Production](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)](#)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Platform](https://img.shields.io/badge/Platform-Admin-red?style=for-the-badge)](#)
[![i18n](https://img.shields.io/badge/i18n-AR_%2B_EN-blue?style=for-the-badge)](#)

</div>

---

## Overview

The **GateFlow Admin Dashboard** is the command center for the platform provider. It enables global oversight of all tenant organizations, cross-tenant security audits, and infrastructure health monitoring.

### Core Capabilities

| Capability                 | Description                                                |
| :------------------------- | :--------------------------------------------------------- |
| **Organization Lifecycle** | Onboard, suspend, and configure tenant properties          |
| **Global Insights**        | Track platform-wide scan volume, active users, and revenue |
| **AI-Powered Admin**       | Natural language interface for generating platform reports |
| **System Guard**           | Live monitoring of database latency and Redis cache health |

---

## Features

### Platform Governance

| Feature            | Capability                                             |
| :----------------- | :----------------------------------------------------- |
| **Org Management** | Complete CRUD and status control for tenant properties |
| **Finance Engine** | Real-time MRR tracking and subscription oversight      |
| **Auth Key Forge** | Generate global `ADMIN` and `SERVICE` keys             |
| **Health Monitor** | Visual indicators for PostgreSQL and Upstash Redis     |

### GateAI Admin Assistant

- **Natural Language Reports**: "Show me global scan volume for the last 7 days"
- **Entity Troubleshooting**: "Analyze why Organization X has high scan failures"
- **Data Blueprints**: Execute complex seeding matrices via chat commands

---

## Tech Stack

| Layer           | Technology                          |
| :-------------- | :---------------------------------- |
| **Framework**   | Next.js 14 (App Router)             |
| **AI**          | Google Gemini Pro via Vercel AI SDK |
| **Database**    | PostgreSQL with global scoping      |
| **Performance** | Edge-cached analytics               |

---

## Getting Started

```bash
# Install dependencies (from root)
pnpm install

# Build shared packages
pnpm turbo build --filter=@gate-access/*

# Start Admin Dashboard
pnpm dev:admin
```

**Local Port**: `http://localhost:3002`

---

## Architecture

```
src/app/(dashboard)/
├── ai/              # GateAI control interface
├── organizations/    # Tenant management workflows
├── health/          # Infrastructure monitoring
└── settings/        # Platform settings

src/lib/
└── admin-auth.ts    # Strict platform-admin session validation
```

---

## Related Documentation

| Document                                            | Description                 |
| :-------------------------------------------------- | :-------------------------- |
| [Development Guide](../guides/DEVELOPMENT_GUIDE.md) | Local setup and conventions |
| [Security Overview](../guides/SECURITY_OVERVIEW.md) | Security architecture       |
| [Deployment Guide](../deployment/README.md)         | Vercel deployment           |

---

<div align="center">

**Part of the GateFlow Production Ecosystem**

[Main README](../README.md) · [Documentation Index](../README.md) · [gateflow.site](https://gateflow.site)

</div>
