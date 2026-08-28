# Session Memory — `guard_patrol_checkpoints`

## Plan Details

- **Slug**: `guard_patrol_checkpoints`
- **Total Phases**: 3
- **Primary Workspaces**: `apps/client-dashboard`, `packages/db`, `packages/types`, `packages/security`

## Invariants & Architecture

1. **Multi-Tenancy**: All DB queries require `where: { organizationId, deletedAt: null }`.
2. **Cryptographic Checkpoint Integrity**: Checkpoint QR codes use HMAC-SHA256 with nonce and timestamp.
3. **ADS Styling**: Design system tokens from `@gate-access/ui/tokens`, full dark mode support, and Arabic RTL layout mirroring.
