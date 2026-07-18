# API Gateway and Contracts Reference (Deep Pass)

This file maps GateFlow's effective API gateway architecture and route contract landscape.

## Coverage Scope

- API route ownership and gateway model.
- Live route counts and domain group distribution.
- Contract and safety invariants expected across handlers.

## 1) Gateway Architecture (Current Reality)

GateFlow currently uses a distributed gateway model:

- No single standalone gateway service in a separate repo/package.
- Each Next.js app exposes route handlers under `app/api/**/route.ts`.
- Governance is shared through common invariants (tenant scope, soft-delete, auth, security rules), not a single edge gateway process.

Primary API-producing apps:

- `client-dashboard`
- `admin-dashboard`
- `marketing`
- `resident-portal`

## 2) Live API Route Counts (Current Snapshot)

- `client-dashboard`: 124 route files
- `admin-dashboard`: 46 route files
- `marketing`: 3 route files
- `resident-portal`: 2 route files

## 3) Domain Group Distribution (Top-Level API Segment)

### Client Dashboard API groups

- `analytics` (20)
- `resident` (12)
- `contacts` (7)
- `projects` (6)
- `ai` (6)
- `workspace` (5)
- `webhooks` (5)
- plus operational groups (`gates`, `scans`, `qrcodes`, `auth`, `tags`, `tasks`, `team`, `watchlist`, etc.)

### Admin Dashboard API groups

- `admin` (21)
- `cms` (8)
- `support` (4)
- `organizations` (3)
- plus `crm`, `intelligence`, `monitoring`, `auth`, `analytics`, `audit`, `branding`, `tasks`

### Marketing API groups

- `contact` (1)
- `marketing` (2)
- `revalidate` (1)

### Resident Portal API groups

- `resident` (2)

## 4) HTTP Method Surface (Route Handler Pattern)

Route handlers expose method exports:

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`

Method handlers are declared with exported async functions in each `route.ts`.

## 5) Contract and Security Invariants

All API work should preserve:

- Tenant isolation using `organizationId` scoping for tenant data operations.
- Soft-delete safety (`deletedAt: null`) where applicable.
- Auth and role checks appropriate to route sensitivity.
- Validation at request boundaries (payload/path/query).
- Stable response envelopes for client consumption.
- Explicit error status and failure-path consistency.

## 6) API Domain Ownership

- `client-dashboard` API: property operations, scans/QR, residents, analytics, workspace, AI actions.
- `admin-dashboard` API: platform governance, organization admin, CMS, support/intelligence.
- `marketing` API: lead capture and attribution/event ingestion.
- `resident-portal` API: resident-facing notification/push actions.

## 7) Fast Regeneration Commands

- Full API route inventory:
  - `rg --files apps -g "**/app/api/**/route.ts"`
- Route handler methods:
  - `rg "export\\s+async\\s+function\\s+(GET|POST|PUT|PATCH|DELETE)" apps --glob "**/app/api/**/route.ts"`
- Per-app API routes:
  - `rg --files apps/client-dashboard -g "**/app/api/**/route.ts"`
  - `rg --files apps/admin-dashboard -g "**/app/api/**/route.ts"`
  - `rg --files apps/marketing -g "**/app/api/**/route.ts"`
  - `rg --files apps/resident-portal -g "**/app/api/**/route.ts"`

## 8) Planning Notes for AI Tools

- Plan API changes by domain group (for example, `analytics`, `resident`, `admin`, `cms`) to reduce cross-domain regressions.
- If UI and API both change, enforce contract-first sequencing in phased plans.
- Explicitly include auth + tenant checks in each API phase acceptance criteria.
