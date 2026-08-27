---
name: fast-dev
description: Ultra-fast single-shot feature implementation, TDD test scaffolding, minimal architecture, auto-preflight, and automated self-healing.
---

# SKILL: Fast-Dev (High-Speed Single-Shot Engineering)

## Purpose

Enable zero-overhead, high-speed feature development, bugfixing, and refactoring without repetitive multi-round prompt fatigue.

---

## 4-Step Velocity Protocol

### 1. In-Memory Spec & Invariant Resolution (<30s)

- Resolve target workspaces (`apps/*` or `packages/*`).
- Enforce GateFlow non-negotiable invariants:
  - Multi-tenancy: `organizationId: session.organizationId`
  - Privacy: AES-256-GCM encryption on PII fields
  - Styling: Pure CSS tokens (`var(--ds-*)`) & Cairo Arabic RTL
  - Soft Deletes: Only apply `deletedAt: null` if defined in model

### 2. Parallel Implementation

- **Step A: Contracts & DB Queries** (Prisma model calls, validation schemas with Zod).
- **Step B: Frontend / Mobile View** (ADS components, dialogs, state hooks).
- **Step C: Test Suites** (Unit & integration tests covering happy path and fail-closed security edge cases).

### 3. Self-Healing Verification Loop

Run scoped verification command:

```bash
pnpm turbo lint typecheck test --filter=<target-workspace>
```

- If lint fails $\to$ run `eslint --fix` or targeted syntax patch.
- If typecheck fails $\to$ resolve types without using `any`.
- If test fails $\to$ inspect assertion trace and adjust implementation.
- **Never ask the user to fix an error that you can diagnose and resolve automatically.**

### 4. Stage & Commit

```bash
git add <affected-files>
git commit -m "<type>(<scope>): <summary>"
```
