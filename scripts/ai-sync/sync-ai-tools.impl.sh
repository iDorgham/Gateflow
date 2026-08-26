#!/usr/bin/env bash
# =============================================================================
# sync-ai-tools.sh — Unified AI Tools Sync
# Single source of truth: .agents/
#
# Usage:
#   ./scripts/ai-sync/sync-ai-tools.sh              # sync all tools
#   ./scripts/ai-sync/sync-ai-tools.sh --tool claude
#   ./scripts/ai-sync/sync-ai-tools.sh --tool cursor
#   ./scripts/ai-sync/sync-ai-tools.sh --tool gemini
#   ./scripts/ai-sync/sync-ai-tools.sh --tool kiro
#   ./scripts/ai-sync/sync-ai-tools.sh --tool antigravity
#   ./scripts/ai-sync/sync-ai-tools.sh --tool kilocode
#   ./scripts/ai-sync/sync-ai-tools.sh --tool opencode
#   ./scripts/ai-sync/sync-ai-tools.sh --tool qwen
#   ./scripts/ai-sync/sync-ai-tools.sh --dry-run    # preview without writing
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC="$ROOT/.agents"

# Auto-heal .agents symlink to .antigravity if missing
if [[ ! -e "$SRC" && -d "$ROOT/.antigravity" ]]; then
  ln -sfn .antigravity "$SRC"
fi

DRY_RUN=false
ONLY_TOOL=""

# ── parse args ────────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --tool) ONLY_TOOL="$2"; shift 2 ;;
    --dry-run) DRY_RUN=true; shift ;;
    -h|--help)
      sed -n '2,13p' "$0"
      exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

# ── helpers ───────────────────────────────────────────────────────────────────
log()  { echo "  $*"; }
ok()   { echo "  ✓ $*"; }
skip() { echo "  · $* (dry-run)"; }

rsync_dir() {
  local src="$1" dest="$2"
  [[ -d "$src" ]] || return 0
  [[ -d "$dest" && "$src" -ef "$dest" ]] && return 0
  if $DRY_RUN; then skip "rsync $src → $dest"; return; fi
  mkdir -p "$dest"
  rsync -a --delete \
    --exclude ".DS_Store" --exclude "**/.DS_Store" \
    --exclude "node_modules" --exclude "**/node_modules" \
    "$src/" "$dest/"
}

copy_file() {
  local src="$1" dest="$2"
  [[ -f "$src" ]] || return 0
  [[ -f "$dest" && "$src" -ef "$dest" ]] && return 0
  if $DRY_RUN; then skip "copy $src → $dest"; return; fi
  mkdir -p "$(dirname "$dest")"
  cp -f "$src" "$dest"
}

write_file() {
  local dest="$1" content="$2"
  if $DRY_RUN; then skip "write $dest"; return; fi
  mkdir -p "$(dirname "$dest")"
  printf '%s\n' "$content" > "$dest"
}

should_sync() {
  local tool="$1"
  [[ -z "$ONLY_TOOL" || "$ONLY_TOOL" == "$tool" ]]
}

