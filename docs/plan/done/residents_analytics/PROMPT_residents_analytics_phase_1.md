# Pro Prompt — Residents & Analytics: Phase 1 (Schema & API Aggregates)

## Phase 1: Schema & API Aggregates

### Primary role

**BACKEND-Database + BACKEND-API** — Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Preferred tool

- [x] Cursor (default)

### Context

- **Project:** GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps:** client-dashboard (3001), admin-dashboard (3002), scanner-app (8081), marketing (3000)
- **Packages:** db, types, ui, api-client, i18n, config
- **Rules:** pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`); QR HMAC-SHA256; no secrets in git
- **Refs:** CLAUDE.md, packages/db/prisma/schema.prisma, docs/plan/execution/PLAN_residents_analytics.md

### Goal

Add Tag/ContactTag and User.preferences to the schema, then extend GET /api/contacts and GET /api/units with filter params and date-range aggregates (visitsInRange, passesInRange, lastVisitInRange). Expose tag CRUD and user preferences APIs.

### Scope (in)

- Prisma: Tag model (id, name, color, organizationId, deletedAt); ContactTag join (contactId, tagId); User.preferences Json?
- Migration: create and apply; seed predefined tags (family, maid, driver, prospect, agent) per org
- GET /api/contacts: query params dateFrom, dateTo, tagIds[], unitType, search, sort, sortDir, page, pageSize; return visitsInRange, passesInRange, lastVisitInRange per contact (attribution via ContactUnit → Unit → VisitorQR → ScanLog)
- GET /api/units: same query params; return visitsInRange, passesInRange, lastVisitInRange, linkedContactCount; optional "potentialVacancy" when visitsInRange === 0 over 60d
- Tag APIs: GET/POST /api/tags; PATCH/DELETE /api/tags/[id]; POST/DELETE /api/contacts/[id]/tags; POST /api/contacts/tags/bulk
- User preferences: GET/PATCH /api/users/me/preferences (tableViews for contacts/units)
- Zod validation for all new params; requireAuth; org scoping

### Scope (out)

- No UI changes; no React Query or React Table
- No Analytics page changes
- No Redis caching in this phase

### Steps (ordered)

1. In packages/db/prisma/schema.prisma: add Tag (id, name, color, organizationId, deletedAt, @@index), ContactTag (contactId, tagId, @@id), link Contact.tags and Tag.contacts; add User.preferences Json?
2. Run migration: `cd packages/db && npx prisma migrate dev --name add_tag_contact_tag_user_preferences`
3. Add seed for predefined tags (create per organization if needed, or global tags with orgId). Update packages/db/seed if present.
4. Extend GET /api/contacts: parse dateFrom, dateTo, tagIds, unitType, search, sort, sortDir, page, pageSize. Build Prisma where (org, deletedAt, tagIds via ContactTag, unitType via Unit, search on name/email/phone/company). Add subquery or raw for visitsInRange/passesInRange (ScanLog SUCCESS count where QRCode.visitorQR.unitId in contact's unitIds, scannedAt in range). Return in payload.
5. Extend GET /api/units: same pattern; aggregates via VisitorQR → ScanLog; linkedContactCount from ContactUnit; optional potentialVacancy.
6. Create /api/tags route: GET (list by org), POST (create); /api/tags/[id]: PATCH, DELETE. Create /api/contacts/[id]/tags: POST (add tag), DELETE (remove tag). Create /api/contacts/tags/bulk: POST (add/remove tags for multiple contactIds).
7. Create /api/users/me/preferences: GET (return preferences), PATCH (body: { tableViews?: { contacts?: {...}, units?: {...} } }). Validate user from session.
8. Add/update tests for new APIs (org scoping, validation, aggregates).
9. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`; fix any failures.
10. After phase passes: git add, commit (e.g. `feat(residents): schema Tag/ContactTag/User.preferences and API aggregates`), pull --rebase, push.

### Acceptance criteria

- [ ] Migration applies; Tag and ContactTag exist; User has preferences column
- [ ] GET /api/contacts and /api/units accept new params and return visitsInRange, passesInRange, lastVisitInRange (and units: linkedContactCount, potentialVacancy)
- [ ] Tag CRUD and contact tag assign/remove/bulk work; all org-scoped
- [ ] GET/PATCH /api/users/me/preferences work with tableViews
- [ ] `pnpm turbo lint --filter=client-dashboard` passes
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes
- [ ] Tests pass or no regression

### Files likely touched

- packages/db/prisma/schema.prisma
- packages/db/package.json or seed script (if tags seed)
- apps/client-dashboard/src/app/api/contacts/route.ts
- apps/client-dashboard/src/app/api/units/route.ts
- apps/client-dashboard/src/app/api/tags/route.ts (new)
- apps/client-dashboard/src/app/api/tags/[id]/route.ts (new)
- apps/client-dashboard/src/app/api/contacts/[id]/tags/route.ts (new)
- apps/client-dashboard/src/app/api/contacts/tags/bulk/route.ts (new)
- apps/client-dashboard/src/app/api/users/me/preferences/route.ts (new)
