# Reference prompts for /plan and other commands

Reusable, copy-paste prompts for Cursor chat.

---

## core_security_v6 — Short vs full

**Short prompt** (concise but wrapped for readability):

```
Run /plan with gf-security loaded, using `docs/plan/context/IDEA_core_security_v6.md`.
It should produce `PLAN_core_security_v6.md` and all `PROMPT_core_security_v6_phase_N.md` files.
In every phase prompt's Context section, require loading `.antigravity/skills/gf-security/SKILL.md`
and respecting `.antigravity/rules/00-gateflow-core.mdc` and `.antigravity/contracts/CONTRACTS.md` during implementation.
```

**Full prompt** (use the copy button on the block below):

```text
**Command:** `/plan`

**Request:** Run `/plan` (the plan workflow) with **gf-security** loaded to produce a phased plan and phase prompts for the core security v6 initiative.

**Input**
- **Source idea:** `docs/plan/context/IDEA_core_security_v6.md`
- **Planning skill:** `.antigravity/skills/gf-planner/SKILL.md`
- **Security context:** Load `.antigravity/skills/gf-security/SKILL.md` before and during planning so the plan and every phase prompt are written with the GateFlow security model in mind (auth, RBAC, multi-tenancy, QR signing, API checklist, soft deletes).

**Outputs**
1. **Plan:** `docs/plan/execution/PLAN_core_security_v6.md`
   - Ordered phases with Scope, Deliverables, Depends on, and Test criteria.
   - Each phase must have a **Primary role** from `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` (use **SECURITY** where the phase is security-critical).
   - Use `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` and `.antigravity/templates/TEMPLATE_PROMPT_phase.md` for structure.

2. **Phase prompts:** One file per phase, e.g. `PROMPT_core_security_v6_phase_1.md`, `PROMPT_core_security_v6_phase_2.md`, …
   - Each must be based on `.antigravity/templates/TEMPLATE_PROMPT_phase.md`.
   - Each must include concrete Steps, Scope (in/out), and Acceptance criteria (including lint/typecheck/tests for affected workspaces).

**Mandatory in every phase prompt (Context)**
In the **Context** section of every `PROMPT_core_security_v6_phase_N.md`, require that whoever executes the phase (e.g. via `/dev`):

- Load `.antigravity/skills/gf-security/SKILL.md` at the start of implementation.
- Respect `.antigravity/rules/00-gateflow-core.mdc` (pnpm, multi-tenancy, soft deletes, QR signing, auth, secrets).
- Respect `.antigravity/contracts/CONTRACTS.md` as the authoritative invariant list.

So the plan is created with security awareness, and each phase prompt explicitly instructs executors to load gf-security and the core rules and contracts when implementing that phase.

**Additional constraints**
- Prefer small, testable phases executable in one focused session.
- **Preferred tool** in phase prompts may be set to **Cursor** (default), **Claude CLI**, **Gemini CLI**, **OpenCode CLI**, **Kiro CLI**, **Kilo CLI**, **Qwen CLI**, or **Multi-CLI**. Use Kiro CLI, Kilo CLI, or Qwen CLI when the phase is best run from that terminal CLI (e.g. free-tier agentic coding, large context). See `docs/guides/TOOL_AND_CLI_REFERENCE.md` and `.antigravity/skills/multi-cli-cursor-workflow/SKILL.md`.
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
3. Load the prompt’s **Context** requirements: gf-security SKILL, `.antigravity/rules/00-gateflow-core.mdc`, `.antigravity/contracts/CONTRACTS.md`.
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
2. **Load security context:** Read `.antigravity/skills/gf-security/SKILL.md`, `.antigravity/contracts/CONTRACTS.md`, `.antigravity/rules/00-gateflow-core.mdc`.
3. **Implement** the phase per the prompt: audit API routes for auth/org/soft-delete/validation; add or extend tests for org scoping, soft deletes, and (where relevant) QR/scanUuid; document findings.
4. **Verify:** Run `pnpm turbo test --filter=client-dashboard` and `--filter=scanner-app`; run `pnpm turbo lint` and `pnpm turbo typecheck` for touched workspaces. Fix until all pass.
5. **Git:** When all acceptance criteria are satisfied, commit with message like `feat(core_security_v6): phase 1 — core invariants & enforcement hardening`, then pull --rebase and push.
```

---

## Antigravity /guide — Workspace Guide (copy-paste)

Use in Antigravity, Gemini CLI, or any CLI to get the same Must do / Recommended / Critical / Improvements output as Cursor `/guide`. Command files: `docs/tools/antigravity/commands/guide.md`.

**Where to copy from:** Start at the line **Request:** below.

