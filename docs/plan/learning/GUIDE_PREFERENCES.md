# Guide preferences (how /guide should adapt to you)

The workspace guide (`/guide`, gf-guide skill) reads this file and
**adapts its behavior** to your preferences. Edit it over time so the
guide learns how you like to work.

**Location:** `docs/plan/learning/GUIDE_PREFERENCES.md`

---

## Tone & length

- **Default:** Concise bullets; 1–3 items per section unless complex.
- **Your preference:**
  - Always concise and technical — no filler, no preamble, no
    restating what was just done.
  - When I ask for prompts, give full copy-paste text and say where
    to copy from.
  - No emojis unless explicitly requested.

---

## What to emphasize

- **Priority order:** Security > DX > UI — always resolve
  security/correctness issues before DX improvements before polish.
- **Always** include a copy-paste `/dev` or `/plan` command at end
  of every guide output.
- **Always** show Critical section even if empty (write "None").
- **Skip** Improvements section unless there are real, concrete ideas
  (not generic advice).
- Prioritize **Recommended** next steps; keep **Must do** minimal.

---

## Recurring needs

- **Copy-paste prompts:** Point to `docs/plan/execution/PROMPTS_REFERENCE.md`
  and state the exact line to start from (e.g. "Copy from **Request:**").
- **Zero-Friction GitHub:** Full Git cycle (`add`, `commit`,
  `pull --rebase`, `push`) after every `/idea`, `/plan`, `/dev` phase.
  No confirmation needed when state is green.
- **packages/ui changes:** Remind to run `pnpm preflight` before
  committing when any file under `packages/ui/` is modified.
- **Auth / QR / tenant scope:** Remind to load `gf-security` and
  `CONTRACTS.md` before touching auth, RBAC, QR signing, or org queries.
- **CLI suggestions:** Check `CLI_TOOL_MEMORY.md` scoreboard first;
  prefer free-tier CLIs (Kiro, Kilo, Qwen) when quota is a concern.
- **Backlog IDEAs:** Rank by impact (security → core → DX → UI),
  not by date added.

---

## Format preferences

- **Pre-flight:** Offer "1 — Proceed" / "2 — Do suggestions first"
  when something should be done first.
- **Post-task summary:** Always give a short block after completing
  a task (Must do, Recommended, Critical, next step command).

---

## CLIs & plans (My tools)

| Tool                         | Model / plan            |
| ---------------------------- | ----------------------- |
| **Kiro CLI**                 | qwen3-coder-next (free) |
| **Kilo CLI**                 | MiniMax M2.5 (free)     |
| **Qwen CLI**                 | Qwen3 Coder 480B (free) |
| **Cursor IDE**               | $20 plan                |
| **Gemini CLI** (Antigravity) | $20 plan                |
| **Opencode CLI**             | free                    |
| **Claude CLI**               | $20 plan                |

---

## Claude vs Cursor (who does what)

Cursor is **master** (orchestrates, applies, verifies).
Claude CLI is used for tasks that match its strengths.

| Do with **Claude CLI**                                              | Do with **Cursor IDE**                                         |
| ------------------------------------------------------------------- | -------------------------------------------------------------- |
| Backend & APIs — routes, validation, org scope, soft deletes        | UI & layout — pages, components, forms, TanStack Table         |
| Security — auth, RBAC, export/bulk auth, audit, CONTRACTS           | Visual iteration — inline edits, diffs, layout tweaks          |
| Multi-file backend refactors                                        | Exploring & navigating — codebase discovery, lint fixes        |
| Phase 1 (CRM model/API), Phase 9–10 (pagination, export/bulk/audit) | Phases 2, 3, 5–8, 11 — Project page, Contacts/Units UI, tables |
| Phase 12 — Security audit (Claude primary)                          | Orchestration — /plan, /dev, /ship, preflight, subagents       |

**Rule:** For phases with both backend and frontend — Claude owns
API/security, Cursor owns UI; Cursor applies and verifies all changes.

---

## Notes

- **Canonical plan:** `projects_crm_ui` is the single initiative for
  client-dashboard CRM, dashboard, palette, and advanced-tables.
- **Design brief:** "Projects CRM + dashboards + header/settings split"
  — primary user: property manager/security/marketing; navigation:
  Projects → Contacts → Units → QR → Settings; shared EditPanel +
  real-estate palette throughout.
- Work mainly on `client-dashboard`; prefer branch names `feat/xxx`.
  Always mention `PROMPTS_REFERENCE.md` when discussing `/plan`.
