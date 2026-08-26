# NOTEBOOKLM SOURCE 6: GateFlow Applications Deep Dive

## 1. Application Portfolio Overview

| Application      | Path                    | Type        | Port | Primary Role                                              |
| ---------------- | ----------------------- | ----------- | ---- | --------------------------------------------------------- |
| Marketing        | `apps/marketing`        | Web App     | 3000 | Public acquisition, SEO, content, lead capture            |
| Client Dashboard | `apps/client-dashboard` | Web App     | 3001 | Tenant operations console for property managers           |
| Admin Dashboard  | `apps/admin-dashboard`  | Web App     | 3002 | Platform super-admin governance and CMS                   |
| Resident Portal  | `apps/resident-portal`  | Web App/PWA | 3004 | Resident self-service for guest passes and profile        |
| Scanner App      | `apps/scanner-app`      | Mobile App  | 8081 | Field QR scanner for guards, offline-first                |
| Resident Mobile  | `apps/resident-mobile`  | Mobile App  | 8082 | Native resident app (iOS/Android)                         |
| Design System    | `apps/design-system`    | Web App     | —    | Component catalog / docs (currently build artifacts only) |

---

## 2. Client Dashboard (`apps/client-dashboard`)

### Purpose

Primary tenant-facing operations dashboard. Handles resident CRM, QR issuance, gate monitoring, analytics, workspace governance, and embedded AI workflows.

### Route Tree (`src/app/[locale]`)

- Public/auth: `/`, `/login`, `/join`, `/no-unit-linked`
- Dashboard root: `/dashboard`, `/dashboard/profile`, `/dashboard/onboarding`
- Org-scoped workspace (`/dashboard/organizations/[orgId]`):
  - Overview, analytics, scans, QR codes (create, bulk), projects, gates, team, watchlist, incidents, gate-assignments
  - Residents: contacts, units
  - Maintenance, emulation, AI hub, GateAI
  - Workspace settings: settings, billing, webhooks, API keys
  - Settings sub-tree: team, residents, RBAC, projects, notifications, integrations, gates, billing, API, danger

### API Surface Domains (124 route files)

- `auth/*` — login, logout, refresh
- `ai/*`, `chat`, `gateai/*` — assistant actions, reports, automations
- `analytics/*` — 20+ reporting/export endpoints
- `crm/*`, `resident/*`, `contacts/*`, `units/*` — resident and contact domain
- `qrcodes/*`, `scans/*`, `gates/*`, `watchlist/*`, `incidents`, `scanner-rules` — access operations
- `workspace/*`, `api-keys/*`, `integrations`, `webhooks/*` — workspace governance
- `danger/*`, `setup/*`, `onboarding/*`, `admin/emulate-traffic` — admin/tooling operations

### Key Service Modules (`src/lib`)

- `auth.ts`, `require-auth.ts`, `dashboard-auth.ts`, `auth-cookies.ts`, `csrf.ts`, `api-key-auth.ts`
- `analytics/*` — query builders, filters, PDF/cache helpers
- `ai/*` — AI action/task service, context providers, tools
- `realtime/emit-event.ts` — SSE event stream
- Domain services: `webhook-delivery.ts`, `crm-webhooks.ts`, `marketing-tracking.ts`, `gate-assignment.ts`, `watchlist.ts`, `location.ts`

### Status

✅ Live / feature-complete for MVP. Continuous polish and pilot hardening in progress.

---

## 3. Admin Dashboard (`apps/admin-dashboard`)

### Purpose

Platform-level control plane for super-admins. Manages organizations, users, authorization keys, CMS, intelligence, monitoring, and support.

### Route Tree (`src/app/[locale]`)

- Auth: `/login`
- Dashboard: `/(dashboard)`, `/(dashboard)/redirect`
- Core platform: `/organizations`, `/users`, `/admins`, `/projects`, `/gates`, `/analytics`, `/scans`, `/audit-logs`, `/authorization-keys`, `/finance`, `/intelligence`
- Monitoring: `/monitoring`, `/monitoring/hub`, `/monitoring/seeding`, `/monitoring/emulation`
- CRM/CMS: `/crm`, `/crm/deals`, `/cms/pages`, `/cms/blog`
- Settings: `/settings`, `/settings/api`, `/settings/app-urls`, `/settings/auth`, `/settings/authentication`, `/settings/audit-logs`, `/settings/compliance`, `/settings/database`, `/settings/email`, `/settings/infrastructure`, `/settings/localization`, `/settings/rate-limiting`, `/settings/security`, `/settings/security-policies`, `/settings/style-hub`
- Org-scoped mirrors: `/organizations/[orgId]/*`

