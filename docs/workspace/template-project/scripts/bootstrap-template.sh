#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
CHECKLIST_FILE="${ROOT_DIR}/docs/workspace/POST_INSTALL_CHECKLIST.md"

echo "==> Running template structure validation"
node "${SCRIPT_DIR}/template-validate.js"

echo
echo "==> Checking post-install checklist"
if [[ ! -f "${CHECKLIST_FILE}" ]]; then
  echo "Missing checklist: ${CHECKLIST_FILE}"
  exit 1
fi

total="$(awk '/^- \[ \] /{c++} END{print c+0}' "${CHECKLIST_FILE}")"
done_count="$(awk '/^- \[x\] /{c++} END{print c+0}' "${CHECKLIST_FILE}")"
pending_count=$((total - done_count))

echo "Checklist items: total=${total}, done=${done_count}, pending=${pending_count}"
if [[ "${pending_count}" -gt 0 ]]; then
  echo
  echo "Pending checklist items:"
  awk '/^- \[ \] /{print " - " substr($0, 7)}' "${CHECKLIST_FILE}"
fi

echo
echo "Bootstrap check complete."
