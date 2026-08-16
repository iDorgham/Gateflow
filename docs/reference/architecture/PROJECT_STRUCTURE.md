# GateFlow — Project Structure Reference

**Last Updated:** August 16, 2026

---

## Repository Overview

GateFlow is a **Turborepo monorepo** containing 7 applications and 12 shared packages, built with Next.js 16, Expo SDK 57/React Native, PostgreSQL + Prisma, and pnpm.

```
Gate-Access/
├── apps/                          # Application workspaces
│   ├── client-dashboard/          # Main SaaS dashboard (Next.js 16)
│   ├── admin-dashboard/           # Platform super-admin (Next.js 16)
│   ├── scanner-app/               # Mobile QR scanner (Expo SDK 57)
│   ├── marketing/                 # Public marketing site (Next.js 16)
│   ├── resident-portal/           # Resident self-service (Next.js 16)
│   ├── resident-mobile/           # Resident mobile app (Expo SDK 57)
│   └── design-system/             # Internal ADS component docs (Next.js 16)
├── packages/                      # Shared libraries
│   ├── db/                        # Prisma schema, client, migrations
│   ├── types/                     # Shared TypeScript types + Zod schemas
│   ├── ui/                        # @gateflow/ui - ADS/Radix UI primitives
│   ├── components/                # @gateflow/components - Composed layouts
│   ├── tokens/                    # @gateflow/tokens - Design tokens
│   ├── theme/                     # @gateflow/theme - Theme layer
│   ├── ai/                        # @gateflow/ai - Agentic AI components
│   ├── config/                    # Shared ESLint/TS/Tailwind configs
│   ├── api-client/                # Shared API client utilities
│   ├── i18n/                      # Internationalization (AR/EN)
│   ├── stripe/                    # Billing integration
│   └── utils/                     # Shared utility functions
├── docs/                          # Project documentation
├── scripts/                       # Ralph automation, checks, AI sync
├── infra/                         # Infrastructure configs
├── .github/workflows/             # CI/CD (10 workflow files)
├── .ai/                           # Workflow v2 runtime state
├── patches/                       # pnpm patchedDependencies (Expo/RN)
├── turbo.json                     # Turborepo pipeline config
├── pnpm-workspace.yaml            # pnpm workspace definition
├── package.json                   # Root scripts (dev, build, lint)
├── tsconfig.json                  # Base TypeScript config
├── tailwind.config.ts             # Shared Tailwind config
└── README.md / CHANGELOG.md
```

---

## Tech Stack

| Layer           | Technology                          | Version    |
| --------------- | ----------------------------------- | ---------- |
| Frontend (Web)  | Next.js (App Router)                | 16.x       |
| Mobile          | Expo / React Native                 | SDK 57     |
| Database        | PostgreSQL                          | 16+        |
| ORM             | Prisma                              | 6.19.x     |
| Auth            | JWT (`jose`) + Argon2id             | Latest     |
| Package Manager | pnpm                                | 8.15       |
| Build System    | Turborepo                           | 2.10.x     |
| UI Components   | Atlassian Design System (ADS) based | —          |
| Styling         | Tailwind CSS                        | 4.x        |
| TypeScript      | TypeScript                          | 5.9.x      |
| React           | React                               | 19.x       |
| QR Signing      | HMAC-SHA256 (native `crypto`)       | Latest     |
| Encryption      | AES-256                             | Latest     |
| Rate Limiting   | Upstash Redis                       | Latest     |
| AI              | Vercel AI SDK                       | 6.x        |
| Offline Storage | AsyncStorage + SecureStore          | —          |

---

## Development Ports

| App              | Port | Command              |
| ---------------- | ---- | -------------------- |
| Marketing        | 3000 | `pnpm dev:marketing` |
| Client Dashboard | 3001 | `pnpm dev:client`    |
| Admin Dashboard  | 3002 | `pnpm dev:admin`     |
| Resident Portal  | 3004 | `pnpm dev:resident`  |
| Design System    | 3005 | `pnpm dev:design`    |
| Scanner App      | 8081 | `pnpm dev:scanner`   |
| Resident Mobile  | 8082 | `pnpm dev:mobile`    |

---

## Database Schema (Prisma)

### Core Models (63 total)

| Domain            | Models                                                                             |
| ----------------- | ---------------------------------------------------------------------------------- |
| **Multi-tenancy** | Organization, Project, User, Role, Invitation                                      |
| **Access**        | Gate, GateAssignment, ShiftLog, QRCode, ScanLog, AccessRule, VisitorQR             |
| **Residents**     | Unit, Contact, ContactUnit, ResidentLimit, WatchlistEntry                          |
| **Security**      | AuditLog, RefreshToken, ApiKey, AdminAuthorizationKey, Incident, ScanAttachment    |
| **Integrations**  | Webhook, WebhookDelivery, QrShortLink, ShortLinkClick, EventLog                    |
| **CRM/Sales**     | Lead, Deal, Tag, ContactTag                                                        |
| **Operations**    | WorkOrder, Vendor, Task, TaskBoard, TaskBot, TaskBotRule, TaskBotRun, Notification |
| **Marketing**     | LandingPage, LandingPageSection, BlogPost, BlogCategory, BlogTag                   |
| **Branding**      | OrganizationBranding, BrandingSnapshot                                             |
| **AI**            | AiTask, AiActionLog, AiAutomation, AiGeneratedAsset, AiUsageLog                    |
| **Knowledge**     | KnowledgeSource, KnowledgeItem                                                     |
| **Comms**         | OrganizationCommunicationConfig, CommunicationLog                                  |
| **Marketplace**   | Merchant, Service, ServiceBooking                                                  |
| **Support**       | SupportTicket, SupportMessage                                                      |

