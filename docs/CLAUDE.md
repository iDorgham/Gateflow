# GateFlow — AI Assistant Guide (CLAUDE.md)

**Product:** GateFlow — Zero-Trust Digital Gate Infrastructure Platform
**Status:** MVP 100% Complete | Phase 3 Planning (Marketing Suite)
**Stack:** Next.js 14 · Expo SDK 54 · PostgreSQL 15 · Prisma 5 · pnpm 8 · Turborepo 2

---

## Repository Overview

GateFlow is a **Turborepo monorepo** with 6 apps and 6 shared packages, targeting MENA gated compounds, events, and access-controlled venues. It replaces paper guest books and WhatsApp QR chaos with auditable, cryptographically-signed digital access.

```
Gate-Access/
├── apps/
│   ├── client-dashboard/    # Main SaaS portal — Next.js 14, port 3001
│   ├── admin-dashboard/     # Super-admin panel — Next.js 14, port 3002
│   ├── scanner-app/         # Mobile QR scanner — Expo SDK 54, port 8081
│   ├── marketing/           # Public marketing site — Next.js 14, port 3000
│   ├── resident-portal/     # Resident self-service — Next.js 14 (planned)
│   └── resident-mobile/     # Resident mobile app — Expo (planned)
├── packages/
│   ├── db/                  # Prisma schema, client, migrations, seed
│   ├── types/               # Shared TypeScript types
│   ├── ui/                  # Shared UI component library (shadcn-style)
│   ├── config/              # Shared ESLint/TS configs
│   ├── api-client/          # Shared fetch utilities
│   └── i18n/                # Arabic/English internationalization
├── docs/                    # 16+ documentation files
├── infra/                   # Infrastructure configs
├── turbo.json               # Turborepo pipeline config
├── pnpm-workspace.yaml      # pnpm workspace definition
├── tsconfig.json            # Base TypeScript config (strict, ES2020)
├── tailwind.config.ts       # Shared Tailwind config
└── postcss.config.js
```

---

## Essential Commands

```bash
# Slash commands (Cursor): /ready (pre-dev), /run, /run all, /guide, /plan, /github, etc.

# Install dependencies (pnpm ONLY — never npm or yarn)
pnpm install

# Start all apps in dev mode
pnpm turbo dev

# Build everything (respects Turborepo dependency graph)
pnpm turbo build

# Run all linters
pnpm turbo lint

# Run all tests
pnpm turbo test

# Type-check all packages
pnpm turbo typecheck

# Run a single app in isolation
pnpm turbo dev --filter=client-dashboard
pnpm turbo dev --filter=scanner-app

# Database operations (run from packages/db)
cd packages/db && npx prisma generate        # Regenerate Prisma client
cd packages/db && npx prisma db push         # Push schema to DB (dev)
cd packages/db && npx prisma migrate dev     # Create a migration
cd packages/db && npx prisma migrate dev --create-only  # Migration without applying
cd packages/db && npx prisma db seed         # Seed database
cd packages/db && npx prisma studio          # Open Prisma Studio
```

---

## Development Ports

| App              | Port | Start Command                         |
| ---------------- | ---- | ------------------------------------- |
| Marketing        | 3000 | `next dev -p 3000`                    |
| Client Dashboard | 3001 | `next dev -p 3001 -H 0.0.0.0`         |
| Admin Dashboard  | 3002 | `next dev -p 3002`                    |
| Scanner App      | 8081 | `expo start --lan -c` (Metro bundler) |

---

## Tech Stack

| Layer           | Technology                     | Version |
| --------------- | ------------------------------ | ------- |
| Web Frontend    | Next.js App Router             | 14.x    |
| Mobile          | Expo / React Native            | SDK 54  |
| Database        | PostgreSQL                     | 15+     |
| ORM             | Prisma                         | 5.x     |
| Auth            | JWT (`jose`) + Argon2id        | Latest  |
| Package Manager | pnpm                           | 8.x     |
| Build System    | Turborepo                      | 2.x     |
| UI Components   | Custom (shadcn/ui-style)       | —       |
| QR Signing      | HMAC-SHA256 (`crypto-js`)      | Latest  |
| Offline Crypto  | AES-256 + PBKDF2 (`crypto-js`) | Latest  |
| Rate Limiting   | Upstash Redis                  | Latest  |
| Offline Storage | AsyncStorage + SecureStore     | —       |
| Testing         | Jest + ts-jest                 | 29/30.x |