```text
**Command:** /guide (workspace guide)

**Request:** Act as the GateFlow workspace guide. Produce a report in this format:

### Must do
- [Actions that unblock the project or keep it healthy]

### Recommended
- [High-value next steps]

### Critical
- [Security or compliance items, or "None"]

### Improvements
- [1–3 concrete ideas]

**Context to load (read these files):**
- `GATEFLOW_CONFIG.md` (repo root) — commands, plans, security, agents, skills
- `docs/PRD_v7.0.md` — product status and roadmap
- `docs/plan/` — latest IDEA, PLAN, and which phase is next
- `docs/plan/learning/GUIDE_PREFERENCES.md` (if present) — user preferences
- `docs/guides/TOOL_AND_CLI_REFERENCE.md` — task-to-tool matrix for CLI suggestions

**State to assess:**
- Git status (branch, uncommitted changes)
- Whether preflight (lint/typecheck/test) is green or unknown
- Active plan and next incomplete phase

**Rules:** pnpm only; multi-tenant (organizationId); soft deletes (deletedAt null); QR HMAC-SHA256. Ref: CLAUDE.md.
```

---

## Design mode — UI/UX Design Brief (copy-paste)

Use when you need a structured design brief + layout + token + motion plan + responsive plan. Command files: `docs/tools/antigravity/commands/design-mode.md`.

**Where to copy from:** Start at the line **Request:** below. Replace `[Describe...]` with your design task.

```text
**Command:** Design mode (UI/UX design brief)

**Request:** Produce a design brief for the following UI/UX task. Output:

1. **Design brief** — Purpose, target user, constraints (responsive, RTL, dark mode, WCAG AA).
2. **Layout plan** — Structure (grid/flex), component hierarchy, key screens.
3. **Token plan** — Which design tokens from `packages/ui/src/tokens.ts` to use (colors, spacing, radius).
4. **Motion plan** — Where and how to add animations (duration, easing, prefers-reduced-motion fallback).
5. **Responsive plan** — Breakpoints, mobile-first adjustments, touch targets.

**Context to load:**
- `docs/guides/UI_DESIGN_GUIDE.md`
- `docs/guides/MOTION_AND_ANIMATION.md`
- `packages/ui/src/tokens.ts`
- `apps/client-dashboard/src/app/globals.css` (CSS variables)

**User task (replace with your description):**
[Describe the page, component, or flow you want to design — e.g. "Analytics dashboard card for scan counts" or "Login page with animated particle background"]

**Stack:** Next.js 14, @gate-access/ui, Tailwind 3.4. Use semantic tokens only. Support AR/EN and RTL.
```

---

## Prompt writer — Write Phase or CLI Prompts (copy-paste)

Use to generate /plan, /dev, or CLI prompts from a short description. Command files: `docs/tools/antigravity/commands/prompt-writer.md`.

**Where to copy from:** Start at the line **Request:** below. Replace `[E.g....]` with your task description.

```text
**Command:** Prompt writer

**Request:** Write a pro prompt for GateFlow from the user's short description below. Output one of:
- A **phase prompt** (for /plan or /dev) — use `.antigravity/templates/TEMPLATE_PROMPT_phase.md` structure.
- A **CLI prompt** (for Claude/Gemini/Opencode/Kiro/Kilo/Qwen) — include the correct role prefix from `docs/guides/PROMPT_ENGINEERING.md`.

**Context to load:**
- `docs/guides/PROMPT_ENGINEERING.md`
- `.antigravity/templates/TEMPLATE_PROMPT_phase.md`
- `docs/archive/plan-legacy/guidelines/SUBAGENT_HIERARCHY.md`

**User description (replace with your input):**
[E.g. "Add pagination to the scans table" or "Security review for the gates API route" or "Design a new onboarding step for resident portal"]

**Include:** Primary role, Preferred tool, Goal, Scope (in/out), Steps, Acceptance criteria. For CLI: role prefix + GateFlow context snippet.
```

---

## Sign-in pages design (admin + client) — Unified layout & post-login animation

Use for a single, professional prompt to implement identical sign-in layout and smooth “gate” collapse animation for both admin and client dashboards. **Animation principle: less is more** — simple, smooth transitions; avoid decorative motion.

**Where to copy from:** Start at the line **Request:** below.

