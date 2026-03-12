# PROMPT_core_security_v6_phase_6 — Visitor Identity Levels & Privacy/Retention

**Initiative:** core_security_v6  
**Plan:** `docs/plan/execution/PLAN_core_security_v6.md`  
**Phase:** 6 of 6  

---

## Primary role

**SECURITY** (backend, config, access control), **MOBILE** (scanner ID capture flow). Use gf-security for artifact storage and retention; use gf-mobile for scanner UX.

## Preferred tool

**Cursor** (default). **SuperDesign** optional for scanner ID-capture flow if it introduces new screens or significant UX change.

---

## Context

Before and during implementation you **must**:

1. **Load** `.cursor/skills/gf-security/SKILL.md` at the start of implementation.
2. **Respect** `.cursor/rules/00-gateflow-core.mdc` (pnpm only; multi-tenancy; soft deletes; QR HMAC-SHA256; auth; secrets).
3. **Respect** `.cursor/contracts/CONTRACTS.md` as the authoritative invariant list.

Additional references:
- `docs/PRD_v7.0.md` (Section 13.4 Visitor Identity & Trust Levels; Section 8 Security & Compliance; resident privacy, data retention).
- `docs/guides/SECURITY_OVERVIEW.md` (Section 4, 7).
- Phase 5 incidents (artifacts can attach to incident or scan).

---

## Goal

Introduce **visitor identity levels** (0 = name/phone only; 1 = ID photo capture; 2 = ID OCR + matching) as configurable per org/gate; implement scanner flow for Level 1 (ID capture) and store artifact references in a way that is org-scoped and permission-gated. Add **privacy & retention** settings: tenant-level retention for scan logs, visitor history, ID artifacts, and incidents; optional resident-facing toggles (e.g. masking, unit visibility). Document behavior and ensure no cross-org access to artifacts.

---

## Scope (in)

- **Identity level config:** Org or gate setting for required identity level (0, 1, 2). Stored in existing org/gate config or new table; migration if needed. Default 0 (current behavior).
- **Scanner Level 1 flow:** When gate/org requires level 1, scanner prompts guard to capture ID (e.g. front/back); upload or store reference (e.g. attachment id or blob key) with scan or incident. Level 2 can be stub (e.g. “OCR coming later”) or minimal.
- **Artifact storage:** Define where ID images and OCR text live (e.g. encrypted field in DB, or object storage key in DB). API to attach artifact to scan/incident and to retrieve with auth and org check; deny cross-org access.
- **Retention config:** Tenant-level settings for retention of scan logs, visitor history, ID artifacts, incidents (e.g. 6, 12, 24 months). Store in org settings; surface in dashboard. Document how retention is applied; implement scheduled cleanup job or placeholder (e.g. script or cron contract) that respects retention.
- **Resident-facing options (minimal):** Optional toggles for resident: e.g. mask name on landing page, control unit visibility. One or two config keys and UI toggles; no full privacy dashboard in this phase.
- **Tests:** Identity level enforcement (scanner requires capture when level 1); artifact upload and org-scoped retrieval; retention config read/write.
- **Docs:** Update SECURITY_OVERVIEW and PRD-aligned docs for identity levels and retention.

## Scope (out)

- Full OCR pipeline for Level 2 (stub or minimal only).
- Legal hold or regulatory-specific retention logic (document only).
- Hardware integration.

---

## Steps (ordered)

1. **Load security context**  
   Read `.cursor/skills/gf-security/SKILL.md`, `.cursor/contracts/CONTRACTS.md`, and `.cursor/rules/00-gateflow-core.mdc`.

2. **Identity level config**  
   Add `requiredIdentityLevel` (0/1/2) to Organization or Gate (or both with gate override). Migration. Default 0. Dashboard or settings UI to set per org/gate (auth and org scope).

3. **Artifact storage**  
   Decide and implement: either (a) store encrypted blob or base64 in a new table (e.g. ScanAttachment or IncidentAttachment) with organizationId, scanLogId/incidentId, type (id_front, id_back, etc.), or (b) store object storage key in DB with org and scan/incident reference. API: POST to attach (auth, org, scan/incident in same org); GET to retrieve (auth, org, same-org check). No listing of artifacts across orgs.

4. **Scanner Level 1 flow**  
   When required identity level is 1 (and optionally 2): after scan validation, prompt guard to capture ID (e.g. camera or upload). Send image to backend; backend stores artifact and links to scan or incident. Scanner shows success/error. If Level 2: stub “OCR coming later” or minimal field matching (e.g. name on ID vs invite name).

5. **Retention settings**  
   Add org-level settings: e.g. scanLogRetentionMonths, visitorHistoryRetentionMonths, idArtifactRetentionMonths, incidentRetentionMonths. Store in Organization or WorkspaceSettings. Dashboard form to view/edit; only Org Admin or Security Manager. Document behavior: “After X months, data is eligible for deletion” and add placeholder job or script that would delete/anon per retention (or document that manual/script runs later).

6. **Resident toggles (minimal)**  
   Add one or two org or resident-level options: e.g. “maskResidentNameOnLandingPage”, “showUnitOnLandingPage”. Expose in resident settings or org settings; apply in resident portal/landing when rendering guest-facing content.

7. **Tests**  
   Test: set identity level 1 for gate; scanner flow requires capture and artifact is stored; GET artifact with same org succeeds, GET with other org fails. Retention config read/write; no regression on scan when level 0.

8. **Docs**  
   Update SECURITY_OVERVIEW (and PRD-aligned docs): identity levels 0–2, artifact storage and access control, retention config and intended cleanup behavior.

9. **SuperDesign (optional)**  
   If scanner ID-capture flow adds new screens or major UX, run design draft before implementation.

10. **Quality gates**  
    Run `pnpm turbo build`, `pnpm turbo test`, `pnpm turbo lint`, `pnpm turbo typecheck` for touched workspaces.

---

## Acceptance criteria

- [ ] **Security context loaded** — gf-security, 00-gateflow-core.mdc, CONTRACTS.md read at start.
- [ ] **Org scoping** — Identity level config and artifact storage are org-scoped; artifact retrieval denied for other orgs.
- [ ] **Identity level 1** — When required, scanner prompts for ID capture; artifact attached to scan/incident; backend stores and links correctly.
- [ ] **Artifact access control** — Only authorized roles in the same org can retrieve artifacts; tests confirm cross-org denial.
- [ ] **Retention config** — Tenant can set retention for scans, visitor history, ID artifacts, incidents; settings persisted and visible in dashboard; behavior documented.
- [ ] **Resident toggles** — At least one resident-facing option (e.g. mask name or unit visibility) implemented and wired.
- [ ] **Tests** — Identity level enforcement and artifact org-scoping tests pass.
- [ ] **Lint & typecheck** — Pass for touched workspaces.
- [ ] **Build** — `pnpm turbo build` passes.
- [ ] **Docs** — SECURITY_OVERVIEW (and related docs) updated for identity levels and retention.
