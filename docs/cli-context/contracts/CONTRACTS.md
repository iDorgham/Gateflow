# GateFlow Code Contracts

Invariants that **all** new or modified code must satisfy. Use for implementation, code review, and AI-assisted generation.

---

## 1. Multi-tenancy

**Contract:** Every database query that touches tenant-scoped data MUST include `organizationId` in the `where` clause.

```ts
// ✅ Correct
where: { organizationId: auth.orgId, deletedAt: null }

// ❌ Violation
where: { id }  // Missing org scope — data leak
```

**Applies to:** All Prisma queries for `Gate`, `QRCode`, `Project`, `User` (when querying by org), `ScanLog` (via gate/QR), `Unit`, `Webhook`, `ApiKey`, etc.

---

## 2. Soft deletes

**Contract:** No hard deletes. All mutable entities have `deletedAt DateTime?`. Queries MUST filter `deletedAt: null`; updates for "delete" set `deletedAt: new Date()`.

```ts
// ✅ Correct
await prisma.gate.update({ where: { id }, data: { deletedAt: new Date() } });

// ❌ Violation
await prisma.gate.delete({ where: { id } });
```

---

## 3. QR security

**Contract:** All QR payloads MUST be HMAC-SHA256 signed. Never generate or accept unsigned QRs.

**Contract:** Scanner sync deduplication key is `scanUuid` — do not change this contract.

---

## 4. Authentication

**Contract:** API routes MUST check auth before any tenant-scoped operation.

- **Cookie auth (web):** `getSessionClaims()`; reject if `!claims?.orgId`
- **Bearer auth (scanner/mobile):** `requireAuth(request)`; use `isNextResponse()` to handle 401

---

## 5. Input validation

**Contract:** All API inputs MUST be validated with Zod before use.

```ts
const schema = z.object({ name: z.string().min(1).max(100) });
const result = schema.safeParse(body);
if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
```

---

## 6. Secrets & tokens

**Contract:** Never commit `.env`, `.env.local`, or any file containing secrets.

**Contract:** Never store access tokens in `localStorage`. Use secure cookies (web) or SecureStore (mobile).

---

## 7. Package manager

**Contract:** Use **pnpm only**. Never `npm` or `yarn`.

---

## 8. Imports

**Contract:** Prefer workspace packages: `@gate-access/db`, `@gate-access/types`, `@gate-access/ui`, `@gate-access/api-client`, `@gate-access/i18n`.

---

## 9. API route security

**Contract:** Every API route that touches tenant data or sensitive operations must follow the GateFlow API security checklist:

1. **Auth first**
   - Use the standard helper for the app (`requireAuth(request)` or equivalent).
   - Reject unauthenticated requests before any tenant‑scoped access.
2. **Role / permission checks**
   - Enforce `UserRole` and tenant ownership before returning or mutating data.
3. **Multi‑tenant scoping**
   - Combine `organizationId` and soft delete filters:
   - `where: { organizationId: auth.orgId, deletedAt: null }`
4. **Input validation**
   - Validate all inputs with Zod before use; reject invalid payloads with 4xx.
5. **Rate limiting (user‑facing or high‑impact routes)**
   - Apply standard rate limiting helpers where abuse is possible (login, QR generation, exports, bulk sync, etc.).
6. **CSRF protection (cookie‑based web flows)**
   - Enforce CSRF checks for mutating requests when cookies are used for auth.
7. **Error handling**
   - Avoid leaking secrets, full tokens, or internal details in responses or logs.

This contract is enforced together with `.cursor/rules/00-gateflow-core.mdc`, `.cursor/rules/gateflow-security.mdc`, and `.cursor/skills/gf-security/SKILL.md`.

---

## 10. SECURITY specialist phases

**Contract:** When a plan phase or task has **Primary role: SECURITY** (see `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`):

- The implementing agent must:
  - Load `.cursor/skills/gf-security/SKILL.md` and `.cursor/contracts/CONTRACTS.md` before making changes.
  - Treat violations of contracts 1–9 as **hard errors**, not optional suggestions.
- Phase prompts (`PROMPT_<slug>_phase_<N>.md`) must:
  - Include security invariants and references under **Context**.
  - Include acceptance criteria that verify:
    - Correct `organizationId` scoping and `deletedAt: null` filtering.
    - QR signing and `scanUuid` dedup invariants.
    - Proper auth/permission checks, validation, rate limiting, and CSRF where applicable.
- Implementation must:
  - Add or update tests to cover security behaviour where it is modified.
  - Avoid introducing new secrets into code, tests, or fixtures.

This contract binds the SECURITY role definition in `SUBAGENT_HIERARCHY.md` to concrete expectations for phases and implementations.

---

## Anti-patterns (never do)

- Hard delete tenant data
- Query without `organizationId` for tenant models
- Skip `deletedAt: null` on tenant queries
- Generate unsigned QR codes
- Store tokens in localStorage
- Use `any` without justification
- Expose raw Prisma client in public APIs
- Add or modify API routes without auth, org scoping, validation, and (where appropriate) CSRF and rate limiting
- Ignore or override SECURITY contracts in this file, `.cursor/rules/00-gateflow-core.mdc`, or `.cursor/rules/gateflow-security.mdc`