---

## Authentication & Security

### JWT Tokens

- **Access tokens**: 15-minute expiry, signed with HS256
- **Refresh tokens**: 30-day expiry, stored in DB with rotation
- **Issuer/Audience**: `gateflow` / `gateflow-api`
- **Claims**: `sub` (userId), `email`, `role`, `orgId`
- Auth utility: `apps/client-dashboard/src/lib/auth.ts`

### Password Hashing

- **Algorithm**: Argon2id (`argon2` package)
- **Parameters**: `t=3, m=65536, p=4`

### RBAC Roles (`UserRole` enum)

| Role           | Access                            |
| -------------- | --------------------------------- |
| `ADMIN`        | Platform admin (admin-dashboard)  |
| `TENANT_ADMIN` | Full client-dashboard access      |
| `TENANT_USER`  | Limited client-dashboard access   |
| `VISITOR`      | Scanner app only                  |
| `RESIDENT`     | Resident portal (planned Phase 2) |

### API Key Auth

- Keys are stored as **SHA-256 hashes** (never plaintext) in the `ApiKey` model
- Keys support scoped permissions via `ApiScope` enum
- Middleware: `apps/client-dashboard/src/lib/api-key-auth.ts`

### Security Measures

- **CSRF**: Double-submit cookie pattern (`src/lib/csrf.ts`)
- **Rate limiting**: Upstash Redis, multi-instance safe (`src/lib/rate-limit.ts`)
- **Field encryption**: AES-256 for webhook secrets (`src/lib/encryption.ts`)
- **QR signing**: HMAC-SHA256 (`QR_SIGNING_SECRET` env var)
- **Security headers**: HSTS, X-Frame-Options, X-Content-Type-Options

---

## Database Schema

All database work lives in `packages/db/prisma/schema.prisma`.

### Core Models

| Model             | Purpose                             | Key Relations                            |
| ----------------- | ----------------------------------- | ---------------------------------------- |
| `Organization`    | Multi-tenant root entity            | Users, Gates, QRCodes, Webhooks, ApiKeys |
| `Project`         | Sub-grouping within an org          | Organization, Gates, QRCodes             |
| `User`            | Authenticated user                  | Organization, ScanLogs, RefreshTokens    |
| `Gate`            | Physical access point               | Organization, Project, ScanLogs, QRCodes |
| `QRCode`          | Generated access code               | Organization, Project, Gate, ScanLogs    |
| `ScanLog`         | Immutable audit record per scan     | User, Gate, QRCode                       |
| `RefreshToken`    | JWT refresh token (rotation)        | User                                     |
| `Webhook`         | Event notification endpoint         | Organization, WebhookDeliveries          |
| `WebhookDelivery` | Individual webhook delivery attempt | Webhook                                  |
| `ApiKey`          | Programmatic API access             | Organization                             |

### Conventions

- **IDs**: `cuid()` via `@default(cuid())`
- **Soft deletes**: All mutable entities have `deletedAt DateTime?` — always filter `where: { deletedAt: null }`
- **Timestamps**: `createdAt @default(now())` + `updatedAt @updatedAt` on all models
- **Indexes**: All foreign keys have `@@index(...)`, plus `@@index([deletedAt])` on soft-delete fields
- **Multi-tenancy**: Every query must scope by `organizationId` — row-level tenant isolation

### Key Enums

```
Plan:                 FREE | PRO | ENTERPRISE
UserRole:             ADMIN | TENANT_ADMIN | TENANT_USER | VISITOR
QRCodeType:           SINGLE | RECURRING | PERMANENT
ScanStatus:           (see schema)
WebhookEvent:         (see schema)
WebhookDeliveryStatus:(see schema)
ApiScope:             (see schema)
```

