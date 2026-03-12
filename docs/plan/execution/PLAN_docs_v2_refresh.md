# PLAN_docs_v2_refresh — Docs v2 Refresh (PRD v6 Aligned)

**Initiative:** Docs v2 refresh  
**Source idea:** `docs/plan/context/IDEA_docs_v2_refresh.md`  
**Primary product spec:** `docs/PRD_v7.0.md`  
**Owner:** Product + Engineering  
**Status:** Not started  

---

## 1. Objectives

- Make `docs/PRD_v7.0.md` the **single canonical PRD**.
- Replace the ad‑hoc docs tree with a **small, high-signal set** of guides aligned to PRD v6.
- Rebuild `docs/plan/` so it is **exclusively driven** by `/idea`, `/plan`, `/dev`, `/ship` flows and shared templates.
- Highlight GateFlow’s value as a **must‑have security tool** for gated communities in the docs set (visitor identity, guard accountability, scanner policies, resident safety).

---

## 2. High-Level Phases

1. **Phase 1 — Baseline & Archive Cleanup**
2. **Phase 2 — Core Guides v2**
3. **Phase 3 — Plan Folder & Workflows**
4. **Phase 4 — Extended Guides & Learning Docs**

Each phase is expected to be small enough to run as a single `/dev` execution when scheduled.

---

## 3. Phase 1 — Baseline & Archive Cleanup

**Goal:** Ensure the PRD and docs tree have a clean baseline for further work.

**Scope:**

- Confirm `docs/PRD_v7.0.md` content matches archived `docs/archive/plan-legacy/phase-1-mvp/specs/PRD_v7.0.md`.
- Ensure **all legacy planning docs** live under `docs/archive/plan-legacy/**`.
- Keep `docs/plan/` present but logically empty of old content (only new IDEA/PLAN/PROMPT files going forward).

**Key tasks:**

- [ ] Validate that `docs/PRD_v7.0.md` is complete and consistent (no TODOs or dangling references to v5 as “current”).
- [ ] Confirm `docs/archive/plan-legacy/**` contains all prior `docs/plan/**` content.
- [ ] Verify `docs/plan/` contains only:
  - `context/IDEA_docs_v2_refresh.md` (this initiative).
  - Any newly created PLAN/PROMPT files (from this plan).
- [ ] Add or update a very small `docs/README.md` that:
  - Points to `PRD_v7.0.md` as the canonical spec.
  - Briefly explains that legacy docs are under `docs/archive/**`.

**Acceptance criteria:**

- There is **exactly one** canonical PRD file referenced as current: `docs/PRD_v7.0.md`.
- Old docs are preserved under `docs/archive/**` and no longer mixed with v2 docs.
- New contributors can see from `docs/README.md` where to start.

---

## 4. Phase 2 — Core Guides v2

**Goal:** Create a minimal but complete set of **core guides** aligned to PRD v6.

**Target files (in `docs/guides/`):**

- `ARCHITECTURE.md`
- `SECURITY_OVERVIEW.md`
- `DEVELOPMENT_GUIDE.md`
- `ENVIRONMENT_VARIABLES.md`

**Approach:**

- Use `PRD_v7.0.md`, `CLAUDE.md`, `GATEFLOW_CONFIG.md`, and relevant archived docs as input only.
- Apply the `content-creation` and `pro-prd-writer` skills for language and structure.
- Keep each guide concise and scannable (tables, sections, no duplication of PRD).

**Key tasks:**

- [ ] `ARCHITECTURE.md`
  - High-level system diagram (apps, packages, data layer).
  - Summary of flows: QR lifecycle, scanner, resident portal, marketing suite.
- [ ] `SECURITY_OVERVIEW.md`
  - Multi-tenancy, soft deletes, QR signing, scanner invariants.
  - New v6 elements: visitor identity levels, watchlists, guard shifts/incidents, scanner policies.
  - Link explicitly to `.cursor/rules/*` and `CONTRACTS.md`.
- [ ] `DEVELOPMENT_GUIDE.md`
  - Local setup, pnpm/Turborepo commands, app dev workflows.
  - How to use `/idea`, `/plan`, `/dev`, `/ship` with this repo.
- [ ] `ENVIRONMENT_VARIABLES.md`
  - Consolidated table of env vars per app (client-dashboard, scanner-app, resident-portal, resident-mobile, admin-dashboard, marketing).

**Acceptance criteria:**

- All four guides exist, pass basic lint/format checks, and are internally consistent with `PRD_v7.0.md`.
- No guide duplicates PRD text unnecessarily; they summarize and point back to PRD where needed.

