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

---

## Dashboard UI Patterns

### Pattern 5 — Shared `PageHeader` Component for All Dashboard Pages

- **Initiative:** `dashboard_polish`
- **Context:** Phase 2
- **Description:** Extract the page title + subtitle + badge + actions block into a single `PageHeader` component (`components/dashboard/page-header.tsx`). Use `text-xl font-black uppercase tracking-tight` for the title — never define it per-page. Pages wrap content in `<div className="space-y-6">` for consistent section spacing.
- **When to apply:** Every new dashboard page that has a title, subtitle, or top-level action buttons.

### Pattern 6 — Composable `FilterBar` Sub-components

- **Initiative:** `dashboard_polish`
- **Context:** Phase 3
- **Description:** Define filter UIs as composable primitives on a `FilterBar` namespace (`FilterBar.Search`, `FilterBar.Select`, `FilterBar.DatePresets`, `FilterBar.Divider`) rather than per-page implementations. The container uses `rounded-2xl border bg-card px-4 py-3 flex flex-wrap gap-2`. Sub-components use `h-9 rounded-xl` for consistent control height.
- **When to apply:** Any page with search, sort, or date filter controls.

### Pattern 7 — Server-Side Search with 300ms Debounce

- **Initiative:** `watchlist_ui`
- **Context:** Phase 2
- **Description:** For scalability, push search/filter to the server rather than filtering a client-side array. Use a `useRef`-based debounce timer (300ms) — not `useDebounce` hook — to limit API calls. The search input controls local state immediately; the fetch fires after debounce. A loading indicator appears in the search input while the request is in flight.
- **When to apply:** Any page where the data set may grow large enough to make client-side filtering unreliable (watchlist, contacts, QR codes, etc.).

### Pattern 8 — Stats Computed from Full Load, Not Search Results

- **Initiative:** `watchlist_ui`
- **Context:** Phase 2
- **Description:** When a page has a stats row (total, this month, last added), compute stats from the initial full-fetch result and store them separately. Do not recompute stats from the search-filtered result — users expect stats to reflect totals, not the current search scope.
- **When to apply:** Any page that shows aggregate stats alongside a searchable/filterable table.

### Pattern 9 — Plan Folder Lifecycle: `planning/` → `done/`

- **Initiative:** `docs_v2_refresh`
- **Context:** Phase 3
- **Description:** When all phases in a plan are complete, move the plan folder from `docs/plan/planning/<slug>/` to `docs/plan/done/<slug>/` using `git mv`. This keeps `planning/` clean (only active work) and gives `done/` value as a searchable archive of patterns and prompts. Workflow files (ONE_MAN_*.md, lifecycle guides) belong in `docs/plan/guides/`, not the root.
- **When to apply:** After marking the last phase of any plan as complete in TASKS_<slug>.md.

