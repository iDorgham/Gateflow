# Docs & Planning Patterns (v2)

This file captures recurring patterns and best practices discovered while executing plans.

- For legacy patterns, see `docs/archive/plan-legacy/learning/patterns.md`.
- New entries should reference:
  - The initiative (e.g. `docs_v2_refresh`, `core_security_v6`).
  - The phase or PR where the pattern was observed.
  - A short description of the pattern and when to apply it.

---

## Seed Patterns

### Pattern 1 — Single Canonical Spec, Archived History

- **Initiative:** `docs_v2_refresh`
- **Context:** Phase 1 (baseline & archive cleanup)
- **Description:** Keep one canonical PRD (`docs/PRD_v6.0.md`) and archive older versions/specs under `docs/archive/**`. Only ever update the canonical spec going forward.
- **When to apply:** Whenever introducing a new major version of a spec; never keep multiple competing “current” PRD files.

---

## CRM / Entity-Extension Patterns

### Pattern 2 — Additive CRM Schema Extensions

- **Initiative:** `projects_crm_ui`
- **Context:** Phase 1 (CRM data model & API extensions)
- **Description:** When extending existing tenant-scoped entities (Contact, Project) with CRM-style metadata:
  1. Use **nullable columns** for all new fields (no back-fill needed; safe to deploy).
  2. Prefer **enums** (e.g. `ContactSource`, `GateMode`) over free strings for categorical values — keeps data clean and enables future filtering.
  3. Store JSON arrays (e.g. gallery image URLs) as a `Json?` column named `*Json` (e.g. `galleryJson`) to signal the raw type to readers.
  4. `prisma db push` is the dev workflow for this repo (migrate tracking is not active); always generate the client after a push.
  5. Export new enums from `@gate-access/db` and import them in API routes — never import from `@prisma/client` directly.
- **When to apply:** Any time a new batch of nullable CRM-style fields is added to an existing model.

### Pattern 3 — Test Files Require `export {}` for Module Isolation

- **Initiative:** `projects_crm_ui`
- **Context:** Phase 1 — adding `contacts/route.test.ts` and `projects/route.test.ts`
- **Description:** Jest test files that share top-level `const` names (e.g. `mockGetSessionClaims`) across the project must include `export {}` at the top to make them TypeScript modules rather than global scripts. Without this, `tsc --noEmit` reports “Cannot redeclare block-scoped variable”.
- **When to apply:** Every new `*.test.ts` file that declares module-level `const` mocks.

### Pattern 4 — POST Route Tests Need `MockNextRequest`

- **Initiative:** `projects_crm_ui`
- **Context:** Phase 1 — testing POST routes in Jest `node` environment
- **Description:** Jest's `testEnvironment: 'node'` does not fully support the Web `Request` API. Mock `next/server` at the test-file level with a `MockNextRequest` class that implements `.json()` via `JSON.parse(this._body)`. Use `jest.requireMock('next/server').NextRequest` to construct request objects inside tests.
- **When to apply:** Any test file that calls a Next.js App Router handler whose POST body is read via `request.json()`.

