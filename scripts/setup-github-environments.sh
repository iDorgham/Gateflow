#!/usr/bin/env bash
# =============================================================================
# setup-github-environments.sh
#
# Ensures GateFlow deployment environments exist and Production* envs only
# accept deploys from main/master (per GitHub deployment environments docs).
#
# Usage:
#   bash scripts/setup-github-environments.sh
#   REPO=iDorgham/Gateflow bash scripts/setup-github-environments.sh
# =============================================================================
set -euo pipefail

REPO="${REPO:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
APPS=(
  gateflow-client-dashboard
  gateflow-admin-dashboard
  gateflow-marketing
  gateflow-resident-portal
  gateflow-design-system
)

# En-dash matches Vercel-created GitHub environment names.
# Use Python — macOS /bin/bash 3.2 does not expand $'\u2013'.
DASH="$(python3 -c 'print("\u2013")')"

encode() {
  python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$1"
}

upsert_env() {
  local name="$1"
  local encoded
  encoded="$(encode "$name")"
  echo "→ Environment: $name"
  # Create/update environment. custom_branch_policies=true requires follow-up branch rules.
  gh api \
    --method PUT \
    "repos/${REPO}/environments/${encoded}" \
    -f wait_timer=0 \
    -F prevent_self_review=false \
    -F reviewers='[]' \
    --input - >/dev/null <<EOF
{
  "deployment_branch_policy": null
}
EOF
}

set_production_branch_policy() {
  local name="$1"
  local encoded
  encoded="$(encode "$name")"

  echo "  · Restrict ${name} → main + master"

  # Enable custom branch policies
  gh api \
    --method PUT \
    "repos/${REPO}/environments/${encoded}" \
    --input - >/dev/null <<EOF
{
  "deployment_branch_policy": {
    "protected_branches": false,
    "custom_branch_policies": true
  }
}
EOF

  # Replace existing policies with main + master
  local existing
  existing="$(gh api "repos/${REPO}/environments/${encoded}/deployment-branch-policies" --jq '.branch_policies[].id' 2>/dev/null || true)"
  if [[ -n "$existing" ]]; then
    while IFS= read -r id; do
      [[ -z "$id" ]] && continue
      gh api --method DELETE "repos/${REPO}/environments/${encoded}/deployment-branch-policies/${id}" >/dev/null || true
    done <<< "$existing"
  fi

  for branch in main master; do
    gh api \
      --method POST \
      "repos/${REPO}/environments/${encoded}/deployment-branch-policies" \
      -f name="$branch" \
      -f type=branch >/dev/null || true
  done
}

echo "Configuring GitHub environments for ${REPO}"
echo

# Shared
upsert_env "Production"
upsert_env "Preview"
set_production_branch_policy "Production"

# Per-app (align with Vercel GitHub environments)
for app in "${APPS[@]}"; do
  upsert_env "Production ${DASH} ${app}"
  upsert_env "Preview ${DASH} ${app}"
  set_production_branch_policy "Production ${DASH} ${app}"
done

# Legacy / unused design env (keep if present; restrict Production)
if gh api "repos/${REPO}/environments/$(encode "Production ${DASH} gateflow-design")" --silent 2>/dev/null; then
  set_production_branch_policy "Production ${DASH} gateflow-design"
fi

echo
echo "Done. Review: https://github.com/${REPO}/settings/environments"
echo "Production* environments are limited to branches: main, master"
echo "Preview* environments remain unrestricted (any branch / workflow_dispatch)."
