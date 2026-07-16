# Functions and Services Index Reference (Deep Pass)

This file defines where functional logic lives and how to inventory it quickly.

## Coverage Scope

- Function/service-layer ownership by app/package.
- API method handler inventory method.
- Practical extraction workflow for near-exhaustive function indexing.

## 1) Functional Ownership Model

### App-local service layers

- `apps/client-dashboard/src/lib/**`
- `apps/admin-dashboard/src/lib/**`
- `apps/marketing/lib/**`
- `apps/resident-portal/src/lib/**` (where present)

These own feature-domain logic closest to each app.

### API function handlers

- `apps/*/src/app/api/**/route.ts`
- `apps/marketing/app/api/**/route.ts`

Core exported functions are HTTP method handlers (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).

### Shared service/function layers

- `packages/db/src/**` (DB access, seed utilities, tenant helpers)
- `packages/types/src/**` (cross-app contract types)
- `packages/ui/src/**` (shared UI behavior and design primitives)
- `packages/utils/src/**` (shared utility helpers)
- `packages/api-client/src/**` (API consumption helpers)

## 2) API Method Handler Density (Observed)

Route handlers across dashboard/marketing/resident-portal expose a large set of exported async method functions.

High-density method zones include:

- `client-dashboard`:
  - analytics handlers
  - resident handlers
  - contacts/projects/workspace handlers
  - gates/scans/qrcodes handlers
- `admin-dashboard`:
  - admin governance handlers
  - cms handlers
  - support handlers

## 3) Function Index Extraction Commands

Use this sequence to generate exhaustive function maps per app/package.

- Exported functions (generic):
  - `rg "^export\\s+(async\\s+)?function\\s+\\w+" apps packages`
- Exported const functions:
  - `rg "^export\\s+const\\s+\\w+\\s*=\\s*(async\\s*)?\\(" apps packages`
- API HTTP handlers:
  - `rg "export\\s+async\\s+function\\s+(GET|POST|PUT|PATCH|DELETE)" apps --glob "**/app/api/**/route.ts"`
- Named service utilities by folder:
  - `rg "^export" apps/client-dashboard/src/lib apps/admin-dashboard/src/lib packages/db/src packages/utils/src`

## 4) Function Indexing Strategy for Planning Agents

When an AI tool needs "all functions touching feature X":

1. Start from route family and entry page.
2. Identify called modules under app `src/lib`.
3. Resolve shared dependencies in `packages/db`, `packages/types`, `packages/ui`, `packages/utils`.
4. Build an impact set (readers, writers, validators, side-effects).

## 5) Practical Function Map Template

Use this template for per-feature function index blocks:

- Entry file:
  - path
  - exported handlers/functions
- Called service modules:
  - path
  - exported API
- Shared dependencies:
  - package paths
  - contract/type dependencies
- Side effects:
  - DB writes
  - external API/webhook calls
  - background scheduling/notifications

## 6) Planning Notes for AI Tools

- Do not assume route handler file equals full business logic; always trace into app `lib` and shared packages.
- For high-risk changes, require function-level impact list before edits.
- Include test/update tasks for each touched function cluster in plan phases.