---

## 5. Phase 3 — Plan Folder & Workflows

**Goal:** Recreate `docs/plan/` as a **plan-native** space driven by `/idea` and `/plan`.

**Target structure:**

```text
docs/plan/
  context/
    IDEA_docs_v2_refresh.md
    IDEA_<other_initiatives>.md
  execution/
    PLAN_docs_v2_refresh.md        # this file
    PLAN_<other_initiatives>.md
    PROMPT_<slug>_phase_<N>.md
  learning/
    patterns.md
    incidents.md
    decisions.md
```

**Initial initiatives (recommended):**

1. `docs_v2_refresh` (this one).
2. `core_security_v6` (scanner rules, identity, watchlists, guard ops).
3. `resident_experience_v2` (resident portal + mobile).
4. `marketing_suite_v2` (attribution and analytics).

**Key tasks:**

- [ ] Ensure `docs/plan/context/IDEA_docs_v2_refresh.md` is up to date.
- [ ] For each future initiative, create `IDEA_<slug>.md` via `/idea`.
- [ ] For each initiative, run `/plan` to generate:
  - `PLAN_<slug>.md` under `docs/plan/execution/`.
  - Phase prompts to `PROMPT_<slug>_phase_<N>.md` using `TEMPLATE_PROMPT_phase.md`.
- [ ] Recreate `docs/plan/learning/{patterns,incidents,decisions}.md`:
  - Either migrate curated content from legacy.
  - Or start fresh and link to the legacy learning docs in `archive/plan-legacy/**`.

**Acceptance criteria:**

- `docs/plan/` contains only new IDEA/PLAN/PROMPT/learning docs.
- For at least **docs_v2_refresh** and **core_security_v6**, the PLAN and PHASE prompts exist and are usable by `/dev`.

---

## 6. Phase 4 — Extended Guides & Learning Docs

**Goal:** Add focused guides and learning docs that support **security operations** and **resident experience**, grounded in PRD v6.

**Candidate guides (all in `docs/guides/`):**

- `SCANNER_OPERATIONS.md`
  - Guard flows, gate assignment, location rules, incidents, overrides.
  - How supervisors use the incident/override queue.
- `RESIDENT_EXPERIENCE.md`
  - Resident portal and mobile flows: visitor creation, sharing, notifications, navigation.
  - Safety and privacy controls (what guests see, arrival checks, quiet hours).
- `I18N_GUIDE.md` (optional)
  - AR/EN, RTL layout, design considerations for MENA.

**Learning docs:**

- Curate and (optionally) migrate patterns, incidents, and decisions from:
  - `docs/archive/plan-legacy/learning/**`
  - Any other repo-local references.

**Key tasks:**

- [ ] For each new guide, run `/idea` + `/plan` if scope is large, or write directly if small.
- [ ] Write or refine `docs/plan/learning/{patterns,incidents,decisions}.md`:
  - Capture at least the **top 5–10** patterns and incidents from previous work (as a starting point).

**Acceptance criteria:**

- Security and operations teams can rely on `SCANNER_OPERATIONS.md` as the definitive narrative for guard workflows.
- Product and UX teams can use `RESIDENT_EXPERIENCE.md` to reason about the full resident journey and tradeoffs.
- The learning docs contain at least a first batch of curated entries and are referenced from `docs/README.md`.

---

## 7. Dependencies & Skills

**Dependencies:**

- Canonical product spec: `docs/PRD_v7.0.md`.
- Security and core rules:
  - `.cursor/rules/00-gateflow-core.mdc`
  - `.cursor/rules/gateflow-security.mdc`
  - `.cursor/contracts/CONTRACTS.md`
- Existing high-signal legacy docs in `docs/archive/plan-legacy/**` (for migration reference only).

**Skills & flows to use:**

- `pro-prd-writer` — for any PRD or PRD-aligned content.
- `content-creation` — for guide writing and restructuring.
- `gf-planner` — for multi-phase planning of initiatives.
- Slash commands:
  - `/idea` → capture initiatives.
  - `/plan` → generate this and future PLAN_* files.
  - `/dev` → implement individual phases.

---

## 8. Open Risks / Considerations

- **Scope creep:** Docs v2 can easily balloon into many documents. This plan deliberately focuses on **core guides first**, then extended guides.
- **Staleness risk:** To avoid Docs v2 becoming v1 again, we should:
  - Prefer updating PRD v6 and core guides over adding new files.
  - Tie significant code/feature work to updating relevant docs as part of phase acceptance criteria.

