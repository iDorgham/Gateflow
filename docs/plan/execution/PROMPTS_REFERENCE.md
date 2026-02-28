# Reference prompts for /plan and other commands

Reusable, copy-paste prompts for Cursor chat.

---

## core_security_v6 — Short vs full

**Short prompt** (concise but wrapped for readability):

```
Run /plan with gf-security loaded, using `docs/plan/context/IDEA_core_security_v6.md`.
It should produce `PLAN_core_security_v6.md` and all `PROMPT_core_security_v6_phase_N.md` files.
In every phase prompt's Context section, require loading `.cursor/skills/gf-security/SKILL.md`
and respecting `.cursor/rules/00-gateflow-core.mdc` and `.cursor/contracts/CONTRACTS.md` during implementation.
```

**Full prompt** (use the copy button on the block below):

```text
**Command:** `/plan`

**Request:** Run `/plan` (the plan workflow) with **gf-security** loaded to produce a phased plan and phase prompts for the core security v6 initiative.

**Input**
- **Source idea:** `docs/plan/context/IDEA_core_security_v6.md`
- **Planning skill:** `.cursor/skills/gf-planner/SKILL.md`
- **Security context:** Load `.cursor/skills/gf-security/SKILL.md` before and during planning so the plan and every phase prompt are written with the GateFlow security model in mind (auth, RBAC, multi-tenancy, QR signing, API checklist, soft deletes).

**Outputs**
1. **Plan:** `docs/plan/execution/PLAN_core_security_v6.md`
   - Ordered phases with Scope, Deliverables, Depends on, and Test criteria.
   - Each phase must have a **Primary role** from `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` (use **SECURITY** where the phase is security-critical).
   - Use `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` and `.cursor/templates/TEMPLATE_PROMPT_phase.md` for structure.

2. **Phase prompts:** One file per phase, e.g. `PROMPT_core_security_v6_phase_1.md`, `PROMPT_core_security_v6_phase_2.md`, …
   - Each must be based on `.cursor/templates/TEMPLATE_PROMPT_phase.md`.
   - Each must include concrete Steps, Scope (in/out), and Acceptance criteria (including lint/typecheck/tests for affected workspaces).

**Mandatory in every phase prompt (Context)**
In the **Context** section of every `PROMPT_core_security_v6_phase_N.md`, require that whoever executes the phase (e.g. via `/dev`):

- Load `.cursor/skills/gf-security/SKILL.md` at the start of implementation.
- Respect `.cursor/rules/00-gateflow-core.mdc` (pnpm, multi-tenancy, soft deletes, QR signing, auth, secrets).
- Respect `.cursor/contracts/CONTRACTS.md` as the authoritative invariant list.

So the plan is created with security awareness, and each phase prompt explicitly instructs executors to load gf-security and the core rules and contracts when implementing that phase.

**Additional constraints**
- Prefer small, testable phases executable in one focused session.
- Add **Multi-CLI** only for phases that are complex or high-risk (per gf-planner and `AI_SKILLS_SUBAGENTS_RULES.md`).
- Add **SuperDesign** only for phases that add or change UI.
- Ensure acceptance criteria for security-related phases include checks for org scoping, soft deletes, QR signing, and (where relevant) auth/CSRF/rate limiting.
```

*Use with the **/plan** command: paste the block above into Cursor chat when you run `/plan` for core_security_v6.*

---

## Generated artifacts (core_security_v6)

After running `/plan` for core_security_v6, the following files exist:

| File | Description |
|------|--------------|
| `docs/plan/execution/PLAN_core_security_v6.md` | Six-phase plan: invariants → gate–account (model+API) → gate–account (UI) → location rule → watchlists/incidents → identity & retention |
| `docs/plan/execution/PROMPT_core_security_v6_phase_1.md` | Core invariants & enforcement hardening (SECURITY) |
| `docs/plan/execution/PROMPT_core_security_v6_phase_2.md` | Gate–account assignment: model + API + enforcement (SECURITY) |
| `docs/plan/execution/PROMPT_core_security_v6_phase_3.md` | Gate–account: dashboard UI + scanner UX (FRONTEND / MOBILE); SuperDesign for dashboard |
| `docs/plan/execution/PROMPT_core_security_v6_phase_4.md` | Location rule optional (SECURITY) |
| `docs/plan/execution/PROMPT_core_security_v6_phase_5.md` | Watchlists, incidents & guard accountability (SECURITY) |
| `docs/plan/execution/PROMPT_core_security_v6_phase_6.md` | Visitor identity levels & privacy/retention (SECURITY / MOBILE) |

