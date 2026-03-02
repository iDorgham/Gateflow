# Run 1 — CLAUDE CLI (Phase 1 only)

**Run this prompt in Claude CLI first.** After Claude proposes changes, apply them in Cursor and run `pnpm preflight` for client-dashboard and db.

---

You are implementing **Phase 1** of the GateFlow projects_crm_ui plan: **CRM data model & API extensions**.

**Context:** GateFlow monorepo (pnpm, Turborepo). Apps: `apps/client-dashboard` (Next.js 14). Packages: `@gate-access/db`, `@gate-access/types`. Rules: pnpm only; every tenant query must scope by `organizationId`; filter `deletedAt: null` (soft deletes); no secrets in git. Refs: `packages/db/prisma/schema.prisma`, `apps/client-dashboard/src/app/api/`, `.cursor/contracts/CONTRACTS.md`, `docs/SECURITY_OVERVIEW.md`.

**Goal:** Introduce backend fields and API support for richer Project, Contact, Unit, and Gate data so CRM-style UIs can be built later. No UI changes in this phase.

**Scope (in):**
- Extend Contact-related schema: `jobTitle`, `source`, `companyWebsite`, `avatarUrl`, `notes` (nullable where appropriate). Ensure contacts can be related to QR/scan counts if not already.
- Confirm Unit schema has unit type + quotas for analytics/CRM.
- Project: confirm `location`, `website`, `logoUrl`, `coverUrl`; add `gallery` (e.g. JSON or table), `externalUrl`; add boolean/enum for single-gate vs multi-gate.
- Extend GateAssignment only if project-edit UX needs extra metadata.
- Update API handlers: `/api/contacts`, `/api/units`, `/api/projects`, `/api/gates` — accept and validate new fields (Zod), preserve org scope and soft deletes.

**Scope (out):** No UI components; no scanner or auth changes.

**Steps:**
1. Update `packages/db/prisma/schema.prisma` for Contact, Project, Unit, Gate (and GateAssignment if needed). Run migration: `cd packages/db && pnpm prisma migrate dev --name projects_crm_ui_phase_1`.
2. Update `@gate-access/types` if they mirror these models.
3. Update API routes: POST/PATCH for contacts and projects with new fields and Zod validation; GET responses include new fields. Units and gates only as needed. Every query: `organizationId` from auth, `deletedAt: null`.
4. Add or extend minimal backend tests for updated routes.
5. Output: list of files to create/change and code (or patches). Cursor will apply and run `pnpm turbo lint --filter=client-dashboard`, `pnpm turbo typecheck --filter=client-dashboard`, `pnpm turbo test --filter=client-dashboard`.

**Acceptance:** Schema compiles; migration applies; new contact/project fields persisted and returned by APIs; all routes enforce org scope and soft deletes; lint/typecheck/tests pass.
