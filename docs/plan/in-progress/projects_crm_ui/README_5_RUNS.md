# 5-step run guide — 12 phases in 5 prompts

Use these prompts to run the full **projects_crm_ui** plan in five steps: 3 with **Claude CLI**, 2 with **Cursor**. Cursor is always master: it applies Claude’s output and runs preflight/tests.

| Step | Tool   | File | Phases covered |
|------|--------|------|-----------------|
| **1** | Claude CLI | `RUN_1_CLAUDE_phase1.md` | Phase 1 (CRM data model & API extensions) |
| **2** | Cursor     | `RUN_2_CURSOR_phases_2_thru_9.md` | Phases 2–9 UI (project page, CRM UI, edit, header/settings, QR table + reorder + filter + sort/pagination UI) |
| **3** | Claude CLI | `RUN_3_CLAUDE_phases_9_and_10.md` | Phase 9 backend (sort/pagination API) + Phase 10 (export, bulk, audit) |
| **4** | Cursor     | `RUN_4_CURSOR_phase_11.md` | Phase 11 (apply table pattern to Contacts & Units) |
| **5** | Claude CLI | `RUN_5_CLAUDE_phase_12.md` | Phase 12 (security audit, performance check, final review) |

## How to run

1. **Run 1 (Claude):** Open Claude CLI, paste or load `RUN_1_CLAUDE_phase1.md`. Apply the proposed changes in Cursor; run `pnpm preflight` (or `pnpm turbo lint --filter=client-dashboard` etc.). Commit.
2. **Run 2 (Cursor):** In Cursor, open `RUN_2_CURSOR_phases_2_thru_9.md` and implement Phases 2–9 UI in one or more sessions. Run lint/typecheck/tests as you go; commit when done.
3. **Run 3 (Claude):** In Claude CLI, paste or load `RUN_3_CLAUDE_phases_9_and_10.md`. Apply API and audit changes in Cursor; run preflight; commit.
4. **Run 4 (Cursor):** In Cursor, open `RUN_4_CURSOR_phase_11.md` and implement Phase 11. Run preflight; commit.
5. **Run 5 (Claude):** In Claude CLI, paste or load `RUN_5_CLAUDE_phase_12.md`. Apply any security/API fixes in Cursor; run preflight; commit. Optionally add polish from Claude’s recommendations.

## Notes

- Claude does **not** run automatically inside Cursor; you run Claude in a separate terminal and then apply its output in Cursor.
- After any Claude run, add one line to `docs/plan/learning/CLI_USAGE_AND_RESULTS.md` (date, CLI, task, outcome).
- Respect the 80% rule: if Claude CLI is near its limit, use Cursor for more of the work or a free-tier CLI.