# ── command metadata ──────────────────────────────────────────────────────────
# Array of "key|title|description|gemini_name|kiro_prompt_intro"
COMMANDS=(
  "focus|Focus|Select or report the single Workflow v2 pilot application.|focus|Select or report the focused pilot application"
  "audit|Audit|Audit the focused application, pages, security, usability, or pilot flow.|audit|Audit the focused application using dated evidence"
  "progress|Progress|Report focused app stage, scores, coverage, blockers, and one next command.|progress|Report Workflow v2 progress"
  "page-map|Page Map|Inventory and pilot-classify focused application routes.|page-map|Inventory and classify focused application routes"
  "page|Page|Create or update a complete evidence-backed P0 page brief.|page|Create or update a focused page brief"
  "components|Components|Map pages to existing components, variants, and states.|components|Map focused page components"
  "usability|Usability|Review usability, accessibility, RTL, and responsive behavior.|usability|Review focused application usability"
  "check|Check|Run deterministic focused checks and artifact validation.|check|Check the focused application"
  "design|Design|Produce GateFlow design contracts and audits.|design|Create or review a GateFlow design contract"
  "api|API|Plan or review secure typed API resources and flows.|api|Plan or review a typed API contract"
  "database|Database|Plan or audit safe tenant-aware database work.|database|Plan or audit database work"
  "security|Security|Run a read-only focused security review.|security|Review focused application security"
  "test|Test|Run focused test scopes with dated evidence.|test|Test the focused application"
  "github|GitHub|Inspect or prepare focused GitHub and CI work with mutation hardlocks.|github|Inspect or prepare GitHub work"
  "vercel|Vercel|Inspect focused Vercel readiness with mutation hardlocks.|vercel|Inspect Vercel readiness"
  "observe|Observe|Audit reliability, observability, and pilot metrics.|observe|Audit focused observability"
  "release|Release|Prepare a focused release and rollback handoff.|release|Prepare release readiness"
  "pilot|Pilot|Orchestrate the focused pilot or run its bounded loop profile through certification.|pilot|Run the focused pilot workflow or bounded pilot loop"
  "certify|Certify|Certify a pilot-ready application from fresh evidence.|certify|Certify the focused pilot application"
  "next-app|Next App|Recommend and confirm the next fixed-sequence pilot application.|next-app|Recommend the next pilot application"
  "idea|Idea|Capture and refine GateFlow initiatives into IDEA_<slug>.md and backlog entries.|idea|Capture and refine a new idea or initiative into IDEA_<slug>.md"
  "draft|Draft|Capture raw planning notes under docs/plan/Draft/<slug>/ before formal /plan.|draft|Capture or continue a draft plan under docs/plan/Draft"
  "prompt|Prompt|Build FOR_PLAN_PROMPT.md from draft to feed /plan.|prompt|Write FOR_PLAN_PROMPT.md for a plan slug"
  "plan|Plan|Turn an IDEA_<slug>.md into a phased PLAN_<slug>.md plus PROMPT_<slug>_phase_<N>.md pro prompts.|plan|Turn an IDEA_<slug>.md into a multi-phase PLAN_<slug>.md with phase prompts"
  "dev|Dev|Implement one phase or run a bounded approved plan/task loop with explicit delivery gates.|dev|Implement one phase or run the bounded development loop"
  "ship|Ship|Execute all remaining phases of a plan sequentially via repeated /dev-style execution.|ship|Execute all remaining phases of a plan sequentially"
  "guide|Guide|Run the GateFlow workspace guide — router plus coach; what should I do now?|guide|Run the GateFlow workspace guide"
  "man|Man|One Man — one command, seven domains (Code, Brand, SaaS, Marketing, Business, Content, Copywrite).|man|Act as the one-man orchestrator"
  "brainstorm|Brainstorm|Strategic brainstorming for roadmap, gaps, and release planning.|brainstorm|Run a strategic brainstorming session for GateFlow"
  "creative|Creative|Creative direction for brand, content, and marketing assets.|creative|Run creative direction workflow"
  "deploy|Deploy|Deploy target app or workspace apps per deploy workflow.|deploy|Deploy a GateFlow app"
  "clis-team|CLIs Team|Run a predefined CLI team (seo, refactor, audit). Cursor is master; team outputs are proposals.|clis|Run a fixed team of 2-4 CLIs in sequence"
  "docs|Docs|Automated documentation updates — changelog, version badge, PRD, feature log, README, release.|docs|Update project documentation automatically after shipping a feature or cutting a release"
  "version|Version|Semantic versioning — bump package.json, create annotated git tags, generate versioned branch names.|version|Manage semantic versioning across package.json, git tags, and branch names"
  "organize|Organize|Docs folder cleanup — scan structure, remove empty dirs and dead symlinks, rebuild docs/INDEX.md.|organize|Keep the docs/ folder clean, structured, and navigable"
  "ralph|Ralph|Compatibility alias for the bounded /dev loop across all approved remaining phases.|ralph|Run all remaining phases through the bounded development loop"
)

