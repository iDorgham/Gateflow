# PROMPT — Phase 01: Live Shift & Gate Telemetry API

**Slug:** `guard_shift_visual_map`  
**Phase:** 01  
**Target App:** `apps/client-dashboard`  
**Primary Role:** BACKEND-API / SECURITY  
**Preferred Tool:** Cursor (or Claude CLI / Gemini CLI)

---

## 1. Objective

Implement the `GET /api/shifts/live` endpoint in `apps/client-dashboard` that returns real-time shift occupancy, active `ShiftLog` sessions, `GateAssignment` schedules, and terminal connectivity metrics scoped strictly to the caller's `organizationId`.

---

## 2. Scope & Touchpoints

- `apps/client-dashboard/src/app/api/shifts/live/route.ts` (NEW)
- `apps/client-dashboard/src/app/api/shifts/live/route.test.ts` (NEW)
- `packages/db` (querying `Gate`, `GateAssignment`, `ShiftLog`, `User`)

---

## 3. Invariants & Rules

- **Multi-Tenancy**: `where: { organizationId: orgId }` mandatory on all queries.
- **Soft Deletes**: Apply `deletedAt: null` on `Gate` and `GateAssignment`. Do NOT apply on `ShiftLog` (no `deletedAt` column).
- **Zero PII Leakage**: Return user display names and avatars for active guards; do not return passwords, password hashes, or sensitive tokens.
- **Performance**: Single-query or Promise.all aggregation to keep response latency $<50\text{ms}$.

---

## 4. Implementation Steps

1. **Route Implementation**:
   - Verify session claims via `getSessionClaims()` from `@/lib/auth-cookies`.
   - Fetch active gates (`deletedAt: null`), active shifts (`ShiftLog` where `endTime: null`), and current scheduled assignments.
   - Aggregate status for each gate:
     - `ACTIVE`: Has a running `ShiftLog` with `endTime: null`.
     - `OVERRUN`: Running `ShiftLog` duration $>8$ hours.
     - `SCHEDULED`: No active `ShiftLog`, but has an active `GateAssignment`.
     - `UNMANNED`: Gate is active, but no guard is currently on shift or assigned.
   - Calculate summary metrics: Total Gates, Active Gates, Unmanned Count, Active Guards.
2. **Automated Testing**:
   - Write comprehensive unit tests for `GET /api/shifts/live`:
     - 401 when unauthenticated.
     - Correct calculation of `ACTIVE`, `UNMANNED`, `OVERRUN` states.
     - Tenant isolation verification.
3. **Phase Log**:
   - Generate `phase_logs/PHASE_LOG_phase_01.md`.

---

## 5. Acceptance Criteria

- [ ] `GET /api/shifts/live` returns `{ success: true, data: { gates, summary } }`.
- [ ] Multi-tenancy strictly enforced with `organizationId`.
- [ ] Unit tests pass via `pnpm turbo test --filter=client-dashboard`.
