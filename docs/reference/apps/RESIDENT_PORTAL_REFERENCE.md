# GateFlow Resident Portal Reference

Comprehensive reference for `apps/resident-portal` including delivered scope, page structure, UI/UX modules, APIs, and service/data domains.

## Coverage Status

- Pages/routes: covered.
- Navigation/menu: covered.
- API routes: covered (exhaustive current inventory).
- UI/UX component inventory: covered.
- Function/service modules: covered.
- DB model mapping: covered at feature-domain level.

## App Purpose

- Resident-facing web portal for managing guest access and resident actions.
- Complements mobile flows with desktop/web-friendly management and visibility.
- Supports portal shell navigation, visitor workflows, open QR workflows, maintenance, history, and profile/notification controls.

## What Has Been Completed

- Portal shell + route group architecture implemented.
- Visitor flows (list/new/detail) implemented.
- Open QR flow implemented (`open-qr/new`).
- History and maintenance sections implemented.
- Profile + notification settings surfaces implemented.
- PWA/offline support components and sync helpers are present.
- Resident push registration and notifications API routes are implemented.

## Application Structure

## Main Route Tree

- Public:
  - `/login`
  - `/no-unit-linked`
- Portal shell group:
  - `/(portal)`
  - `/(portal)/visitors`
  - `/(portal)/visitors/new`
  - `/(portal)/visitors/[id]`
  - `/(portal)/open-qr/new`
  - `/(portal)/history`
  - `/(portal)/maintenance`
  - `/(portal)/profile`
  - `/(portal)/settings/notifications`
- Supporting route-level UX states:
  - loading/error components under portal routes.

## UI/UX Architecture

Primary component domains:

- Layout/navigation:
  - `components/layout/portal-shell.tsx`
  - `components/layout/sidebar.tsx`
  - `components/layout/bottom-nav.tsx`
  - `components/layout/page-header.tsx`
  - `components/layout/quick-create-fab.tsx`
  - `components/layout/nav-items.ts`
- Visitor/access flows:
  - `components/visitors/*`
  - `components/visitor-form.tsx`
  - `components/visitor-qr-card.tsx`
  - `components/open-qr-form.tsx`
  - `components/open-qr-card.tsx`
  - `components/access-rule-selector.tsx`
- History and maintenance:
  - `components/history/history-content.tsx`
  - `components/maintenance/*`
- Profile/settings/common:
  - `components/profile/notification-settings.tsx`
  - `components/quota-progress-circle.tsx`
  - `components/common/*` (loading skeleton, pull-to-refresh, offline banner)
- PWA/offline UX:
  - `components/pwa/pwa-bootstrap.tsx`
  - `components/pwa/offline-qr-cache-client.tsx`

## Navigation / Menu Model

Portal uses a shell-based navigation model with desktop/mobile variants:

- Sidebar + page header for wider layouts.
- Bottom navigation + quick-create FAB for compact/mobile behavior.
- Navigation definition source: `components/layout/nav-items.ts`.

## API Surface (Complete Current Inventory)

All handlers under `apps/resident-portal/src/app/api`:

- `/api/resident/notifications`
- `/api/resident/push/register`

## Function and Service Layer

Primary modules in `src/lib`:

- Auth/session:
  - `auth.ts`
  - `auth-cookies.ts`
- Offline/PWA behavior:
  - `offline-cache.ts`
  - `pending-sync.ts`
  - `sw-register.ts`
- Push notifications:
  - `push-notifications.ts`

Supporting hook:

- `hooks/use-breakpoint.ts`

## DB Model Coverage by Feature Domain

Resident portal primarily interacts with:

- Resident and visitor identity:
  - `User`, `Unit`, `Contact`, `ContactUnit`, `ResidentLimit`.
- Access credentials:
  - `QRCode`, `VisitorQR`, `AccessRule`, `ScanLog`.
- Notifications and communication:
  - `Notification`, `OrganizationCommunicationConfig`, `CommunicationLog`.
- Maintenance flow:
  - `WorkOrder`, `Vendor`.
- Context and tenancy:
  - `Organization`, `Project`.

## Planning Notes for AI Tools

- Treat resident portal as a shell app with adaptive layout and PWA support.
- Keep parity between portal flows and mobile-resident/scanner ecosystem contracts.
- Preserve resident-oriented simplicity while maintaining shared security invariants (tenant scope, signed QR lifecycle).
- Any visitor/open-QR changes should be planned against shared QR/scan data contracts to avoid cross-app drift.