# ── generate commands.json ────────────────────────────────────────────────────
generate_commands_json() {
  local run_prefix="$1"   # e.g. ".agents/workflows" or ".cursor/commands"
  local ext="${2:-.md}"   # file extension

  local out='{"version":1,"commands":{'
  local first=true
  for entry in "${COMMANDS[@]}"; do
    local key="${entry%%|*}"
    local rest="${entry#*|}"
    local title="${rest%%|*}"
    rest="${rest#*|}"
    local desc="${rest%%|*}"

    $first || out+=","
    first=false
    out+="\"$key\":{\"title\":\"$title\",\"description\":\"$desc\",\"run\":\"$run_prefix/$key$ext\"}"
  done
  out+="}}"
  echo "$out" | python3 -m json.tool
}

# ── generate Gemini TOML ──────────────────────────────────────────────────────
generate_gemini_toml() {
  local key="$1" desc="$2" gemini_name="$3" intro="$4"
  cat <<TOML
description = "$desc"
prompt = """
Follow the workflow defined in the $key workflow to $intro.

@{.agents/workflows/$key.md}

User input: {{args}}
"""
TOML
}

# ── generate Kiro hook JSON ───────────────────────────────────────────────────
generate_kiro_hook() {
  local key="$1" desc="$2"
  cat <<JSON
{
  "name": "/$key",
  "version": "1.0.0",
  "description": "$desc",
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Read and follow the GateFlow /$key workflow exactly as defined in .agents/workflows/$key.md\\n\\nLoad it now and execute it. User input: {{args}}"
  }
}
JSON
}

# =============================================================================
# TOOL SYNC FUNCTIONS
# =============================================================================

# ── Claude CLI ────────────────────────────────────────────────────────────────
sync_claude() {
  echo "── Claude CLI (.claude/) ──"
  local dest="$ROOT/.claude"
  mkdir -p "$dest"

  # commands → .md files
  mkdir -p "$dest/commands"
  for entry in "${COMMANDS[@]}"; do
    local key="${entry%%|*}"
    copy_file "$SRC/workflows/$key.md" "$dest/commands/$key.md"
  done
  ok "commands (${#COMMANDS[@]})"

  # settings.json — commands registry
  if ! $DRY_RUN; then
    generate_commands_json ".agents/workflows" ".md" > "$dest/settings.json"
  fi
  ok "settings.json"

  # skills / agents / subagents / commands-ref
  rsync_dir "$SRC/skills"       "$dest/skills"
  rsync_dir "$SRC/agents"       "$dest/agents"
  rsync_dir "$SRC/subagents"    "$dest/subagents"
  rsync_dir "$SRC/commands-ref" "$dest/commands-ref"
  ok "skills ($(ls "$SRC/skills" | wc -l | tr -d ' ')) / agents / subagents / commands-ref"
}

# ── Cursor IDE ────────────────────────────────────────────────────────────────
sync_cursor() {
  echo "── Cursor IDE (.cursor/) ──"
  local dest="$ROOT/.cursor"
  mkdir -p "$dest"

  # commands → .md files + commands.json
  mkdir -p "$dest/commands"
  for entry in "${COMMANDS[@]}"; do
    local key="${entry%%|*}"
    copy_file "$SRC/workflows/$key.md" "$dest/commands/$key.md"
  done
  ok "commands (${#COMMANDS[@]})"

  if ! $DRY_RUN; then
    generate_commands_json ".cursor/commands" ".md" > "$dest/commands.json"
  fi
  ok "commands.json (all ${#COMMANDS[@]})"

  # skills / agents / subagents / commands-ref / templates / contracts
  rsync_dir "$SRC/skills"       "$dest/skills"
  rsync_dir "$SRC/agents"       "$dest/agents"
  rsync_dir "$SRC/subagents"    "$dest/subagents"
  rsync_dir "$SRC/commands-ref" "$dest/commands-ref"
  rsync_dir "$SRC/templates"    "$dest/templates"
  rsync_dir "$SRC/contracts"    "$dest/contracts"
  ok "skills ($(ls "$SRC/skills" | wc -l | tr -d ' ')) / agents / subagents / commands-ref / templates / contracts"

  # rules — sync .md and .mdc from canonical .agents/rules
  if [[ -d "$SRC/rules" ]]; then
    if ! $DRY_RUN; then
      mkdir -p "$dest/rules"
      for f in "$SRC/rules/"*.md "$SRC/rules/"*.mdc; do
        [[ -f "$f" ]] || continue
        cp -f "$f" "$dest/rules/$(basename "$f")"
      done
    fi
    ok "rules (.md + .mdc synced from .agents/rules)"
  fi

  # hooks / mcp
  if ! $DRY_RUN; then
    copy_file "$SRC/hooks.json" "$dest/hooks.json"
    copy_file "$SRC/mcp.json"   "$dest/mcp.json"
  fi
  ok "hooks.json / mcp.json"
}