---

## Shared Packages

### `@gate-access/db`

- Entry: `packages/db/src/index.ts`
- Exports: Prisma client instance, all model types
- Use: `import { prisma } from '@gate-access/db'`

### `@gate-access/types`

- Entry: `packages/types/src/index.ts`
- Contains: `auth`, `gate`, `organization`, `qr-payload`, `qr-signing`, `qr-validate`, `qr`, `scan-event`, `scan-log`, `user`
- Use: `import { UserRole } from '@gate-access/types'`

### `@gate-access/ui`

- Entry: `packages/ui/src/index.ts`
- 16 components: Avatar, Badge, Button, Card, Checkbox, Dialog, DropdownMenu, Input, Label, Select, Separator, Sheet, Skeleton, Table, Textarea, Toast
- Design tokens: `packages/ui/src/tokens.ts`
- Use: `import { Button } from '@gate-access/ui'`

### `@gate-access/api-client`

- Shared fetch utilities with JWT auth
- Use for cross-app API calls from client-side code

### `@gate-access/i18n`

- Arabic/English (AR/EN) internationalization support
- Required for MENA market support

### `@gate-access/config`

- Shared ESLint and TypeScript base configurations

---

## App Architecture: Client Dashboard

**Path:** `apps/client-dashboard/src/`

```
src/
├── app/
│   ├── api/                     # Next.js App Router API routes
│   │   ├── auth/login/          # POST — login, issue tokens
│   │   ├── auth/refresh/        # POST — rotate refresh token
│   │   ├── auth/logout/         # POST — revoke refresh token
│   │   ├── qrcodes/             # GET/POST — QR code management
│   │   ├── qrcodes/validate/    # POST — server-side QR validation
│   │   ├── qr/bulk-create/      # POST — CSV bulk QR generation
│   │   ├── qr/send-email/       # POST — email QR to guest
│   │   ├── scans/               # GET — scan history
│   │   ├── scans/bulk/          # POST — bulk sync from scanner
│   │   ├── scans/export/        # GET — export scan logs
│   │   ├── gates/               # CRUD gate management
│   │   ├── projects/            # CRUD project management
│   │   ├── webhooks/            # CRUD webhooks
│   │   ├── api-keys/            # CRUD API keys
│   │   ├── workspace/settings/  # GET/PUT workspace settings
│   │   ├── override/log/        # POST — supervisor override log
│   │   └── onboarding/complete/ # POST — complete org onboarding
│   ├── dashboard/               # Protected dashboard pages (App Router)
│   │   ├── qrcodes/             # QR management UI
│   │   ├── scans/               # Scan history UI
│   │   ├── gates/               # Gate management UI
│   │   ├── projects/            # Project management UI
│   │   ├── team/                # Team/RBAC management UI
│   │   ├── analytics/           # Analytics dashboard
│   │   ├── workspace/           # Settings, webhooks, API keys, billing
│   │   └── onboarding/          # Onboarding wizard
│   ├── login/                   # Login page
│   └── s/[shortId]/             # Short link redirects
├── lib/
│   ├── auth.ts                  # JWT sign/verify, Argon2id helpers
│   ├── auth-cookies.ts          # Secure cookie management
│   ├── dashboard-auth.ts        # Route-level auth guard
│   ├── require-auth.ts          # Middleware auth helper
│   ├── api-key-auth.ts          # API key validation middleware
│   ├── csrf.ts                  # CSRF token generation/validation
│   ├── rate-limit.ts            # Upstash Redis rate limiting
│   ├── encryption.ts            # AES-256 field encryption
│   ├── project-cookie.ts        # Active project cookie management
│   ├── webhook-delivery.ts      # Webhook dispatch logic
│   ├── utils.ts                 # General utilities
│   └── types.ts                 # Local type extensions
└── components/
    └── dashboard/               # Dashboard-specific React components
```

---

## App Architecture: Scanner App

