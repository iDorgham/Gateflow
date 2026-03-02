---
description: GateFlow security rules and SECURITY specialist agent guidance
globs: *
alwaysApply: true
---

# GateFlow — Security Rules & Specialist Agents

Security in GateFlow is enforced by **core rules**, **code contracts**, and a dedicated **SECURITY specialist role**. This rule binds them together for Cursor, CLIs, and other tools.

**Primary references**

- `.cursor/rules/00-gateflow-core.mdc` — core security and multi‑tenancy rules.
- `.cursor/contracts/CONTRACTS.md` — invariants for multi‑tenancy, soft deletes, QR security, auth, validation, secrets, pnpm, and imports.
- `.cursor/skills/gf-security/SKILL.md` — detailed security skill (auth stack, RBAC, API checklist, QR + mobile security).
- `docs/SECURITY_OVERVIEW.md`, `docs/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md` — architecture‑level security docs.
- `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` — SECURITY role responsibilities and CLI prefix.

All agents and tools must **load and respect** these when working on security‑sensitive code.

---

## 1. Security Invariants (Must Never Be Broken)

These invariants are **non‑negotiable** and apply to all apps and packages:

- **Multi‑tenancy**
  - Every database query that touches tenant data must scope by `organizationId`.
  - Never rely on implicit scoping; always include `organizationId` explicitly.
- **Soft deletes**
  - No hard deletes for mutable tenant data.
  - Queries must filter `deletedAt: null`; “delete” operations set `deletedAt: new Date()`.
- **QR security & scanner invariants**
  - All QR payloads must be **HMAC‑SHA256 signed** using `QR_SIGNING_SECRET`.
  - Never generate or accept unsigned QRs.
  - Scanner sync deduplication key is **`scanUuid`** — do not change or overload this contract.
- **Auth and tokens**
  - API routes must validate auth **before** any tenant operation.
  - Access tokens are short‑lived; always support refresh/rotation flows.
  - Tokens must not be stored in `localStorage`; use secure cookies (web) or SecureStore (mobile).
- **Secrets**
  - Never commit `.env` or `.env.local`.
  - Use `.env.example` with placeholders only.
  - For security‑critical env vars (JWT secrets, QR signing key, DB URL, Redis tokens), fail‑closed rather than falling back to unsafe defaults.

These invariants are defined in `.cursor/rules/00-gateflow-core.mdc` and `.cursor/contracts/CONTRACTS.md` and are repeated here for emphasis.

---

## 2. API Route Security Checklist

For **every** API endpoint (especially under `apps/client-dashboard/src/app/api/` and any future resident/portal APIs):

1. **Auth first**
   - Use `requireAuth(request)` or the project‑standard auth helper for the app.
   - If auth fails, return an appropriate 4xx response immediately.
2. **Role / permission check**
   - Enforce RBAC (`UserRole`) and tenant ownership before accessing data.
3. **Multi‑tenant scope**
   - Scope all queries by `organizationId` from auth claims.
   - Combine with soft delete filter: `where: { organizationId: orgId, deletedAt: null }`.
4. **Input validation**
   - Validate all inputs with Zod before use; reject invalid payloads with 4xx.
5. **Rate limiting (user‑facing or high‑impact routes)**
   - Apply rate limiting via the standard helper for login, QR creation, exports, and any route that can be abused.
6. **CSRF protection (web POST/PUT/PATCH/DELETE)**
   - Enforce CSRF checks where cookies are used for auth (client dashboard, resident portal).
7. **Logging & error handling**
   - Avoid leaking secrets or full tokens in logs or error messages.

This checklist mirrors `.cursor/skills/gf-security/SKILL.md` and must be followed for **all** new or modified API routes.

---

## 3. QR, Scanner, and Mobile Security

When working on QR generation, scanner app flows, or resident‑side QR use:

- **QR generation (server‑side)**
  - Always sign payloads with HMAC‑SHA256 (`QR_SIGNING_SECRET`).
  - Include only the minimum required fields in payloads; never embed secrets.
