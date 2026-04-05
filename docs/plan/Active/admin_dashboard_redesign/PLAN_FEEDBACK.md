# Plan Feedback: Admin Dashboard Redesign (v10 Match)

## Suggested Plan Edits (Scope, Phases, Risks)

| Suggestion                                  | Reason                                                                                                            | Status     |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------- |
| **Consolidate Header & Sidebar Refinement** | Both are in `AdminShell` and `Sidebar`, so Phase 2 covers both for a unified PR.                                  | ✅ Applied |
| **Dedicated Settings Sub-folder**           | Settings are becoming complex; segmenting them into sub-pages under `(dashboard)/settings/` avoids messy routing. | ✅ Applied |
| **Emulation & Seeding Wide View**           | These pages have a lot of data; wide format is critical for 2026 platform activities.                             | ✅ Applied |

## Workspace Skills/Agents to Add

- **`gf-admin-v10-style` skill**: A micro-skill for Cursor/Agents to enforce the specific CSS classes and tokens used in Client Dashboard V10 when building admin components.
- **`gf-admin-ui-verifier` agent**: A specialized subagent task to audit only Admin UI responsiveness and RTL layout in dark mode.

## Links to Learnings

- `docs/development/learning/RTL_LAYOUT_PATTERNS.md` — Insights on sidebar-heavy RTL navigation.
- `docs/development/learning/ADS_TOKEN_MAPPING.md` — mapping of Atlassian tokens to GateFlow UI variables.
