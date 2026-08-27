---
name: github-pr-review
description: Comprehensive automated Pull Request review, security invariants checking, diff auditing, CI status verification, and safe-merge coordination.
---

# SKILL: GitHub Pull Request Review & Merge Gate

## Purpose

Automate high-precision, multi-dimensional code reviews for GateFlow pull requests. Validate architectural invariants, multi-tenancy scoping, performance budgets, and security posture before authorizing a merge.

---

## 5-Point Review Audit Checklist

When reviewing any Pull Request or branch diff, execute this 5-gate audit:

### Gate 1: Multi-Tenancy & Security Invariants

- **Tenant Isolation**: Every database query touching tenant entities MUST include `organizationId: session.organizationId`.
- **PII Protection**: Ensure national IDs, phone numbers, and license plates are encrypted via AES-256-GCM.
- **Secrets Scan**: Confirm no hardcoded API keys, test JWT secrets, or environment overrides exist in the diff.
- **Soft Deletes**: Only use `deletedAt: null` on models that define `deletedAt`.

### Gate 2: Type Safety & Architecture Integrity

- **No `any` Escapes**: Ensure TypeScript types are strictly defined; no unvetted type assertions (`as any`).
- **Prisma Schema Drift**: Verify migrations are backwards-compatible and use `DIRECT_DATABASE_URL` for direct DDL.
- **API Contracts**: Validate request schemas with Zod and response schemas with `@gate-access/types`.

### Gate 3: UI Design & Arabic RTL Localization

- **ADS Tokens Only**: Disallow raw hex colors; require pure CSS variables (`var(--ds-*)`) or `@gateflow/theme`.
- **Bidirectional RTL**: Verify that layouts use logical spacing (`ms-*`, `me-*`, `ps-*`, `pe-*`) and Cairo Arabic typography.
- **Hydration Safety**: Ensure theme and language switchers do not trigger client-side React hydration mismatches.

### Gate 4: Performance & Core Web Vitals

- **CLS Guard**: Ensure all images and dynamic widgets define explicit aspect ratios / heights ($0.00\text{ CLS}$).
- **Dynamic Imports**: Heavy components (e.g. Recharts, QR Canvas) must be lazy loaded or rendered in client bounds.
- **Server Components**: Prefer React Server Components (RSC) for data fetching where applicable.

### Gate 5: Verification & Proof

- **CI Checks**: Ensure all 15+ CI checks are green (`gh pr checks <pr_number>`).
- **Preflight**: Verify `pnpm preflight` passes locally without skipped tests.
- **Runtime Proof**: Validate `.ai/runtime-proof.json` receipt via `pnpm proof:check`.

---

## Standard Review Commands

```bash
# 1. Inspect PR metadata and diff
gh pr view <pr_number>
gh pr diff <pr_number>

# 2. Check CI status
gh pr checks <pr_number>

# 3. Squash merge once green and authorized
gh pr merge <pr_number> --squash --delete-branch
```