### API Surface (61 route files)

- Platform governance: `/api/admin/organizations*`, `/api/admin/users*`, `/api/admin/authorization-keys*`, `/api/admin/reset-tenant`, `/api/admin/seed-hierarchy`
- Monitoring/ops: `/api/admin/health`, `/api/admin/analytics`, `/api/admin/finance`, `/api/admin/emulate-traffic`, `/api/admin/emulation-history*`
- AI/intelligence: `/api/admin/ai/assistant`, `/api/intelligence/chat`, `/api/intelligence/sync`, `/api/tasks/generate`
- CMS/content: `/api/cms/*`
- Design/theming: `/api/organizations/[orgId]/style/*`, `/api/branding/[orgId]`
- CRM: `/api/crm/generate-draft`, `/api/crm/score-lead`
- Auth: `/api/auth/login`, `/api/admin/login`

### Key Service Modules (`src/lib`)

- `admin-auth.ts` — admin session/guard logic
- `branding-css-generator.ts` — style token/CSS generation
- `bot-reactor.ts`, `task-bot-reactor.ts` — automation/task reaction logic
- `notifications.ts` — admin notification workflows

### Status

✅ Live / feature-complete for MVP. Recent work includes AI assistant, traffic emulation, CMS builder, style hub.

---

## 4. Scanner App (`apps/scanner-app`)

### Purpose

High-speed, one-handed mobile field application for security guards at compound gates. Offline-first QR validation and instant check-ins.

### Architecture

- Expo SDK 57 / React Native
- Tab-driven UX (not Next.js App Router)
- Jest unit tests for critical paths

### Tab Navigation

1. **Scanner** — live camera QR scanning
2. **Today** — expected visits / shift summary
3. **Log** — scan history
4. **Chat** — guard/resident communication
5. **Settings** — app/gate preferences

### Core Service Modules (`src/lib`)

- `scanner.ts` — scan lifecycle and API integration
- `qr-verify.ts` — offline QR signature verification (HMAC-SHA256)
- `offline-queue.ts` — encrypted offline queue + bulk sync (`scanUuid` dedup)
- `maintenance-queue.ts` — maintenance report queuing
- `auth-client.ts` — mobile auth with SecureStore
- `security/secure-pin.ts` — supervisor override PIN
- `scan-history.ts` — local history management
- `preferences.ts` — device preferences

### Key Components (`src/components`)

- `ScanResultOverlay.tsx`, `QueueStatusBadge.tsx`, `QueueStatus.tsx`, `DiagnosticsOverlay.tsx`
- `SupervisorOverride.tsx`, `SupervisorOverrideModal.tsx`, `GateSelector.tsx`
- `IDCaptureModal.tsx`, `PassCancelDialog.tsx`, `MaintenanceReportModal.tsx`
- Tab screens: `TodayVisitsTab.tsx`, `HistoryTab.tsx`, `ChatTab.tsx`, `SettingsTab.tsx`

### Security Notes

- Verifies QR signatures locally using shared secret.
- Queues scans offline with AES-256 + PBKDF2 encryption.
- `scanUuid` is the immutable deduplication key for sync.
- Supervisor override uses secure PIN flow.

### Status

✅ Live / MVP complete. Active onboarding wizard and shift-accountability hardening in `Unreleased`.

---

## 5. Resident Mobile (`apps/resident-mobile`)

### Purpose

Native resident self-service app for iOS/Android. Manages guest passes, views history, receives push notifications, and guides guests to the unit.

### Completed Features

- QR list and creation
- Offline QR cache
- Visitor history with date grouping
- Contact picker & OS share sheet
- Push notifications for scan events
- GPS guide for guests
- Arrival notifications
- Settings and profile
- RTL Arabic support
- Jest tests for API routes

### Key Flows

- One-tap express invite
- Access rule selection (one-time, recurring, permanent)
- Quota limits by unit type
- Unit-linked visitor passes

### Status

✅ All 6 phases complete per project dashboard.

---

## 6. Resident Portal (`apps/resident-portal`)

### Purpose

