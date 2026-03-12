# GateFlow Project Progress Dashboard

<p align="center">
  <img src="./docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

---

## Project Overview

| Attribute      | Value                                                                      |
| -------------- | -------------------------------------------------------------------------- |
| **Product**    | GateFlow — Zero-Trust Digital Gate Infrastructure Platform                 |
| **Status**     | MVP ~75% Complete                                                          |
| **Phase**      | Phase 2 Planning (Resident Portal)                                         |
| **Tech Stack** | Next.js 14 · Expo SDK 54 · PostgreSQL 15 · Prisma 5 · pnpm 8 · Turborepo 2 |

---

## MVP Completion Status: 78%

### ✅ Completed Features

| Feature                              | Status      | Notes                                     |
| ------------------------------------ | ----------- | ----------------------------------------- |
| Organization CRUD                    | ✅ Complete | Multi-tenant architecture                 |
| JWT Auth (Argon2id + token rotation) | ✅ Complete | 15-min access, 30-day refresh             |
| Single QR Code Creation              | ✅ Complete | Individual visitor passes                 |
| Bulk CSV QR Creation                 | ✅ Complete | Batch generation                          |
| Gate Management                      | ✅ Complete | Physical access point CRUD                |
| Mobile Scanner (offline-capable)     | ✅ Complete | Expo app with AES-256 sync                |
| Scanner App - 5 Tabs                 | ✅ Complete | Scanner, Today, Log, Chat, Settings       |
| RBAC (roles + permissions)           | ✅ Complete | ADMIN, TENANT_ADMIN, TENANT_USER, VISITOR |
| Live Analytics Dashboard             | ✅ Complete | Real-time scan monitoring                 |
| Webhooks + API Keys                  | ✅ Complete | Event notifications + programmatic access |
| Admin - Authorization Keys           | ✅ Complete | Platform-wide auth key management         |
| CSRF Protection                      | ✅ Complete | Double-submit cookie pattern              |
| Rate Limiting                        | ✅ Complete | Upstash Redis                             |
| Field Encryption                     | ✅ Complete | AES-256 for webhook secrets               |
| QR Signing                           | ✅ Complete | HMAC-SHA256                               |
| Supervisor Override                  | ✅ Complete | PIN-based bypass in scanner               |
| Advanced Analytics                   | ✅ Complete | Charts and reporting                      |
| Admin Dashboard                      | ✅ Complete | Super-admin panel                         |
| Resident Portal (Web)                | ✅ Complete | Visitor pass management, quota, profile   |
| Marketing Site                       | ✅ Complete | Full platform marketing                   |

### 🔄 In Progress

| Feature             | Status     | Notes                          |
| ------------------- | ---------- | ------------------------------ |
| Resident Mobile App | 🔄 Planned | Phase 2 - native notifications |

### 📋 Remaining MVP Items (~22%)

| Feature                        | Priority | Notes                     |
| ------------------------------ | -------- | ------------------------- |
| Resident Mobile App            | High     | iOS/Android native apps   |
| WhatsApp/Omni-channel Delivery | Medium   | Phase 3                   |
| LPR Integration                | Medium   | License plate recognition |

---

## Phase Roadmap

### Phase 1: MVP (Current) — 75% Complete

- [x] Core platform infrastructure
- [x] Client Dashboard
- [x] Admin Dashboard
- [x] Scanner App (offline-capable)
- [x] Marketing Site
- [x] Security features (JWT, RBAC, encryption)

### Phase 2: Resident Portal — Q3-Q4 2026

**Status:** Planning

**New Features:**

- Self-service guest management for residents
- Unit-linked visitor passes
- Quota limits by unit type
- Access rules (one-time, recurring, permanent)
- Resident mobile app (iOS/Android)

**New Prisma Models:**

- `Unit` — residential unit linked to org and user
- `VisitorQR` — visitor QR created by resident
- `AccessRule` — time-based access constraints
- `ResidentLimit` — per-org quota config by unit type

**Documentation:**

