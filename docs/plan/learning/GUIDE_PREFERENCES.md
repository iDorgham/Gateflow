# Guide preferences (how /guide should adapt to you)

The workspace guide (`/guide`, gf-guide skill) reads this file when it exists and **adapts its behavior** to your preferences. Edit it over time so the guide learns how you like to work.

**Location:** `docs/plan/learning/GUIDE_PREFERENCES.md`

When you say things like "I prefer short answers" or "always give me copy-paste prompts," the agent can suggest adding them here. Future `/guide` runs will then follow these preferences.

---

## Tone & length

- **Default:** Concise bullets; 1–3 items per section unless the situation is complex.
- **Your preference:**
  - Always concise; avoid long paragraphs.
  - When I ask for prompts, give full copy-paste text and say where to copy from.

---

## What to emphasize

- **Your priority order for Must do / Recommended / Critical / Improvements:**
  - Prioritize **Recommended** next steps; keep **Must do** minimal (only what unblocks or keeps the project healthy).
  - Critical (security) when relevant; then Recommended, then Must do, then Improvements.

---

## Recurring needs (learned from our conversations)

- **Copy-paste prompts:** When the user asks for a "professional prompt" or "prompt to copy," point to `docs/plan/execution/PROMPTS_REFERENCE.md` and say exactly which line to start copying from (e.g. "Copy from the line **Request:**").
- *(Add more below as you discover what you want the guide to always do.)*
  - Example: "When discussing /plan for security initiatives, remind to load gf-security and reference CONTRACTS.md in phase prompts."

---

## Format preferences

- **Pre-flight:** Offer "1 — Proceed" / "2 — Do suggestions first" when something should be done first. *(Keep / change / add)*
- **Post-task summary:** Optional short block (Must do, Recommended, Critical, Improvements). *(e.g. "Always give post-task summary" or "Only when I ask")*

---

## CLIs & plans (My tools)

Tools and plans the guide can suggest when they match the task. Update this list if your setup changes.

| Tool | Model / plan |
|------|----------------|
| **Kiro CLI** | qwen3-coder-next (free) |
| **Kilo CLI** | MiniMax M2.5 (free) |
| **Qwen CLI** | Qwen3 Coder 480B (free) |
| **Cursor IDE** | $20 plan |
| **Gemini CLI** (Antigravity) | $20 plan |
| **Opencode CLI** | free |
| **Claude CLI** | $20 plan |

---

## Claude vs Cursor (who does what, by their powers)

Use this split for **projects_crm_ui** and similar work. Cursor remains **master** (orchestrates, applies, verifies); Claude CLI is used for tasks that match its strengths.

| Do with **Claude CLI** | Do with **Cursor IDE** |
|------------------------|-------------------------|
| **Backend & APIs** — New/updated API routes, request validation, org scoping, soft deletes, pagination/sort/filter params. | **UI & layout** — Pages, components, EditPanel, header, sidebar, theme toggle, forms, TanStack Table wiring in the app. |
| **Security & correctness** — Auth checks, RBAC, export/bulk auth, audit logging, CONTRACTS compliance. | **Visual iteration** — Inline edits, live diffs, new components, layout tweaks, responsive behavior. |
| **Multi-file backend refactors** — Touching many API files or shared server logic. | **Exploring & navigating** — Codebase discovery, small–medium edits, fixing lint/type errors in UI. |
| **Phase 1** (CRM data model & API extensions), **Phase 9** (sorting, pagination server-side), **Phase 10** (export endpoint, bulk actions, audit). | **Phases 2, 3, 5, 6, 7, 8, 11** — Project page, Contacts/Units UI, header/settings split, TanStack Table base, column reorder, filtering UI, applying pattern to Contacts/Units. |
| **Phase 12** — Security audit of table/export/bulk APIs (Claude primary); polish/performance can stay in Cursor. | **Orchestration** — `/plan`, `/dev`, `/ship`, running phase prompts, preflight, subagents (explore, shell, browser-use). |

**Rule:** For any phase that has both backend and frontend, use **Claude for the API/security parts** and **Cursor for the UI parts**; Cursor applies and verifies all changes (preflight, tests).

---

## Notes (free-form)

- **Canonical plan:** Treat **projects_crm_ui** as the single initiative for client-dashboard CRM, dashboard, palette, and advanced-tables work; avoid ad-hoc work outside it.
- **Design brief:** "Projects CRM + dashboards + header/settings split" is one UX story — primary user (property manager / security / marketing), first view (project detail or list), navigation (Projects → Contacts → Units → QR → Settings); use shared EditPanel and real-estate palette throughout.
- **Implementation:** For UI work, lean on gf-design-guide, ui-ux, tailwind, gf-creative-ui-animation; consider SuperDesign once for unified project/CRM layout before locking JSX.
- I work mainly on client-dashboard; prefer branch names like feat/xxx. Always mention PROMPTS_REFERENCE.md when talking about /plan.
