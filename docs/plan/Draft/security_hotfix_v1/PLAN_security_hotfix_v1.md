# PLAN: Critical Security Patches

**Slug:** `security_hotfix_v1`  
**Status:** draft  
**Created:** 2026-04-30  
**Target:** Immediate hotfix window

## Overview

Execute a focused 3-phase security sprint to eliminate high-risk gaps across API auth/tenant scoping, cryptography implementation, and web security headers. This plan is intentionally minimal-scope and release-oriented.

## Objectives

1. Protect `/api/scans/bulk` from unauthenticated and unscoped writes.
2. Remove `crypto-js` usage and standardize encryption to native Node.js `crypto` with AES-256-GCM.
3. Enforce baseline HTTP security headers across all Next.js web apps.

## Hard Invariants

- Tenant isolation: tenant-scoped queries must include `organizationId`.
- Soft-delete safety: read paths should preserve `deletedAt: null` behavior where applicable.
- Security boundaries: auth/RBAC on API handlers, no secret leakage to repo.
- Tooling: `pnpm` only.
- Lifecycle discipline: do not edit this plan file during `/dev` execution; update tasks/logs/session memory instead.

## Phases

| #   | Phase                                              | Tool   | Status |
| --- | -------------------------------------------------- | ------ | ------ |
| 1   | Enforce auth and tenant scoping for scans bulk API | claude | [ ]    |
| 2   | Migrate CryptoJS to native AES-256-GCM utilities   | claude | [ ]    |
| 3   | Add HTTP security headers across Next.js apps      | gemini | [ ]    |

## Prompt Paths (Canonical)

- Phase 1: `phases/01_api_scans_bulk_auth_tenant/PROMPT_phase_01.md`
- Phase 2: `phases/02_crypto_native_aes_gcm/PROMPT_phase_02.md`
- Phase 3: `phases/03_http_security_headers/PROMPT_phase_03.md`

## Dependencies

- Phase 2 should run after Phase 1 if any shared auth/util dependencies are touched.
- Phase 3 can run independently but should execute after Phase 2 to keep verification and rollback simple.

## Verification Gates

- Per phase:
  - Relevant targeted checks for touched app/package.
  - `pnpm preflight` mandatory.
- Final:
  - Re-run `pnpm preflight`.
  - Confirm no `crypto-js` in workspace dependencies/imports.
  - Confirm headers are emitted in all target web apps.

## Rollback Strategy

- Phase-level rollback via git commits per phase.
- If Phase 2 introduces crypto compatibility issues, preserve old ciphertext compatibility via decode fallback (if needed) and document in phase log.
- If Phase 3 CSP is too strict, apply safest reduced CSP that still keeps required protections.