Web/PWA equivalent of resident mobile for desktop or browser-based guest pass management.

### Route Tree

- Public: `/login`, `/no-unit-linked`
- Portal shell (`/(portal)`):
  - `/visitors`, `/visitors/new`, `/visitors/[id]`
  - `/open-qr/new`
  - `/history`
  - `/maintenance`
  - `/profile`
  - `/settings/notifications`

### API Surface

- `/api/resident/notifications`
- `/api/resident/push/register`

### Key Components

- Layout: `portal-shell.tsx`, `sidebar.tsx`, `bottom-nav.tsx`, `page-header.tsx`, `quick-create-fab.tsx`
- Visitor flows: `visitors/*`, `visitor-form.tsx`, `visitor-qr-card.tsx`, `open-qr-form.tsx`, `open-qr-card.tsx`, `access-rule-selector.tsx`
- PWA/offline: `pwa-bootstrap.tsx`, `offline-qr-cache-client.tsx`

### Status

✅ Feature-complete. Recent pilot certification phases in progress (`Unreleased`).

---

## 7. Marketing Site (`apps/marketing`)

### Purpose

Public acquisition and conversion surface. SEO, localized pricing, lead ingestion, blog/content delivery, and marketing attribution.

### Route Tree (`app/[locale]`)

- Core: `/`, `/features`, `/pricing`, `/contact`, `/company`, `/resources`
- Solutions: `/solutions`, `/solutions/compounds`, `/solutions/events`, `/solutions/schools`, `/solutions/clubs`
- Content/legal: `/blog`, `/blog/[slug]`, `/legal/*`, `/help`
- Utility: `/[slug]`, `/s/[shortId]`, `/login`, `/forbidden`, `/unauthorized`, `/resources/playbooks/[vertical]`

### API Surface

- `/api/contact` — lead/contact intake
- `/api/marketing/intent-event` — intent/campaign event tracking
- `/api/revalidate` — incremental content revalidation

### Key UI Modules

- `components/nav.tsx` — desktop/mobile nav + mega menu
- `components/sections/*` — hero, social proof, trust bar, stats, features, how-it-works, comparison, CTA
- Conversion: `contact-form.tsx`, `chat-widget.tsx`, `intent-link.tsx`, `cookie-consent.tsx`

### Marketing Suite Capabilities

- Meta Pixel tracking
- GA4 tracking
- UTM attribution
- CRM webhooks
- Partytown optimization for third-party scripts

### Status

✅ Live / feature-complete. Ongoing SEO and conversion optimization.

---

## 8. Design System (`apps/design-system`)

### Purpose

Interactive Storybook/documentation catalog for shared UI components (`@gateflow/ui`).

### Current Reality

- Standalone `apps/design-system` workspace exists but currently contains build artifacts only (`.next`, `.turbo`, `node_modules`, `public`) and no active source documentation/code.
- Practical design-system usage is distributed across `apps/client-dashboard`, `apps/admin-dashboard`, and `apps/marketing`.
- Source of truth for tokens/components is `packages/ui`.

### Canonical Source Files

- `packages/ui/src/index.ts` — component exports
- `packages/ui/src/tokens.ts` — token contracts
- `packages/ui/src/globals.css` — theme variables
- `packages/ui/src/components/**/*` — shared primitives

### Status

✅ Design system v1.0 launched as npm packages (`@gateflow/tokens`, `@gateflow/theme`, `@gateflow/ui`, `@gateflow/components`, `@gateflow/ai`).
Standalone app is a future revival candidate.

---

## 9. Shared Packages

| Package                   | Path                  | Purpose                                            |
| ------------------------- | --------------------- | -------------------------------------------------- |
| `@gate-access/db`         | `packages/db`         | Prisma schema, client, migrations, seed utilities  |
| `@gate-access/types`      | `packages/types`      | Shared TypeScript contracts and enums              |
| `@gateflow/ui`            | `packages/ui`         | Shared UI component library and design tokens      |
| `@gate-access/i18n`       | `packages/i18n`       | Arabic/English dictionaries and locale hooks       |
| `@gate-access/api-client` | `packages/api-client` | Typed HTTP client wrappers                         |
| `@gate-access/config`     | `packages/config`     | Shared ESLint, TypeScript, Tailwind configurations |
| `@gate-access/utils`      | `packages/utils`      | Cross-cutting helpers (HMAC, formatting, dates)    |