**Path:** `apps/scanner-app/src/`

```
src/
├── lib/
│   ├── scanner.ts               # Core QR scan processing logic
│   ├── qr-verify.ts             # Offline HMAC-SHA256 QR verification
│   ├── offline-queue.ts         # AES-256 encrypted offline sync queue
│   ├── auth-client.ts           # Mobile auth (JWT via SecureStore)
│   ├── scan-history.ts          # Local scan history persistence
│   └── preferences.ts           # User preferences (AsyncStorage)
└── components/
    ├── GateSelector.tsx          # Gate selection UI
    ├── HistoryTab.tsx            # Scan history display
    ├── QueueStatus.tsx           # Offline queue status
    ├── SettingsTab.tsx           # App settings
    └── SupervisorOverride.tsx    # Override flow (PIN modal, force-override, server audit log)
```

**Key features:**

- **Offline-first**: Scans queued locally with AES-256 encryption when offline
- **PBKDF2 key derivation** for offline encryption keys
- **LWW (Last Write Wins)** sync conflict resolution
- **scanUuid deduplication** prevents double-counting synced scans
- **Expo Camera** for QR scanning, **Expo Haptics** for feedback
- **Expo Location** for optional scan context

---

## Testing

Tests use **Jest + ts-jest** with `testEnvironment: 'node'`.

### Running Tests

```bash
# All tests via Turborepo
pnpm turbo test

# Single app
pnpm --filter=client-dashboard test
pnpm --filter=scanner-app test

# Watch mode (within an app directory)
npx jest --watch
```

### Test File Conventions

- Test files: `*.test.ts` (co-located with source in `src/`)
- Pattern: `**/*.test.ts`
- Scanner app tests: `offline-queue.test.ts`, `qr-verify.test.ts`, `scanner.test.ts`, `auth-client.test.ts`
- Client-dashboard tests: `auth.test.ts`

---

## Environment Variables

Copy `.env.example` to `.env.local` in each app before running.

### Global

```env
DATABASE_URL="postgresql://user:password@host:port/gateflow"
```

### Client Dashboard (`apps/client-dashboard/.env.local`)

```env
DATABASE_URL=
NEXTAUTH_SECRET=           # JWT signing secret (required)
NEXTAUTH_URL=              # e.g. http://localhost:3001
NEXT_PUBLIC_API_URL=       # Public API base URL
NEXT_PUBLIC_APP_URL=       # Public app URL
QR_SIGNING_SECRET=         # HMAC-SHA256 QR signing key
UPSTASH_REDIS_REST_URL=    # Rate limiting
UPSTASH_REDIS_REST_TOKEN=  # Rate limiting
```

### Scanner App (`apps/scanner-app/.env`)

```env
EXPO_PUBLIC_API_URL=       # Backend API endpoint
```

> **Never commit `.env` or `.env.local` files.** Only `.env.example` files with placeholder values should be committed.

---

## Code Conventions

### TypeScript

- **Strict mode** enabled globally (`"strict": true`)
- **Target**: ES2020
- **Module resolution**: `bundler` for web apps
- Path aliases via `tsconfig.json`:
  - `@gate-access/ui` → `packages/ui/src`
  - `@gate-access/types` → `packages/types/src`
  - `@gate-access/api-client` → `packages/api-client/src`

### API Route Pattern (Next.js App Router)

```ts
// Always validate auth first
import { requireAuth } from '@/lib/require-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success)
    return NextResponse.json(
      { message: auth.message },
      { status: auth.status }
    );

  // Always scope queries by orgId (multi-tenant)
  const data = await prisma.someModel.findMany({
    where: { organizationId: auth.orgId, deletedAt: null },
  });
}
```

### Database Queries

- Always filter `deletedAt: null` — all deletions are soft deletes
- Always scope by `organizationId` for tenant isolation
- Use `prisma.model.findUnique` for single records, `findMany` with explicit `where`

### QR Code Flow