# ── Antigravity IDE ───────────────────────────────────────────────────────────
sync_antigravity() {
  echo "── Antigravity IDE (.antigravity/) ──"
  local dest="$ROOT/.antigravity"
  mkdir -p "$dest"

  # workflows
  mkdir -p "$dest/workflows"
  for entry in "${COMMANDS[@]}"; do
    IFS='|' read -r key _ _ _ _ <<< "$entry"
    copy_file "$SRC/workflows/$key.md" "$dest/workflows/$key.md"
  done
  ok "workflows (${#COMMANDS[@]})"

  if ! $DRY_RUN; then
    generate_commands_json ".antigravity/workflows" ".md" > "$dest/commands.json"
  fi
  ok "commands.json"

  # all shared dirs
  rsync_dir "$SRC/skills"       "$dest/skills"
  rsync_dir "$SRC/agents"       "$dest/agents"
  rsync_dir "$SRC/subagents"    "$dest/subagents"
  rsync_dir "$SRC/commands-ref" "$dest/commands-ref"
  rsync_dir "$SRC/rules"        "$dest/rules"
  rsync_dir "$SRC/templates"    "$dest/templates"
  rsync_dir "$SRC/contracts"    "$dest/contracts"
  rsync_dir "$SRC/hooks"        "$dest/hooks"
  ok "skills / agents / subagents / commands-ref / rules / templates / contracts / hooks"

  if ! $DRY_RUN; then
    copy_file "$SRC/hooks.json" "$dest/hooks.json"
    copy_file "$SRC/mcp.json"   "$dest/mcp.json"
    copy_file "$SRC/rules.md"   "$dest/rules.md" 2>/dev/null || true
  fi
  ok "hooks.json / mcp.json / rules.md"
}


# ── Gemini CLI ────────────────────────────────────────────────────────────────
sync_gemini() {
  echo "── Gemini CLI (.gemini/) ──"
  local dest="$ROOT/.gemini/commands"
  if ! $DRY_RUN; then mkdir -p "$dest"; fi

  for entry in "${COMMANDS[@]}"; do
    local key="${entry%%|*}"
    local rest="${entry#*|*|}"
    local desc="${rest%%|*}"
    rest="${rest#*|}"
    local gemini_name="${rest%%|*}"
    local intro="${rest#*|}"

    local toml_file="$dest/$gemini_name.toml"
    if $DRY_RUN; then
      skip "write $toml_file"
    else
      generate_gemini_toml "$key" "$desc" "$gemini_name" "$intro" > "$toml_file"
    fi
  done
  ok "TOML commands (${#COMMANDS[@]} → .gemini/commands/*.toml)"
}

# ── Kiro CLI ──────────────────────────────────────────────────────────────────
sync_kiro() {
  echo "── Kiro CLI (.kiro/) ──"
  local dest="$ROOT/.kiro/hooks"
  if ! $DRY_RUN; then mkdir -p "$dest"; fi

  for entry in "${COMMANDS[@]}"; do
    local key="${entry%%|*}"
    local rest="${entry#*|*|}"
    local desc="${rest%%|*}"

    local json_file="$dest/cmd-$key.json"
    if $DRY_RUN; then
      skip "write $json_file"
    else
      generate_kiro_hook "$key" "$desc" > "$json_file"
    fi
  done
  ok "hook JSON files (${#COMMANDS[@]} → .kiro/hooks/cmd-*.json)"

  # Kiro MCP — extract from .agents/mcp.json (exclude pencil which is Antigravity-specific)
  if ! $DRY_RUN; then
    mkdir -p "$ROOT/.kiro/settings"
    node -e '
const fs = require("fs");
try {
  const src = JSON.parse(fs.readFileSync("'"$SRC"'/mcp.json", "utf8"));
  const exclude = new Set(["pencil"]);
  const servers = {};
  for (const [k, v] of Object.entries(src.mcpServers || {})) {
    if (!exclude.has(k)) servers[k] = v;
  }
  fs.writeFileSync("'"$ROOT"'/.kiro/settings/mcp.json", JSON.stringify({ mcpServers: servers }, null, 2) + "\n");
} catch (e) {}
'
  fi
  ok "settings/mcp.json"
}

