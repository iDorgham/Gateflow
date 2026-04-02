# CONTEXT: Admin Emulation Hub

## Schema Snapshot (Prisma)

- `AiActionLog`: `id`, `organizationId`, `userId` (actor), `actionType`, `prompt`, `intentJson`, `result`, `status`, `metadata`, `createdAt`, `updatedAt`, `deletedAt`.
- `Organization`: `id`, `name`, `status`.
- `Project`: `id`, `organizationId`, `name`, `unitIdFormat`.
- `Gate`: `id`, `organizationId`, `projectId`, `name`.
- `Unit`: `id`, `organizationId`, `projectId`, `name`, `phase`, `building`, `floor`.
- `ScanLog`: `id`, `status`, `gateId`, `qrCodeId`, `scanUuid`.

## Environment

- `ADMIN_ACCESS_KEY`: Required for admin-api auth.
- `QR_SIGNING_SECRET`: Required for HMAC signed QR codes.
- `ALLOW_EMULATION_SEED`: (Optional) Flag to allow writes in prod.

## Key Types (Emulation)

- `RushScenario`: `luxury-compound` | `nightclub` | `private-school` | `wedding-venue`.
- `UnitHierarchyRangeConfig`: `min/max phases`, `min/max buildings`, `min/max floors`.

## Auth Strategy

Admin routes use `isAdminAuthorized(request)` which checks the `x-admin-key` header or a session cookie against the `ADMIN_ACCESS_KEY`. Actor is generally logged as `'system-admin'`.
