<p align="center">
  <img src="../../docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow Admin Dashboard</h1>

<p align="center">
  <strong>Super-Admin Platform Management</strong><br>
  <em>Platform-wide organization management, analytics, and system health monitoring</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-1.0.0--Production-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Framework-Next.js%2014-blue" alt="Framework">
  <img src="https://img.shields.io/badge/Type-Platform%20Admin-blue" alt="Type">
</p>

---

## 📋 Overview

The **GateFlow Admin Dashboard** is the command center for the platform provider. It allows for the global oversight of all tenant organizations, cross-tenant security audits, and infrastructure health monitoring.

### Core Capabilities
- **Organization Lifecycle**: Onboard, suspend, and configure tenant properties.
- **Global Insights**: Track platform-wide scan volume, active users, and revenue metrics.
- **AI-Powered Admin**: Natural language interface for generating platform reports and managing entities.
- **System Guard**: Live monitoring of database latency and Redis cache health.

---

## ✨ Features

### 🏢 Platform Governance
| Feature | Capability |
| :--- | :--- |
| **Org Management** | Complete CRUD and status control for tenant properties. |
| **Finance Engine** | Real-time MRR tracking and subscription oversight. |
| **Auth Key Forge** | Generate global `ADMIN` and `SERVICE` keys for platform operations. |
| **Health Monitor** | Visual indicators for PostgreSQL and Upstash Redis connectivity. |

### 🤖 GateAI Admin Assistant
- **Natural Language Reports**: "Show me global scan volume for the last 7 days."
- **Entity Troubleshooting**: "Analyze why Organization X has a high scan failure rate."
- **Data Blueprints**: Execute complex seeding matrices via simple chat commands.

---

## 💻 Tech Stack

- **Frontend**: Next.js 14 (App Router).
- **Core AI**: Google Gemini Pro via Vercel AI SDK.
- **Database**: PostgreSQL with global scoping.
- **Performance**: Edge-cached analytics for system-wide metrics.

---

## 🚀 Getting Started

```bash
# Install root
pnpm install

# Build shared packages
pnpm turbo build --filter=@gate-access/*

# Start Admin Dashboard
pnpm dev:admin
```

**Local Port**: `http://localhost:3002`

---

## 📁 Architecture

- `src/app/(dashboard)/ai`: The specialized GateAI control interface.
- `src/app/(dashboard)/organizations`: Tenant management workflows.
- `src/app/(dashboard)/health`: Infrastructure monitoring dashboard.
- `src/lib/admin-auth.ts`: Strict platform-admin session validation.

---

<p align="center">
  <strong>Part of the GateFlow 1.0 Production Ecosystem</strong><br>
  <a href="../../README.md">Main Project</a> • <a href="../../docs/README.md">Documentation Index</a>
</p>
