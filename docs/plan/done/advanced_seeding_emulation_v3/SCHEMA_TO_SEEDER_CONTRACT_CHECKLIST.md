# Schema-to-Seeder Contract Checklist (Reusable for `/dev`)

Use this checklist at the end of **every phase** that touches seeding, emulation APIs, or dashboard data contracts.

---

## 0) Required context loaded

- [ ] `.antigravity/rules/00-gateflow-core.mdc`
- [ ] `.antigravity/contracts/CONTRACTS.md`
- [ ] `docs/plan/done/advanced_seeding_emulation_v3/PLAN_advanced_seeding_emulation_v3.md`
- [ ] Active phase prompt (`PROMPT_advanced_seeding_emulation_v3_phase_N.md`)
- [ ] `docs/Pasted_Text_1774974939864.txt` (for scenario and temporal realism constants)

---

## 1) Prisma schema contract (must match exactly)

Reference: `packages/db/prisma/schema.prisma`

### Contact

- [ ] Seeder writes `Contact.firstName` and `Contact.lastName` (not a single `name` field)
- [ ] Seeder uses dashboard-visible fields: `email`, `phone`, `jobTitle`, `company`
- [ ] Seeder sets `organizationId` on every `Contact`
- [ ] Seeder does not read soft-deleted records unless explicitly intended (`deletedAt: null` on reads)

### Unit

- [ ] Seeder writes unit identifier to **`Unit.name`** (dashboard reads `name`)
- [ ] Seeder writes `Unit.type` using valid enum values
- [ ] Seeder writes optional `building`, `sizeSqm` where applicable
- [ ] Seeder sets `organizationId` and (when applicable) `projectId`
- [ ] Uniqueness assumptions align with schema (`@@unique([organizationId, name])`)

### QRCode

- [ ] Seeder writes `code`, `type`, `isActive`, `currentUses`, `maxUses`, `expiresAt`, `createdAt`
- [ ] Seeder writes relation fields used by dashboard/API: `projectId`, `gateId`, `contactId`
- [ ] Seeder writes guest fields used by UI: `guestName`, `guestEmail`, `guestPhone`
- [ ] Seeder sets `organizationId`
- [ ] Seeder avoids deleted rows in reads (`deletedAt: null`)

### VisitorQR

- [ ] Seeder writes `qrCodeId`, `unitId`, `visitorName`, `visitorPhone`, `visitorEmail`, `isOpenQR`, `createdBy`
- [ ] Team is aware `VisitorQR` has **no direct `organizationId` field**; tenant safety is enforced through related `QRCode` and `Unit`

### ScanLog

- [ ] Seeder writes `status`, `scannedAt`, `gateId`, `qrCodeId`, `scanUuid`, optional `deviceId`, optional `userId`
- [ ] Team is aware `ScanLog` has **no direct `organizationId` field**
- [ ] Tenant scoping for scans is relation-scoped: `scanLog -> qrCode.organizationId`

---

## 2) Client-dashboard data contract alignment

### Contacts table/API

References:

- `apps/client-dashboard/src/components/crm/ContactTable.tsx`
- `apps/client-dashboard/src/app/api/crm/contacts/route.ts`

- [ ] Seeded contacts render correctly in CRM table without adapter hacks
- [ ] `/api/crm/contacts` returns expected shape and values from seeded data
- [ ] Contact-unit relationships appear in `units[]` badge list

### Units table/API

References:

- `apps/client-dashboard/src/components/crm/UnitTable.tsx`
- `apps/client-dashboard/src/app/api/crm/units/route.ts`

- [ ] `Unit.name` appears as unit identifier in table
- [ ] `type`, `building`, `sizeSqm` are populated and sortable where expected
- [ ] Unit-contact assignments render in residents/avatars

### QR table/API

References:

- `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesTable.tsx`
- `apps/client-dashboard/src/app/api/qrcodes/route.ts`
- `apps/client-dashboard/src/lib/qrcodes/use-qrcodes.ts`

- [ ] `/api/qrcodes` row fields match frontend contract (`id`, `code`, `type`, `status`, `createdAt`, `expiresAt`, `isActive`, `currentUses`, `maxUses`, `scansCount`, `lastScanAt`, `gateName`, `projectName`, `guestName`, `guestEmail`, `guestPhone`, `contactId`)
- [ ] Derived status logic (`ACTIVE`, `INACTIVE`, `EXPIRED`, `MAX_USES_REACHED`) behaves with seeded values
- [ ] `scansCount` and last scan timestamp reflect seeded `ScanLog` records

### Scans page

References:

- `apps/client-dashboard/src/components/dashboard/scans/ScansTable.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/scans/page.tsx`

- [ ] Seeded scans render with gate, operator, timestamp, status, QR code/project
- [ ] Relation-scoped filter by `qrCode.organizationId` works for tenant isolation
- [ ] Statuses in seed data are valid `ScanStatus` enum values used by page filters

---

## 3) Security hard gates (must pass every phase)

- [ ] **Organization scope:** all tenant queries include `organizationId` (directly or relation-scoped when model has no org column)
- [ ] **Soft delete filter:** reads include `deletedAt: null` where applicable
- [ ] **QR signing:** all generated QR payloads are HMAC-SHA256 signed with `QR_SIGNING_SECRET`
- [ ] **No unsigned QR path:** verify path rejects tampered/unsigned payloads
- [ ] **Emulation API auth:** Super Admin only
- [ ] **Emulation API rate limit:** 5 requests/hour/admin (or stricter) with proper 429 behavior
- [ ] **Audit logging:** emulation actions logged (`AiActionLog`) without leaking secrets

---

## 4) Seeder behavior quality gates

- [ ] Deterministic mode with `seed/randomSeed` produces reproducible outputs
- [ ] Batch inserts are bounded (target around 500 rows/chunk)
- [ ] Pre-insert duplicate validation runs for key fields (`id`, `phone`, `email`, unit identifier mapped to `Unit.name`)
- [ ] Scenario knobs supported as documented: `scenario`, `scans|totalScans`, `pastDays`, `incidentRate`, `seed|randomSeed`
- [ ] Rush-hour model includes weighted peaks plus baseline traffic (non-rush valleys)

---

## 5) Verification commands (run per touched workspace)

```bash
pnpm turbo lint --filter=@gate-access/db --filter=client-dashboard
pnpm turbo typecheck --filter=@gate-access/db --filter=client-dashboard
pnpm turbo test --filter=@gate-access/db --filter=client-dashboard
```

Optional smoke checks:

```bash
pnpm prisma db seed -- --dry-run
pnpm prisma db seed -- --test-integrity=true
pnpm prisma db seed -- --scenario=luxury-compound --scans=5000 --pastDays=45 --incidentRate=0.12 --seed=12345
```

---

## 6) Phase completion sign-off

- [ ] All applicable checks above are green
- [ ] Phase prompt acceptance criteria are satisfied
- [ ] Any schema/API contract changes were reflected in this checklist and the active phase prompt