# ── KiloCode CLI ──────────────────────────────────────────────────────────────
sync_kilocode() {
  echo "── KiloCode CLI (.kilocode/) ──"
  local dest="$ROOT/.kilocode"

  rsync_dir "$SRC/skills"       "$dest/skills"
  rsync_dir "$SRC/commands-ref" "$dest/commands-ref"
  rsync_dir "$SRC/agents"       "$dest/agents"
  ok "skills / commands-ref / agents"
}

# ── OpenCode CLI ──────────────────────────────────────────────────────────────
sync_opencode() {
  echo "── OpenCode CLI (.opencode/) ──"
  local dest="$ROOT/.opencode"

  rsync_dir "$SRC/skills"    "$dest/skills"
  rsync_dir "$SRC/agents"    "$dest/agents"
  ok "skills / agents"

  # Add the main workflow commands to .opencode/commands/
  if ! $DRY_RUN; then
    mkdir -p "$dest/commands"
    for entry in "${COMMANDS[@]}"; do
      local key="${entry%%|*}"
      local rest="${entry#*|*|}"
      local desc="${rest%%|*}"

      # Only write if not a more specific opencode-native command
      if [[ ! -f "$dest/commands/$key.md" ]] || grep -q "agent: build" "$dest/commands/$key.md" 2>/dev/null; then
        cat > "$dest/commands/$key.md" <<MD
---
description: $desc
workflow: .agents/workflows/$key.md
---

Read and follow: .agents/workflows/$key.md
MD
      fi
    done
  fi
  ok "commands (${#COMMANDS[@]} workflow shortcuts added)"
}

# ── Qwen CLI ──────────────────────────────────────────────────────────────────
sync_qwen() {
  echo "── Qwen CLI (.qwen/) ──"
  # Qwen uses ~/.qwen for global config; sync skills and commands to repo-local .qwen/
  local dest="$ROOT/.qwen"
  mkdir -p "$dest"

  rsync_dir "$SRC/skills"       "$dest/skills"
  rsync_dir "$SRC/agents"       "$dest/agents"
  rsync_dir "$SRC/commands-ref" "$dest/commands-ref"
  ok "skills / agents / commands-ref"

  # Add workflow commands as markdown files in .qwen/workflows/
  if ! $DRY_RUN; then
    mkdir -p "$dest/workflows"
    for entry in "${COMMANDS[@]}"; do
      local key="${entry%%|*}"
      copy_file "$SRC/workflows/$key.md" "$dest/workflows/$key.md"
    done
  fi
  ok "workflows (${#COMMANDS[@]} commands synced)"
}

# =============================================================================
# MAIN
# =============================================================================

echo ""
echo "GateFlow AI Tools Sync"
echo "Source: $SRC"
echo "$([ "$DRY_RUN" = true ] && echo "(DRY RUN — no files written)" || echo "Mode: write")"
echo "────────────────────────────────────"

[[ -d "$SRC" ]] || { echo "ERROR: .agents/ not found at $SRC" >&2; exit 1; }

should_sync claude      && { echo; sync_claude; }
should_sync cursor      && { echo; sync_cursor; }
should_sync antigravity && { echo; sync_antigravity; }
should_sync gemini      && { echo; sync_gemini; }
should_sync kiro        && { echo; sync_kiro; }
should_sync kilocode    && { echo; sync_kilocode; }
should_sync opencode    && { echo; sync_opencode; }
should_sync qwen        && { echo; sync_qwen; }

echo ""
echo "────────────────────────────────────"
echo "Done. All tools synced from .agents/"
echo ""
echo "Tip: commit .agents/ changes and push — GitHub Actions auto-syncs on CI."
