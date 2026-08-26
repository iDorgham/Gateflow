# Phase 3: Prisma Migration Safety, Data Retention & Tenant Scoping

## Primary Role

BACKEND-DATABASE / SECURITY

## Tool Selection

- **Tool 1**: Cursor IDE (Migration safety verifier & query auditor)
- **Tool 2**: Opencode CLI (Database policy tests)

## Context

- **Focused Packages**: `packages/db`, `packages/types`
- **Scope**: Migration dry-run contract, `DIRECT_DATABASE_URL` enforcement, tenant scope auditor.
- **Packages**: `@gate-access/db`.

## Goal

Implement automated verification of Prisma migrations, guarantee tenant query scoping (`organizationId` & `deletedAt`), and formalize data retention policies.

## Scope (In)

1. Migration Safety & Dry-Run Contract:
   - Validates environment variable resolution (`DIRECT_DATABASE_URL`) and non-destructive schema changes.
2. Tenant Query Scoping Auditor:
   - Evaluates Prisma query AST/parameters to enforce mandatory `organizationId` and `deletedAt: null` filters.
3. Unit tests:
   - Query filter assertions, soft-delete compliance, migration safety checks.
4. Write `phase_logs/PHASE_LOG_phase_03.md`.

## Acceptance Criteria

- [ ] Migration validator enforces `DIRECT_DATABASE_URL` and safe migration scripts.
- [ ] Tenant auditor detects unscoped queries and flags them immediately.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_03.md` created.