- [Resident Portal Spec](./docs/RESIDENT_PORTAL_SPEC.md)
- [PRD v6.0](./docs/PRD_v6.0.md)

### Phase 3: Marketing Suite — Future

- WhatsApp integration
- SMS delivery
- Meta Pixel / GA4 tracking
- UTM-powered visitor profiling

---

## Quick Links

### Core Documentation

| Document                                           | Description           |
| -------------------------------------------------- | --------------------- |
| [README.md](../README.md)                          | Project overview      |
| [CLAUDE.md](../CLAUDE.md)                          | AI assistant guide    |
| [PRD v6.0](./PRD_v6.0.md)                          | Product requirements  |
| [Security Overview](./guides/SECURITY_OVERVIEW.md) | Security architecture |

### Development

| Document                                                   | Description       |
| ---------------------------------------------------------- | ----------------- |
| [Development Guide](./guides/DEVELOPMENT_GUIDE.md)         | Local setup       |
| [Environment Variables](./guides/ENVIRONMENT_VARIABLES.md) | Env var reference |
| [Scanner Operations](./guides/SCANNER_OPERATIONS.md)       | Guard workflows   |

### Architecture

| Document                                                   | Description       |
| ---------------------------------------------------------- | ----------------- |
| [Architecture](./guides/ARCHITECTURE.md)                   | System design     |
| [UI Design Guide](./guides/UI_DESIGN_GUIDE.md)             | Design tokens     |
| [Tool & CLI Reference](./guides/TOOL_AND_CLI_REFERENCE.md) | Development tools |

---

## App Status

| App              | Port | Status            | Documentation                                                    |
| ---------------- | ---- | ----------------- | ---------------------------------------------------------------- |
| Marketing        | 3000 | ✅ Live           | [marketing/README.md](../apps/marketing/README.md)               |
| Client Dashboard | 3001 | ✅ Live           | [client-dashboard/README.md](../apps/client-dashboard/README.md) |
| Admin Dashboard  | 3002 | ✅ Live           | [admin-dashboard/README.md](../apps/admin-dashboard/README.md)   |
| Scanner App      | 8081 | ✅ Live (v5 tabs) | [scanner-app/README.md](../apps/scanner-app/README.md)           |
| Resident Portal  | 3003 | ✅ Live           | [resident-portal/README.md](../apps/resident-portal/README.md)   |
| Resident Mobile  | TBD  | 📋 Planned        | [resident-mobile/README.md](../apps/resident-mobile/README.md)   |

---

## Package Status

| Package                   | Status    | Purpose                    |
| ------------------------- | --------- | -------------------------- |
| `@gate-access/db`         | ✅ Stable | Prisma schema & client     |
| `@gate-access/types`      | ✅ Stable | Shared TypeScript types    |
| `@gate-access/ui`         | ✅ Stable | UI component library       |
| `@gate-access/api-client` | ✅ Stable | Fetch utilities            |
| `@gate-access/i18n`       | ✅ Stable | AR/EN translations         |
| `@gate-access/config`     | ✅ Stable | ESLint, TSConfig, Tailwind |

---

## Recent Activity

- **Scanner App v5** — Added 5 tabs: Scanner, Today (Expected Visits), Log, Chat, Settings
- **Admin Dashboard** — Added Authorization Keys management with full CRUD API
- **Resident Portal** — Completed profile page, notifications settings, API proxy
- **Core Security v6** — Completed Phases 1-6 (visitor identity levels, privacy/retention)
- **Analytics Dashboard** — Completed full rebuild with Recharts
- **Projects CRM UI** — Completed phases 1-12
- **QR Create Wizard** — Completed phases 1-3

See [Execution Docs](./plan/execution/) for detailed phase history.

---

## Contributing

1. Check the [Development Guide](./guides/DEVELOPMENT_GUIDE.md)
2. Review [Code Conventions](../CLAUDE.md#code-conventions)
3. Use pnpm (not npm/yarn)
4. Run `pnpm turbo build` before submitting PRs

---

<p align="center">
  Built with ❤️ for secure physical spaces.
</p>