Execute phases in order via `/dev` using the corresponding `PROMPT_core_security_v6_phase_N.md`.

---

## Ready and /dev — Copy-paste prompts

**Where to copy from:** Start at the line **Request:** in each block below (or copy the whole block).

### 1. Ready (pre-dev checks)

Run this before starting a phase to ensure a clean baseline: git state check and preflight (lint + typecheck + tests).

```text
**Command:** `/ready` (pre-dev)

**Request:** Run the ready flow before starting a phase:
1. Check git status — branch name, uncommitted changes. If dirty, suggest committing or stashing first.
2. Run `pnpm preflight` (or `pnpm turbo lint && pnpm turbo typecheck && pnpm turbo test` from repo root) and report pass/fail. If any step fails, list the first actionable error with file:line.
3. Confirm which plan is active (e.g. core_security_v6) and which phase is next from `docs/plan/execution/PLAN_core_security_v6.md` (or the plan the user cares about).
4. Summarize: "Ready to run /dev" if green, or "Do this first: [fix X, then re-run preflight]" if not.
```

### 2. /dev — Execute one phase (generic)

Run this to implement **one** phase. Replace `<slug>` and `<N>` with the plan slug and phase number (e.g. core_security_v6 and 1).

```text
**Command:** `/dev`

**Request:** Execute exactly one phase from the plan.

**Phase to run:** Next incomplete phase for the active plan (or specify: e.g. phase 1 of core_security_v6).

**Steps:**
1. Run ready checks: git status and `pnpm preflight`; stop if preflight fails and report the first error.
2. Load the phase prompt: `docs/plan/execution/PROMPT_<slug>_phase_<N>.md` (e.g. PROMPT_core_security_v6_phase_1.md).
3. Load the prompt’s **Context** requirements: gf-security SKILL, `.cursor/rules/00-gateflow-core.mdc`, `.cursor/contracts/CONTRACTS.md`.
4. Implement the phase following the prompt’s **Steps** and **Scope (in/out)**. Use the **Primary role** and **Preferred tool** from the prompt.
5. Run acceptance checks: `pnpm turbo lint`, `pnpm turbo typecheck`, `pnpm turbo test` for affected workspaces (or `pnpm preflight`). Fix until all pass.
6. When all acceptance criteria are met, run the git workflow: add, commit with conventional message (e.g. `feat(core_security_v6): phase 1 — core invariants & enforcement hardening`), pull --rebase origin main, push.

Do not mark the phase complete until every acceptance criterion in the phase prompt is satisfied and tests/lint/typecheck pass.
```

### 3. /dev — Execute phase 1 of core_security_v6 (concrete)

Copy this to run **phase 1** of the core_security_v6 plan (Core Invariants & Enforcement Hardening).

```text
**Command:** `/dev`

**Request:** Execute phase 1 of core_security_v6. Use `docs/plan/execution/PROMPT_core_security_v6_phase_1.md` as the single source of truth.

1. **Ready:** Check git status; run `pnpm preflight`. If anything fails, report and stop.
2. **Load security context:** Read `.cursor/skills/gf-security/SKILL.md`, `.cursor/contracts/CONTRACTS.md`, `.cursor/rules/00-gateflow-core.mdc`.
3. **Implement** the phase per the prompt: audit API routes for auth/org/soft-delete/validation; add or extend tests for org scoping, soft deletes, and (where relevant) QR/scanUuid; document findings.
4. **Verify:** Run `pnpm turbo test --filter=client-dashboard` and `--filter=scanner-app`; run `pnpm turbo lint` and `pnpm turbo typecheck` for touched workspaces. Fix until all pass.
5. **Git:** When all acceptance criteria are satisfied, commit with message like `feat(core_security_v6): phase 1 — core invariants & enforcement hardening`, then pull --rebase and push.
```
