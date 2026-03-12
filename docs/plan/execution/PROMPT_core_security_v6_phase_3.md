# PROMPT_core_security_v6_phase_3 — Gate–Account Assignment (Dashboard UI + Scanner UX)

**Initiative:** core_security_v6  
**Plan:** `docs/plan/execution/PLAN_core_security_v6.md`  
**Phase:** 3 of 6  

---

## Primary role

**FRONTEND** (client-dashboard), **MOBILE** (scanner-app). Use dashboard and mobile UX patterns; ensure accessibility and i18n where applicable.

## Preferred tool

**Cursor** (default). SuperDesign is required for the dashboard gate-assignment screen before implementation.

---

## Context

Before and during implementation you **must**:

1. **Load** `.cursor/skills/gf-security/SKILL.md` at the start of implementation.
2. **Respect** `.cursor/rules/00-gateflow-core.mdc` (pnpm only; multi-tenancy; soft deletes; QR HMAC-SHA256; auth; secrets).
3. **Respect** `.cursor/contracts/CONTRACTS.md` as the authoritative invariant list.

Additional references:
- `docs/PRD_v7.0.md` (Section 13 — Scanner Rules).
- Phase 2 deliverables: assignment API and scanner enforcement. Do not change API contract or enforcement logic; only add UI and refine scanner UX.

---

## Goal

Provide dashboard UI for managing gate–account assignments (assign/unassign users to gates) and ensure scanner app gate selector and messaging are clear and correct when assignments are in use. No changes to Phase 2 model or API behavior.

---

## Scope (in)

- **Dashboard:** New page or section (e.g. under Team or Gates) to:
  - List gates for the org.
  - List users (or team members) for the org.
  - Assign a user to one or more gates; unassign.
  - Show current assignments (e.g. per user or per gate).
- **Scanner app:** Polish gate selector and empty state when user has no assigned gates (clear message, no silent failure).
- **SuperDesign:** Run design draft for the gate-assignment dashboard screen before implementing (create or iterate draft; use output to guide layout and components).

## Scope (out)

- New API endpoints (use Phase 2 APIs only).
- Changes to assignment model, migration, or scan enforcement logic.
- Location rule or other scanner policies (Phase 4).

---

## Steps (ordered)

1. **Load security context**  
   Read `.cursor/skills/gf-security/SKILL.md`, `.cursor/contracts/CONTRACTS.md`, and `.cursor/rules/00-gateflow-core.mdc`.

2. **SuperDesign (run first)**  
   Before coding the dashboard UI:
   - Ensure `.superdesign/init/` exists; run superdesign init if needed.
   - Create or iterate a design draft for the **gate–account assignment** screen (e.g. “Gate assignment management: list gates, list users, assign/unassign with clear feedback”). Use `--context-file` pointing to existing dashboard layout or shell component if available.
   - Use the draft output to guide component structure, layout, and tables/buttons.

3. **Dashboard: gate-assignment page/section**  
   Implement the UI that:
   - Fetches gates and users (existing APIs) and assignments (Phase 2 list API).
   - Allows selecting a user and one or more gates and submitting “assign”; allows removing an assignment (“unassign”).
   - Shows current assignments in a readable form (e.g. table: user ↔ gates).
   - Handles loading and error states; uses existing design tokens and components from `@gate-access/ui` where possible.
   - Is protected by auth and only available to roles with permission to manage team/gates (same as Phase 2 API).

4. **Scanner app UX**  
   Ensure gate selector:
   - Shows only assigned gates when the org has assignments (already enforced in Phase 2; verify UI reflects this).
   - When the user has no assigned gates, shows a clear message (e.g. “No gates assigned. Contact your administrator.”) instead of empty list or generic error.
   - Handles loading and permission/network errors gracefully.

5. **i18n & RTL**  
   Add or reuse translation keys for new copy (dashboard and scanner); ensure RTL layout works if the app supports Arabic.

6. **Quality gates**  
   Run `pnpm turbo lint` and `pnpm turbo typecheck` for `client-dashboard` and `scanner-app`. Run tests; fix any regressions. Optionally run browser-use or manual check: login as admin, open gate-assignment page, assign a user to a gate; login as that user in scanner and confirm only that gate appears.

---

## Acceptance criteria

- [ ] **Security context loaded** — gf-security, 00-gateflow-core.mdc, CONTRACTS.md read at start.
- [ ] **SuperDesign** — Design draft created or iterated for gate-assignment screen; implementation aligns with draft.
- [ ] **Dashboard UI** — Gate-assignment page/section exists; user can assign/unassign users to gates; current assignments visible; auth and permission gating in place.
- [ ] **Scanner UX** — Gate selector shows only assigned gates when applicable; clear message when user has no assigned gates.
- [ ] **No API/model changes** — Phase 2 APIs and schema unchanged; only UI and UX.
- [ ] **Lint & typecheck** — Pass for client-dashboard and scanner-app.
- [ ] **Tests** — No regression in existing tests; optional E2E or manual verification documented or automated.