### Key Enums (40+)

Plan, OrganizationType, QRCodeType, ScanStatus, IncidentStatus, WebhookEvent, WebhookDeliveryStatus, ApiScope, UnitType, AccessRuleType, ContactSource, GateMode, EventType, TaskStatus, TaskPriority, Department, MaintenanceStatus, MaintenancePriority, MaintenanceCategory, LeadStatus, DealStage, LandingPageStatus, BlogPostStatus, TicketStatus, and more.

---

## Shared Packages

### Internal Packages (`@gate-access/*`)

| Package      | Purpose                                  |
| ------------ | ---------------------------------------- |
| `db`         | Prisma schema, client, migrations, seed  |
| `types`      | Shared TypeScript types + Zod schemas    |
| `config`     | Shared ESLint, TSConfig, Tailwind        |
| `api-client` | Type-safe API client wrappers            |
| `i18n`       | Arabic/English internationalization      |
| `stripe`     | Billing integration                      |
| `utils`      | Shared utility functions (contrast, etc) |

### Publishable Packages (`@gateflow/*`)

| Package      | Purpose                               |
| ------------ | ------------------------------------- |
| `ui`         | ADS/Radix UI primitives               |
| `components` | Composed product layouts              |
| `tokens`     | Design tokens (OKLCH color system)    |
| `theme`      | Theme layer                           |
| `ai`         | Agentic AI components (glassmorphism) |

---

## CI/CD Workflows

| Workflow     | Trigger       | Purpose                                       |
| ------------ | ------------- | --------------------------------------------- |
| CI           | Push/PR       | lint, typecheck, test, security, performance  |
| Deploy       | Manual        | Vercel deploy per app + optional migration    |
| DB Migrate   | Manual        | Resolve stuck migrations + migrate deploy     |
| Lighthouse   | PR/daily      | PageSpeed audits                              |
| Release      | Tag push      | GitHub releases                               |
| Publish DS   | Push to master| Publish @gateflow/* packages via Changesets   |
| CodeQL       | Scheduled/PR  | Security analysis                             |
| Sync AI      | CI            | AI tool config sync                           |
| PR Labels    | PR            | Size + affected package labels                |

---

## Environment Variables

| Variable              | Used By              | Purpose                        |
| --------------------- | -------------------- | ------------------------------ |
| `DATABASE_URL`        | All apps             | PostgreSQL connection          |
| `DIRECT_DATABASE_URL` | Migrations           | Direct connection for migrate  |
| `NEXTAUTH_SECRET`     | Web apps             | JWT signing secret (min 32ch)  |
| `NEXTAUTH_URL`        | Web apps             | Auth callback base URL         |
| `QR_SIGNING_SECRET`   | client-dashboard     | HMAC-SHA256 QR signing         |
| `ENCRYPTION_MASTER_KEY` | All apps           | AES-256 encryption key         |
| `ADMIN_ACCESS_KEY`    | admin-dashboard      | Admin portal access key        |
| `NEXT_PUBLIC_APP_URL` | client-dashboard     | Public app URL                 |
| `EXPO_PUBLIC_API_URL` | Mobile apps          | Mobile API endpoint            |
| `EXPO_PUBLIC_QR_SECRET` | scanner-app        | QR validation secret           |

---

## Build & Dev Commands

```bash
# Install dependencies
pnpm install

# Quick start (setup + dev)
pnpm setup:dev

# Start specific app in dev mode
pnpm dev:client      # Client Dashboard
pnpm dev:admin       # Admin Dashboard
pnpm dev:marketing   # Marketing Site
pnpm dev:resident    # Resident Portal
pnpm dev:scanner     # Scanner App
pnpm dev:mobile      # Resident Mobile
pnpm dev:design      # Design System

# Build all apps
pnpm build

# Run full preflight (lint + typecheck + test)
pnpm preflight

# Run linting
pnpm turbo lint

# Run type checking
pnpm turbo typecheck

# Run tests
pnpm turbo test

# Database commands
pnpm db:generate     # Generate Prisma client
pnpm db:studio       # Open Prisma Studio

# Quality checks
pnpm check:security  # Dependency vulnerability scan
pnpm check:secrets   # Secret pattern scan
pnpm check:imports   # Circular import detection
pnpm check:todos     # TODO/FIXME report
pnpm check:ads       # ADS design compliance
```

---

## Documentation

| Area        | Path                    | Contents                              |
| ----------- | ----------------------- | ------------------------------------- |
| Reference   | `docs/reference/`       | PRD, architecture, per-app refs       |
| Guides      | `docs/guides/`          | Security, env vars, deployment, UI    |
| Development | `docs/development/`     | Plan templates, guidelines            |
| Plans       | `docs/plan/`            | Draft / Ready / Active / Complete     |
| Workspace   | `docs/workspace/`       | Multi-tool AI config mirror           |

---

## Production Domains

| App              | Domain                    |
| ---------------- | ------------------------- |
| Marketing        | www.gateflow.site         |
| Client Dashboard | app.gateflow.site         |
| Resident Portal  | portal.gateflow.site      |
| Design System    | design.gateflow.site      |
