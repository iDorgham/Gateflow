# PROMPT: Phase 3 — Dynamic RBAC & Privilege Attenuation

**Slug:** `gateflow_security_readiness_mena`  
**Phase:** 3 of 5  
**Primary Role:** `security`  
**Preferred Tool:** `claude` / `cursor`  
**Application Scope:** `apps/client-dashboard`, `apps/admin-dashboard`

---

## Objective

Implement dynamic privilege attenuation, time-bounded guard supervisory delegations, and step-up confirmation challenges for high-risk operations (bulk exports, organization deletion, encryption key rotation) across client and admin dashboards.

---

## Concrete Steps

1. **Privilege Attenuation Claims**:
   - Extend session token verification to support ephemeral capability delegations with strict TTLs (e.g., 2-hour supervisor bypass token).
2. **Step-Up Challenge Middleware (`src/lib/security/step-up-guard.ts`)**:
   - Protect destructive and compliance routes with required step-up PIN / password verification headers.
3. **Dashboard Permission Gate Polish**:
   - Refactor client/admin dashboard route handlers to use declarative permission requirements (`requirePermission(UserPermission.SECURITY_AUDIT)`).
4. **Arabic RTL Localization**:
   - Add localized step-up modal dialogs in Arabic (`ar-EG`, `ar-SA`) and English with clear warning semantics.
5. **Unit Tests**:
   - Test expired delegation rejection, unauthenticated step-up blocking, and valid role escalation paths.

---

## Acceptance Criteria

- [ ] High-risk routes reject requests lacking valid step-up confirmation headers.
- [ ] Ephemeral supervisor tokens expire deterministically at their exact TTL.
- [ ] Step-up dialogs render properly in RTL Arabic and LTR English with ADS design tokens.
- [ ] `pnpm turbo test --filter=client-dashboard --filter=admin-dashboard` passes with 0 failures.
