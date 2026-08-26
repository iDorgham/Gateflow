#!/usr/bin/env bash
# =============================================================================
# sync-ai-tools.sh — Unified AI Tools Sync (smart 24h cache)
# Single source of truth: .agents/
#
# Usage:
#   ./scripts/ai-sync/sync-ai-tools.sh              # sync (smart cache)
#   ./scripts/ai-sync/sync-ai-tools.sh --force      # ignore 24h cache
#   ./scripts/ai-sync/sync-ai-tools.sh --status     # show last success
#   ./scripts/ai-sync/sync-ai-tools.sh --dry-run
#   ./scripts/ai-sync/sync-ai-tools.sh --tool <name>
#
# After a successful FULL sync, skip for 24h unless .agents/ changed or --force.
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC="$ROOT/.agents"

# Auto-heal .agents symlink to .antigravity if missing
if [[ ! -e "$SRC" && -d "$ROOT/.antigravity" ]]; then
  ln -sfn .antigravity "$SRC"
fi

CACHE_DIR="$ROOT/.cache"
STAMP_FILE="$CACHE_DIR/ai-tools-sync.json"
TTL_SECONDS=$((24 * 60 * 60))
DRY_RUN=false
ONLY_TOOL=""
FORCE=false
STATUS_ONLY=false
IMPL="$ROOT/scripts/ai-sync/sync-ai-tools.impl.sh"
# Known-good full implementation (pre-cache) on master history
IMPL_FALLBACK_URL="https://raw.githubusercontent.com/iDorgham/Gateflow/ec9d248c13f099a7361a1389291c68df50ee5aa7/scripts/ai-sync/sync-ai-tools.sh"

FORWARD_ARGS=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --tool) ONLY_TOOL="$2"; FORWARD_ARGS+=(--tool "$2"); shift 2 ;;
    --dry-run) DRY_RUN=true; FORWARD_ARGS+=(--dry-run); shift ;;
    --force) FORCE=true; shift ;;
    --status) STATUS_ONLY=true; shift ;;
    -h|--help)
      sed -n '2,16p' "$0"
      exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

export STAMP_FILE TTL_SECONDS

agents_mtime() {
  [[ -d "$SRC" ]] || { echo 0; return; }
  find "$SRC" -type f -print0 2>/dev/null \
    | xargs -0 stat -c %Y 2>/dev/null \
    | sort -n | tail -1 || echo 0
}

show_status() {
  if [[ ! -f "$STAMP_FILE" ]]; then
    echo "AI tools sync: no successful run recorded yet."
    echo "  Stamp: $STAMP_FILE"
    return 0
  fi
  node -e '
const fs = require("fs");
const stampFile = process.env.STAMP_FILE;
const ttl = parseInt(process.env.TTL_SECONDS || "86400", 10);
const d = JSON.parse(fs.readFileSync(stampFile, "utf8"));
const ts = Number(d.ok_at || 0);
const age = (Date.now() / 1000) - ts;
const remain = Math.max(0, ttl - age);
console.log(`AI tools sync: last OK at ${d.ok_at_iso || "?"}`);
console.log(`  tool scope : ${d.only_tool || "all"}`);
console.log(`  agents mtime: ${d.agents_mtime || "?"}`);
console.log(`  age        : ${Math.floor(age / 3600)}h ${Math.floor((age % 3600) / 60)}m`);
console.log(`  remaining  : ${Math.floor(remain / 3600)}h ${Math.floor((remain % 3600) / 60)}m of ${Math.floor(ttl / 3600)}h TTL`);
console.log(`  stamp      : ${stampFile}`);
'
}

cache_is_fresh() {
  [[ -z "$ONLY_TOOL" ]] || return 1
  [[ "$DRY_RUN" = false ]] || return 1
  [[ -f "$STAMP_FILE" ]] || return 1
  export CURRENT_AGENTS_MTIME
  CURRENT_AGENTS_MTIME="$(agents_mtime)"
  node -e '
const fs = require("fs");
const stampFile = process.env.STAMP_FILE;
const ttl = parseInt(process.env.TTL_SECONDS || "86400", 10);
const cur = String(process.env.CURRENT_AGENTS_MTIME || "0");
try {
  const d = JSON.parse(fs.readFileSync(stampFile, "utf8"));
  if ((Date.now() / 1000) - Number(d.ok_at || 0) > ttl) process.exit(1);
  if (String(d.agents_mtime || "") !== cur) process.exit(1);
  process.exit(0);
} catch {
  process.exit(1);
}
'
}

write_stamp() {
  [[ "$DRY_RUN" = false && -z "$ONLY_TOOL" ]] || return 0
  mkdir -p "$CACHE_DIR"
  export AGENTS_MTIME ONLY_TOOL
  AGENTS_MTIME="$(agents_mtime)"
  node -e '
const fs = require("fs");
const stampFile = process.env.STAMP_FILE;
const now = Date.now() / 1000;
const data = {
  ok_at: now,
  ok_at_iso: new Date().toISOString(),
  only_tool: process.env.ONLY_TOOL || null,
  agents_mtime: process.env.AGENTS_MTIME || "0",
  ttl_seconds: parseInt(process.env.TTL_SECONDS || "86400", 10)
};
fs.writeFileSync(stampFile, JSON.stringify(data, null, 2) + "\n");
'
}

ensure_impl() {
  if [[ -f "$IMPL" ]]; then
    return 0
  fi
  echo "· Restoring sync implementation body to $IMPL …"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$IMPL_FALLBACK_URL" -o "$IMPL"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$IMPL" "$IMPL_FALLBACK_URL"
  else
    echo "ERROR: missing $IMPL and neither curl nor wget available" >&2
    exit 1
  fi
  chmod +x "$IMPL" || true
}

if $STATUS_ONLY; then
  show_status
  exit 0
fi

if ! $FORCE && cache_is_fresh; then
  echo ""
  echo "⏭  Skipping AI tools sync — last success still within 24h and .agents/ unchanged."
  echo "   Use --force to sync anyway, or --status to inspect the stamp."
  show_status
  echo ""
  exit 0
fi

ensure_impl

if $FORCE; then
  echo "Cache: forced (ignoring 24h success stamp)"
fi

bash "$IMPL" ${FORWARD_ARGS[@]+"${FORWARD_ARGS[@]}"}
status=$?
if [[ $status -eq 0 ]]; then
  write_stamp
  if [[ -z "$ONLY_TOOL" && "$DRY_RUN" = false ]]; then
    echo "Stamp written: $STAMP_FILE (valid ~24h unless .agents/ changes)"
  fi
fi
exit $status
