# Phase 6: QR Generation, Access Logs & Relational Chain

> **Checklist (mandatory):** `docs/plan/done/advanced_seeding_emulation_v3/SCHEMA_TO_SEEDER_CONTRACT_CHECKLIST.md`

> **Plan:** `docs/plan/done/advanced_seeding_emulation_v3/PLAN_advanced_seeding_emulation_v3.md`

### Primary role

**BACKEND** — **SECURITY** parity required for QR and tenant scope.

### Tool selection

|               | Tool          | Why                                       |
| ------------- | ------------- | ----------------------------------------- |
| **Preferred** | **Cursor**    | Reuse existing QR signing helpers in repo |
| **Fallback**  | **Multi-CLI** | SECURITY + adversarial review             |

### Skills to load

1. `.antigravity/skills/gf-security/SKILL.md` — HMAC-SHA256, `scanUuid`, RBAC patterns
2. `.antigravity/skills/gf-ads/SKILL.md`
3. `.antigravity/rules/00-gateflow-core.mdc`, `.antigravity/contracts/CONTRACTS.md`
4. `.cursor/skills/qr-crypto/SKILL.md` if present — signing details

### Context

- **Depends on:** Phases 1–5.
- **Objective:** Build full chain: **Org → Project → Gate → Unit → Contact → QRCode → VisitorQR → ScanLog** using existing Prisma models and **existing** `QR_SIGNING_SECRET` signing utility (do not invent unsigned payloads).
- **Invariant:** `scanUuid` is dedupe key; every payload signed per CONTRACTS.
- **Exact model mapping:** use actual schema fields (`QRCode.guestName/guestEmail/guestPhone`, `VisitorQR.createdBy`, `Unit.name`, `ScanLog.status/scannedAt/scanUuid`) so client-dashboard tables render without transforms.

### Goal

`packages/db/src/advanced-seed-service.ts` (or `seed/relational-chain.ts`) function `seedRelationalChain(config)` producing a consistent graph for one org with rush-hour scan times.

### Scope (in)

- Wire to existing QR sign/verify in `packages/db` or `packages/types` / app-shared lib — locate with **explore** subagent if needed.
- Create VisitorQR + ScanLog rows with Phase 5 timestamps.
- Use `validateUniqueness` for any exposed codes/ids if applicable.
- Tests: verify signature; verify org isolation; count chain depth.

### Scope (out)

- Public HTTP endpoint (Phase 7).
- Admin UI (Phase 8).

### Steps (ordered)

1. Grep codebase for `QR_SIGNING_SECRET`, `hmac`, `signQr`, etc.
2. Implement chain builder with batch inserts (500 rows).
3. For each scan: stable `scanUuid` (`randomUUID` or deterministic from seed index).
4. Add test that **rejects** tampered payload if verifier exists.
5. `pnpm turbo lint typecheck test --filter=@gate-access/db`
6. Commit: `feat(seeding): phase 6 — QR signing and relational scan chain`

### Security checklist

- [ ] `organizationId` on all queries
- [ ] `deletedAt: null` on reads
- [ ] No duplicate business keys pre-insert
- [ ] QR signing uses **HMAC-SHA256** with `QR_SIGNING_SECRET`
- [ ] `ScanLog` tenancy enforced via nested `qrCode.organizationId` scope (no direct `organizationId` field on `ScanLog`)
- [ ] Audit logging optional here; **required** in Phase 7 for live emulation — stub OK if `AiActionLog` only in API

### Acceptance criteria

- [ ] **Functional:** End-to-end seed for one org creates scans viewable in Prisma Studio.
- [ ] **Security:** All generated QRs pass existing verify helper; no unsigned path.
- [ ] **Data integrity:** FK graph complete; `scanUuid` unique per scan.
- [ ] **Quality:** Lint, typecheck, tests pass for `@gate-access/db`.

### Files likely touched

- `packages/db/src/advanced-seed-service.ts`
- Possibly `packages/db/src/lib/qr-*` (only if consolidating)

### Handoff to Phase 7

Chain callable from serverless route for “live” emulation requests.
