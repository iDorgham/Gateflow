## Phase 3: Visitor QR creation & quota enforcement (web)

### Primary role

BACKEND-API  
Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

Load these skills when implementing (from `.cursor/skills/`):

- [x] gf-api — API routes, validation, rate limiting
- [x] gf-database — Prisma, queries touching new resident models
- [x] gf-security — auth, RBAC, QR, multi-tenant
- [ ] gf-testing — Jest, test patterns (recommended if adding tests)

### MCP to use

| MCP           | When                                      |
|---------------|-------------------------------------------|
| Prisma-Local  | Inspect & query new resident models       |
| Context7      | Next.js API route patterns, Zod schemas   |

### Preferred tool

- [x] Cursor (default)
- [ ] Gemini CLI — quick structural/schema checks (optional)
- [ ] Multi-CLI — only if additional audit is desired

### Context

- **Apps**: `apps/client-dashboard` (for existing QR APIs), `apps/resident-portal`
- **Packages**: `@gate-access/db`, `@gate-access/types`, `@gate-access/api-client`
- **Rules**:  
  - All API routes must validate auth first and scope by `organizationId`.  
  - Use soft deletes (`deletedAt: null`) where applicable.  
  - All QR payloads must be HMAC-SHA256 signed using `QR_SIGNING_SECRET`.  
  - Input validation via Zod; rate limiting on high-impact routes if needed.
- **Refs**: `docs/SECURITY_OVERVIEW.md`, `.cursor/contracts/CONTRACTS.md`, `apps/client-dashboard/src/app/api/qrcodes/*`, `apps/client-dashboard/src/app/api/qr/*`

### Goal

Allow residents to create and manage visitor and open QRs through resident-portal UI backed by secure, quota-aware APIs that reuse existing QR signing and audit patterns.

### Scope (in)

- Add resident-facing API routes (e.g. `/api/resident/qrs` or similar) to:
  - List existing `VisitorQR` entries for the authenticated resident’s unit(s).
  - Create `VisitorQR` + `AccessRule` records with all four rule types (one-time, date-range, recurring, permanent).
  - Mark visitor QRs as soft-deleted when revoked.
- Enforce `ResidentLimit` quotas:
  - Monthly visitor quota per `UnitType`.
  - `canCreateOpenQR` flag governing eligibility for open QRs.
- Build resident-portal UI to:
  - Display quotas (e.g. used/total).
  - Create new visitor QR with rule type selection and validation.
  - Optionally show the generated QR or shareable link (even if full share flow is done later).

### Scope (out)

- Scanner-side changes (scanner app already validates QR payloads; reuse existing patterns).
- Push notifications and visitor history UI (later phases).

### Steps (ordered)

1. Review existing QR creation APIs in `apps/client-dashboard/src/app/api/qrcodes` and related helpers to understand how QR payloads are signed and what fields are included.
2. Design resident API surface, e.g.:
   - `POST /api/resident/qrs` — create new visitor/open QR with an `AccessRule`.
   - `GET /api/resident/qrs` — list resident visitor QRs (scoped by resident’s unit(s) and `organizationId`).
   - `DELETE /api/resident/qrs/[id]` — soft-delete/revoke a QR.
3. Implement these routes with:
   - Auth guard that ensures the user is RESIDENT and resolves their `Unit`/`organizationId`.
   - Zod validation for request payloads (names, dates, rule types, etc.).
   - Quota checks using `ResidentLimit` and current month usage for that unit and unit type.
   - QR creation that reuses existing QR signing utilities (no new signing scheme).
4. Add any missing Prisma queries in `@gate-access/db` helpers to support resident queries (e.g. counts per unit per month).
5. In `apps/resident-portal`, build pages/forms for:
   - Listing existing visitor QRs with basic status (active, expired, revoked).
   - Creating new visitor/open QR with selection of access rule type and input fields.
   - Showing quota usage (e.g. "3/10 visitors used this month").
6. Add tests:
   - API tests (where pattern exists) for quota enforcement and validation errors.
   - Unit tests for helper functions that compute remaining quota and rule validity.
7. Run:
   - `pnpm turbo lint --filter=@gate-access/db --filter=client-dashboard --filter=resident-portal`
   - `pnpm turbo typecheck --filter=@gate-access/db --filter=client-dashboard --filter=resident-portal`
   - Relevant tests via `pnpm turbo test --filter=client-dashboard` (and resident-portal tests if added).

### SuperDesign (optional — for UI phases)

- **SuperDesign:** Optionally create/iterate a design draft focused on the "Create visitor QR" flow in resident-portal (form layout, quota widget, list view) before heavy UI refinement.

### Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | Map existing QR creation and validation flows | "Trace the existing QR creation flow in `client-dashboard` (UI → API → DB) and summarize how payloads are signed, stored, and validated." |
| **shell** | Run targeted tests | "Run `pnpm turbo test --filter=client-dashboard` and report any failures in QR or scan-related tests." |

### Commands (when to run)

- Before/after phase: `/ready` as needed to ensure clean state and preflight.
- After phase: `/github` — commit API and resident-portal changes with a message like `feat(resident-portal): visitor QR creation and quotas`.

### Acceptance criteria

**Checklist:**

- [ ] Resident APIs for create/list/revoke visitor QRs exist and are fully auth-guarded and org-scoped.
- [ ] Quota logic respects `ResidentLimit` configuration and blocks over-quota creation with clear error messages.
- [ ] All new queries filter by `organizationId` and `deletedAt: null` where applicable.
- [ ] QRs generated for residents are HMAC-SHA256 signed using the existing `QR_SIGNING_SECRET`.
- [ ] Resident-portal UI lets residents view existing visitor QRs and create new ones with appropriate validation.
- [ ] `pnpm turbo lint --filter=@gate-access/db --filter=client-dashboard --filter=resident-portal` passes.
- [ ] `pnpm turbo typecheck --filter=@gate-access/db --filter=client-dashboard --filter=resident-portal` passes.

**Given/When/Then (optional):**

- **Given** a resident with a monthly quota of 5 visitors and 5 active visitor QRs this month, **When** they attempt to create a sixth visitor QR, **Then** the API should reject the request with an over-quota error and no new QR should be persisted.

### Files likely touched

- `apps/client-dashboard/src/app/api/resident/qrs/*` (new)
- `apps/resident-portal/src/app/(dashboard)/visitor-qrs/*`
- `packages/db/prisma/schema.prisma` (if small tweaks are needed)
- `packages/db/src/*` helper functions or repositories
- Shared types in `packages/types` if needed for resident-specific payloads

### Multi-CLI (optional — only for complex/high-risk phases)

Optional: if you want extra audit, you may use a CLI (e.g. Claude or Gemini) to review API routes for multi-tenant scoping and QR signing, but this is not required for the plan to be executable.

