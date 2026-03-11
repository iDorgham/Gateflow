# Phase 2: Expand AI Tools — Real QR Creation, QR Sets & System Queries

## Primary role
BACKEND-API

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Rules**: All Prisma queries must be org-scoped (`organizationId: claims.orgId`); soft deletes; never expose secrets.
- **Refs**:
  - `app/api/ai/assistant/route.ts` — current route with 4 tools (createProject, createUnit, createQR[stub], getProjectStats[stub])
  - `app/[locale]/dashboard/qrcodes/create/actions.ts` — `createQRCode()` server action (signs payload with HMAC, creates QrShortLink)
  - `@gate-access/types` — `signQRPayload`, `QRCodeType`
  - `packages/db/prisma/schema.prisma` — QRCode, Gate, Project, Contact, Unit, ScanLog models

## Goal
Replace stubbed tools with real implementations and add 6 new query tools so the assistant can answer any question about the organization's data.

## Scope (in)
- **Fix `createQR`**: Accept `count` (1–20), `type` (SINGLE/RECURRING/PERMANENT), `gateId?`, `expiresAt?`, `maxUses?`, `guestName?`, `guestEmail?`. Loop to create `count` QRs using `signQRPayload` + Prisma. Return `{ created: [{ qrId, shortUrl }], count }`.
- **Fix `getProjectStats`** → rename to **`getOrgStats`**: real counts from Prisma (`prisma.project.count`, `prisma.gate.count`, etc.).
- **Add `listProjects`**: returns org projects `{ id, name, gateCount, unitCount, createdAt }` (top 20, ordered by name).
- **Add `listGates`**: returns active gates `{ id, name, projectName, isActive }` (top 20).
- **Add `listContacts`**: optional `search` param, returns matching contacts `{ id, firstName, lastName, email, phone }` (top 10).
- **Add `listRecentScans`**: returns last 20 scan logs `{ id, status, scannedAt, gateName, qrCodeId }`.
- **Add `listUnits`**: optional `projectId?`, `unitType?`, returns `{ id, name, type, building, qrQuota }` (top 20).
- **Update system prompt** to list all available tools and their purpose.
- **Remove** the `/tmp` file log in production — replace with `console.log` or no-op.

## Scope (out)
- `createTask` tool (Phase 3)
- Team chat (Phase 4)

## Steps (ordered)
1. Read `actions.ts` (`qrcodes/create`) to understand `signQRPayload`, `QrShortLink` creation, and env var usage (`QR_SIGNING_SECRET`, `NEXT_PUBLIC_QR_BASE_URL`).
2. In `route.ts`, update `createQR` tool:
   - Parameters: `count: z.number().int().min(1).max(20).default(1)`, `type`, `gateId?`, `expiresAt?`, `maxUses?`, `guestName?`, `guestEmail?`
   - Execute: loop `count` times calling `signQRPayload`, then `prisma.qRCode.create` + `prisma.qrShortLink.create` for each.
   - Return: `{ created: [{ qrId, shortUrl }], count }`
3. Replace `getProjectStats` tool with `getOrgStats`:
   - Real `prisma.project.count`, `gate.count`, `qRCode.count`, `contact.count`, `unit.count`, `scanLog.count`
   - All scoped by `organizationId: claims.orgId`
4. Add `listProjects` tool (parameters: none):
   - `prisma.project.findMany({ where: { organizationId, deletedAt: null }, include: { _count: { select: { gates: true, units: true } } }, orderBy: { name: 'asc' }, take: 20 })`
5. Add `listGates` tool (parameters: `projectId?: string`):
   - `prisma.gate.findMany({ where: { organizationId, deletedAt: null, isActive: true, ...(projectId ? { projectId } : {}) }, take: 20 })`
6. Add `listContacts` tool (parameters: `search?: string`):
   - `prisma.contact.findMany` with optional `OR: [{ firstName contains }, { lastName contains }, { email contains }]`, take: 10.
7. Add `listRecentScans` tool (parameters: `gateId?: string`):
   - `prisma.scanLog.findMany({ where: { gate: { organizationId } }, orderBy: { scannedAt: 'desc' }, take: 20, include: { gate: { select: { name: true } } } })`
8. Add `listUnits` tool (parameters: `projectId?: string, unitType?: string`):
   - `prisma.unit.findMany({ where: { organizationId, deletedAt: null }, take: 20 })`
9. Update system prompt to list all tools by name and purpose.
10. Run `pnpm turbo typecheck --filter=client-dashboard`.
11. Commit: `feat(ai): real QR creation, QR sets, and 6 system query tools (phase 2)`.

## Acceptance criteria
- [ ] Asking the AI "Create 3 single-use QRs for gate X" creates 3 real QR records and returns `shortUrl` for each.
- [ ] `getOrgStats` returns real counts from Prisma (not hardcoded).
- [ ] `listProjects`, `listGates`, `listContacts`, `listRecentScans`, `listUnits` all return org-scoped data.
- [ ] Typecheck passes.
