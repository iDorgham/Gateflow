# One Man Code — SaaS Checklist

SaaS-specific concerns for One Man Code flows. Use when planning or implementing features in a multi-tenant SaaS (e.g. GateFlow client-dashboard, admin-dashboard).

---

## 1. Multi-Tenancy

- [ ] Every query touching tenant data **scoped by `organizationId`** (from auth).
- [ ] No implicit scoping; always include `organizationId` in `where`.
- [ ] Row-level tenant isolation; never return data from another org.

---

## 2. Soft Deletes

- [ ] No hard deletes for mutable tenant data.
- [ ] Queries filter `deletedAt: null`.
- [ ] "Delete" operations set `deletedAt: new Date()`.

---

## 3. RBAC & Auth

- [ ] API routes validate auth **before** any tenant operation.
- [ ] Enforce role (e.g. TENANT_ADMIN, TENANT_USER) and tenant ownership.
- [ ] Tokens short-lived; support refresh/rotation.
- [ ] Never store tokens in `localStorage`; use secure cookies (web) or SecureStore (mobile).

---

## 4. Onboarding & Billing

- [ ] Onboarding flow (first project, first gate) clearly defined.
- [ ] Plan tiers (FREE, PRO, ENTERPRISE) respected where applicable.
- [ ] Billing-related features gated by plan if present.

---

## 5. Audit & Logging

- [ ] Sensitive actions (e.g. export, bulk delete) logged with user id and org.
- [ ] No secrets or full tokens in logs.

---

## 6. Phase Prompt Preference (SaaS)

For typical SaaS features (dashboard, settings, team, integrations):

- **Primary roles:** BACKEND-API + FRONTEND.
- **Skills:** gf-api, gf-security, gf-database (backend); gf-design-guide, react (frontend).
- **MCP:** Prisma-Local (schema), Context7 (docs).

See `.cursor/skills/one-man/SKILL.md` and `docs/plan/ONE_MAN_CODE.md`.