```text
**Command:** Design + implement (or use with /dev)

**Request:** Implement unified sign-in pages for admin and client dashboards with a full-screen split layout and a simple, smooth post-login “gate” collapse animation. Keep animations minimal and purposeful.

**Skills to load (in order):**
1. `.antigravity/skills/gf-design-guide/SKILL.md` — layout, tokens, spacing, RTL
2. `docs/guides/UI_DESIGN_GUIDE.md` — colors, typography, grid
3. `.antigravity/skills/gf-creative-ui-animation/SKILL.md` — motion principles, reduced-motion
4. `docs/guides/MOTION_AND_ANIMATION.md` — duration, transform/opacity, checklist
5. `.antigravity/skills/gf-uiux-animator/SKILL.md` — Framer Motion layout morphs, spring presets

**Primary role:** FRONTEND  
**Preferred tool:** Cursor

**Context**
- GateFlow monorepo; pnpm only; `@gate-access/ui`, Tailwind 3.4 (no Tailwind v4).
- Existing login pages: `apps/admin-dashboard/src/app/[locale]/login/page.tsx`, `apps/client-dashboard/src/app/[locale]/login/page.tsx`. Both use `LoginShell` from `packages/ui/src/components/auth/login-shell.tsx`.
- Design tokens: `packages/ui/src/tokens.ts`; semantic colors via CSS vars in app `globals.css`.
- Rules: 4pt spacing base, RTL flip for `dir="rtl"`, `prefers-reduced-motion` fallback, no layout shift (CLS).

**Goal**
Deliver identical look-and-feel and animation behavior for both dashboards’ sign-in, with a shared layout component and a restrained post-login “gate” collapse (left panel → sidebar, then dashboard reveal).

**Scope (in)**
- `packages/ui` — new or updated shared auth layout component
- `apps/admin-dashboard` and `apps/client-dashboard` — login page integration only (no auth API changes)
- Semantic accent for right panel (e.g. `--accent` or token); Framer Motion only where layout morph is needed

**Scope (out)**
- Auth API, session, or security logic changes
- Marketing or resident-portal login pages
- Tailwind v4 or new CSS framework

**Layout requirements**
- Full-screen split: left 50% `bg-background` (sign-in panel), right 50% accent background. Use semantic `--accent` or define in tokens/globals: light `hsl(24 100% 50%)`, dark `hsl(24 90% 45%)`.
- Left panel: logo + app name top-left; form 300px wide, aligned to the right edge of the left panel (`flex justify-end`). Form: title (e.g. “Sign In to Admin Dashboard” vs “Sign In to Client Portal”), email/password (or admin key) inputs `w-full` max 300px, submit button.
- Top-right: language (EN/AR) and theme (light/dark) using `Switch` from `@gate-access/ui`. RTL-aware.

**Animation requirements (less is more)**
- Post-login: on auth success, left panel shrinks from 50% to collapsed sidebar width (~80–100px).
- Single spring: ~0.5–0.6s (e.g. stiffness 160, damping 24). Logo + text slide and fade out; when width ≤ ~120px, sidebar icons fade in with a short stagger (0.06–0.08s); each icon subtle scale (0.95→1) and y (8→0).
- After sidebar settled (~0.3–0.4s delay): dashboard header from top (y -48→0), main content fade + slight slide-up (y 12→0), stagger 0.08s. Right panel crossfade to `bg-background`.
- Use `transform` and `opacity` only where possible. Respect `prefers-reduced-motion: reduce` (instant or near-instant state change).
- Optional presets: **balanced** `{ stiffness: 160, damping: 24 }`, **snappier** `{ stiffness: 220, damping: 28 }`. Prefer one default (balanced).

**Implementation steps**
1. Create or update shared layout in `packages/ui/src/components/auth/`: e.g. `AnimatedSignInLayout.tsx` (or extend `LoginShell`). State: `isAuthenticated`. Use Framer Motion `layout` / `layoutId` for sidebar morph; variants for logo-text (slide + fade), icons (stagger + scale). Main content: `initial={{ opacity: 0, y: 12 }}` `animate={{ opacity: 1, y: 0 }}` with delay and optional stagger.
2. Define accent for login right panel in tokens or app CSS (light/dark).
3. In `apps/admin-dashboard/src/app/[locale]/login/page.tsx` and `apps/client-dashboard/src/app/[locale]/login/page.tsx`: wrap content in the shared layout; pass `dashboardType: 'admin' | 'client'`, `title`, `subtitle?`, `buttonText`. Keep existing form logic and auth flow.
4. Ensure RTL: reverse x directions and alignment where needed; test with `ar-EG` locale.
5. Add reduced-motion media query or hook; when active, use instant or very short (e.g. 50ms) transitions.
6. Run `pnpm turbo lint --filter=@gate-access/ui --filter=client-dashboard --filter=admin-dashboard`, typecheck, and fix. No new tests required unless adding coverage for layout component.

**Deliverables**
- Full code for the shared animated sign-in layout component (or diff to `LoginShell`).
- Example updated `login/page.tsx` for admin-dashboard (client-dashboard analogous).
- Short timing note: panel collapse → sidebar icons → header drop → content fade (with chosen durations).

**Acceptance criteria**
- [ ] Both login pages look identical in structure and animation except for copy (title, subtitle, button text).
- [ ] Layout uses semantic tokens and 4pt-based spacing; RTL correct.
- [ ] Post-login animation: one smooth spring; no jank; reduced-motion respected.
- [ ] Lint and typecheck pass for touched packages/apps.
```

**Skill name reference (no typos):** Use **gf-design-guide** (not gf-ui-design-guide), **gf-creative-ui-animation** (not gf-motion-guide), **gf-uiux-animator**.

**Timing sequence (implementation):** Panel collapse (50% → 96px): spring stiffness 160, damping 24 (~0.5–0.6s). Logo+text: fade + slide (0.35s). Sidebar icons: stagger 0.07s, delay 0.2s. Right accent: crossfade to bg-background (0.4s, delay 0.25s). Reduced motion: all durations 0.05s or instant.
