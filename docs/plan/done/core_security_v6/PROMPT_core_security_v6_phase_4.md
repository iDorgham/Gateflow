# PROMPT_core_security_v6_phase_4 — Location Rule (Optional)

**Initiative:** core_security_v6  
**Plan:** `docs/plan/execution/PLAN_core_security_v6.md`  
**Phase:** 4 of 6  

---

## Primary role

**SECURITY** — Use this role's context when implementing. Location rule is an opt-in policy; enforce only when enabled; do not weaken org scoping or auth.

## Preferred tool

**Cursor** (default). Multi-CLI not required.

---

## Context

Before and during implementation you **must**:

1. **Load** `.cursor/skills/gf-security/SKILL.md` at the start of implementation.
2. **Respect** `.cursor/rules/00-gateflow-core.mdc` (pnpm only; multi-tenancy; soft deletes; QR HMAC-SHA256; auth; secrets).
3. **Respect** `.cursor/contracts/CONTRACTS.md` as the authoritative invariant list.

Additional references:
- `docs/PRD_v7.0.md` (Section 13.2–13.3 — Location rule, “Not on Location” behavior).
- `docs/guides/SECURITY_OVERVIEW.md` (Section 6 — Scanner policies).
- Phase 2 gate–account assignment (scanner is already gate-aware).

---

## Goal

Implement the optional **location rule**: when enabled for a gate (or org), a scan is accepted only if the device location is within a configured radius of the gate. Add gate-level (or org-level) configuration for coordinates and radius; scanner sends location in scan context; API enforces distance check and returns a clear error when the rule is on and location is missing or out of range.

---

## Scope (in)

- **Config:** Add latitude, longitude, and radius (e.g. meters) to Gate model (or org-level override). Add a boolean or flag to enable/disable location enforcement per gate (or org). Migration for new fields.
- **API:** Scan and bulk-sync payloads accept optional device location (lat/long). When location rule is enabled for the gate, compute distance from device to gate; if missing or beyond radius, reject scan with clear error code/message (e.g. “Scan only allowed at gate location”).
- **Scanner app:** Capture device location when available (permissions and UX); send location with scan request. When API rejects due to location, show clear message (e.g. “Scanning is only allowed at the gate location for this account”); optionally prompt to enable location or move closer.
- **Docs:** Update `docs/guides/SECURITY_OVERVIEW.md` (and any scanner ops doc) to describe location rule behavior, opt-in, and “location unavailable” behavior.
- **Tests:** Unit/integration tests for “allowed” vs “rejected” based on distance; “rule off” vs “rule on”; missing location when rule on → reject.

## Scope (out)

- Mandatory location (no opt-in); changing gate–account logic from Phase 2.
- Continuous location tracking or geofencing outside of scan moment.
- Hardware integration (barriers, turnstiles).

---

## Steps (ordered)

1. **Load security context**  
   Read `.cursor/skills/gf-security/SKILL.md`, `.cursor/contracts/CONTRACTS.md`, and `.cursor/rules/00-gateflow-core.mdc`.

2. **Schema**  
   In `packages/db/prisma/schema.prisma`, add to `Gate` (or equivalent): `latitude`, `longitude` (Float?), `locationRadiusMeters` (Int?), `locationEnforced` (Boolean? default false). Or add org-level defaults if product prefers. Create and apply migration.

3. **Dashboard config (minimal)**  
   Expose gate (or org) settings for: coordinates, radius, enable/disable location enforcement. Can be a simple form or settings section; ensure auth and org scope. No SuperDesign required unless new full page.

4. **API: accept location in scan**  
   In scan and bulk-sync handlers, accept optional `latitude`, `longitude` (or nested `location`) in request body. Validate with Zod. When `locationEnforced` is true for the gate, require location; if missing, return 400/403 with message. If present, compute distance (e.g. Haversine); if > radius, return 403 with clear message. When `locationEnforced` is false, ignore location for enforcement but may store for audit.

5. **Scanner app**  
   Request location permission when user initiates scan (or on app open if needed). Include lat/long in scan payload when available. Parse API error for location rejection and show localized message; do not store tokens in localStorage.

6. **Tests**  
   Add tests: gate with location on, scan inside radius → success; scan outside radius → rejected; scan without location when rule on → rejected; rule off → location optional, no enforcement. Ensure org scoping and auth unchanged.

7. **Docs**  
   Update `SECURITY_OVERVIEW.md` (and scanner ops if present): location rule is opt-in; when on, scan requires device location within radius; when location unavailable or denied, scan is rejected with clear message.

8. **Quality gates**  
   Run `pnpm turbo build`, `pnpm turbo test` for affected workspaces, `pnpm turbo lint`, `pnpm turbo typecheck`.

---

## Acceptance criteria

- [ ] **Security context loaded** — gf-security, 00-gateflow-core.mdc, CONTRACTS.md read at start.
- [ ] **Org scoping** — All config and scan enforcement remain org-scoped; no cross-tenant bypass.
- [ ] **Location rule opt-in** — Enforcement only when enabled per gate (or org); when off, scans not rejected for location.
- [ ] **Enforcement** — When rule on and location missing or outside radius, scan rejected with clear error; when inside radius, scan accepted (subject to other checks).
- [ ] **Scanner** — Sends location when available; shows clear error when rejected due to location.
- [ ] **Tests** — Distance and “rule on/off” cases covered; no regression on existing scan tests.
- [ ] **Docs** — SECURITY_OVERVIEW (and scanner docs) updated.
- [ ] **Lint & typecheck** — Pass for touched workspaces.
- [ ] **Build** — `pnpm turbo build` passes.
