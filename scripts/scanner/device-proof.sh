#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/scanner-app"
EVIDENCE_ROOT="$ROOT/docs/audits/scanner-app/evidence"
RUN_DATE="${SCANNER_PROOF_DATE:-$(date +%F)}"
EVIDENCE_DIR="$EVIDENCE_ROOT/$RUN_DATE"
DEVICE="${SCANNER_DEVICE:-Dorgham’s iPhone 12 Pro Max}"
METRO_PORT="${SCANNER_METRO_PORT:-8081}"
METRO_PID=""

usage() {
  cat <<'EOF'
Usage: scripts/scanner/device-proof.sh <prepare|run|finalize>

  prepare   Check the paired iPhone and create a redacted evidence packet.
  run       Prepare, open Expo Orbit, and run Metro on the LAN until Ctrl-C.
  finalize  Require the three device screenshots and write SHA-256 evidence.

Environment overrides:
  SCANNER_DEVICE       devicectl device name or identifier
  SCANNER_PROOF_DATE   evidence folder date (YYYY-MM-DD)
  SCANNER_METRO_PORT   Metro port (default: 8081)
EOF
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

write_metadata() {
  mkdir -p "$EVIDENCE_DIR"
  {
    echo "runDate=$RUN_DATE"
    echo "startedAt=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "gitCommit=$(git -C "$ROOT" rev-parse HEAD)"
    echo "gitBranch=$(git -C "$ROOT" branch --show-current)"
    echo "device=Test Device (redacted)"
    echo "metroPort=$METRO_PORT"
    printf "toolchain=%s\n" "$(xcodebuild -version | tr '\n' ' ' | sed 's/[[:space:]]*$//')"
  } >"$EVIDENCE_DIR/run-metadata.txt"

  # Use raw xcrun devicectl output only for availability checking
  local raw_devices
  raw_devices=$(xcrun devicectl list devices)
  if ! echo "$raw_devices" | rg -F "$DEVICE" >/dev/null; then
    echo "Device is not paired/available: $DEVICE" >&2
    exit 1
  fi

  # Write redacted availability data to evidence file
  {
    echo "Name                          Hostname                                      Identifier                             State                Model"
    echo "---------------------------   -------------------------------------------   ------------------------------------   ------------------   ------------------------------"
    echo "Test Device (redacted)        redacted.local                                00000000-0000-0000-0000-000000000000   available (paired)   iPhone (model redacted)"
  } >"$EVIDENCE_DIR/devices.txt"

  cat >"$EVIDENCE_DIR/CAPTURE_CHECKLIST.md" <<'EOF'
# Scanner device-proof checklist

- [ ] `scan-access-granted.png` — fresh dashboard QR; no visitor PII.
- [ ] Record the persisted `scanId` and confirm payload `qrId` equals the DB QR id.
- [ ] `offline-pending.png` — valid scan while offline; pending/no-grant state.
- [ ] Record the offline `scanUuid` without visitor PII.
- [ ] `offline-synced.png` — reconnect and persist using the same `scanUuid`.
- [ ] Run `scripts/scanner/device-proof.sh finalize`.

Screenshots are device evidence only after the IDs are checked against the
database/API. Do not mark the pilot gate passed from screenshots alone.
EOF
}

prepare() {
  require_command pnpm
  require_command xcrun
  require_command rg
  require_command shasum

  if [[ "$(uname -s)" != "Darwin" ]]; then
    echo "Scanner iPhone proof currently requires macOS." >&2
    exit 1
  fi
  if [[ ! -d "/Applications/Expo Orbit.app" ]]; then
    echo "Expo Orbit is not installed in /Applications." >&2
    exit 1
  fi
  if [[ ! -f "$APP/.env" && ! -f "$APP/.env.local" ]]; then
    echo "Scanner environment file is missing." >&2
    exit 1
  fi

  write_metadata
  echo "Evidence packet prepared: $EVIDENCE_DIR"
}

stop_metro() {
  if [[ -n "$METRO_PID" ]] && kill -0 "$METRO_PID" 2>/dev/null; then
    kill "$METRO_PID" 2>/dev/null || true
    wait "$METRO_PID" 2>/dev/null || true
  fi
}

run() {
  prepare
  trap stop_metro EXIT INT TERM

  open -a "Expo Orbit"
  echo "Expo Orbit opened. Metro will be reachable on the trusted LAN."
  echo "No environment values are copied into the evidence packet."

  (
    cd "$APP"
    pnpm exec expo start --go --lan --port "$METRO_PORT" -c 2>&1 | tee "$EVIDENCE_DIR/metro.log"
  ) &
  METRO_PID=$!
  wait "$METRO_PID"
}

finalize() {
  require_command shasum
  local missing=0
  # All artifacts that will be hashed — validation must cover all of them
  local required=(
    "run-metadata.txt"
    "devices.txt"
    "CAPTURE_CHECKLIST.md"
    "scan-proof-qr.png"
    "scan-proof-qr-meta.txt"
    "scan-proof-scan-meta.txt"
    "scan-access-granted.png"
    "offline-proof-4-qr.png"
    "offline-proof-4-qr-meta.txt"
    "offline-proof-4-scan-meta.txt"
    "offline-pending.png"
    "offline-proof-4-queued.png"
    "offline-synced.png"
  )

  for file in "${required[@]}"; do
    if [[ ! -s "$EVIDENCE_DIR/$file" ]]; then
      echo "Missing evidence: $EVIDENCE_DIR/$file" >&2
      missing=1
    fi
  done
  [[ "$missing" -eq 0 ]] || exit 1

  echo "finalizedAt=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >>"$EVIDENCE_DIR/run-metadata.txt"
  (
    cd "$EVIDENCE_DIR"
    shasum -a 256 run-metadata.txt devices.txt CAPTURE_CHECKLIST.md \
      scan-proof-qr.png scan-proof-qr-meta.txt scan-proof-scan-meta.txt \
      scan-access-granted.png \
      offline-proof-4-qr.png offline-proof-4-qr-meta.txt \
      offline-proof-4-scan-meta.txt offline-pending.png \
      offline-proof-4-queued.png offline-synced.png \
      >SHA256SUMS
  )
  echo "Evidence finalized: $EVIDENCE_DIR/SHA256SUMS"
  echo "Pilot status was not changed; verify database/API IDs before promotion."
}

case "${1:-}" in
  prepare) prepare ;;
  run) run ;;
  finalize) finalize ;;
  *) usage; exit 1 ;;
esac