- **Scanner app**
  - Preserve the `scanUuid` offline queue dedup contract.
  - Use AES‑256 + PBKDF2 for offline queue encryption (per existing implementation).
  - Store tokens only in SecureStore (never AsyncStorage for auth).
- **Resident portal / mobile**
  - Treat resident‑generated visitor QRs as fully scoped by `organizationId` and configured access rules.
  - Apply the same signing and validation rules as platform‑generated QRs.

Any change that touches these areas should be treated as **SECURITY‑critical** and executed under a SECURITY‑primary phase.

---

## 4. SECURITY Specialist Agent Rules

The **SECURITY** role is defined in `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` and used across Cursor and CLIs (Claude, Opencode, Gemini). When a phase or task has **Primary role: SECURITY**:

- **Adopt the security persona**
  - Use the canonical prefix from `SUBAGENT_HIERARCHY.md` (e.g. “You are the GateFlow Security Specialist…”).
  - In Cursor, adopt the security role agent from `.cursor/agents/roles/security.md` (via orchestrator) when available.
- **Load the right skills and docs**
  - Always load `.cursor/skills/gf-security/SKILL.md` before changing auth, RBAC, QR, scanner sync, or any tenant‑scoped API.
  - Cross‑check invariants in `.cursor/contracts/CONTRACTS.md` and `.cursor/rules/00-gateflow-core.mdc`.
  - For deeper context, read `docs/SECURITY_OVERVIEW.md`.
- **Treat violations as hard errors**
  - Missing `organizationId` scope, missing `deletedAt: null`, unsigned QR generation, storing tokens in `localStorage`, or committing secrets are **hard violations**, not minor suggestions.
  - SECURITY agents must propose concrete fixes, not just comments.
- **Phase responsibilities**
  - For SECURITY‑primary phases in `PLAN_<slug>.md` / `PROMPT_<slug>_phase_<N>.md`:
    - Ensure acceptance criteria include checks for multi‑tenant scoping, soft deletes, QR signing, auth flows, and secrets handling.
    - Prefer adding focused tests (e.g. auth/permission tests, org leakage tests, QR verification tests) as part of the phase.

---

## 5. Phased Plans and Security‑Critical Work

When creating or executing phased plans that include security‑critical work:

- **Planning**
  - Use `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` and `.cursor/skills/gf-planner/SKILL.md`.
  - For any phase that changes auth, RBAC, QR flows, scanner sync, or tenant data access, set **Primary role: SECURITY** in the phase definition.
- **Phase prompts**
  - In `docs/plan/execution/PROMPT_<slug>_phase_<N>.md` for SECURITY phases:
    - Call out `.cursor/skills/gf-security/SKILL.md` and `.cursor/contracts/CONTRACTS.md` under **Context**.
    - Add explicit steps to verify organization scoping, soft delete filtering, QR signing, and secrets handling.
    - Include acceptance criteria that require these invariants to hold and relevant tests to pass.
- **Multi‑CLI usage**
  - Multi‑CLI (e.g. Claude + Gemini) may be used for SECURITY phases **only** when the phase is complex or high‑risk (as per `AI_SKILLS_SUBAGENTS_RULES.md` and `.cursor/skills/gf-planner/SKILL.md`).
  - SECURITY agents must resolve disagreements conservatively: choose the option that best preserves invariants and least widens the attack surface.

---

## 6. How Other Tools Should Use This Rule

For Kiro, Antigravity, and CLIs:

- Index this file alongside:
  - `GATEFLOW_CONFIG.md`
  - `.cursor/rules/00-gateflow-core.mdc`
  - `.cursor/contracts/CONTRACTS.md`
  - `.cursor/skills/gf-security/SKILL.md`
  - `docs/SECURITY_OVERVIEW.md`
- When a task is tagged as SECURITY‑related or a phase has **Primary role: SECURITY**:
  - Apply this rule’s invariants and checklists before generating code.
  - Refuse or flag suggestions that would break the contracts listed above.