1. Generated with HMAC-SHA256 signature in client-dashboard
2. Distributed via email or displayed in UI
3. Scanner app verifies signature offline using shared secret
4. Scan result queued locally (AES-256 encrypted) if offline
5. Synced to backend via bulk sync endpoint when online

### Git Workflow

- Feature branches: `feat/feature-name` from `main`
- Pre-commit hooks: format (Prettier) + lint (ESLint)
- Ensure Turborepo build passes before PR

---

## Project Status & Roadmap

### MVP Status (~78% complete)

| Feature                                           | Status |
| ------------------------------------------------- | ------ |
| Organization CRUD                                 | ✅     |
| JWT auth (Argon2id + token rotation)              | ✅     |
| Single & bulk CSV QR creation                     | ✅     |
| Gate management                                   | ✅     |
| Mobile scanner (offline-capable)                  | ✅     |
| Scanner App 5 tabs (Scan/Today/Log/Chat/Settings) | ✅     |
| RBAC (roles + permissions)                        | ✅     |
| Live analytics dashboard                          | ✅     |
| Webhooks + API keys                               | ✅     |
| Admin Authorization Keys                          | ✅     |
| Resident Portal (Web)                             | ✅     |
| CSRF, rate limiting, encryption                   | ✅     |
| Supervisor override (scanner)                     | ✅     |
| Advanced analytics                                | ✅     |
| Admin dashboard                                   | ✅     |
| Marketing site — full platform                    | ✅     |

### Phase 2 — Resident Portal (Q3-Q4 2026)

The Resident Portal is now live with:

- Visitor pass management
- Quota tracking
- Profile page
- Notifications settings

**Resident Mobile App** — Planned for Phase 2

---

## Documentation Index

| File                            | Description                                                |
| ------------------------------- | ---------------------------------------------------------- |
| `.antigravity/workflows/`             | **Slash commands** — /run, /guide, /plan, /prompt, /github |
| `docs/PRD_v5.0.md`              | **Current** product requirements (5 apps, resident portal) |
| `docs/PROJECT_STRUCTURE.md`     | Detailed structure reference                               |
| `docs/DEVELOPMENT_GUIDE.md`     | Local setup and workspace guide                            |
| `docs/ENVIRONMENT_VARIABLES.md` | All env vars across all apps                               |
| `docs/SECURITY_OVERVIEW.md`     | Security architecture overview                             |
| `docs/DEPLOYMENT_GUIDE.md`      | Deployment instructions                                    |
| `docs/RESIDENT_PORTAL_SPEC.md`  | Resident portal detailed spec                              |
| `docs/DESIGN_TOKENS.md`         | Design system tokens                                       |
| `docs/UI_COMPONENT_LIBRARY.md`  | Shared UI component docs                                   |
| `docs/MVP_DONE_CHECKLIST.md`    | MVP completion tracking                                    |
| `docs/PHASE_2_ROADMAP.md`       | Phase 2 feature roadmap                                    |
| `docs/APP_DESIGN_DOCS.md`       | Application design documentation                           |

---

## Key Constraints for AI Assistants

1. **Package manager**: Always use `pnpm`. Never suggest `npm install` or `yarn`.
2. **Imports**: Use workspace package names (`@gate-access/db`, `@gate-access/types`, etc.) not relative paths across packages.
3. **Multi-tenancy**: Every database query touching tenant data MUST include `organizationId` scope.
4. **Soft deletes**: Filter `deletedAt: null` on all queries — hard deletes are not used.
5. **Auth**: Access tokens expire in 15 minutes. Always handle token refresh. Never store tokens in `localStorage` — use secure cookies.
6. **QR security**: QR payloads must be HMAC-SHA256 signed. Never generate unsigned QR codes.
7. **Offline sync**: Scanner app syncs via `scanUuid` for deduplication — do not break this contract.
8. **Prisma schema location**: `packages/db/prisma/schema.prisma` — run `prisma generate` after any schema change.
9. **No direct DB access from mobile**: Scanner app communicates only through the client-dashboard API.
10. **Turborepo cache**: Build dependencies declared in `turbo.json` — packages must `build` before apps that consume them.
