# Phase Log: Phase 0 — Version Canonical AI Slice & Fail-Closed Sync

**Initiative:** `workspace_ai_surface_hardening_2026`
**Phase:** 0
**Date:** 2026-08-24
**Status:** Completed

---

## Objectives & Deliverables

1. **Version Canonical AI Slice:**
   - Un-ignored `.antigravity/` in `.gitignore` (`!.antigravity`), while keeping transient cache/state (`.antigravity/**/.DS_Store`, `.antigravity/hooks/state/`) ignored.
   - Verified that `.antigravity/` is tracked by git (`git check-ignore .antigravity/skills/gf-guide/SKILL.md` is empty/not ignored).

2. **Self-Healing AI Sync Script (`pnpm sync`):**
   - Added self-healing symlink creation (`.agents -> .antigravity`) in `scripts/ai-sync/sync-ai-tools.sh` and `scripts/ai-sync/sync-ai-tools.impl.sh`.
   - Replaced macOS bash 3.2 temp-file here-strings (`<<<`) and here-documents (`<<EOF`) with pure bash parameter expansion and fast `node -e` helpers.
   - Replaced fragile external `realpath` invocations with bash `-ef` built-in device/inode comparison to prevent self-rsync loops.
   - Verified that `bash scripts/ai-sync/sync-ai-tools.sh --force` completes across all 8 AI tool targets (Claude, Cursor, Antigravity, Gemini, Kiro, KiloCode, OpenCode, Qwen) with 0 errors.
   - Verified that `bash scripts/ai-sync/sync-ai-tools.sh` without `--force` honors the 24h cache stamp and exits instantly.

3. **Fail-Closed CI Workflow:**
   - Updated `.github/workflows/sync-ai-tools.yml` to trigger on `.antigravity/**` paths.
   - Added fail-closed pre-check verifying existence of canonical AI directory (`.antigravity` or `.agents`), failing immediately if absent on main rather than soft-skipping silently.

4. **Documentation:**
   - Updated `docs/workspace/WORKSPACE_GUIDE.md` documenting `.antigravity/` as the tracked canonical AI slice and `.agents` as the local symlink.

---

## Verification Evidence

- `sync-ai-tools.sh --force` output:
  - Claude CLI: 36 commands, settings.json, 165 skills synced
  - Cursor IDE: 36 commands, commands.json, skills, rules, hooks, MCP synced
  - Antigravity IDE: 36 workflows, commands.json, skills, rules, hooks, MCP synced
  - Gemini CLI: 36 TOML commands synced
  - Kiro CLI: 36 hook JSON files, settings/mcp.json synced
  - KiloCode CLI: skills, commands-ref, agents synced
  - OpenCode CLI: skills, agents, 36 workflow commands synced
  - Qwen CLI: skills, agents, commands-ref, 36 workflows synced
  - Cache stamp created: `.cache/ai-tools-sync.json` (exit code 0)
- `sync-ai-tools.sh` (cached run):
  - Skipped within TTL, 0s execution time (exit code 0)
