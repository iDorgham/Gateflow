# GateFlow — Project Structure Reference

**Last Updated:** February 23, 2026

---

## Repository Overview

GateFlow is a **Turborepo monorepo** containing 6 applications and 6 shared packages, built with Next.js 14, Expo/React Native, PostgreSQL + Prisma, and pnpm.

```
Gate-Access/
├── apps/                          # Application workspaces
│   ├── client-dashboard/          # Main SaaS dashboard (Next.js 14)
│   ├── admin-dashboard/           # Platform super-admin (Next.js 14)
│   ├── scanner-app/               # Mobile QR scanner (Expo/React Native)
│   ├── marketing/                 # Public marketing site (Next.js 14)
│   ├── resident-portal/           # Resident self-service (Next.js 14) — Planned
│   └── resident-mobile/           # Resident mobile app (Expo) — Planned
├── packages/                      # Shared libraries
│   ├── db/                        # Prisma schema, client, migrations
│   ├── types/                     # Shared TypeScript types/interfaces
│   ├── ui/                        # Shared UI component library (shadcn-style)
│   ├── config/                    # Shared ESLint/TS configs
│   ├── api-client/                # Shared API client utilities
│   └── i18n/                      # Internationalization (AR/EN)
├── docs/                          # Project documentation (16 files)
├── docker/                        # Docker configs
├── infra/                         # Infrastructure configs
├── terraform/                     # Terraform IaC
├── turbo.json                     # Turborepo pipeline config
├── pnpm-workspace.yaml            # pnpm workspace definition
├── package.json                   # Root scripts (dev, build, lint)
├── tsconfig.json                  # Base TypeScript config
├── tailwind.config.ts             # Shared Tailwind config
└── postcss.config.js              # PostCSS config
```

---

## Tech Stack

| Layer              | Technology                     | Version |
| ------------------ | ------------------------------ | ------- |
| Frontend (Web)     | Next.js (App Router)           | 14.x    |
| Mobile             | Expo / React Native            | SDK 54  |
| Database           | PostgreSQL                     | 15+     |
| ORM                | Prisma                         | 5.x     |
| Auth               | JWT (`jose`) + Argon2id        | Latest  |
| Package Manager    | pnpm                           | 8.x     |
| Build System       | Turborepo                      | 2.x     |
| UI Components      | Custom (shadcn/ui-style)       | —       |
| QR Signing         | HMAC-SHA256 (`crypto-js`)      | Latest  |
| Encryption         | AES-256 + PBKDF2 (`crypto-js`) | Latest  |
| Rate Limiting      | Upstash Redis                  | Latest  |
| Offline Storage    | AsyncStorage + SecureStore     | —       |

---

## Development Ports

| App              | Port  | Command         |
| ---------------- | ----- | --------------- |
| Marketing        | 3000  | `next dev -p 3000` |
| Client Dashboard | 3001  | `next dev -p 3001 -H 0.0.0.0` |
| Admin Dashboard  | 3002  | `next dev -p 3002` |
| Scanner App      | 8081  | `expo start` (Metro) |

---

## Database Schema (Prisma)

### Models

| Model              | Purpose                              | Key Relations              |
| ------------------ | ------------------------------------ | -------------------------- |
| `Organization`     | Multi-tenant root entity             | → Users, Gates, QRCodes, Webhooks, ApiKeys |
| `User`             | Authenticated user                   | → Organization, ScanLogs, RefreshTokens |
| `Gate`             | Physical access point                | → Organization, ScanLogs, QRCodes |
| `QRCode`           | Generated access code                | → Organization, Gate, ScanLogs |
| `ScanLog`          | Audit record per scan                | → User, Gate, QRCode      |
| `RefreshToken`     | JWT refresh token (rotation)         | → User                    |
| `Webhook`          | Event notification endpoint          | → Organization, Deliveries |
| `WebhookDelivery`  | Individual webhook delivery attempt  | → Webhook                 |
| `ApiKey`           | Programmatic API access              | → Organization             |

### Enums

`Plan` · `UserRole` · `QRCodeType` · `ScanStatus` · `WebhookEvent` · `WebhookDeliveryStatus` · `ApiScope`

---

## Shared Packages

### `@gate-access/db`
Prisma client + schema + migrations + seed script.

### `@gate-access/types`
Shared TypeScript types: `auth`, `gate`, `organization`, `qr-payload`, `qr-signing`, `qr-validate`, `qr`, `scan-event`, `scan-log`, `user`.

### `@gate-access/ui`
16 reusable UI components: Avatar, Badge, Button, Card, Checkbox, Dialog, DropdownMenu, Input, Label, Select, Separator, Sheet, Skeleton, Table, Textarea, Toast.

### `@gate-access/config`
Shared ESLint and TypeScript configurations.

### `@gate-access/api-client`
Shared fetch utilities for cross-app API calls.

### `@gate-access/i18n`
Arabic/English internationalization support.

---

## Documentation Inventory (`/docs`)

| Document | Description |
| -------- | ----------- |
| `PRD_v5.0.md` | Latest Product Requirements (5 apps strategy, resident portal) |
| `PRD_v4.0.md` | Previous PRD with full feature matrix |
| `PRD_v3.0.md` | Earlier PRD iteration |
| `PRD_v2.1.md` | Early-stage requirements |
| `PRD_OLD.md` | Original product requirements |
| `PROJECT_STATUS_V4.md` | Detailed implementation status by feature |
| `PROJECT_STATUS.md` | Earlier project status report |
| `MVP_DONE_CHECKLIST.md` | MVP completion checklist |
| `MVP_CODE_QUALITY_AND_SECURITY_REVIEW.md` | Code quality and security audit |
| `COMPREHENSIVE_IMPROVEMENTS_AND_NEW_PRD_V4.md` | Improvement proposals |
| `IMPROVEMENTS_AND_ROADMAP.md` | Feature roadmap |
| `CLAUDE_PROMPT_SET_FOR_MVP_COMPLETION.md` | AI prompt sets for MVP work |
| `MULTI_PROJECT_CLAUDE_PROMPTS.md` | Multi-project prompt templates |
| `OFFLINE_SYNC_NOTES.md` | Offline sync architecture notes |
| `RESIDENT_PORTAL_SPEC.md` | Resident portal specification |
| `RESIDENT_PORTAL_CLAUDE_PROMPTS.md` | Resident portal prompt templates |

---

## Environment Variables

| Variable               | Used By          | Purpose                  |
| ---------------------- | ---------------- | ------------------------ |
| `DATABASE_URL`         | db package       | PostgreSQL connection    |
| `NEXTAUTH_SECRET`      | client-dashboard | JWT signing secret       |
| `NEXTAUTH_URL`         | client-dashboard | Auth callback base URL   |
| `NEXT_PUBLIC_API_URL`  | client-dashboard | Client-side API base     |
| `NEXT_PUBLIC_APP_URL`  | client-dashboard | Public app URL           |
| `QR_SIGNING_SECRET`    | client-dashboard | HMAC-SHA256 QR signing   |
| `EXPO_PUBLIC_API_URL`  | scanner-app      | Mobile API endpoint      |

---

## Build & Dev Commands

```bash
# Install dependencies
pnpm install

# Start all apps in dev mode
pnpm turbo dev

# Build all apps
pnpm turbo build

# Run linting
pnpm turbo lint

# Run tests
pnpm turbo test

# Push Prisma schema to DB
cd packages/db && npx prisma db push

# Generate Prisma client
cd packages/db && npx prisma generate

# Seed database
cd packages/db && npx prisma db seed
```
