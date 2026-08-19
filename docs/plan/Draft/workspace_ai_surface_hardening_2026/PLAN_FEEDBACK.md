# PLAN_FEEDBACK: workspace_ai_surface_hardening_2026

## Plan improvements

- If tracking all of `.antigravity/` is too large, prefer a generated `docs/workspace/ai-canonical/` tarball over committing Cursor hook state.
- Phase 2 prune list should be produced by a dry-run script (folder name, frontmatter name, line count, referenced by which workflow) before deleting anything.
- Do not recertify apps as part of this plan; only stop lying about coverage in `state.json`.
- Alias map for the 15+ folder/frontmatter mismatches belongs in the hygiene script, not a new skill.

## Workspace quality-check scripts to add (only after prune)

- `ai-surface-hygiene` (Phase 5 quality-check script) — run the catalog check; refuse new stubs.
- Conductor routing table lives in `gf-guide`, not a new skill, until Phase 5 lands.
